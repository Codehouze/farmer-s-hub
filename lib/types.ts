import type { Product, User, Category } from "@/app/generated/prisma/client";

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
