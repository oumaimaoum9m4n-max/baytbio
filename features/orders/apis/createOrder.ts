import { useMutation, useQueryClient } from "@tanstack/react-query";
import customFetch from "@/utils/custom-fetch";
import { onMutationSuccess, onMutationError } from "@/utils/mutation-response";
import type { MutationResponse } from "@/utils/types";
import type { CreateOrUpdateOrderDto } from "../types/order.dto";

export type CreateOrderResponse = MutationResponse & { id: string };

export const createOrder = async (
  order: CreateOrUpdateOrderDto,
): Promise<CreateOrderResponse> => {
  const res = await customFetch.post(`/api/orders`, order);
  return res.data;
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOrder,
    onSuccess: (msg) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      onMutationSuccess(msg);
    },
    onError: onMutationError,
  });
};
