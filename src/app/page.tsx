import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

/**
 * Welcome page — layout and copy from the Codex `sola-welcome` page,
 * restyled with the Stitch Quiet Atelier tokens (Playfair + Plus Jakarta Sans).
 */
export default function WelcomePage() {
  return (
    <div className="mx-auto grid min-h-svh w-full max-w-[1480px] grid-rows-[auto_1fr] px-[22px] py-7 md:px-[42px] md:py-[42px] lg:px-[68px] lg:py-12">
      <header className="flex items-center">
        <Link href="/" aria-label="SOLA home" className="inline-flex items-baseline gap-2">
          <span className="font-serif text-2xl leading-none tracking-[0.02em] md:text-[28px]">
            SOLA
          </span>
          <span className="text-[8px] font-medium tracking-[0.2em] text-secondary">
            ATELIER
          </span>
        </Link>
      </header>

      <main className="flex items-center justify-center pt-13 pb-19 md:pb-20">
        <section
          aria-labelledby="welcome-title"
          className="w-full max-w-[780px] text-center"
        >
          <p className="mb-7 text-[9px] font-medium tracking-[0.15em] text-on-surface-variant md:mb-9 md:text-[11px]">
            INTELLIGENT CURATION
          </p>

          <h1
            id="welcome-title"
            className="font-serif text-[clamp(44px,12vw,60px)] leading-[1.06] tracking-[-0.02em] md:text-[clamp(60px,6.5vw,82px)]"
          >
            <span className="block">Your wardrobe.</span>
            <span className="block">Your style.</span>
            <em className="mt-4 block text-blush-deep md:mt-6">Your SOLA.</em>
          </h1>

          <p className="mx-auto mt-6 max-w-[430px] text-body-sm font-light text-on-surface-variant md:mt-8 md:max-w-[610px] md:text-[15px] md:leading-relaxed">
            Your personal AI stylist, creating outfits you&rsquo;ll love from
            clothes you already own.
          </p>

          <div className="mt-7 flex flex-col items-center">
            <Link
              href="/signup"
              className="grid h-[54px] w-full max-w-[310px] grid-cols-[1fr_20px] items-center rounded-full bg-primary-container px-7 text-[11px] font-semibold tracking-[0.12em] text-white transition hover:-translate-y-px hover:bg-[#34312f] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blush-deep md:w-[286px]"
            >
              <span>GET STARTED</span>
              <Icon name="arrow_forward" size={16} className="justify-self-end" />
            </Link>
            <p className="mt-5 text-[11px] font-light text-outline">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-on-surface-variant underline underline-offset-[3px]"
              >
                Log in
              </Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
