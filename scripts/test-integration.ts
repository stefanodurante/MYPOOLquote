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

const required = ["DATABASE_URL", "BETTER_AUTH_SECRET"] as const;
for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Set ${key} before running integration tests.`);
  }
}
process.env.BETTER_AUTH_ALLOW_SIGNUP ??= "true";

async function main() {
  const { eq } = await import("drizzle-orm");
  const { db } = await import("../lib/db");
  const schema = await import("../lib/db/schema");
  const { assertStaffRole } = await import("../lib/session-authorization");
  const { auth } = await import("../lib/auth");
  const email = `integration-${Date.now()}@mypoolquote.local`;
  const password = "Integration-test-password-123!";
  let userId: string | undefined;
  let quoteId: string | undefined;
  let clientId: string | undefined;

  try {
    const signUp = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name: "Integration Test Staff",
      },
    });

    assert.ok(signUp.user?.id, "Signup must return a user.");
    userId = signUp.user.id;

    const signIn = await auth.api.signInEmail({
      body: { email, password },
    });
    assert.equal(signIn.user?.email, email, "Login must return the created user.");
    assertStaffRole(signIn.user?.role);

    assert.throws(() => assertStaffRole("customer"), /Forbidden/);

    clientId = `integration-client-${Date.now()}`;
    quoteId = `integration-quote-${Date.now()}`;
    const now = new Date();

    await db.insert(schema.clients).values({
      id: clientId,
      name: "Integration Test Client",
      address: "Test address",
      contact: "test@example.com",
      createdBy: userId,
    });
    await db.insert(schema.quotes).values({
      id: quoteId,
      createdBy: userId,
      clientId,
      builderName: "Integration Test Builder",
      builderRef: "",
      builderPiva: "",
      clientName: "Integration Test Client",
      clientAddress: "Test address",
      clientContact: "test@example.com",
      appVersion: "pro",
      quoteMode: "completo",
      status: "saved",
      inputs: {},
      lineItems: [],
      bomState: {},
      totals: { total: 100 },
      createdAt: now,
      updatedAt: now,
    });

    const [saved] = await db
      .select({ id: schema.quotes.id, total: schema.quotes.totals })
      .from(schema.quotes)
      .where(eq(schema.quotes.id, quoteId));
    assert.equal(saved?.id, quoteId, "Saved quote must be readable.");

    await db
      .update(schema.quotes)
      .set({ status: "accepted", totals: { total: 120 }, updatedAt: new Date() })
      .where(eq(schema.quotes.id, quoteId));
    const [updated] = await db
      .select({ status: schema.quotes.status, totals: schema.quotes.totals })
      .from(schema.quotes)
      .where(eq(schema.quotes.id, quoteId));
    assert.equal(updated?.status, "accepted", "Saved quote must be updateable.");
    assert.deepEqual(updated?.totals, { total: 120 });

    console.log("Integration checks passed: login, staff authorization, quote persistence.");
  } finally {
    if (quoteId) {
      await db.delete(schema.quotes).where(eq(schema.quotes.id, quoteId));
    }
    if (clientId) {
      await db.delete(schema.clients).where(eq(schema.clients.id, clientId));
    }
    if (userId) {
      await db.delete(schema.user).where(eq(schema.user.id, userId));
    }
    await db.$client.end();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
