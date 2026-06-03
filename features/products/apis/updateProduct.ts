import { useMutation, useQueryClient } from "@tanstack/react-query";
import customFetch from "@/utils/custom-fetch";
import { onMutationSuccess, onMutationError } from "@/utils/mutation-response";
import type { MutationResponse } from "@/utils/types";
import type { CreateOrUpdateProductDto } from "../types/product.dto";

export const updateProduct = async ({
  id,
  ...data
}: CreateOrUpdateProductDto & { id: string }): Promise<MutationResponse> => {
  const res = await customFetch.put(`/api/products/${id}`, data);
  return res.data;
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProduct,
    onSuccess: (msg) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      onMutationSuccess(msg);
    },
    onError: onMutationError,
  });
};
