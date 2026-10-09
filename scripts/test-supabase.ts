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

const required = [
  "DATABASE_URL",
  "BETTER_AUTH_SECRET",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
] as const;

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Set ${key} before running Supabase integration tests.`);
  }
}

process.env.BETTER_AUTH_ALLOW_SIGNUP ??= "true";

async function main() {
  const { eq, sql } = await import("drizzle-orm");
  const { db } = await import("../lib/db");
  const schema = await import("../lib/db/schema");
  const { assertStaffRole } = await import("../lib/session-authorization");
  const { auth } = await import("../lib/auth");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
  const supabaseResponse = await fetch(
    `${supabaseUrl}/rest/v1/catalog_models?select=id&limit=1`,
    {
    headers: {
      apikey: publishableKey,
      Authorization: `Bearer ${publishableKey}`,
    },
    },
  );
  assert.ok(
    supabaseResponse.ok,
    `Supabase catalog endpoint returned HTTP ${supabaseResponse.status}.`,
  );

  const schemaResult = await db.execute<{ table_name: string }>(sql`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
  `);
  const availableTables = new Set(schemaResult.rows.map((row) => row.table_name));
  const expectedTables = [
    "user",
    "session",
    "account",
    "verification",
    "clients",
    "quotes",
    "quote_events",
    "catalog_models",
    "catalog_prices",
  ];
  for (const table of expectedTables) {
    assert.ok(availableTables.has(table), `Supabase schema is missing table "${table}".`);
  }

  const email = `supabase-integration-${Date.now()}@mypoolquote.local`;
  const password = "Supabase-integration-password-123!";
  let userId: string | undefined;
  let quoteId: string | undefined;
  let clientId: string | undefined;

  try {
    const signUp = await auth.api.signUpEmail({
      body: { email, password, name: "Supabase Integration Staff" },
    });
    assert.ok(signUp.user?.id, "Supabase integration signup must return a user.");
    userId = signUp.user.id;

    const signIn = await auth.api.signInEmail({ body: { email, password } });
    assert.equal(signIn.user?.email, email, "Better Auth login must work on Supabase.");
    assertStaffRole(signIn.user?.role);
    assert.throws(() => assertStaffRole("customer"), /Forbidden/);

    clientId = `supabase-client-${Date.now()}`;
    quoteId = `supabase-quote-${Date.now()}`;
    const now = new Date();
    await db.insert(schema.clients).values({
      id: clientId,
      name: "Supabase Integration Client",
      address: "Test address",
      contact: "test@example.com",
      createdBy: userId,
    });
    await db.insert(schema.quotes).values({
      id: quoteId,
      createdBy: userId,
      clientId,
      builderName: "Supabase Integration Builder",
      builderRef: "",
      builderPiva: "",
      clientName: "Supabase Integration Client",
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
      .select({ id: schema.quotes.id })
      .from(schema.quotes)
      .where(eq(schema.quotes.id, quoteId));
    assert.equal(saved?.id, quoteId, "Supabase quote must be readable.");

    await db
      .update(schema.quotes)
      .set({ status: "accepted", updatedAt: new Date() })
      .where(eq(schema.quotes.id, quoteId));
    const [updated] = await db
      .select({ status: schema.quotes.status })
      .from(schema.quotes)
      .where(eq(schema.quotes.id, quoteId));
    assert.equal(updated?.status, "accepted", "Supabase quote must be updateable.");

    console.log(
      "Supabase integration checks passed: connection, schema, authentication, persistence.",
    );
  } finally {
    if (quoteId) await db.delete(schema.quotes).where(eq(schema.quotes.id, quoteId));
    if (clientId) await db.delete(schema.clients).where(eq(schema.clients.id, clientId));
    if (userId) await db.delete(schema.user).where(eq(schema.user.id, userId));
    await db.$client.end();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
