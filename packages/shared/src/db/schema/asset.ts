import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const AssetSchema = pgTable("asset", {
  id: uuid("id").defaultRandom().primaryKey(),

  ticker: varchar("ticker", {
    length: 20,
  }),
  cusip: varchar("cusip", {
    length: 20,
  }).unique(),

  //figi: varchar("figi", {
  //  length: 32,
  //}),

  issuer: text("issuer"),
  assetType: text("asset_type"),
  exchange: text("exchange"),
  sector: text("sector"),
  industry: text("industry"),
  country: text("country"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
