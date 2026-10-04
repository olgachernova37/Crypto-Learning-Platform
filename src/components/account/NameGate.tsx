"use client";

// Every page except the landing (which asks on "Start the journey") and /admin needs a name first.
import { usePathname } from "next/navigation";
import { useProfile } from "@/lib/profile";
import { NameDialog } from "./NameDialog";

export function NameGate() {
  const path = usePathname();
  const { profile, ready } = useProfile();
  if (!ready || profile || path === "/" || path.startsWith("/admin") || path.startsWith("/mascot")) return null;
  return <NameDialog onDone={() => {}} />;
}
