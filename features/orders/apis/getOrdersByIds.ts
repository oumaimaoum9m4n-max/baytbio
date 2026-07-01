import { useQuery } from "@tanstack/react-query";
import customFetch from "@/utils/custom-fetch";
import type { GetAllOrdersDto } from "../types/order.dto";

export const getOrdersByIds = async (
  ids: string[],
): Promise<GetAllOrdersDto[]> => {
  const res = await customFetch.post<{ data: GetAllOrdersDto[] }>(
    "/api/orders/by-ids",
    { ids },
  );
  return res.data.data;
};

export const useGetOrdersByIds = (ids: string[]) =>
  useQuery({
    queryKey: ["orders", "by-ids", [...ids].sort()],
    queryFn: () => getOrdersByIds(ids),
    enabled: ids.length > 0,
    staleTime: 30_000,
  });
