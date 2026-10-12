"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { clients, organizations, user } from "@/lib/db/schema";
import { requireStaff } from "@/lib/session";
import { isAppRole } from "@/lib/roles";

export async function createManagedUser(formData: FormData) {
  await requireStaff();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const role = String(formData.get("role") ?? "");
  const organizationId = String(formData.get("organizationId") ?? "").trim();

  if (!email || !email.includes("@") || password.length < 12 || !name || !isAppRole(role) || role === "staff") {
    throw new Error("Invalid managed user data.");
  }
  if (!organizationId) throw new Error("Organization is required.");

  const [organization] = await db
    .select({ id: organizations.id })
    .from(organizations)
    .where(eq(organizations.id, organizationId))
    .limit(1);
  if (!organization) throw new Error("Organization not found.");

  const result = await auth.api.signUpEmail({ body: { email, password, name } });
  if (!result.user?.id) throw new Error("Unable to create user.");
  await db.update(user).set({ role, organizationId }).where(eq(user.id, result.user.id));
  revalidatePath("/admin/users");
}

export async function linkCustomerToClient(formData: FormData) {
  await requireStaff();
  const customerUserId = String(formData.get("customerUserId") ?? "").trim();
  const clientId = String(formData.get("clientId") ?? "").trim();
  if (!customerUserId || !clientId) throw new Error("Customer and client are required.");

  const [customer] = await db.select({ id: user.id, role: user.role }).from(user).where(eq(user.id, customerUserId)).limit(1);
  if (!customer || customer.role !== "customer") throw new Error("The selected user is not a customer.");
  await db.update(clients).set({ customerUserId }).where(eq(clients.id, clientId));
  revalidatePath("/admin/users");
}
