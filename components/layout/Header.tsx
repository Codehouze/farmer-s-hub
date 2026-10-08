import Link from "next/link";
import { Sprout, Phone } from "lucide-react";
import { auth, signOut } from "@/lib/auth";
import { LinkButton } from "@/components/ui/Button";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/farmers", label: "Farmers & Companies" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
];

export async function Header() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 border-b border-cream-dark bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-white">
            <Sprout className="h-5 w-5" />
          </span>
          <span className="leading-tight">
            <span className="block text-base font-extrabold tracking-tight text-primary">
              FARMERS HUB
            </span>
            <span className="block text-[10px] font-medium uppercase tracking-wider text-muted">
              Connecting Farmers to Buyers
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-foreground/80 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <a
            href="tel:+250788123456"
            className="flex items-center gap-1.5 text-sm font-medium text-foreground/80 hover:text-primary"
          >
            <Phone className="h-4 w-4" />
            +250 788 123 456
          </a>

          {session?.user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="text-sm font-semibold text-primary hover:underline"
              >
                Dashboard
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button
                  type="submit"
                  className="text-sm font-medium text-muted hover:text-primary"
                >
                  Log out
                </button>
              </form>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-semibold text-foreground/80 hover:text-primary"
              >
                Login
              </Link>
              <LinkButton href="/register" className="px-4 py-2 text-sm">
                Register
              </LinkButton>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
