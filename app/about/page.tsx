import Image from "next/image";
import { Target, Users2, Sprout } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";

export const metadata = {
  title: "About Us — Farmers Hub",
  description:
    "Learn about Farmers Hub's mission to connect Rwandan farmers directly with buyers.",
};

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-cream">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-primary-dark sm:text-5xl">
            About Farmers Hub
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
            We build the bridge between the people who grow Rwanda&apos;s food
            and the people who need it — directly, fairly, and with trust.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-xl">
            <Image
              src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=1200&q=80"
              alt="Farmland in Rwanda"
              fill
              sizes="(max-width: 1024px) 90vw, 45vw"
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Our Story
            </h2>
            <p className="mt-4 text-muted">
              Farmers Hub started with a simple observation: Rwandan farmers
              grow some of the freshest produce in the region, yet too often
              struggle to find reliable buyers at fair prices, while
              restaurants, shops, and households struggle to find consistent
              sources of quality produce. Too many middlemen, too little
              information, and too much distance between farm and table.
            </p>
            <p className="mt-4 text-muted">
              We set out to close that gap with a simple online marketplace
              where any farmer or agricultural company can list what they
              grow, and any buyer can search, compare, and connect directly,
              with no intermediaries taking a cut and no guesswork about
              what&apos;s available nearby.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-xl border border-cream-dark bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-semibold text-foreground">
                Our Mission
              </h3>
              <p className="mt-2 text-sm text-muted">
                To give every farmer in Rwanda direct access to buyers, and
                every buyer direct access to fresh, quality produce — making
                the market work better for both sides.
              </p>
            </div>

            <div className="rounded-xl border border-cream-dark bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Users2 className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-semibold text-foreground">
                Who It&apos;s For
              </h3>
              <p className="mt-2 text-sm text-muted">
                Smallholder farmers, cooperatives, and agricultural companies
                on one side; restaurants, shops, exporters, and everyday
                households on the other — anyone buying or selling fresh
                produce in Rwanda.
              </p>
            </div>

            <div className="rounded-xl border border-cream-dark bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Sprout className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-semibold text-foreground">
                Our Values
              </h3>
              <p className="mt-2 text-sm text-muted">
                Transparency in pricing, fairness for farmers, quality for
                buyers, and a platform built to serve every corner of
                Rwanda — from Kigali to the hills of Musanze.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
          Join Farmers Hub Today
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-muted">
          Whether you grow it or need it, Farmers Hub is built to help you
          find the right match, faster.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <LinkButton href="/products">Find Products</LinkButton>
          <LinkButton variant="outline" href="/register?role=farmer">
            Sell Your Products
          </LinkButton>
        </div>
      </section>
    </div>
  );
}
