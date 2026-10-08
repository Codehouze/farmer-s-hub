import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "Contact Us — Farmers Hub",
  description:
    "Get in touch with the Farmers Hub team — questions, support, and partnership inquiries.",
};

export default function ContactPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-cream">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-primary-dark sm:text-5xl">
            Contact Us
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
            Questions about buying, selling, or partnering with Farmers Hub?
            We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Contact details */}
          <div className="space-y-6 lg:col-span-1">
            <div className="rounded-xl border border-cream-dark bg-white p-6 shadow-sm">
              <h2 className="font-semibold text-foreground">Get In Touch</h2>
              <ul className="mt-4 space-y-4 text-sm text-muted">
                <li className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>+250 788 123 456</span>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>hello@farmershub.rw</span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>Kigali, Rwanda</span>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>Mon – Sat, 8:00 AM – 6:00 PM</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-2">
            <form className="rounded-xl border border-cream-dark bg-white p-6 shadow-sm sm:p-8">
              <h2 className="font-semibold text-foreground">
                Send Us a Message
              </h2>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-foreground"
                  >
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your name"
                    className="mt-1.5 w-full rounded-md border border-cream-dark bg-cream px-3 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-foreground"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    className="mt-1.5 w-full rounded-md border border-cream-dark bg-cream px-3 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-5">
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-foreground"
                >
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="What is this about?"
                  className="mt-1.5 w-full rounded-md border border-cream-dark bg-cream px-3 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none"
                />
              </div>

              <div className="mt-5">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-foreground"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Tell us how we can help..."
                  className="mt-1.5 w-full rounded-md border border-cream-dark bg-cream px-3 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none"
                />
              </div>

              <div className="mt-6">
                <Button type="submit">Send Message</Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
