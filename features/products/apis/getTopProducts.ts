import { useQuery } from "@tanstack/react-query";
import customFetch from "@/utils/custom-fetch";
import type { GetTopProductsDto } from "../types/product.dto";

export const getTopProducts = async (): Promise<GetTopProductsDto[]> => {
  const res = await customFetch.get("/api/products/top");
  return res.data;
};

export const useGetTopProducts = () => {
  return useQuery({
    queryKey: ["products", "top"],
    queryFn: getTopProducts,
  });
};
