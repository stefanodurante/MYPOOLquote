import { DEMO_VERSION_LABEL } from "@/lib/app-version";

export function DemoBadge() {
  return <span className="demo-badge">{DEMO_VERSION_LABEL}</span>;
}
