import { useQuery } from "@tanstack/react-query";
import customFetch from "@/utils/custom-fetch";
import type { GetSingleOrderDto } from "../types/order.dto";

export const getSingleOrder = async (
  orderId: string,
): Promise<GetSingleOrderDto> => {
  const res = await customFetch.get(`/api/orders/${orderId}`);
  return res.data;
};

export const useGetSingleOrder = (orderId: string) => {
  return useQuery({
    queryKey: ["orders", orderId],
    queryFn: () => getSingleOrder(orderId),
    enabled: !!orderId,
  });
};
