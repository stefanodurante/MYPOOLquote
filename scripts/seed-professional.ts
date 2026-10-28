import fs from "node:fs";
import { eq } from "drizzle-orm";

if (!process.env.DATABASE_URL && fs.existsSync(".env.local")) {
  for (const line of fs.readFileSync(".env.local", "utf8").split("\n")) {
    const separator = line.indexOf("=");
    if (separator > 0) {
      const key = line.slice(0, separator).trim();
      const value = line.slice(separator + 1).trim();
      if (key && value && !process.env[key]) process.env[key] = value;
    }
  }
}

const email = process.env.PROFESSIONAL_EMAIL;
const password = process.env.PROFESSIONAL_PASSWORD;
const organizationId = process.env.PROFESSIONAL_ORGANIZATION_ID ?? "org-default";

async function main() {
  if (!email || !password) {
    throw new Error("Set PROFESSIONAL_EMAIL and PROFESSIONAL_PASSWORD before running the professional seed.");
  }

  const { auth } = await import("../lib/auth");
  const { db } = await import("../lib/db");
  const { user } = await import("../lib/db/schema");

  const result = await auth.api.signUpEmail({
    body: {
      email,
      password,
      name: process.env.PROFESSIONAL_NAME ?? "Professional Demo",
    },
  });

  if (!result.user?.id) throw new Error("Professional account was not created.");

  await db
    .update(user)
    .set({ role: "professional", organizationId })
    .where(eq(user.id, result.user.id));

  console.log(`Professional user created: ${email}`);
  console.log(`Organization: ${organizationId}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
