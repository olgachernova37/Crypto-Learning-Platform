import type { Metadata } from "next";
import { AppShell } from "@/components/shell/AppShell";
import { PrivacyView } from "@/components/account/PrivacyView";

export const metadata: Metadata = {
  title: "Privacy — Crypto Voyage",
  description: "What Crypto Voyage stores (just your name), why, and how to delete it.",
};

export default function Page() {
  return (
    <AppShell variant="light">
      <PrivacyView />
    </AppShell>
  );
}
