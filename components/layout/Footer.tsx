import Link from "next/link";
import { Sprout, Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-cream-dark bg-primary-dark text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-white/10">
              <Sprout className="h-5 w-5" />
            </span>
            <span className="text-lg font-extrabold">FARMERS HUB</span>
          </Link>
          <p className="mt-3 text-sm text-white/70">
            Connecting farmers and agricultural companies with buyers across
            Rwanda for a better market and better income.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90">
            Quick Links
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li>
              <Link href="/products" className="hover:text-white">
                Find Products
              </Link>
            </li>
            <li>
              <Link href="/farmers" className="hover:text-white">
                Farmers & Companies
              </Link>
            </li>
            <li>
              <Link href="/how-it-works" className="hover:text-white">
                How It Works
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white">
                About Us
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90">
            For Farmers
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li>
              <Link href="/register" className="hover:text-white">
                Sell Your Products
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-white">
                Farmer Dashboard
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90">
            Get In Touch
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4" /> +250 788 123 456
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4" /> hello@farmershub.rw
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Kigali, Rwanda
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-white/60">
        © {new Date().getFullYear()} Farmers Hub. All rights reserved.
      </div>
    </footer>
  );
}
