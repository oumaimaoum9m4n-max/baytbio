import { DeliveryDayModel } from "./deliveryDay.model";
import { BadRequestError } from "@/errors";
import {
  computeSelectableDeliveryDates,
  getMoroccoNow,
  toDeliveryDayDto,
} from "../utils/delivery.utils";
import { deliveryCityRouter } from "./deliveryCity.router";
import type {
  CreateOrUpdateDeliveryDayDto,
  GetAllDeliveryCitiesDto,
  GetAllDeliveryDaysDto,
} from "../types/delivery.dto";
import type {
  MoroccoTime,
  SelectableDeliveryDate,
} from "../types/delivery";
import type { PaginatedData, MutationResponse } from "@/utils/types";

type ListInput = {
  page: number;
  size: number;
  sort?: string;
};

export const deliveryDayRouter = {
  async getAll({
    page,
    size,
    sort,
  }: ListInput): Promise<PaginatedData<GetAllDeliveryDaysDto>> {
    const sortObj: Record<string, 1 | -1> =
      sort === "createdAt_asc" ? { createdAt: 1 } : { deliveryDay: 1 };

    const [data, totalItems] = await Promise.all([
      DeliveryDayModel.find()
        .sort(sortObj)
        .skip(page * size)
        .limit(size)
        .lean(),
      DeliveryDayModel.countDocuments(),
    ]);

    return {
      data: data.map(toDeliveryDayDto),
      totalItems,
      totalPages: Math.max(1, Math.ceil(totalItems / size)),
      currentPage: page,
      pageSize: size,
    };
  },

  async list(): Promise<GetAllDeliveryDaysDto[]> {
    const data = await DeliveryDayModel.find().sort({ deliveryDay: 1 }).lean();
    return data.map(toDeliveryDayDto);
  },

  async create(input: CreateOrUpdateDeliveryDayDto): Promise<MutationResponse> {
    const existing = await DeliveryDayModel.findOne({
      deliveryDay: input.deliveryDay,
    });
    if (existing)
      throw new BadRequestError("Ce jour de livraison est déjà configuré.");

    await DeliveryDayModel.create(input);
    return { msg: "Jour de livraison créé avec succès" };
  },

  async update(
    id: string,
    input: Partial<CreateOrUpdateDeliveryDayDto>,
  ): Promise<MutationResponse> {
    if (input.deliveryDay !== undefined) {
      const clash = await DeliveryDayModel.findOne({
        deliveryDay: input.deliveryDay,
        _id: { $ne: id },
      });
      if (clash)
        throw new BadRequestError("Ce jour de livraison est déjà configuré.");
    }
    await DeliveryDayModel.findByIdAndUpdate(id, input);
    return { msg: "Jour de livraison mis à jour avec succès" };
  },

  async delete(id: string): Promise<MutationResponse> {
    await DeliveryDayModel.findByIdAndDelete(id);
    return { msg: "Jour de livraison supprimé avec succès" };
  },

  /**
   * Everything the order forms need: the list of cities, the two soonest
   * selectable delivery dates, and the Morocco time used to compute them.
   */
  async getOptions(): Promise<{
    now: MoroccoTime;
    cities: GetAllDeliveryCitiesDto[];
    deliveryDates: SelectableDeliveryDate[];
  }> {
    const [now, cities, days] = await Promise.all([
      getMoroccoNow(),
      deliveryCityRouter.list(),
      deliveryDayRouter.list(),
    ]);

    return {
      now,
      cities,
      deliveryDates: computeSelectableDeliveryDates(days, now),
    };
  },
};
