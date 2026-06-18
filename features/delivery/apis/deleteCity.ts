import { useMutation, useQueryClient } from "@tanstack/react-query";
import customFetch from "@/utils/custom-fetch";
import { onMutationSuccess, onMutationError } from "@/utils/mutation-response";
import type { MutationResponse } from "@/utils/types";

export const deleteCity = async (id: string): Promise<MutationResponse> => {
  const res = await customFetch.delete(`/api/delivery/cities/${id}`);
  return res.data;
};

export const useDeleteCity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCity,
    onSuccess: (msg) => {
      queryClient.invalidateQueries({ queryKey: ["delivery-cities"] });
      onMutationSuccess(msg);
    },
    onError: onMutationError,
  });
};
