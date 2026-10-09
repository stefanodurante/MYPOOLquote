"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { catalogPrices } from "@/lib/db/schema";
import { requireStaff } from "@/lib/session";

export async function updateCatalogPrice(formData: FormData) {
  await requireStaff();
  const key = String(formData.get("key") ?? "");
  const value = Number(formData.get("value"));
  if (!key || !Number.isFinite(value) || value < 0 || value > 1_000_000_000) {
    throw new Error("Invalid catalog price.");
  }

  await db.update(catalogPrices).set({ value }).where(eq(catalogPrices.key, key));
  revalidatePath("/");
  revalidatePath("/admin/catalog");
}
