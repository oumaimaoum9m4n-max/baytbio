import { useMutation, useQueryClient } from "@tanstack/react-query";
import customFetch from "@/utils/custom-fetch";
import { onMutationSuccess, onMutationError } from "@/utils/mutation-response";
import type { MutationResponse } from "@/utils/types";
import type { CreateOrUpdateUserDto } from "../types/user.dto";

export const updateUser = async ({
  id,
  ...data
}: CreateOrUpdateUserDto & { id: string }): Promise<MutationResponse> => {
  const res = await customFetch.put(`/api/users/${id}`, data);
  return res.data;
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUser,
    onSuccess: (msg) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onMutationSuccess(msg);
    },
    onError: onMutationError,
  });
};
