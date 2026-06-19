import { z } from "zod";
import type { User, UserRole } from "./user";

export const USER_ROLES = ["USER", "ADMIN"] as const;

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  USER: "",
  ADMIN: "Administrateur",
};

export const USER_SORT_OPTIONS = [
  { key: "", label: "Trier par défaut" },
  { key: "name_asc", label: "Nom A→Z" },
  { key: "name_desc", label: "Nom Z→A" },
  { key: "email_asc", label: "Email A→Z" },
  { key: "email_desc", label: "Email Z→A" },
  { key: "createdAt_desc", label: "Plus récent" },
  { key: "createdAt_asc", label: "Plus ancien" },
] as const;

/* ──────────────────────────────────────────────
   CREATE / UPDATE Schema
   - password is optional on update (only required on create)
   - email + name + role are always required
────────────────────────────────────────────── */
export const CreateOrUpdateUserSchema = z
  .object({
    name: z.string().min(1, "Le nom est obligatoire"),
    email: z.string().min(1, "L'email est obligatoire").email("Email invalide"),
    password: z
      .string()
      .optional()
      .or(z.literal(""))
      .transform((v) => (v === "" ? undefined : v)),
    role: z.enum(USER_ROLES).default("USER"),
    image: z.string().default(""),
  });

export type CreateOrUpdateUserDto = z.infer<typeof CreateOrUpdateUserSchema>;

export type GetAllUsersDto = Pick<
  User,
  "id" | "name" | "email" | "image" | "role" | "emailVerified" | "createdAt"
>;

export type GetSingleUserDto = GetAllUsersDto &
  Pick<User, "updatedAt">;
