import Link from "next/link";
import { MapPin, Phone, Package } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/Badge";

export const metadata = {
  title: "Farmers & Companies | Farmers Hub",
};

export default async function FarmersPage() {
  const farmers = await prisma.user.findMany({
    where: { role: "FARMER" },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      companyName: true,
      location: true,
      bio: true,
      phone: true,
      _count: { select: { products: true } },
    },
  });

  return (
    <div className="bg-cream">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-primary">
            Farmers & Companies
          </h1>
          <p className="mt-2 text-muted">
            Meet the farmers and companies supplying fresh produce across
            Rwanda.
          </p>
        </div>

        {farmers.length === 0 ? (
          <div className="rounded-xl border border-cream-dark bg-white p-12 text-center">
            <p className="text-lg font-semibold text-foreground">
              No farmers found
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {farmers.map((farmer) => (
              <Link
                key={farmer.id}
                href={`/farmers/${farmer.id}`}
                className="block rounded-xl border border-cream-dark bg-white p-5 transition-shadow hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="font-bold text-foreground">
                      {farmer.companyName || farmer.name}
                    </h2>
                    {farmer.companyName && (
                      <p className="text-sm text-muted">{farmer.name}</p>
                    )}
                  </div>
                  <Badge tone="accent">
                    <Package className="mr-1 h-3.5 w-3.5" />
                    {farmer._count.products}
                  </Badge>
                </div>

                {farmer.bio && (
                  <p className="mt-3 line-clamp-2 text-sm text-foreground/80">
                    {farmer.bio}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted">
                  {farmer.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-primary" />
                      {farmer.location}
                    </span>
                  )}
                  {farmer.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="h-4 w-4 text-primary" />
                      {farmer.phone}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
