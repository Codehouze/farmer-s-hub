import type { Prisma, Product, User, Category } from "@/app/generated/prisma/client";

export type ProductWithFarmer = Product & {
  farmer: Pick<User, "id" | "name" | "location" | "phone" | "companyName">;
  category: Category | null;
};

export type ProductCardData = Pick<
  Product,
  | "id"
  | "name"
  | "price"
  | "unit"
  | "quantityAvail"
  | "location"
  | "imageUrl"
  | "available"
>;

// Prisma `select` object matching ProductCardData exactly - pass this to any
// `prisma.product.findMany`/`findUnique` that feeds a <ProductCard />, so
// the two can't drift apart.
export const PRODUCT_CARD_SELECT = {
  id: true,
  name: true,
  price: true,
  unit: true,
  quantityAvail: true,
  location: true,
  imageUrl: true,
  available: true,
} satisfies Prisma.ProductSelect;
