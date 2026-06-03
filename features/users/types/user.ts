export type UserRole = "USER" | "ADMIN";

export type User = {
  id: string;
  name: string;
  email: string;
  image: string;
  role: UserRole;
  emailVerified: string | null;
  createdAt: string;
  updatedAt: string;
};
