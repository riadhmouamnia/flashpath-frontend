import { env } from "./env";

import { defineConfig } from "drizzle-kit";
export default defineConfig({
  schema: "./src/server/db/schemas.ts",
  out: "./src/server/db/migrations",
  dialect: "postgresql", // "postgresql" | "mysql"
  driver: "aws-data-api",
  dbCredentials: {
    database: env.DATABASE_URL,
    secretArn: "",
    resourceArn: "",
  },
  migrations: {
    table: "migrations",
    schema: "public",
  },
});
