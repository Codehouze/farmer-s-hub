import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["FARMER", "BUYER"]),
  phone: z.string().trim().optional().or(z.literal("")),
  location: z.string().trim().optional().or(z.literal("")),
  companyName: z.string().trim().optional().or(z.literal("")),
  bio: z.string().trim().optional().or(z.literal("")),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const productSchema = z.object({
  name: z.string().trim().min(2, "Product name must be at least 2 characters"),
  description: z.string().trim().optional().or(z.literal("")),
  price: z.coerce.number().positive("Price must be greater than 0"),
  unit: z.string().trim().min(1, "Unit is required"),
  quantityAvail: z.coerce.number().min(0, "Quantity can't be negative"),
  location: z.string().trim().min(2, "Location is required"),
  imageUrl: z.string().trim().optional().or(z.literal("")),
  categoryId: z.string().trim().optional().or(z.literal("")),
  available: z.boolean().optional(),
});

export type ProductInput = z.infer<typeof productSchema>;
