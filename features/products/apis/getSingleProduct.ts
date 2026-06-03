import { useQuery } from "@tanstack/react-query";
import customFetch from "@/utils/custom-fetch";
import type { GetSingleProductDto } from "../types/product.dto";

export const getSingleProduct = async (
  productId: string,
): Promise<GetSingleProductDto> => {
  const res = await customFetch.get(`/api/products/${productId}`);
  return res.data;
};

export const useGetSingleProduct = (productId: string) => {
  return useQuery({
    queryKey: ["products", productId],
    queryFn: () => getSingleProduct(productId),
    enabled: !!productId,
  });
};
