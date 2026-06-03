import { useQuery } from "@tanstack/react-query";
import customFetch from "@/utils/custom-fetch";
import type { PaginatedData } from "@/utils/types";
import type { GetAllProductsDto } from "../types/product.dto";

export const getAllProducts = async (
  page = 0,
  size = 10,
  search = "",
  sort = "",
): Promise<PaginatedData<GetAllProductsDto>> => {
  const res = await customFetch.get(
    `/api/products?page=${page}&size=${size}&s=${encodeURIComponent(search)}&sort=${sort}`,
  );
  return res.data;
};

export const useGetAllProducts = (
  page: number,
  size: number,
  search: string,
  sort: string,
) => {
  return useQuery({
    queryKey: ["products", page, size, search, sort],
    queryFn: () => getAllProducts(page, size, search, sort),
  });
};
