import assert from "node:assert/strict";
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

if (!process.env.DATABASE_URL) throw new Error("Set DATABASE_URL before running multiuser tests.");

async function main() {
  const { and, eq } = await import("drizzle-orm");
  const { db } = await import("../lib/db");
  const { clients, organizations, quotes, user } = await import("../lib/db/schema");
  const suffix = Date.now().toString();
  const orgA = `test-org-a-${suffix}`;
  const orgB = `test-org-b-${suffix}`;
  const userA = `test-professional-a-${suffix}`;
  const userB = `test-professional-b-${suffix}`;
  const customer = `test-customer-${suffix}`;
  const clientA = `test-client-a-${suffix}`;
  const clientB = `test-client-b-${suffix}`;
  const quoteA = `test-quote-a-${suffix}`;
  const quoteB = `test-quote-b-${suffix}`;

  try {
    await db.insert(organizations).values([
      { id: orgA, name: "Organization A", taxId: "" },
      { id: orgB, name: "Organization B", taxId: "" },
    ]);
    await db.insert(user).values([
      { id: userA, name: "Professional A", email: `${userA}@example.test`, role: "professional", organizationId: orgA },
      { id: userB, name: "Professional B", email: `${userB}@example.test`, role: "professional", organizationId: orgB },
      { id: customer, name: "Customer", email: `${customer}@example.test`, role: "customer", organizationId: orgA },
    ]);
    await db.insert(clients).values([
      { id: clientA, name: "Client A", createdBy: userA, customerUserId: customer, organizationId: orgA },
      { id: clientB, name: "Client B", createdBy: userB, organizationId: orgB },
    ]);
    await db.insert(quotes).values([
      {
        id: quoteA, createdBy: userA, clientId: clientA, organizationId: orgA,
        builderName: "Builder A", clientName: "Client A", appVersion: "pro", quoteMode: "completo",
        inputs: {}, lineItems: [], bomState: {}, totals: { total: 100 },
      },
      {
        id: quoteB, createdBy: userB, clientId: clientB, organizationId: orgB,
        builderName: "Builder B", clientName: "Client B", appVersion: "pro", quoteMode: "completo",
        inputs: {}, lineItems: [], bomState: {}, totals: { total: 200 },
      },
    ]);

    const professionalAQuotes = await db.select({ id: quotes.id }).from(quotes).where(eq(quotes.organizationId, orgA));
    assert.deepEqual(professionalAQuotes.map((row) => row.id), [quoteA]);

    const customerQuotes = await db
      .select({ id: quotes.id })
      .from(quotes)
      .innerJoin(clients, eq(quotes.clientId, clients.id))
      .where(and(eq(clients.customerUserId, customer), eq(quotes.organizationId, orgA)));
    assert.deepEqual(customerQuotes.map((row) => row.id), [quoteA]);

    const crossOrganization = await db
      .select({ id: quotes.id })
      .from(quotes)
      .where(and(eq(quotes.id, quoteB), eq(quotes.organizationId, orgA)));
    assert.equal(crossOrganization.length, 0, "Organization A must not read Organization B quotes.");

    const staffView = await db.select({ id: quotes.id }).from(quotes);
    assert.ok(staffView.some((row) => row.id === quoteA) && staffView.some((row) => row.id === quoteB));
    console.log("Multiuser checks passed: organization isolation, customer read-only scope, staff global scope.");
  } finally {
    await db.delete(quotes).where(eq(quotes.id, quoteA));
    await db.delete(quotes).where(eq(quotes.id, quoteB));
    await db.delete(clients).where(eq(clients.id, clientA));
    await db.delete(clients).where(eq(clients.id, clientB));
    await db.delete(user).where(eq(user.id, userA));
    await db.delete(user).where(eq(user.id, userB));
    await db.delete(user).where(eq(user.id, customer));
    await db.delete(organizations).where(eq(organizations.id, orgA));
    await db.delete(organizations).where(eq(organizations.id, orgB));
    await db.$client.end();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
