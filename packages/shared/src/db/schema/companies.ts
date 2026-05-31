import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const CompanySchema = pgTable("company", {
  id: uuid("id").defaultRandom().primaryKey(),
  cik: varchar("cik", { length: 20 }).unique().notNull(),
  name: text("name").notNull(),
  manager: text("manager").notNull(),
  address: text("address"),
  link: text("link"),
  state: text("state"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
