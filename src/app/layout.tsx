import type { Metadata, Viewport } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "SOLA — Smart Outfit & Look Assistant",
  description:
    "SOLA — your personal AI stylist, creating outfits from clothes you already own.",
};

export const viewport: Viewport = {
  themeColor: "#fbf9f6",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${jakarta.variable} h-full antialiased`}
    >
      <head>
        {/* Icon font used throughout the Stitch designs */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font, @next/next/google-font-display -- block avoids icon-name text flashing */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
        />
      </head>
      <body className="min-h-full flex flex-col bg-background font-sans text-body-md text-on-surface">
        {children}
      </body>
    </html>
  );
}
