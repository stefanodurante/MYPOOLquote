import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { organizations } from "@/lib/db/schema";

export async function getOrganizationProfile(id: string) {
  const [organization] = await db
    .select()
    .from(organizations)
    .where(eq(organizations.id, id))
    .limit(1);
  return organization ?? null;
}

export function isOrganizationProfileComplete(
  organization: { name: string; legalName: string; taxId: string; address: string; city: string; email: string },
) {
  return [
    organization.name,
    organization.legalName,
    organization.taxId,
    organization.address,
    organization.city,
    organization.email,
  ].every((value) => value.trim().length > 0);
}
