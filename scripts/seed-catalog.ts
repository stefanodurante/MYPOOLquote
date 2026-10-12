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
  const { catalogModels, catalogPrices } = await import("../lib/db/schema");
  const { SEED_MODELS, SEED_PRICES } = await import("../lib/quote/seed-data");

  await db
    .insert(catalogModels)
    .values(
      SEED_MODELS.map((model) => ({
        id: model.id,
        label: model.label,
        lengthM: model.l,
        widthM: model.w,
        depthM: model.h,
        poolType: model.type,
        imageUrl: model.imageUrl ?? null,
      })),
    )
    .onConflictDoNothing({ target: catalogModels.id });

  await db
    .insert(catalogPrices)
    .values(SEED_PRICES)
    .onConflictDoNothing({ target: catalogPrices.key });

  await db.$client.end();
  console.log(`Catalog seeded: ${SEED_MODELS.length} models, ${SEED_PRICES.length} prices.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
