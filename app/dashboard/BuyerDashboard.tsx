import { LinkButton } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { Order, Product, User, OrderStatus } from "@/app/generated/prisma/client";

type OrderWithProductFarmer = Order & { product: Product & { farmer: User } };

export function BuyerDashboard({
  userName,
  orders,
}: {
  userName: string;
  orders: OrderWithProductFarmer[];
}) {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Welcome back, {userName}</h1>
          <p className="text-sm text-muted">Track the status of your orders.</p>
        </div>
        <LinkButton href="/products">Browse products</LinkButton>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-lg border border-dashed border-cream-dark p-10 text-center">
          <p className="text-muted">You haven&apos;t placed any orders yet.</p>
          <div className="mt-4">
            <LinkButton href="/products">Browse products</LinkButton>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-cream-dark bg-white p-4"
            >
              <div>
                <p className="font-semibold text-foreground">{order.product.name}</p>
                <p className="text-sm text-muted">
                  {order.quantity} {order.product.unit} • from {order.product.farmer.name} •{" "}
                  {order.product.location}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-foreground">
                  {(order.product.price * order.quantity).toLocaleString()} RWF
                </span>
                <StatusBadge status={order.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const toneMap: Record<OrderStatus, "accent" | "muted"> = {
    PENDING: "muted",
    CONFIRMED: "accent",
    COMPLETED: "accent",
    CANCELLED: "muted",
  };
  return <Badge tone={toneMap[status]}>{status}</Badge>;
}
