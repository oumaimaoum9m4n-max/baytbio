import { useQuery } from "@tanstack/react-query";
import customFetch from "@/utils/custom-fetch";
import type { PaginatedData } from "@/utils/types";
import type { GetAllDeliveryDaysDto } from "../types/delivery.dto";

export const getAllDays = async (
  page = 0,
  size = 10,
  sort = "",
): Promise<PaginatedData<GetAllDeliveryDaysDto>> => {
  const res = await customFetch.get(
    `/api/delivery/days?page=${page}&size=${size}&sort=${sort}`,
  );
  return res.data;
};

export const useGetAllDays = (page: number, size: number, sort: string) =>
  useQuery({
    queryKey: ["delivery-days", page, size, sort],
    queryFn: () => getAllDays(page, size, sort),
  });
