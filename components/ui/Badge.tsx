import { clsx } from "clsx";
import type { ReactNode } from "react";

export function Badge({
  children,
  tone = "accent",
  className,
}: {
  children: ReactNode;
  tone?: "accent" | "muted";
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        tone === "accent" && "bg-accent/15 text-primary-dark",
        tone === "muted" && "bg-cream-dark text-muted",
        className
      )}
    >
      {children}
    </span>
  );
}
