import type { Metadata } from "next";
import { AppShell } from "@/components/shell/AppShell";
import { ProgressView } from "@/components/progress/ProgressView";

export const metadata: Metadata = {
  title: "Your progress — Crypto Voyage",
  description: "Your XP, streak, lessons and NFT animal.",
};

export default function Page() {
  return (
    <AppShell variant="light">
      <ProgressView />
    </AppShell>
  );
}
