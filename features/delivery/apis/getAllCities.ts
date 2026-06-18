import { useQuery } from "@tanstack/react-query";
import customFetch from "@/utils/custom-fetch";
import type { PaginatedData } from "@/utils/types";
import type { GetAllDeliveryCitiesDto } from "../types/delivery.dto";

export const getAllCities = async (
  page = 0,
  size = 10,
  search = "",
  sort = "",
): Promise<PaginatedData<GetAllDeliveryCitiesDto>> => {
  const res = await customFetch.get(
    `/api/delivery/cities?page=${page}&size=${size}&s=${encodeURIComponent(search)}&sort=${sort}`,
  );
  return res.data;
};

export const useGetAllCities = (
  page: number,
  size: number,
  search: string,
  sort: string,
) =>
  useQuery({
    queryKey: ["delivery-cities", page, size, search, sort],
    queryFn: () => getAllCities(page, size, search, sort),
  });
