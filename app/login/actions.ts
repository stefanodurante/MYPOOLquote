"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export async function signInStaff(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect("/login?error=invalid");
  }

  try {
    const result = await auth.api.signInEmail({
      body: { email, password },
      headers: await headers(),
    });

    if ("error" in result && result.error) {
      redirect("/login?error=invalid");
    }
  } catch {
    redirect("/login?error=invalid");
  }

  redirect("/");
}
