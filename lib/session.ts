import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { assertStaffRole } from "@/lib/session-authorization";

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export { assertStaffRole };

export async function requireStaff() {
  const session = await getSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  assertStaffRole(session.user.role);
  return session;
}
