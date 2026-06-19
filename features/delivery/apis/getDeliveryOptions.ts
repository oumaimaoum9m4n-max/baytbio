import { useQuery } from "@tanstack/react-query";
import customFetch from "@/utils/custom-fetch";
import type {
  MoroccoTime,
  SelectableDeliveryDate,
} from "../types/delivery";
import type { GetAllDeliveryCitiesDto } from "../types/delivery.dto";

export type DeliveryOptions = {
  now: MoroccoTime;
  cities: GetAllDeliveryCitiesDto[];
  deliveryDates: SelectableDeliveryDate[];
};

export const getDeliveryOptions = async (): Promise<DeliveryOptions> => {
  const res = await customFetch.get(`/api/delivery/options`);
  return res.data;
};

export const useGetDeliveryOptions = () =>
  useQuery({
    queryKey: ["delivery-options"],
    queryFn: getDeliveryOptions,
    staleTime: 60_000,
  });
