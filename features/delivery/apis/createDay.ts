import { useMutation, useQueryClient } from "@tanstack/react-query";
import customFetch from "@/utils/custom-fetch";
import { onMutationSuccess, onMutationError } from "@/utils/mutation-response";
import type { MutationResponse } from "@/utils/types";
import type { CreateOrUpdateDeliveryDayDto } from "../types/delivery.dto";

export const createDay = async (
  day: CreateOrUpdateDeliveryDayDto,
): Promise<MutationResponse> => {
  const res = await customFetch.post(`/api/delivery/days`, day);
  return res.data;
};

export const useCreateDay = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDay,
    onSuccess: (msg) => {
      queryClient.invalidateQueries({ queryKey: ["delivery-days"] });
      onMutationSuccess(msg);
    },
    onError: onMutationError,
  });
};
