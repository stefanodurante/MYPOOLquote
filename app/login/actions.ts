"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function signInStaff(email: string, password: string) {
  try {
    await auth.api.signInEmail({
      body: { email, password },
      headers: await headers(),
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "Email o password non validi." };
  }
}
