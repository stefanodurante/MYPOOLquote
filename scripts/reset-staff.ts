import fs from "node:fs";

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

async function main() {
  const { eq } = await import("drizzle-orm");
  const { db } = await import("../lib/db");
  const { account, user } = await import("../lib/db/schema");
  const email = process.env.STAFF_EMAIL ?? "staff@mypoolquote.local";
  const [existing] = await db.select({ id: user.id }).from(user).where(eq(user.email, email)).limit(1);

  if (existing) {
    await db.delete(account).where(eq(account.userId, existing.id));
    await db.delete(user).where(eq(user.id, existing.id));
    console.log(`Removed existing staff account: ${email}`);
  } else {
    console.log(`No existing staff account found: ${email}`);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
