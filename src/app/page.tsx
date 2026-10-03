import { AppShell } from "@/components/shell/AppShell";
import { GlobeStart } from "@/components/ocean/GlobeStart";

export default function Page() {
  return (
    <AppShell variant="immersive">
      <GlobeStart />
    </AppShell>
  );
}
