import type { Metadata } from "next";
import { AppShell } from "@/components/shell/AppShell";
import { AdminView } from "@/components/admin/AdminView";

export const metadata: Metadata = {
  title: "Captain's deck — Crypto Voyage",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <AppShell variant="light">
      <AdminView />
    </AppShell>
  );
}
