import { useMutation, useQueryClient } from "@tanstack/react-query";
import customFetch from "@/utils/custom-fetch";
import { onMutationSuccess, onMutationError } from "@/utils/mutation-response";
import type { MutationResponse } from "@/utils/types";
import type { OrderStatus } from "../types/order";

export const updateOrderStatus = async ({
  id,
  status,
}: {
  id: string;
  status: OrderStatus;
}): Promise<MutationResponse> => {
  const res = await customFetch.patch(`/api/orders/${id}/status`, { status });
  return res.data;
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: (msg) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      onMutationSuccess(msg);
    },
    onError: onMutationError,
  });
};
