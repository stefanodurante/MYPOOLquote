import { defineConfig } from "drizzle-kit";
import fs from "node:fs";

if (!process.env.DATABASE_URL && fs.existsSync(".env.local")) {
  const env = fs.readFileSync(".env.local", "utf8");
  const match = env.match(/^DATABASE_URL=(.*)$/m);
  if (match?.[1]) process.env.DATABASE_URL = match[1].trim();
}

export default defineConfig({
  out: "./drizzle",
  schema: "./lib/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
