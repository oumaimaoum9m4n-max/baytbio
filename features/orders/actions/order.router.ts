import mongoose, { type PipelineStage, type ClientSession } from "mongoose";
import { OrderModel } from "./order.model";
import { ProductModel } from "@/features/products/actions/product.model";
import { BadRequestError } from "@/errors";
import { toOrderDetailDto, toOrderDto } from "../utils/order.utils";
import type {
  CreateOrUpdateOrderDto,
  GetAllOrdersDto,
  GetSingleOrderDto,
  OrderKpis,
} from "../types/order.dto";
import type { OrderStatus } from "../types/order";
import type { PaginatedData, MutationResponse } from "@/utils/types";

type ListInput = {
  page: number;
  size: number;
  search: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  sort?: string;
};

const buildMatchStage = ({ search, status, startDate, endDate }: ListInput) => {
  const match: Record<string, unknown> = {};

  if (status && status !== "all") match.status = status;

  if (startDate || endDate) {
    const range: Record<string, Date> = {};
    if (startDate) range.$gte = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      range.$lte = end;
    }
    match.createdAt = range;
  }

  if (search) {
    const rx = { $regex: search, $options: "i" };
    match.$or = [
      { _id: rx },
      { fullName: rx },
      { phoneNumber: rx },
      { email: rx },
      { fullAddress: rx },
    ];
  }

  return match;
};

/**
 * Sums an order's items into a `productId -> quantity` map, merging any
 * duplicate lines that target the same product.
 */
const sumQuantitiesByProduct = (
  items: { productId: unknown; quantity: number }[],
): Map<string, number> => {
  const map = new Map<string, number>();
  for (const it of items) {
    const id =
      typeof it.productId === "string"
        ? it.productId
        : String((it.productId as { toString?: () => string })?.toString?.() ?? it.productId);
    map.set(id, (map.get(id) ?? 0) + it.quantity);
  }
  return map;
};

/**
 * Applies stock changes inside an existing transaction.
 *
 * `deltas` maps a productId to the quantity that must be SUBTRACTED from its
 * stock. A positive delta consumes stock (a new/increased order line); a
 * negative delta restores it (a removed/decreased line).
 *
 * Before touching anything we verify every consuming product has enough stock
 * and build a single user-friendly message listing *all* the problematic
 * products at once. The decrements themselves are guarded with a `$gte` filter
 * so a concurrent order can never push stock negative.
 */
const applyStockDeltas = async (
  deltas: Map<string, number>,
  session: ClientSession,
): Promise<void> => {
  const consumed = [...deltas.entries()].filter(([, qty]) => qty > 0);
  const restored = [...deltas.entries()].filter(([, qty]) => qty < 0);

  if (consumed.length) {
    const products = await ProductModel.find({
      _id: { $in: consumed.map(([id]) => id) },
    })
      .select("name stock")
      .session(session)
      .lean();

    const byId = new Map(
      products.map((p: { _id: { toString: () => string }; name?: string; stock?: number }) => [
        p._id.toString(),
        p,
      ]),
    );

    const issues: string[] = [];
    for (const [id, qty] of consumed) {
      const product = byId.get(id);
      if (!product) {
        issues.push("• Un produit demandé n'est plus disponible.");
        continue;
      }
      const available = product.stock ?? 0;
      if (available < qty) {
        issues.push(
          available > 0
            ? `• ${product.name} : ${qty} demandé(s), seulement ${available} en stock.`
            : `• ${product.name} : en rupture de stock.`,
        );
      }
    }

    if (issues.length) {
      throw new BadRequestError(
        `Stock insuffisant pour finaliser la commande :\n${issues.join("\n")}`,
      );
    }

    for (const [id, qty] of consumed) {
      const res = await ProductModel.updateOne(
        { _id: id, stock: { $gte: qty } },
        { $inc: { stock: -qty } },
        { session },
      );
      // matchedCount 0 means another order consumed the stock in between.
      if (res.matchedCount === 0) {
        throw new BadRequestError(
          "Le stock de certains produits vient de changer. Veuillez vérifier votre commande et réessayer.",
        );
      }
    }
  }

  for (const [id, qty] of restored) {
    await ProductModel.updateOne({ _id: id }, { $inc: { stock: -qty } }, { session });
  }
};

/**
 * An order only "holds" stock while it is not cancelled. This returns, per
 * product, how much stock must be SUBTRACTED to move from a previous state to
 * the next one (positive = consume more, negative = give back).
 *
 * It transparently covers every transition: creating, editing items, cancelling
 * (everything is released) and un-cancelling (everything is consumed again).
 */
const computeStockDeltas = (
  prevItems: { productId: unknown; quantity: number }[],
  prevStatus: OrderStatus,
  nextItems: { productId: unknown; quantity: number }[],
  nextStatus: OrderStatus,
): Map<string, number> => {
  const prevHeld =
    prevStatus === "cancelled" ? new Map<string, number>() : sumQuantitiesByProduct(prevItems);
  const nextHeld =
    nextStatus === "cancelled" ? new Map<string, number>() : sumQuantitiesByProduct(nextItems);

  const deltas = new Map<string, number>();
  for (const productId of new Set([...prevHeld.keys(), ...nextHeld.keys()])) {
    const delta = (nextHeld.get(productId) ?? 0) - (prevHeld.get(productId) ?? 0);
    if (delta !== 0) deltas.set(productId, delta);
  }
  return deltas;
};

export const orderRouter = {
  async getAll(input: ListInput): Promise<PaginatedData<GetAllOrdersDto>> {
    const { page, size, sort } = input;
    const match = buildMatchStage(input);

    const sortStage: Record<string, 1 | -1> =
      sort === "createdAt_asc"
        ? { createdAt: 1 }
        : sort === "createdAt_desc"
          ? { createdAt: -1 }
          : { _bucket: 1, _sortKey: 1 };

    const pipeline: PipelineStage[] = [{ $match: match }];

    if (sort !== "createdAt_asc" && sort !== "createdAt_desc") {
      pipeline.push({
        $addFields: {
          _bucket: {
            $cond: [{ $eq: ["$status", "pending"] }, 0, 1],
          },
          _sortKey: {
            $cond: [
              { $eq: ["$status", "pending"] },
              { $toLong: "$createdAt" },
              { $multiply: [{ $toLong: "$createdAt" }, -1] },
            ],
          },
        },
      });
    }

    pipeline.push(
      { $sort: sortStage },
      { $skip: page * size },
      { $limit: size },
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "_products",
        },
      },
      {
        $addFields: {
          items: {
            $map: {
              input: "$items",
              as: "it",
              in: {
                quantity: "$$it.quantity",
                productId: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$_products",
                        as: "p",
                        cond: { $eq: ["$$p._id", "$$it.productId"] },
                      },
                    },
                    0,
                  ],
                },
              },
            },
          },
        },
      },
      { $project: { _products: 0, _bucket: 0, _sortKey: 0 } },
    );

    const [data, totalItems] = await Promise.all([
      OrderModel.aggregate(pipeline),
      OrderModel.countDocuments(match),
    ]);

    return {
      data: data.map(toOrderDto),
      totalItems,
      totalPages: Math.max(1, Math.ceil(totalItems / size)),
      currentPage: page,
      pageSize: size,
    };
  },

  async getKpis(input: Omit<ListInput, "page" | "size" | "sort">): Promise<
    OrderKpis
  > {
    const match = buildMatchStage({ ...input, page: 0, size: 0 });
    const rows = await OrderModel.aggregate([
      { $match: match },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const map = rows.reduce<Record<string, number>>((acc, r) => {
      acc[r._id] = r.count;
      return acc;
    }, {});

    return {
      total:
        (map.pending ?? 0) +
        (map.confirmed ?? 0) +
        (map.delivered ?? 0) +
        (map.cancelled ?? 0),
      pending: map.pending ?? 0,
      confirmed: map.confirmed ?? 0,
      delivered: map.delivered ?? 0,
      cancelled: map.cancelled ?? 0,
    };
  },

  async getById(id: string): Promise<GetSingleOrderDto> {
    const order = await OrderModel.findById(id)
      .populate("items.productId")
      .lean();
    if (!order) throw new Error("Commande non trouvée");
    return toOrderDetailDto(order);
  },

  async create(input: CreateOrUpdateOrderDto): Promise<MutationResponse & { id: string }> {
    const session = await mongoose.startSession();
    try {
      let orderId = "";
      await session.withTransaction(async () => {
        await applyStockDeltas(sumQuantitiesByProduct(input.items), session);

        const [order] = await OrderModel.create(
          [
            {
              fullName: input.fullName,
              phoneNumber: input.phoneNumber,
              email: input.email ?? "",
              fullAddress: input.fullAddress,
              deliveryCity: input.deliveryCity,
              deliveryFee: input.deliveryFee ?? 0,
              deliveryDate: input.deliveryDate,
              status: "pending",
              items: input.items,
            },
          ],
          { session },
        );
        orderId = order._id as string;
      });
      return { msg: "Commande créée avec succès", id: orderId };
    } finally {
      await session.endSession();
    }
  },

  async update(
    id: string,
    input: Partial<CreateOrUpdateOrderDto>,
  ): Promise<MutationResponse> {
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        const existing = await OrderModel.findById(id).session(session).lean();
        if (!existing) throw new BadRequestError("Commande introuvable.");

        // Reconcile against whatever the order will look like after the update:
        // changed items and/or a changed status (e.g. cancelling) both matter.
        const deltas = computeStockDeltas(
          existing.items ?? [],
          existing.status,
          input.items ?? existing.items ?? [],
          input.status ?? existing.status,
        );
        if (deltas.size) await applyStockDeltas(deltas, session);

        await OrderModel.findByIdAndUpdate(id, input, { session });
      });
      return { msg: "Commande mise à jour avec succès" };
    } finally {
      await session.endSession();
    }
  },

  async updateStatus(
    id: string,
    status: OrderStatus,
  ): Promise<MutationResponse> {
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        const existing = await OrderModel.findById(id).session(session).lean();
        if (!existing) throw new BadRequestError("Commande introuvable.");

        // Cancelling releases the order's stock; un-cancelling consumes it again.
        const deltas = computeStockDeltas(
          existing.items ?? [],
          existing.status,
          existing.items ?? [],
          status,
        );
        if (deltas.size) await applyStockDeltas(deltas, session);

        await OrderModel.findByIdAndUpdate(id, { status }, { session });
      });
    } finally {
      await session.endSession();
    }

    const labelMap: Record<OrderStatus, string> = {
      pending: "remise en attente",
      confirmed: "confirmée",
      delivered: "marquée comme livrée",
      cancelled: "annulée",
    };
    return { msg: `Commande ${labelMap[status]}` };
  },
};
