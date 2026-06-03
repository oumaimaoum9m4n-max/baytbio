import { useMutation, useQueryClient } from "@tanstack/react-query";
import customFetch from "@/utils/custom-fetch";
import { onMutationSuccess, onMutationError } from "@/utils/mutation-response";
import type { MutationResponse } from "@/utils/types";
import type { CreateOrUpdateProductDto } from "../types/product.dto";

export const createProduct = async (
  product: CreateOrUpdateProductDto,
): Promise<MutationResponse> => {
  const res = await customFetch.post(`/api/products`, product);
  return res.data;
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProduct,
    onSuccess: (msg) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      onMutationSuccess(msg);
    },
    onError: onMutationError,
  });
};
