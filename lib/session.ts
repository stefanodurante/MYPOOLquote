import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import type { AppRole, Permission } from "@/lib/roles";
import { hasPermission, isAppRole } from "@/lib/roles";
import { assertRole } from "@/lib/session-authorization";

export type AuthContext = {
  userId: string;
  role: AppRole;
  organizationId: string | null;
};

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export { assertRole };

export async function requireRole(...allowedRoles: AppRole[]) {
  const session = await getSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  assertRole(session.user.role, allowedRoles);
  return session;
}

export async function getAuthContext(): Promise<AuthContext> {
  const session = await getSession();
  if (!session?.user) throw new Error("Unauthorized");
  if (!isAppRole(session.user.role)) throw new Error("Forbidden");
  return {
    userId: session.user.id,
    role: session.user.role,
    organizationId: session.user.organizationId ?? null,
  };
}

export async function requireProfessional() {
  const context = await getAuthContext();
  if (context.role !== "professional") throw new Error("Forbidden");
  if (!context.organizationId) throw new Error("Professional is not associated with an organization");
  return context;
}

export async function requireQuoteManager() {
  const context = await requireQuoteReader();
  if (context.role === "customer") throw new Error("Forbidden");
  return context;
}

export async function requireQuoteReader() {
  const context = await getAuthContext();
  if (context.role === "professional" && !context.organizationId) {
    throw new Error("Professional is not associated with an organization");
  }
  return context;
}

export async function requireCustomer() {
  const context = await getAuthContext();
  if (context.role !== "customer") throw new Error("Forbidden");
  return context;
}

export async function requirePermission(permission: Permission) {
  const session = await getSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  if (!hasPermission(session.user.role, permission)) {
    throw new Error("Forbidden");
  }
  return session;
}

export async function requireStaff() {
  return requireRole("staff");
}
