import Link from "next/link";
import { getAuthContext } from "@/lib/session";
import { getOrganizationProfile } from "@/lib/organization";
import { ProfileForm } from "./profile-form";

export const dynamic = "force-dynamic";

export default async function ProfessionalProfilePage() {
  const context = await getAuthContext();
  if (context.role !== "professional" || !context.organizationId) {
    throw new Error("Forbidden");
  }
  const organization = await getOrganizationProfile(context.organizationId);
  if (!organization) throw new Error("Organization not found");

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div><p className="eyebrow">MYPOOL QUOTATION · PROFESSIONAL</p><h1>Profilo aziendale</h1></div>
        <Link href="/" className="muted">← Dashboard</Link>
      </header>
      <ProfileForm organization={organization} />
    </main>
  );
}
