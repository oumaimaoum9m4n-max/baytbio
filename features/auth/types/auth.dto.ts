import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().min(1, "L'email est obligatoire").email("Email invalide"),
  password: z.string().min(1, "Le mot de passe est obligatoire"),
});

export type LoginDto = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
  name: z.string().min(1, "Le nom est obligatoire"),
  email: z.string().min(1, "L'email est obligatoire").email("Email invalide"),
  password: z
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

export type RegisterDto = z.infer<typeof RegisterSchema>;
