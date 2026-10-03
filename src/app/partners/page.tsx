import type { Metadata } from "next";
import { AppShell } from "@/components/shell/AppShell";
import { PartnersView } from "@/components/partners/PartnersView";

export const metadata: Metadata = {
  title: "We recommend — Crypto Voyage",
  description: "Trusted places to take your next step in crypto, when you're ready.",
};

export default function Page() {
  return (
    <AppShell variant="light">
      <PartnersView />
    </AppShell>
  );
}
