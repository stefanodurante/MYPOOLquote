import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import type { AppRole, Permission } from "@/lib/roles";
import { hasPermission } from "@/lib/roles";
import { assertRole } from "@/lib/session-authorization";

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
