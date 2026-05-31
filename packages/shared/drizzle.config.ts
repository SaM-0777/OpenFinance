import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables from root .env file
config({ path: resolve(__dirname, "../../.env") });

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error(
    "DATABASE_URL is not set. Please check your .env file in the root directory."
  );
}

export default defineConfig({
  dialect: "postgresql",
  out: "src/db/migrations",
  schema: "src/db/schema",
  dbCredentials: {
    url: dbUrl,
  },
  verbose: true,
  breakpoints: true,
});
