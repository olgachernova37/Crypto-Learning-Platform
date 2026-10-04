import type { Metadata, Viewport } from "next";
import "@fontsource-variable/nunito";
import "./globals.css";
import { NameGate } from "@/components/account/NameGate";

export const metadata: Metadata = {
  title: "Crypto Voyage — learn crypto from zero",
  description:
    "Learn crypto in small, friendly steps and earn your first NFT on Solana devnet.",
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
      </body>
    </html>
  );
}
