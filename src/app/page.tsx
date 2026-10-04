import { AppShell } from "@/components/shell/AppShell";
import { Intro } from "@/components/ocean/intro/Intro";

export default function Page() {
  return (
    <AppShell variant="immersive">
      <Intro />
    </AppShell>
  );
}
