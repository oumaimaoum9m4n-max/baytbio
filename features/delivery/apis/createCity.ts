import { useMutation, useQueryClient } from "@tanstack/react-query";
import customFetch from "@/utils/custom-fetch";
import { onMutationSuccess, onMutationError } from "@/utils/mutation-response";
import type { MutationResponse } from "@/utils/types";
import type { CreateOrUpdateDeliveryCityDto } from "../types/delivery.dto";

export const createCity = async (
  city: CreateOrUpdateDeliveryCityDto,
): Promise<MutationResponse> => {
  const res = await customFetch.post(`/api/delivery/cities`, city);
  return res.data;
};

export const useCreateCity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCity,
    onSuccess: (msg) => {
      queryClient.invalidateQueries({ queryKey: ["delivery-cities"] });
      onMutationSuccess(msg);
    },
    onError: onMutationError,
  });
};
