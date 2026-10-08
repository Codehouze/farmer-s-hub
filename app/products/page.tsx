import { Search } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/Button";
import type { Prisma } from "@/app/generated/prisma/client";

export const metadata = {
  title: "Products | Farmers Hub",
};

type SearchParams = Promise<{
  q?: string;
  category?: string;
  location?: string;
}>;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { q, category, location } = await searchParams;

  const [categories, locations] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({
      where: { available: true },
      select: { location: true },
      distinct: ["location"],
      orderBy: { location: "asc" },
    }),
  ]);

  const where: Prisma.ProductWhereInput = {
    available: true,
    ...(q ? { name: { contains: q } } : {}),
    ...(category ? { category: { slug: category } } : {}),
    ...(location ? { location } : {}),
  };

  const products = await prisma.product.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      price: true,
      unit: true,
      quantityAvail: true,
      location: true,
      imageUrl: true,
      available: true,
    },
  });

  const hasFilters = Boolean(q || category || location);

  return (
    <div className="bg-cream">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-primary">
            Browse Products
          </h1>
          <p className="mt-2 text-muted">
            Fresh produce straight from farmers across Rwanda.
          </p>
        </div>

        <form
          method="GET"
          className="mb-8 grid gap-4 rounded-xl border border-cream-dark bg-white p-4 sm:grid-cols-4"
        >
          <div className="relative sm:col-span-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="text"
              name="q"
              defaultValue={q ?? ""}
              placeholder="Search products..."
              className="w-full rounded-md border border-cream-dark bg-cream/40 py-2.5 pl-9 pr-3 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none"
            />
          </div>

          <select
            name="category"
            defaultValue={category ?? ""}
            className="w-full rounded-md border border-cream-dark bg-cream/40 py-2.5 px-3 text-sm text-foreground focus:border-primary focus:outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            name="location"
            defaultValue={location ?? ""}
            className="w-full rounded-md border border-cream-dark bg-cream/40 py-2.5 px-3 text-sm text-foreground focus:border-primary focus:outline-none"
          >
            <option value="">All Locations</option>
            {locations.map((l) => (
              <option key={l.location} value={l.location}>
                {l.location}
              </option>
            ))}
          </select>

          <div className="flex gap-3 sm:col-span-4">
            <Button type="submit" variant="primary">
              Apply Filters
            </Button>
            {hasFilters && (
              <a
                href="/products"
                className="inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold text-muted transition-colors hover:text-primary"
              >
                Clear
              </a>
            )}
          </div>
        </form>

        {products.length === 0 ? (
          <div className="rounded-xl border border-cream-dark bg-white p-12 text-center">
            <p className="text-lg font-semibold text-foreground">
              No products found
            </p>
            <p className="mt-1 text-muted">
              Try adjusting your search or filters to find what you&apos;re
              looking for.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
