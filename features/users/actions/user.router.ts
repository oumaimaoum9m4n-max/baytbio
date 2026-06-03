import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { toUserDetailDto, toUserDto } from "../utils/user.utils";
import type {
  CreateOrUpdateUserDto,
  GetAllUsersDto,
  GetSingleUserDto,
} from "../types/user.dto";
import type { PaginatedData, MutationResponse } from "@/utils/types";

type ListInput = {
  page: number;
  size: number;
  search: string;
  role?: string;
  sort?: string;
};

const buildOrderBy = (
  sort?: string,
): Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[] => {
  switch (sort) {
    case "name_asc":
      return { name: "asc" };
    case "name_desc":
      return { name: "desc" };
    case "email_asc":
      return { email: "asc" };
    case "email_desc":
      return { email: "desc" };
    case "createdAt_asc":
      return { createdAt: "asc" };
    case "createdAt_desc":
    default:
      return { createdAt: "desc" };
  }
};

const buildWhere = ({
  search,
  role,
}: Pick<ListInput, "search" | "role">): Prisma.UserWhereInput => {
  const where: Prisma.UserWhereInput = {};

  if (role && role !== "all" && (role === "USER" || role === "ADMIN")) {
    where.role = role;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  return where;
};

export const userRouter = {
  async getAll({
    page,
    size,
    search,
    role,
    sort,
  }: ListInput): Promise<PaginatedData<GetAllUsersDto>> {
    const where = buildWhere({ search, role });
    const orderBy = buildOrderBy(sort);

    const [data, totalItems] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy,
        skip: page * size,
        take: size,
      }),
      prisma.user.count({ where }),
    ]);

    return {
      data: data.map(toUserDto),
      totalItems,
      totalPages: Math.max(1, Math.ceil(totalItems / size)),
      currentPage: page,
      pageSize: size,
    };
  },

  async getById(id: string): Promise<GetSingleUserDto> {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new Error("Utilisateur non trouvé");
    return toUserDetailDto(user);
  },

  async create(input: CreateOrUpdateUserDto): Promise<MutationResponse> {
    if (!input.password || input.password.length < 6) {
      throw new Error("Mot de passe requis (min. 6 caractères)");
    }

    const existing = await prisma.user.findUnique({
      where: { email: input.email },
    });
    if (existing) {
      throw new Error("Un compte avec cet email existe déjà");
    }

    const hashed = await bcrypt.hash(input.password, 12);

    await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        password: hashed,
        role: input.role,
        image: input.image || null,
      },
    });

    return { msg: "Utilisateur créé avec succès" };
  },

  async update(
    id: string,
    input: Partial<CreateOrUpdateUserDto>,
  ): Promise<MutationResponse> {
    const data: Prisma.UserUpdateInput = {};

    if (input.name !== undefined) data.name = input.name;
    if (input.email !== undefined) data.email = input.email;
    if (input.role !== undefined) data.role = input.role;
    if (input.image !== undefined) data.image = input.image || null;

    if (input.password && input.password.length > 0) {
      if (input.password.length < 6) {
        throw new Error("Le mot de passe doit contenir au moins 6 caractères");
      }
      data.password = await bcrypt.hash(input.password, 12);
    }

    await prisma.user.update({ where: { id }, data });
    return { msg: "Utilisateur mis à jour avec succès" };
  },

  async delete(id: string): Promise<MutationResponse> {
    await prisma.user.delete({ where: { id } });
    return { msg: "Utilisateur supprimé avec succès" };
  },
};
