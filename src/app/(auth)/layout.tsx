import Link from "next/link";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="mx-auto flex min-h-svh w-full max-w-[1480px] flex-col px-[22px] py-7 md:px-[42px] md:py-[42px] lg:px-[68px] lg:py-12">
      <header>
        <Link href="/" aria-label="SOLA home" className="inline-flex items-baseline gap-2">
          <span className="font-serif text-2xl leading-none tracking-[0.02em] md:text-[28px]">SOLA</span>
          <span className="text-[8px] font-medium tracking-[0.2em] text-secondary">ATELIER</span>
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center py-12">{children}</main>
    </div>
  );
}
