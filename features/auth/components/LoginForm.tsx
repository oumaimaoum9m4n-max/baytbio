"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@heroui/react";
import { LogIn, Lock, Mail } from "lucide-react";

import { FormInput } from "@/components/ui";
import { useShowFormError } from "@/hooks/use-show-form-error";
import { LoginSchema, type LoginDto } from "../types/auth.dto";

type Props = {
  onSubmit: (data: LoginDto) => void;
  isSubmitting: boolean;
};

const LoginForm = ({ onSubmit, isSubmitting }: Props) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDto>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(LoginSchema) as any,
    defaultValues: { email: "", password: "" },
  });

  useShowFormError(errors);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5"
      style={{ fontFamily: "DM Sans, sans-serif" }}
    >
      <FormInput
        control={control}
        name="email"
        label="Email *"
        placeholder="vous@example.com"
        autoComplete="email"
        props={{
          startContent: (
            <Mail size={13} className="text-[#888880] pointer-events-none" />
          ),
        }}
      />

      <FormInput
        control={control}
        name="password"
        label="Mot de passe *"
        placeholder="••••••••"
        autoComplete="current-password"
        props={{
          type: "password",
          startContent: (
            <Lock size={13} className="text-[#888880] pointer-events-none" />
          ),
        }}
      />

      <Button
        type="submit"
        color="primary"
        size="md"
        isLoading={isSubmitting}
        startContent={!isSubmitting ? <LogIn size={14} /> : undefined}
        className="h-10 text-[0.85rem] font-medium mt-2"
      >
        Se connecter
      </Button>
    </form>
  );
};

export default LoginForm;
