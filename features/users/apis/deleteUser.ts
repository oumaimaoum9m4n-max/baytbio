import { useMutation, useQueryClient } from "@tanstack/react-query";
import customFetch from "@/utils/custom-fetch";
import { onMutationSuccess, onMutationError } from "@/utils/mutation-response";
import type { MutationResponse } from "@/utils/types";

export const deleteUser = async (id: string): Promise<MutationResponse> => {
  const res = await customFetch.delete(`/api/users/${id}`);
  return res.data;
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: (msg) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onMutationSuccess(msg);
    },
    onError: onMutationError,
  });
};
