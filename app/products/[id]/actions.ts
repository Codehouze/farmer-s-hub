"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const orderSchema = z.object({
  quantity: z.coerce.number().positive("Quantity must be greater than 0"),
  note: z.string().trim().max(500).optional(),
});

export async function placeOrder(productId: string, formData: FormData) {
  const session = await auth();

  if (!session?.user || session.user.role !== "BUYER") {
    redirect(`/login?callbackUrl=/products/${productId}`);
  }

  const parsed = orderSchema.safeParse({
    quantity: formData.get("quantity"),
    note: formData.get("note") || undefined,
  });

  if (!parsed.success) {
    redirect(`/products/${productId}?error=invalid`);
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { quantityAvail: true, available: true },
  });

  if (!product || !product.available) {
    redirect(`/products/${productId}?error=unavailable`);
  }

  if (parsed.data.quantity > product.quantityAvail) {
    redirect(`/products/${productId}?error=exceeds`);
  }

  await prisma.order.create({
    data: {
      quantity: parsed.data.quantity,
      note: parsed.data.note,
      productId,
      buyerId: session.user.id,
    },
  });

  redirect(`/products/${productId}?ordered=1`);
}
