import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const orderSchema = z.object({
  productId: z.string().min(1),
  quantity: z.coerce.number().positive("Quantity must be greater than 0"),
  note: z.string().trim().max(500).optional(),
});

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  if (session.user.role !== "BUYER") {
    return NextResponse.json(
      { error: "Only buyers can place orders" },
      { status: 403 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = orderSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const { productId, quantity, note } = parsed.data;

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { quantityAvail: true, available: true },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  if (!product.available) {
    return NextResponse.json(
      { error: "Product is not available" },
      { status: 400 }
    );
  }

  if (quantity > product.quantityAvail) {
    return NextResponse.json(
      { error: "Quantity exceeds what's available" },
      { status: 400 }
    );
  }

  const order = await prisma.order.create({
    data: {
      quantity,
      note,
      productId,
      buyerId: session.user.id,
    },
  });

  return NextResponse.json({ order }, { status: 201 });
}
