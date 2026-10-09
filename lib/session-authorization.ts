export function assertStaffRole(role: string | null | undefined) {
  if (role !== "staff") {
    throw new Error("Forbidden");
  }
}
