import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "../../ProductForm";
import { updateProductAction, deleteProductAction } from "../../actions";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect(`/login?callbackUrl=/dashboard/products/${id}/edit`);
  }
  if (session.user.role !== "FARMER") {
    redirect("/dashboard");
  }

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product || product.farmerId !== session.user.id) {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-primary">Edit product</h1>
      <p className="mt-1 text-sm text-muted">Update your listing details below.</p>

      <div className="mt-6 rounded-xl border border-cream-dark bg-white p-6 shadow-sm">
        <ProductForm
          action={updateProductAction.bind(null, product.id)}
          categories={categories}
          submitLabel="Save changes"
          defaultValues={{
            name: product.name,
            description: product.description ?? "",
            price: product.price,
            unit: product.unit,
            quantityAvail: product.quantityAvail,
            location: product.location,
            imageUrl: product.imageUrl ?? "",
            categoryId: product.categoryId,
            available: product.available,
          }}
        />
      </div>

      <form action={deleteProductAction.bind(null, product.id)} className="mt-6">
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-md border border-red-600 px-5 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-600 hover:text-white"
        >
          Delete product
        </button>
      </form>
    </div>
  );
}
