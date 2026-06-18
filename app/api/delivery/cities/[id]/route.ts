import { NextResponse } from "next/server";
import { deliveryCityRouter } from "@/features/delivery/actions/deliveryCity.router";
import { CustomAPIError } from "@/errors";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const body = await req.json();
    const result = await deliveryCityRouter.update(id, body);
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof CustomAPIError) {
      return NextResponse.json({ msg: err.message }, { status: err.statusCode });
    }
    console.error("[PUT /api/delivery/cities/:id]", err);
    return NextResponse.json(
      { msg: "Une erreur est survenue lors de la mise à jour de la ville." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const result = await deliveryCityRouter.delete(id);
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof CustomAPIError) {
      return NextResponse.json({ msg: err.message }, { status: err.statusCode });
    }
    console.error("[DELETE /api/delivery/cities/:id]", err);
    return NextResponse.json(
      { msg: "Une erreur est survenue lors de la suppression de la ville." },
      { status: 500 },
    );
  }
}
