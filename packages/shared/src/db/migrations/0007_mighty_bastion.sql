DROP INDEX "holding_cik_filing_cusip_unique";--> statement-breakpoint
ALTER TABLE "holding" ADD COLUMN "other_manager" text;--> statement-breakpoint
ALTER TABLE "holding" ADD COLUMN "voting_authority_sole" bigint;--> statement-breakpoint
ALTER TABLE "holding" ADD COLUMN "voting_authority_shared" bigint;--> statement-breakpoint
ALTER TABLE "holding" ADD COLUMN "voting_authority_none" bigint;--> statement-breakpoint
CREATE UNIQUE INDEX "holding_unique" ON "holding" USING btree ("cik","filing_date","cusip","investment_discretion","option_type","other_manager","voting_authority_sole","voting_authority_shared","voting_authority_none");