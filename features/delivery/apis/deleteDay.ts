import { useMutation, useQueryClient } from "@tanstack/react-query";
import customFetch from "@/utils/custom-fetch";
import { onMutationSuccess, onMutationError } from "@/utils/mutation-response";
import type { MutationResponse } from "@/utils/types";

export const deleteDay = async (id: string): Promise<MutationResponse> => {
  const res = await customFetch.delete(`/api/delivery/days/${id}`);
  return res.data;
};

export const useDeleteDay = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDay,
    onSuccess: (msg) => {
      queryClient.invalidateQueries({ queryKey: ["delivery-days"] });
      onMutationSuccess(msg);
    },
    onError: onMutationError,
  });
};
