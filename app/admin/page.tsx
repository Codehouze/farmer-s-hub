import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminOverviewPage() {
  const [
    farmerCount,
    buyerCount,
    productCount,
    activeProductCount,
    pendingOrderCount,
    totalOrderCount,
    categoryCount,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "FARMER" } }),
    prisma.user.count({ where: { role: "BUYER" } }),
    prisma.product.count(),
    prisma.product.count({ where: { available: true } }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.count(),
    prisma.category.count(),
  ]);

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { product: true, buyer: true },
  });

  return (
    <div className="space-y-10">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Farmers" value={farmerCount} href="/admin/users" />
        <StatCard label="Buyers" value={buyerCount} href="/admin/users" />
        <StatCard
          label="Products"
          value={`${activeProductCount} / ${productCount}`}
          sub="active / total"
          href="/admin/products"
        />
        <StatCard
          label="Pending orders"
          value={pendingOrderCount}
          href="/admin/orders"
        />
        <StatCard label="Total orders" value={totalOrderCount} href="/admin/orders" />
        <StatCard
          label="Categories"
          value={categoryCount}
          href="/admin/categories"
        />
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Recent orders</h2>
          <Link
            href="/admin/orders"
            className="text-sm font-semibold text-primary hover:underline"
          >
            View all &rarr;
          </Link>
        </div>

        {recentOrders.length === 0 ? (
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
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-dark">
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {order.product.name}
                    </td>
                    <td className="px-4 py-3">{order.buyer.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {order.quantity} {order.product.unit}
                    </td>
                    <td className="px-4 py-3">{order.status}</td>
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

function StatCard({
  label,
  value,
  sub,
  href,
}: {
  label: string;
  value: string | number;
  sub?: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-lg border border-cream-dark bg-white p-5 transition-shadow hover:shadow-md"
    >
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 text-2xl font-bold text-primary">{value}</p>
      {sub && <p className="text-xs text-muted">{sub}</p>}
    </Link>
  );
}
