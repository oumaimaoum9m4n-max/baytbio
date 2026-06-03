import { useMutation, useQueryClient } from "@tanstack/react-query";
import customFetch from "@/utils/custom-fetch";
import { onMutationSuccess, onMutationError } from "@/utils/mutation-response";
import type { MutationResponse } from "@/utils/types";
import type { CreateOrUpdateOrderDto } from "../types/order.dto";

export const updateOrder = async ({
  id,
  ...data
}: CreateOrUpdateOrderDto & { id: string }): Promise<MutationResponse> => {
  const res = await customFetch.put(`/api/orders/${id}`, data);
  return res.data;
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateOrder,
    onSuccess: (msg) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      onMutationSuccess(msg);
    },
    onError: onMutationError,
  });
};
