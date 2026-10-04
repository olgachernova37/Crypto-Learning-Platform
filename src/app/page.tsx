import { AppShell } from "@/components/shell/AppShell";
import { SolanaHero } from "@/components/ocean/hero/SolanaHero";

export default function Page() {
  return (
    <AppShell variant="immersive">
      <SolanaHero />
    </AppShell>
  );
}
