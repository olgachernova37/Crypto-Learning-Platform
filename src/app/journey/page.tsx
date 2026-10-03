import type { Metadata } from "next";
import { AppShell } from "@/components/shell/AppShell";
import { Journey } from "@/components/ocean/Journey";

export const metadata: Metadata = {
  title: "Your route — Crypto Voyage",
  description: "Sail from stop to stop: each one is a small, friendly crypto lesson.",
};

export default function Page() {
  return (
    <AppShell variant="immersive">
      <Journey />
    </AppShell>
  );
}
