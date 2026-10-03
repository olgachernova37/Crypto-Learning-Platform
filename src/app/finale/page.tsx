import type { Metadata } from "next";
import { AppShell } from "@/components/shell/AppShell";
import { FinaleView } from "@/components/lesson/FinaleView";

export const metadata: Metadata = {
  title: "You did it! · Crypto Voyage",
  description: "You finished the route. Claim your NFT sea animal, a learning badge on Solana devnet.",
};

export default function Page() {
  return (
    <AppShell variant="bare">
      <FinaleView />
    </AppShell>
  );
}
