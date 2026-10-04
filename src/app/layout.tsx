import type { Metadata, Viewport } from "next";
import "@fontsource-variable/nunito";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { NameGate } from "@/components/account/NameGate";

// Absolute URLs for link previews (Open Graph). Vercel sets VERCEL_PROJECT_PRODUCTION_URL.
const site = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: "Crypto Voyage — learn crypto from zero",
  description:
    "Learn crypto in small, friendly steps and earn your first NFT on Solana devnet.",
  openGraph: { images: ["/api/card?k=invite&l=en&f=og"] },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#0d2b45",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
        <NameGate />
        {/* page-view counts only: no cookies, nobody is identified (see /privacy) */}
        <Analytics />
      </body>
    </html>
  );
}
