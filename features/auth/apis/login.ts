import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { onMutationSuccess, onMutationError } from "@/utils/mutation-response";
import type { MutationResponse } from "@/utils/types";
import type { LoginDto } from "../types/auth.dto";

type LoginInput = LoginDto & { callbackUrl?: string };

export const login = async ({
  email,
  password,
}: LoginInput): Promise<MutationResponse> => {
  const res = await signIn("credentials", {
    email,
    password,
    redirect: false,
  });

  if (!res) {
    throw new Error("Erreur de connexion");
  }

  if (res.error) {
    throw new Error(res.error);
  }

  return { msg: "Connexion réussie" };
};

export const useLogin = () => {
  return useMutation({
    mutationFn: login,
    onSuccess: onMutationSuccess,
    onError: onMutationError,
  });
};

export const loginWithGoogle = async (callbackUrl = "/") => {
  await signIn("google", { callbackUrl });
};

export const useLoginWithGoogle = () => {
  return useMutation({
    mutationFn: loginWithGoogle,
    onError: onMutationError,
  });
};
