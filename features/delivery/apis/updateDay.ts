import { useMutation, useQueryClient } from "@tanstack/react-query";
import customFetch from "@/utils/custom-fetch";
import { onMutationSuccess, onMutationError } from "@/utils/mutation-response";
import type { MutationResponse } from "@/utils/types";
import type { CreateOrUpdateDeliveryDayDto } from "../types/delivery.dto";

export const updateDay = async ({
  id,
  ...data
}: CreateOrUpdateDeliveryDayDto & { id: string }): Promise<MutationResponse> => {
  const res = await customFetch.put(`/api/delivery/days/${id}`, data);
  return res.data;
};

export const useUpdateDay = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateDay,
    onSuccess: (msg) => {
      queryClient.invalidateQueries({ queryKey: ["delivery-days"] });
      onMutationSuccess(msg);
    },
    onError: onMutationError,
  });
};
