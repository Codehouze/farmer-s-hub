import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Phone, CheckCircle2, AlertCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Badge } from "@/components/ui/Badge";
import { Button, LinkButton } from "@/components/ui/Button";
import { placeOrder } from "./actions";

type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ ordered?: string; error?: string }>;

export default async function ProductDetailPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { id } = await params;
  const { ordered, error } = await searchParams;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { farmer: true, category: true },
  });

  if (!product) {
    notFound();
  }

  const session = await auth();
  const action = placeOrder.bind(null, product.id);

  const errorMessages: Record<string, string> = {
    invalid: "Please enter a valid quantity.",
    unavailable: "This product is no longer available.",
    exceeds: "That quantity exceeds what's currently available.",
  };

  return (
    <div className="bg-cream">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-white">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted">
                No image
              </div>
            )}
            {product.available && (
              <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-medium text-white">
                Available
              </span>
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              {product.category && (
                <Badge tone="accent">{product.category.name}</Badge>
              )}
              {!product.available && <Badge tone="muted">Sold out</Badge>}
            </div>

            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground">
              {product.name}
            </h1>

            <p className="mt-2 text-2xl font-bold text-primary">
              {product.price.toLocaleString()} RWF
              <span className="text-sm font-normal text-muted">
                /{product.unit}
              </span>
            </p>

            <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-muted">Quantity available</dt>
                <dd className="font-semibold text-foreground">
                  {product.quantityAvail} {product.unit}
                </dd>
              </div>
              <div>
                <dt className="text-muted">Location</dt>
                <dd className="flex items-center gap-1 font-semibold text-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  {product.location}
                </dd>
              </div>
            </dl>

            {product.description && (
              <p className="mt-4 text-foreground/80">{product.description}</p>
            )}

            <div className="mt-6 rounded-xl border border-cream-dark bg-white p-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
                Sold by
              </h2>
              <p className="mt-1 text-lg font-bold text-foreground">
                {product.farmer.companyName || product.farmer.name}
              </p>
              {product.farmer.companyName && (
                <p className="text-sm text-muted">{product.farmer.name}</p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-foreground/80">
                {product.farmer.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-primary" />
                    {product.farmer.location}
                  </span>
                )}
                {product.farmer.phone && (
                  <a
                    href={`tel:${product.farmer.phone}`}
                    className="flex items-center gap-1 font-medium text-primary hover:underline"
                  >
                    <Phone className="h-4 w-4" />
                    {product.farmer.phone}
                  </a>
                )}
              </div>
              <Link
                href={`/farmers/${product.farmer.id}`}
                className="mt-3 inline-block text-sm font-semibold text-primary hover:underline"
              >
                View farmer profile &rarr;
              </Link>
            </div>

            <div className="mt-6 rounded-xl border border-cream-dark bg-white p-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
                Place an Order
              </h2>

              {ordered === "1" && (
                <p className="mt-3 flex items-center gap-2 rounded-md bg-accent/15 px-3 py-2 text-sm font-medium text-primary-dark">
                  <CheckCircle2 className="h-4 w-4" />
                  Order placed successfully! The farmer will be in touch.
                </p>
              )}

              {error && errorMessages[error] && (
                <p className="mt-3 flex items-center gap-2 rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                  <AlertCircle className="h-4 w-4" />
                  {errorMessages[error]}
                </p>
              )}

              {!product.available ? (
                <p className="mt-3 text-sm text-muted">
                  This product is currently sold out.
                </p>
              ) : !session?.user ? (
                <div className="mt-3">
                  <p className="text-sm text-muted">
                    Please log in as a buyer to place an order.
                  </p>
                  <LinkButton
                    href={`/login?callbackUrl=/products/${product.id}`}
                    className="mt-3"
                  >
                    Log in to Order
                  </LinkButton>
                </div>
              ) : session.user.role === "FARMER" ? (
                <p className="mt-3 rounded-md bg-cream-dark px-3 py-2 text-sm text-muted">
                  Farmers can&apos;t place orders.
                </p>
              ) : session.user.role === "BUYER" ? (
                <form action={action} className="mt-3 space-y-3">
                  <div>
                    <label
                      htmlFor="quantity"
                      className="block text-sm font-medium text-foreground"
                    >
                      Quantity ({product.unit})
                    </label>
                    <input
                      id="quantity"
                      name="quantity"
                      type="number"
                      min={0.1}
                      max={product.quantityAvail}
                      step="any"
                      required
                      defaultValue={1}
                      className="mt-1 w-full rounded-md border border-cream-dark bg-cream/40 py-2 px-3 text-sm focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="note"
                      className="block text-sm font-medium text-foreground"
                    >
                      Note (optional)
                    </label>
                    <textarea
                      id="note"
                      name="note"
                      rows={2}
                      placeholder="Delivery details, preferred date, etc."
                      className="mt-1 w-full rounded-md border border-cream-dark bg-cream/40 py-2 px-3 text-sm focus:border-primary focus:outline-none"
                    />
                  </div>
                  <Button type="submit" variant="primary" className="w-full">
                    Place Order
                  </Button>
                </form>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
