import { useMutation, useQueryClient } from "@tanstack/react-query";
import customFetch from "@/utils/custom-fetch";
import { onMutationSuccess, onMutationError } from "@/utils/mutation-response";
import type { MutationResponse } from "@/utils/types";
import type { CreateOrUpdateUserDto } from "../types/user.dto";

export const createUser = async (
  user: CreateOrUpdateUserDto,
): Promise<MutationResponse> => {
  const res = await customFetch.post(`/api/users`, user);
  return res.data;
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: (msg) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onMutationSuccess(msg);
    },
    onError: onMutationError,
  });
};
