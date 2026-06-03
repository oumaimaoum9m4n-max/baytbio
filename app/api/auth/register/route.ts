import { NextResponse } from "next/server";
import { authRouter } from "@/features/auth/actions/auth.router";
import { RegisterSchema } from "@/features/auth/types/auth.dto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = RegisterSchema.parse(body);
    const result = await authRouter.register(parsed);
    return NextResponse.json(result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erreur inattendue";
    return NextResponse.json({ msg }, { status: 400 });
  }
}
