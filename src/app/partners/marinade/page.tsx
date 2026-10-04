import type { Metadata } from "next";
import { AppShell } from "@/components/shell/AppShell";
import { MarinadeQuest } from "@/components/partners/MarinadeQuest";

export const metadata: Metadata = {
  title: "Marinade staking quest — Crypto Voyage",
  description: "Practise staking 1 test SOL, verify it, and claim a Starfish badge.",
};

export default function Page() {
  return (
    <AppShell variant="light">
      <MarinadeQuest />
    </AppShell>
  );
}
