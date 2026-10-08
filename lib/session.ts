import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function requireStaff() {
  const session = await getSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  if (session.user.role !== "staff") {
    throw new Error("Forbidden");
  }
  return session;
}
