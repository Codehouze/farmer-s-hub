import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/Badge";
import { toggleProductAvailabilityAction, adminDeleteProductAction } from "./actions";

type SearchParams = Promise<{ notice?: string }>;

const NOTICE_MESSAGES: Record<string, string> = {
  deleted: "Product deleted.",
  delisted:
    "This product has order history, so it was marked unavailable instead of deleted.",
};

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { notice } = await searchParams;
  const noticeMessage = notice ? NOTICE_MESSAGES[notice] : undefined;

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      farmer: { select: { id: true, name: true, companyName: true } },
      category: { select: { name: true } },
    },
  });

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">
        All products ({products.length})
      </h2>

      {noticeMessage && (
        <p className="rounded-md bg-accent/15 px-4 py-3 text-sm font-medium text-primary-dark">
          {noticeMessage}
        </p>
      )}

      <div className="overflow-x-auto rounded-lg border border-cream-dark">
        <table className="w-full text-left text-sm">
          <thead className="bg-cream text-xs uppercase text-muted">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Farmer</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Qty</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-dark">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-4 py-3 font-medium text-foreground">
                  <Link
                    href={`/products/${product.id}`}
                    className="hover:text-primary hover:underline"
                  >
                    {product.name}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/farmers/${product.farmer.id}`}
                    className="hover:text-primary hover:underline"
                  >
                    {product.farmer.companyName || product.farmer.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted">
                  {product.category?.name ?? "—"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {product.price.toLocaleString()} RWF/{product.unit}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {product.quantityAvail} {product.unit}
                </td>
                <td className="px-4 py-3">
                  <Badge tone={product.available ? "accent" : "muted"}>
                    {product.available ? "Available" : "Unavailable"}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <form
                      action={toggleProductAvailabilityAction.bind(null, product.id)}
                    >
                      <input
                        type="hidden"
                        name="available"
                        value={(!product.available).toString()}
                      />
                      <button
                        type="submit"
                        className="text-xs font-semibold text-primary hover:underline"
                      >
                        {product.available ? "Delist" : "Relist"}
                      </button>
                    </form>
                    <form action={adminDeleteProductAction.bind(null, product.id)}>
                      <button
                        type="submit"
                        className="text-xs font-semibold text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
