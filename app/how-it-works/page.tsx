import {
  ClipboardList,
  Search,
  ShoppingCart,
  Truck,
  UserPlus,
  PackagePlus,
  MessageCircle,
  Handshake,
  ListFilter,
  CheckCircle2,
} from "lucide-react";
import { LinkButton } from "@/components/ui/Button";

export const metadata = {
  title: "How It Works — Farmers Hub",
  description:
    "See how Farmers Hub connects farmers and buyers across Rwanda, step by step.",
};

const steps = [
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
];

const farmerSteps = [
  {
    icon: UserPlus,
    title: "Create a Farmer Account",
    desc: "Register as a farmer or agricultural company with your name, location, and contact details.",
  },
  {
    icon: PackagePlus,
    title: "List Your Produce",
    desc: "Add each product with a photo, price, unit, available quantity, and your location so buyers nearby can find you.",
  },
  {
    icon: MessageCircle,
    title: "Receive Orders & Respond",
    desc: "Buyers place orders directly on your listings. You review and confirm orders from your dashboard.",
  },
  {
    icon: Handshake,
    title: "Deliver & Get Paid",
    desc: "Arrange pickup or delivery with the buyer and complete the sale — no middlemen taking a share.",
  },
];

const buyerSteps = [
  {
    icon: ListFilter,
    title: "Browse or Search",
    desc: "Use the category filters and search bar to find exactly the produce you need, by type or location.",
  },
  {
    icon: Search,
    title: "Compare Farmers & Prices",
    desc: "View product details, farmer location, and pricing to pick the best option for your needs.",
  },
  {
    icon: ShoppingCart,
    title: "Place Your Order",
    desc: "Order directly from the farmer with the quantity you need — clear and transparent pricing.",
  },
  {
    icon: CheckCircle2,
    title: "Confirm & Receive",
    desc: "Coordinate pickup or delivery with the farmer and receive your fresh produce.",
  },
];

export default function HowItWorksPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-cream">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-primary-dark sm:text-5xl">
            How Farmers Hub Works
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
            A simple, direct path from farm to buyer — built for farmers,
            companies, and buyers across Rwanda.
          </p>
        </div>
      </section>

      {/* Overview 4-step */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-bold text-foreground sm:text-3xl">
          The Basics
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
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
      </section>

      {/* For Farmers */}
      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col items-center text-center">
            <span className="rounded-full bg-primary px-4 py-1 text-xs font-semibold uppercase tracking-wider text-white">
              For Farmers & Companies
            </span>
            <h2 className="mt-4 text-2xl font-bold text-foreground sm:text-3xl">
              Sell Your Produce, Your Way
            </h2>
            <p className="mt-2 max-w-2xl text-muted">
              Get your products in front of buyers across the country, with
              full control over pricing and availability.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {farmerSteps.map((step, i) => (
              <div
                key={step.title}
                className="rounded-xl border border-cream-dark bg-white p-6 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <step.icon className="h-6 w-6" />
                </div>
                <div className="mt-4 text-xs font-bold uppercase tracking-wider text-accent">
                  {i + 1}
                </div>
                <h3 className="mt-1 font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-muted">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <LinkButton href="/register?role=farmer">
              Register as a Farmer
            </LinkButton>
          </div>
        </div>
      </section>

      {/* For Buyers */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col items-center text-center">
          <span className="rounded-full bg-accent px-4 py-1 text-xs font-semibold uppercase tracking-wider text-white">
            For Buyers
          </span>
          <h2 className="mt-4 text-2xl font-bold text-foreground sm:text-3xl">
            Find Fresh Produce, Faster
          </h2>
          <p className="mt-2 max-w-2xl text-muted">
            Search, compare, and order directly from farmers near you — no
            middlemen, no guesswork.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {buyerSteps.map((step, i) => (
            <div
              key={step.title}
              className="rounded-xl border border-cream-dark bg-white p-6 shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <step.icon className="h-6 w-6" />
              </div>
              <div className="mt-4 text-xs font-bold uppercase tracking-wider text-accent">
                {i + 1}
              </div>
              <h3 className="mt-1 font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-muted">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <LinkButton href="/products">Browse Products</LinkButton>
        </div>
      </section>
    </div>
  );
}
