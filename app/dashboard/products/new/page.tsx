import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "../ProductForm";
import { createProductAction } from "../actions";

export default async function NewProductPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard/products/new");
  }
  if (session.user.role !== "FARMER") {
    redirect("/dashboard");
  }

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-primary">Add a new product</h1>
      <p className="mt-1 text-sm text-muted">
        List a product for buyers to find and order.
      </p>
      <div className="mt-6 rounded-xl border border-cream-dark bg-white p-6 shadow-sm">
        <ProductForm
          action={createProductAction}
          categories={categories}
          submitLabel="Add product"
        />
      </div>
    </div>
  );
}
