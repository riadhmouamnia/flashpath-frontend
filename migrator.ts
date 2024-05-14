import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";
import { neon } from "@neondatabase/serverless";
import * as schema from "./src/server/db/schemas";
import { env } from "./env";

async function main() {
  console.log("Migration started");

  const client = neon(env.DATABASE_URL!);

  const db = drizzle(client, { schema });

  await migrate(db, { migrationsFolder: "./src/server/db/migrations" });

  console.log("Migration completed");

  process.exit(0);
}

main().catch((error) => {
  console.error("Migration failed");
  console.log(error);
  process.exit(1);
});
