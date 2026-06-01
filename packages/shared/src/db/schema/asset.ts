import {
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const AssetSchema = pgTable(
  "asset",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    ticker: varchar("ticker", {
      length: 20,
    }).notNull(),
    cusip: varchar("cusip", {
      length: 20,
    })
      .unique()
      .notNull(),

    name: text("name").notNull(),
    summary: text("summary"),
    currency: varchar("currency", {
      length: 10,
    }),
    sector: text("sector"),
    industryGroup: text("industry_group"),
    industry: text("industry"),
    exchange: text("exchange"),
    mic: varchar("mic", {
      length: 20,
    }),
    market: text("market"),
    country: text("country"),
    state: text("state"),
    city: text("city"),
    zipCode: varchar("zip_code", {
      length: 20,
    }),
    website: text("website"),
    isin: varchar("isin", {
      length: 20,
    }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    //uniqueIndex("asset_isin_unique").on(table.isin),
    uniqueIndex("asset_cusip_unique").on(table.cusip),
  ],
);
