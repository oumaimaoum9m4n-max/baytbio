import type { GetAllUsersDto, GetSingleUserDto } from "../types/user.dto";
import type { UserRole } from "../types/user";

type PrismaUserLike = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: UserRole | string;
  emailVerified: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
};

const toISO = (v: Date | string | null | undefined): string => {
  if (!v) return "";
  if (v instanceof Date) return v.toISOString();
  return v;
};

export const toUserDto = (user: PrismaUserLike): GetAllUsersDto => ({
  id: user.id,
  name: user.name ?? "",
  email: user.email ?? "",
  image: user.image ?? "",
  role: (user.role as UserRole) ?? "USER",
  emailVerified: user.emailVerified ? toISO(user.emailVerified) : null,
  createdAt: toISO(user.createdAt),
});

export const toUserDetailDto = (user: PrismaUserLike): GetSingleUserDto => ({
  ...toUserDto(user),
  updatedAt: toISO(user.updatedAt),
});

export const USER_ROLE_STYLE: Record<
  UserRole,
  { chipColor: "primary" | "default"; dot: string }
> = {
  ADMIN: { chipColor: "primary", dot: "#2D5A3D" },
  USER: { chipColor: "default", dot: "#888880" },
};
