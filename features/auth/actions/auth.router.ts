import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import type { RegisterDto } from "../types/auth.dto";
import type { MutationResponse } from "@/utils/types";

export const authRouter = {
  async register(input: RegisterDto): Promise<MutationResponse> {
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
      },
    });

    return { msg: "Compte créé avec succès" };
  },
};
