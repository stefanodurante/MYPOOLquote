import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as { pool: Pool | undefined };

function getPool() {
  if (!globalForDb.pool) {
    globalForDb.pool = new Pool({
      connectionString:
        process.env.DATABASE_URL ?? "postgresql://localhost/mypoolquote",
    });
  }
  return globalForDb.pool;
}

export const db = drizzle(getPool(), { schema });
