import Link from "next/link";
import { LinkButton } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { OrderStatusForm } from "./OrderStatusForm";
import { deleteProductAction } from "./products/actions";
import type { Product, Order, User } from "@/app/generated/prisma/client";

type OrderWithRelations = Order & { product: Product; buyer: User };

export function FarmerDashboard({
  userName,
  products,
  orders,
}: {
  userName: string;
  products: Product[];
  orders: OrderWithRelations[];
}) {
  const activeProductCount = products.filter((p) => p.available).length;
  const pendingOrdersCount = orders.filter((o) => o.status === "PENDING").length;

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-2xl font-bold text-primary">Welcome back, {userName}</h1>
        <p className="text-sm text-muted">Manage your products and track incoming orders.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Active products" value={activeProductCount} />
        <StatCard label="Total products" value={products.length} />
        <StatCard label="Pending orders" value={pendingOrdersCount} />
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Your products</h2>
          <LinkButton href="/dashboard/products/new">Add product</LinkButton>
        </div>

        {products.length === 0 ? (
          <p className="rounded-lg border border-dashed border-cream-dark p-6 text-center text-sm text-muted">
            You haven&apos;t listed any products yet.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-cream-dark">
            <table className="w-full text-left text-sm">
              <thead className="bg-cream text-xs uppercase text-muted">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Qty</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-dark">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-4 py-3 font-medium text-foreground">{product.name}</td>
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
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/dashboard/products/${product.id}/edit`}
                          className="font-semibold text-primary hover:underline"
                        >
                          Edit
                        </Link>
                        <form action={deleteProductAction.bind(null, product.id)}>
                          <button
                            type="submit"
                            className="font-semibold text-red-600 hover:underline"
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
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Incoming orders</h2>

        {orders.length === 0 ? (
          <p className="rounded-lg border border-dashed border-cream-dark p-6 text-center text-sm text-muted">
            No orders yet.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-cream-dark">
            <table className="w-full text-left text-sm">
              <thead className="bg-cream text-xs uppercase text-muted">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Buyer</th>
                  <th className="px-4 py-3">Qty</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-dark">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-4 py-3 font-medium text-foreground">{order.product.name}</td>
                    <td className="px-4 py-3">{order.buyer.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {order.quantity} {order.product.unit}
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={order.status === "PENDING" ? "muted" : "accent"}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <OrderStatusForm orderId={order.id} currentStatus={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-cream-dark bg-white p-5">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 text-2xl font-bold text-primary">{value}</p>
    </div>
  );
}
