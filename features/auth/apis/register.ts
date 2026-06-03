import { useMutation } from "@tanstack/react-query";
import customFetch from "@/utils/custom-fetch";
import { onMutationSuccess, onMutationError } from "@/utils/mutation-response";
import type { MutationResponse } from "@/utils/types";
import type { RegisterDto } from "../types/auth.dto";

export const register = async (
  input: RegisterDto,
): Promise<MutationResponse> => {
  const res = await customFetch.post(`/api/auth/register`, input);
  return res.data;
};

export const useRegister = () => {
  return useMutation({
    mutationFn: register,
    onSuccess: onMutationSuccess,
    onError: onMutationError,
  });
};
