import type { AppRole } from "@/lib/roles";

export function assertStaffRole(role: string | null | undefined) {
  assertRole(role, ["staff"]);
}

export function assertRole(role: string | null | undefined, allowedRoles: readonly AppRole[]) {
  if (!allowedRoles.includes(role as AppRole)) {
    throw new Error("Forbidden");
  }
}
