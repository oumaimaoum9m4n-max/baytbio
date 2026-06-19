import { DeliveryCityModel } from "./deliveryCity.model";
import { BadRequestError } from "@/errors";
import { toDeliveryCityDto } from "../utils/delivery.utils";
import type {
  CreateOrUpdateDeliveryCityDto,
  GetAllDeliveryCitiesDto,
} from "../types/delivery.dto";
import type { PaginatedData, MutationResponse } from "@/utils/types";

type ListInput = {
  page: number;
  size: number;
  search: string;
  sort?: string;
};

const SORT_MAP: Record<string, Record<string, 1 | -1>> = {
  name_asc: { cityName: 1 },
  name_desc: { cityName: -1 },
  tax_asc: { deliveryTax: 1 },
  tax_desc: { deliveryTax: -1 },
  createdAt_asc: { createdAt: 1 },
  createdAt_desc: { createdAt: -1 },
};

export const deliveryCityRouter = {
  async getAll({
    page,
    size,
    search,
    sort,
  }: ListInput): Promise<PaginatedData<GetAllDeliveryCitiesDto>> {
    const query = search
      ? { cityName: { $regex: search, $options: "i" } }
      : {};
    const sortObj = SORT_MAP[sort ?? ""] ?? { createdAt: -1 };

    const [data, totalItems] = await Promise.all([
      DeliveryCityModel.find(query)
        .sort(sortObj)
        .skip(page * size)
        .limit(size)
        .lean(),
      DeliveryCityModel.countDocuments(query),
    ]);

    return {
      data: data.map(toDeliveryCityDto),
      totalItems,
      totalPages: Math.max(1, Math.ceil(totalItems / size)),
      currentPage: page,
      pageSize: size,
    };
  },

  /** Full, unpaginated list (used by selects in the order forms). */
  async list(): Promise<GetAllDeliveryCitiesDto[]> {
    const data = await DeliveryCityModel.find().sort({ cityName: 1 }).lean();
    return data.map(toDeliveryCityDto);
  },

  async create(
    input: CreateOrUpdateDeliveryCityDto,
  ): Promise<MutationResponse> {
    const existing = await DeliveryCityModel.findOne({
      cityName: { $regex: `^${input.cityName.trim()}$`, $options: "i" },
    });
    if (existing) throw new BadRequestError("Cette ville existe déjà.");

    await DeliveryCityModel.create({
      cityName: input.cityName.trim(),
      deliveryTax: input.deliveryTax,
    });
    return { msg: "Ville de livraison créée avec succès" };
  },

  async update(
    id: string,
    input: Partial<CreateOrUpdateDeliveryCityDto>,
  ): Promise<MutationResponse> {
    await DeliveryCityModel.findByIdAndUpdate(id, input);
    return { msg: "Ville de livraison mise à jour avec succès" };
  },

  async delete(id: string): Promise<MutationResponse> {
    await DeliveryCityModel.findByIdAndDelete(id);
    return { msg: "Ville de livraison supprimée avec succès" };
  },
};
