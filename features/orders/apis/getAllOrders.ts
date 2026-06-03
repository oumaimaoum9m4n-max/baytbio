import { useQuery } from "@tanstack/react-query";
import customFetch from "@/utils/custom-fetch";
import type { PaginatedData } from "@/utils/types";
import type { GetAllOrdersDto, OrderKpis } from "../types/order.dto";

export type GetAllOrdersParams = {
  page: number;
  size: number;
  search: string;
  status: string;
  startDate: string;
  endDate: string;
  sort: string;
};

export type GetAllOrdersResponse = PaginatedData<GetAllOrdersDto> & {
  kpis: OrderKpis | null;
};

const buildQuery = (params: GetAllOrdersParams & { kpis?: boolean }) => {
  const qs = new URLSearchParams({
    page: String(params.page),
    size: String(params.size),
    s: params.search,
    status: params.status,
    startDate: params.startDate,
    endDate: params.endDate,
    sort: params.sort,
  });
  if (params.kpis) qs.set("kpis", "1");
  return qs.toString();
};

export const getAllOrders = async (
  params: GetAllOrdersParams,
): Promise<GetAllOrdersResponse> => {
  const res = await customFetch.get(
    `/api/orders?${buildQuery({ ...params, kpis: true })}`,
  );
  return res.data;
};

export const useGetAllOrders = (params: GetAllOrdersParams) => {
  return useQuery({
    queryKey: [
      "orders",
      params.page,
      params.size,
      params.search,
      params.status,
      params.startDate,
      params.endDate,
      params.sort,
    ],
    queryFn: () => getAllOrders(params),
  });
};
