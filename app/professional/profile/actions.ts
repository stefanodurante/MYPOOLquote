"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { organizations } from "@/lib/db/schema";
import { isOrganizationProfileComplete } from "@/lib/organization";
import { requireProfessional } from "@/lib/session";

function text(formData: FormData, key: string, maxLength = 180) {
  return String(formData.get(key) ?? "").trim().slice(0, maxLength);
}

export async function updateProfessionalProfile(formData: FormData) {
  const context = await requireProfessional();
  const organizationId = context.organizationId;
  if (!organizationId) throw new Error("Professional is not associated with an organization");
  const values = {
    name: text(formData, "name"),
    legalName: text(formData, "legalName"),
    taxId: text(formData, "taxId", 40),
    address: text(formData, "address"),
    postalCode: text(formData, "postalCode", 20),
    city: text(formData, "city"),
    phone: text(formData, "phone", 40),
    email: text(formData, "email", 160).toLowerCase(),
    logoUrl: text(formData, "logoUrl", 500) || null,
    quotePrefix: text(formData, "quotePrefix", 12).toUpperCase() || "MP",
    quoteFooter: text(formData, "quoteFooter", 500),
  };

  if (!values.name || !values.legalName || !values.taxId || !values.address || !values.city || !values.email.includes("@")) {
    throw new Error("Completa i dati obbligatori dell'azienda.");
  }

  await db
    .update(organizations)
    .set({
      ...values,
      profileCompleted: isOrganizationProfileComplete(values),
      updatedAt: new Date(),
    })
    .where(eq(organizations.id, organizationId));

  revalidatePath("/");
  revalidatePath("/professional");
  revalidatePath("/professional/onboarding");
  revalidatePath("/professional/profile");
}
