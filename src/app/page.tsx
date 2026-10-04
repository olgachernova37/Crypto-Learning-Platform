import { AppShell } from "@/components/shell/AppShell";
import { EarthHero } from "@/components/ocean/hero/EarthHero";

export default function Page() {
  return (
    <AppShell variant="immersive">
      <EarthHero />
    </AppShell>
  );
}
