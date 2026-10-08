import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Leaf,
  ShieldCheck,
  BadgeCheck,
  ClipboardList,
  Users,
  ShoppingCart,
  Truck,
  Smartphone,
  TrendingUp,
  Gift,
  MapPinned,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { LinkButton } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProductCard } from "@/components/products/ProductCard";

export default async function Home() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: { available: true },
      orderBy: { createdAt: "desc" },
      take: 5,
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
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="bg-cream">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
          <div>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-primary-dark sm:text-5xl">
              Connecting Farmers to Buyers Across Rwanda
            </h1>
            <p className="mt-4 max-w-xl text-lg text-muted">
              Farmers Hub makes it simple for Rwandan farmers and agricultural
              companies to list fresh produce, and for buyers to find,
              compare, and order directly from the source — no middlemen,
              better prices for everyone.
            </p>

            {/* Search bar */}
            <form
              action="/products"
              method="GET"
              className="mt-8 flex flex-col gap-2 rounded-xl border border-cream-dark bg-white p-2 shadow-sm sm:flex-row sm:items-center"
            >
              <select
                name="category"
                defaultValue=""
                className="rounded-md border border-transparent bg-cream px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none sm:w-48"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>

              <div className="flex flex-1 items-center gap-2 rounded-md border border-transparent bg-cream px-3 py-2.5 focus-within:border-primary">
                <Search className="h-4 w-4 shrink-0 text-muted" />
                <input
                  type="text"
                  name="q"
                  placeholder="Search for vegetables, fruits, grains..."
                  className="w-full bg-transparent text-sm text-foreground placeholder:text-muted focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
              >
                <Search className="h-4 w-4" />
                Search
              </button>
            </form>

            {/* Trust badges */}
            <div className="mt-5 flex flex-wrap gap-2">
              <Badge tone="accent">
                <Leaf className="mr-1 h-3.5 w-3.5" /> Fresh Produce
              </Badge>
              <Badge tone="accent">
                <ShieldCheck className="mr-1 h-3.5 w-3.5" /> Trusted Farmers
              </Badge>
              <Badge tone="accent">
                <BadgeCheck className="mr-1 h-3.5 w-3.5" /> Quality Guaranteed
              </Badge>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href="/products">Find Products</LinkButton>
              <LinkButton variant="outline" href="/register?role=farmer">
                Sell Your Products
              </LinkButton>
            </div>
          </div>

          <div className="relative mx-auto aspect-[4/3] w-full max-w-lg overflow-hidden rounded-2xl shadow-xl lg:max-w-none">
            <Image
              src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=80"
              alt="Fresh vegetables harvested by Rwandan farmers"
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 45vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Featured Products
            </h2>
            <p className="mt-1 text-muted">
              Fresh picks from farmers near you, updated regularly.
            </p>
          </div>
          <Link
            href="/products"
            className="hidden shrink-0 text-sm font-semibold text-primary hover:underline sm:inline-block"
          >
            View all products &rarr;
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/products"
            className="text-sm font-semibold text-primary hover:underline"
          >
            View all products &rarr;
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              How It Works
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-muted">
              A simple, direct path from farm to buyer in four steps.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: ClipboardList,
                title: "Farmers List Products",
                desc: "Farmers and agri-companies add their fresh produce, quantities, and prices in minutes.",
              },
              {
                icon: Search,
                title: "Buyers Search",
                desc: "Buyers browse by category, location, or keyword to find exactly what they need.",
              },
              {
                icon: ShoppingCart,
                title: "Make an Order",
                desc: "Buyers place an order directly with the farmer — clear quantities and prices, no surprises.",
              },
              {
                icon: Truck,
                title: "Connect & Deliver",
                desc: "Farmer and buyer connect to arrange pickup or delivery and complete the sale.",
              },
            ].map((step, i) => (
              <div
                key={step.title}
                className="relative rounded-xl border border-cream-dark bg-white p-6 text-center shadow-sm"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <step.icon className="h-6 w-6" />
                </div>
                <div className="mt-4 text-xs font-bold uppercase tracking-wider text-accent">
                  Step {i + 1}
                </div>
                <h3 className="mt-1 font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-muted">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-primary-dark text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 text-center sm:px-6 md:grid-cols-5 lg:px-8">
          {[
            { icon: ShieldCheck, label: "Trusted Platform" },
            { icon: Smartphone, label: "Easy Communication" },
            { icon: TrendingUp, label: "Better Market" },
            { icon: Gift, label: "Market Linking Bonus" },
            { icon: MapPinned, label: "Serving all Rwanda" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center gap-3"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                <item.icon className="h-6 w-6" />
              </span>
              <span className="text-sm font-medium text-white/90">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
