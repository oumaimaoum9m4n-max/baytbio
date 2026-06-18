import { useMutation, useQueryClient } from "@tanstack/react-query";
import customFetch from "@/utils/custom-fetch";
import { onMutationSuccess, onMutationError } from "@/utils/mutation-response";
import type { MutationResponse } from "@/utils/types";
import type { CreateOrUpdateDeliveryCityDto } from "../types/delivery.dto";

export const updateCity = async ({
  id,
  ...data
}: CreateOrUpdateDeliveryCityDto & { id: string }): Promise<MutationResponse> => {
  const res = await customFetch.put(`/api/delivery/cities/${id}`, data);
  return res.data;
};

export const useUpdateCity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCity,
    onSuccess: (msg) => {
      queryClient.invalidateQueries({ queryKey: ["delivery-cities"] });
      onMutationSuccess(msg);
    },
    onError: onMutationError,
  });
};
