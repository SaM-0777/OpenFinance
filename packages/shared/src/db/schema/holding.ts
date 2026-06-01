import {
  pgTable,
  uuid,
  varchar,
  text,
  bigint,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import { CompanySchema } from "./companies";

export const HoldingSchema = pgTable(
  "holding",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    cik: varchar("cik", {
      length: 20,
    })
      .notNull()
      .references(() => CompanySchema.cik, {
        onDelete: "cascade",
      }),

    cusip: varchar("cusip"),
    issuer: text("issuer").notNull(),
    securityClass: text("security_class"),
    value: bigint("value", {
      mode: "number",
    }).notNull(),
    shares: bigint("shares", {
      mode: "number",
    }).notNull(),

    reportPeriod: timestamp("report_period", {
      mode: "date",
    }),
    filingDate: timestamp("filing_date", {
      mode: "date",
    }).notNull(),

    shareType: varchar("share_type", {
      length: 20,
    }),
    optionType: varchar("option_type", {
      length: 10,
    }),

    investmentDiscretion: text("investment_discretion"),
    otherManager: text("other_manager"),

    votingAuthoritySole: bigint("voting_authority_sole", {
      mode: "number",
    }),
    votingAuthorityShared: bigint("voting_authority_shared", {
      mode: "number",
    }),
    votingAuthorityNone: bigint("voting_authority_none", {
      mode: "number",
    }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("holding_unique").on(
      table.cik,
      table.filingDate,
      table.reportPeriod,
      table.cusip,
      table.investmentDiscretion,
      table.optionType,
      table.otherManager,
      table.votingAuthoritySole,
      table.votingAuthorityShared,
      table.votingAuthorityNone,
    ),
  ],
);
