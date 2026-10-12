"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { catalogModels, catalogPrices } from "@/lib/db/schema";
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

function modelValues(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim().toLowerCase().replace(/[^a-z0-9_-]/g, "-");
  const label = String(formData.get("label") ?? "").trim();
  const lengthM = Number(formData.get("lengthM"));
  const widthM = Number(formData.get("widthM"));
  const depthM = Number(formData.get("depthM"));
  const poolType = String(formData.get("poolType") ?? "");
  if (!id || !label || !["skimmer", "sfioratore", "vetroresina", "fuoriterra"].includes(poolType)) {
    throw new Error("Invalid catalog model.");
  }
  if (![lengthM, widthM, depthM].every((value) => Number.isFinite(value) && value > 0 && value <= 100)) {
    throw new Error("Invalid catalog model dimensions.");
  }
  return { id, label, lengthM, widthM, depthM, poolType };
}

export async function createCatalogModel(formData: FormData) {
  await requireStaff();
  await db.insert(catalogModels).values(modelValues(formData));
  revalidatePath("/");
  revalidatePath("/admin/catalog");
  revalidatePath("/admin/catalog/models");
}

export async function updateCatalogModel(formData: FormData) {
  await requireStaff();
  const id = String(formData.get("id") ?? "");
  const active = formData.get("active") === "on";
  await db.update(catalogModels).set({ ...modelValues(formData), active }).where(eq(catalogModels.id, id));
  revalidatePath("/");
  revalidatePath("/admin/catalog");
  revalidatePath("/admin/catalog/models");
}
