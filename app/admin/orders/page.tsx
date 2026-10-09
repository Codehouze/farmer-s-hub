import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/Badge";
import { AdminOrderStatusForm } from "./AdminOrderStatusForm";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      product: { include: { farmer: { select: { name: true, companyName: true } } } },
      buyer: { select: { name: true, email: true } },
    },
  });

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">
        All orders ({orders.length})
      </h2>

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
                <th className="px-4 py-3">Farmer</th>
                <th className="px-4 py-3">Buyer</th>
                <th className="px-4 py-3">Qty</th>
                <th className="px-4 py-3">Placed</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-dark">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-3 font-medium text-foreground">
                    {order.product.name}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {order.product.farmer.companyName || order.product.farmer.name}
                  </td>
                  <td className="px-4 py-3">
                    {order.buyer.name}
                    <span className="block text-xs text-muted">
                      {order.buyer.email}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {order.quantity} {order.product.unit}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted">
                    {order.createdAt.toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={order.status === "PENDING" ? "muted" : "accent"}>
                      {order.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <AdminOrderStatusForm
                      orderId={order.id}
                      currentStatus={order.status}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
