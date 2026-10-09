import Link from "next/link";
import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/admin";

const adminNav = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/categories", label: "Categories" },
];

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requireAdmin();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          Admin
        </p>
        <h1 className="text-2xl font-bold text-primary">
          Welcome, {session.user.name ?? "Admin"}
        </h1>
      </div>

      <nav className="mb-8 flex flex-wrap gap-1 rounded-lg border border-cream-dark bg-white p-1 text-sm font-medium">
        {adminNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-md px-3 py-1.5 text-foreground/80 transition-colors hover:bg-cream hover:text-primary"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {children}
    </div>
  );
}
