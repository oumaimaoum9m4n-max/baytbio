import { ProductModel } from "./product.model";
import { OrderModel } from "@/features/orders/actions/order.model";
import { toProductDetailDto, toProductDto } from "../utils/product.utils";
import type {
  CreateOrUpdateProductDto,
  GetAllProductsDto,
  GetSingleProductDto,
  GetTopProductsDto,
} from "../types/product.dto";
import type { PaginatedData, MutationResponse } from "@/utils/types";

const SORT_MAP: Record<string, Record<string, 1 | -1>> = {
  name_asc: { name: 1 },
  name_desc: { name: -1 },
  price_asc: { price: 1 },
  price_desc: { price: -1 },
  stock_asc: { stock: 1 },
  stock_desc: { stock: -1 },
  createdAt_asc: { createdAt: 1 },
  createdAt_desc: { createdAt: -1 },
};

export const productRouter = {
  async getAll({
    page,
    size,
    search,
    sort,
  }: {
    page: number;
    size: number;
    search: string;
    sort?: string;
  }): Promise<PaginatedData<GetAllProductsDto>> {
    const query = search ? { name: { $regex: search, $options: "i" } } : {};
    const sortObj = SORT_MAP[sort ?? ""] ?? { createdAt: -1 };

    const [data, totalItems] = await Promise.all([
      ProductModel.find(query)
        .sort(sortObj)
        .skip(page * size)
        .limit(size)
        .lean(),
      ProductModel.countDocuments(query),
    ]);

    return {
      data: data.map(toProductDto),
      totalItems,
      totalPages: Math.ceil(totalItems / size),
      currentPage: page,
      pageSize: size,
    };
  },

  async getById(id: string): Promise<GetSingleProductDto> {
    const product = await ProductModel.findById(id).lean();
    if (!product) throw new Error("Produit non trouvé");

    const relatedIds = (product.relatedProducts ?? [])
      .map((r: any) => r.id)
      .filter(Boolean);

    const freshRelated = relatedIds.length
      ? await ProductModel.find({ _id: { $in: relatedIds } })
          .select("name images")
          .lean()
      : [];

    const relatedMap = new Map(
      (freshRelated as any[]).map((r) => [r._id.toString(), r]),
    );

    const relatedProducts = relatedIds
      .map((rid: any) => relatedMap.get(rid.toString()))
      .filter(Boolean)
      .map((r: any) => ({
        id: r._id.toString(),
        name: r.name ?? "",
        mainImage: r.images?.[0] ?? "",
      }));

    return toProductDetailDto({ ...product, relatedProducts });
  },

  async create(input: CreateOrUpdateProductDto): Promise<MutationResponse> {
    await ProductModel.create(input);
    return { msg: "Produit créé avec succès" };
  },

  async update(
    id: string,
    input: Partial<CreateOrUpdateProductDto>,
  ): Promise<MutationResponse> {
    await ProductModel.findByIdAndUpdate(id, input);
    return { msg: "Produit mis à jour avec succès" };
  },

  async getTopProducts(): Promise<GetTopProductsDto[]> {
    const topSold: { _id: string; totalSold: number }[] =
      await OrderModel.aggregate([
        { $match: { status: { $ne: "cancelled" } } },
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.productId",
            totalSold: { $sum: "$items.quantity" },
          },
        },
        { $sort: { totalSold: -1 } },
        { $limit: 10 },
      ]);

    const soldCountMap = new Map(
      topSold.map((p) => [p._id.toString(), p.totalSold]),
    );

    let products = await ProductModel.find({
      _id: { $in: topSold.map((p) => p._id) },
      status: "enabled",
    }).lean();

    products.sort(
      (a, b) =>
        (soldCountMap.get(b._id.toString()) ?? 0) -
        (soldCountMap.get(a._id.toString()) ?? 0),
    );
    products = products.slice(0, 3);

    if (products.length < 3) {
      const existingIds = products.map((p) => p._id);
      const filler = await ProductModel.find({
        _id: { $nin: existingIds },
        status: "enabled",
      })
        .sort({ createdAt: -1 })
        .limit(3 - products.length)
        .lean();
      products = [...products, ...filler];
    }

    return products.map((p) => ({
      id: p._id.toString(),
      name: p.name,
      price: p.price,
      stock: p.stock ?? 0,
      unit: p.unit,
      images: p.images ?? [],
      shortDescription: p.shortDescription ?? "",
      tags: p.tags ?? [],
      totalSold: soldCountMap.get(p._id.toString()) ?? 0,
    }));
  },
};
