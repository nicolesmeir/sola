import Link from "next/link";

const STEPS = ["Style", "Inspiration", "Wardrobe", "Review"];

/** Onboarding chrome — header from the Stitch simplified screens, without app nav. */
export default function OnboardingLayout({ children }: LayoutProps<"/onboarding">) {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="border-b border-surface-variant">
        <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-margin-mobile lg:px-margin">
          <Link href="/" className="inline-flex items-baseline gap-2" aria-label="SOLA home">
            <span className="font-serif text-2xl leading-none md:text-[28px]">SOLA</span>
            <span className="text-[8px] font-medium tracking-[0.2em] text-secondary">ATELIER</span>
          </Link>
          <p className="label-caps hidden text-on-surface-variant sm:block">
            Style setup · {STEPS.join(" · ")}
          </p>
        </div>
      </header>
      <main className="mx-auto w-full max-w-[1440px] flex-1 px-margin-mobile pb-space-xl lg:px-margin">
        {children}
      </main>
    </div>
  );
}
