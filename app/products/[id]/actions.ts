"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { placeOrder as placeOrderInDb } from "@/lib/orders";

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

  const result = await placeOrderInDb(
    productId,
    session.user.id,
    parsed.data.quantity,
    parsed.data.note
  );

  if (!result.ok) {
    const errorParam = result.code === 404 ? "unavailable" : "exceeds";
    redirect(`/products/${productId}?error=${errorParam}`);
  }

  redirect(`/products/${productId}?ordered=1`);
}
