import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "outline" | "blush" | "text";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full label-caps transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blush-deep";

const variants: Record<Variant, string> = {
  primary:
    "h-12 px-7 bg-primary-container text-surface-bright hover:bg-[#363432]",
  outline:
    "h-12 px-7 border border-primary-container text-primary-container hover:bg-blush-wash",
  blush:
    "h-12 px-7 border border-blush bg-surface-container-lowest text-on-surface hover:bg-blush-wash hover:border-blush-deep",
  text: "px-0 py-2 text-on-surface-variant hover:text-blush-deep",
};

type Common = { variant?: Variant; className?: string; children: ReactNode };

export function Button({
  variant = "primary",
  className = "",
  ...props
}: Common & ComponentProps<"button">) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props} />
  );
}

export function ButtonLink({
  variant = "primary",
  className = "",
  ...props
}: Common & ComponentProps<typeof Link>) {
  return (
    <Link className={`${base} ${variants[variant]} ${className}`} {...props} />
  );
}
