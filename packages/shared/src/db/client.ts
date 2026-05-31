import { drizzle } from "drizzle-orm/postgres-js";
import postgres, { type Sql } from "postgres";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("@openfinance/shared/db requires DATABASE_URL to be set");
}

declare global {
  // Reuse the same Postgres client during dev hot reloads.
  // eslint-disable-next-line no-var
  var __openfinancePostgresClient__: Sql | undefined;
}

const globalClient = globalThis.__openfinancePostgresClient__;

const client =
  globalClient ??
  postgres(databaseUrl, {
    ssl: "require",
    max: 20,
    connect_timeout: 10,
    idle_timeout: 30,
    debug: process.env.NODE_ENV !== "production",
    prepare: false,
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__openfinancePostgresClient__ = client;
}

export const db = drizzle({ client });
export { client };
