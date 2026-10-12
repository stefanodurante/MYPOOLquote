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
  const { db } = await import("../lib/db");
  const {
    organizations,
    user,
    clients,
    quotes,
    quoteEvents,
  } = await import("../lib/db/schema");
  const { isNull } = await import("drizzle-orm");

  const id = process.env.DEFAULT_ORGANIZATION_ID ?? "org-default";
  const name = process.env.DEFAULT_ORGANIZATION_NAME ?? "MYPOOLquote Demo";

  await db
    .insert(organizations)
    .values({ id, name, taxId: "" })
    .onConflictDoNothing({ target: organizations.id });

  await db.update(user).set({ organizationId: id }).where(isNull(user.organizationId));
  await db.update(clients).set({ organizationId: id }).where(isNull(clients.organizationId));
  await db.update(quotes).set({ organizationId: id }).where(isNull(quotes.organizationId));
  await db
    .update(quoteEvents)
    .set({ organizationId: id })
    .where(isNull(quoteEvents.organizationId));

  await db.$client.end();
  console.log(`Organization ready: ${id} (${name}). Existing tenant data was associated.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
