import { notFound } from "next/navigation";
import { MapPin, Phone } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/products/ProductCard";
import { PRODUCT_CARD_SELECT } from "@/lib/types";

type Params = Promise<{ id: string }>;

export default async function FarmerProfilePage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;

  const farmer = await prisma.user.findFirst({
    where: { id, role: "FARMER" },
    select: {
      id: true,
      name: true,
      companyName: true,
      location: true,
      bio: true,
      phone: true,
      products: {
        where: { available: true },
        orderBy: { createdAt: "desc" },
        select: PRODUCT_CARD_SELECT,
      },
    },
  });

  if (!farmer) {
    notFound();
  }

  return (
    <div className="bg-cream">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-cream-dark bg-white p-6">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            {farmer.companyName || farmer.name}
          </h1>
          {farmer.companyName && (
            <p className="text-muted">{farmer.name}</p>
          )}

          {farmer.bio && (
            <p className="mt-3 max-w-2xl text-foreground/80">{farmer.bio}</p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-foreground/80">
            {farmer.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-primary" />
                {farmer.location}
              </span>
            )}
            {farmer.phone && (
              <a
                href={`tel:${farmer.phone}`}
                className="flex items-center gap-1 font-medium text-primary hover:underline"
              >
                <Phone className="h-4 w-4" />
                {farmer.phone}
              </a>
            )}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="mb-4 text-xl font-bold text-foreground">
            Available Products
          </h2>

          {farmer.products.length === 0 ? (
            <div className="rounded-xl border border-cream-dark bg-white p-12 text-center">
              <p className="text-muted">
                This farmer has no available products right now.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {farmer.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
