import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import type { ProductCardData } from "@/lib/types";

export function ProductCard({ product }: { product: ProductCardData }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group block overflow-hidden rounded-xl border border-cream-dark bg-white transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-cream">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 20vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted">
            No image
          </div>
        )}
        {product.available && (
          <span className="absolute left-2 top-2 rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-white">
            Available
          </span>
        )}
      </div>

      <div className="space-y-1 p-3">
        <h3 className="font-semibold text-foreground">{product.name}</h3>
        <p className="text-sm text-muted">
          {product.quantityAvail} {product.unit} available
        </p>
        <p className="flex items-center gap-1 text-sm text-muted">
          <MapPin className="h-3.5 w-3.5" />
          {product.location}
        </p>
        <p className="pt-1 text-base font-bold text-primary">
          {product.price.toLocaleString()} RWF
          <span className="text-xs font-normal text-muted">
            /{product.unit}
          </span>
        </p>
      </div>
    </Link>
  );
}
