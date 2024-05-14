import { text, timestamp, pgTable, serial } from "drizzle-orm/pg-core";

export const LeadTable = pgTable("leads", {
  id: serial("id").primaryKey().notNull(),
  email: text("email").notNull(),
  description: text("description").default("This is my comment"),
  createdAt: timestamp("created_at").defaultNow(),
});
