import { redirect } from "next/navigation";
import { getAuthContext } from "@/lib/session";
import { getOrganizationProfile } from "@/lib/organization";
import { ProfileForm } from "../profile/profile-form";

export const dynamic = "force-dynamic";

export default async function ProfessionalOnboardingPage() {
  const context = await getAuthContext();
  if (context.role !== "professional" || !context.organizationId) redirect("/login");
  const organization = await getOrganizationProfile(context.organizationId);
  if (!organization) redirect("/login");

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div><p className="eyebrow">MYPOOL QUOTATION · PROFESSIONAL</p><h1>Benvenuto</h1></div>
      </header>
      <ProfileForm organization={organization} onboarding />
    </main>
  );
}
