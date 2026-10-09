export const APP_ROLES = ["staff", "professional", "customer"] as const;

export type AppRole = (typeof APP_ROLES)[number];

export const PERMISSIONS = [
  "platform:manage",
  "quotes:create",
  "quotes:read",
  "quotes:update",
  "clients:manage",
  "catalog:manage",
  "catalog:read",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

const ROLE_PERMISSIONS: Record<AppRole, readonly Permission[]> = {
  staff: PERMISSIONS,
  professional: [
    "quotes:create",
    "quotes:read",
    "quotes:update",
    "clients:manage",
    "catalog:manage",
    "catalog:read",
  ],
  customer: ["quotes:read"],
};

export function isAppRole(value: unknown): value is AppRole {
  return typeof value === "string" && APP_ROLES.includes(value as AppRole);
}

export function hasPermission(role: unknown, permission: Permission) {
  return isAppRole(role) && ROLE_PERMISSIONS[role].includes(permission);
}

export function getRolePermissions(role: unknown): readonly Permission[] {
  return isAppRole(role) ? ROLE_PERMISSIONS[role] : [];
}
