import type { PipelineStage } from "mongoose";
import { OrderModel } from "./order.model";
import "@/features/products/actions/product.model";
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
    const order = await OrderModel.create({
      fullName: input.fullName,
      phoneNumber: input.phoneNumber,
      email: input.email ?? "",
      fullAddress: input.fullAddress,
      status: "pending",
      items: input.items,
    });
    return { msg: "Commande créée avec succès", id: order._id as string };
  },

  async update(
    id: string,
    input: Partial<CreateOrUpdateOrderDto>,
  ): Promise<MutationResponse> {
    await OrderModel.findByIdAndUpdate(id, input);
    return { msg: "Commande mise à jour avec succès" };
  },

  async updateStatus(
    id: string,
    status: OrderStatus,
  ): Promise<MutationResponse> {
    await OrderModel.findByIdAndUpdate(id, { status });
    const labelMap: Record<OrderStatus, string> = {
      pending: "remise en attente",
      confirmed: "confirmée",
      delivered: "marquée comme livrée",
      cancelled: "annulée",
    };
    return { msg: `Commande ${labelMap[status]}` };
  },
};
