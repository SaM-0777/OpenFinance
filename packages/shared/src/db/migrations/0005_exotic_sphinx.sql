DROP INDEX "asset_isin_unique";--> statement-breakpoint
ALTER TABLE "asset" ALTER COLUMN "cusip" SET NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "asset_cusip_unique" ON "asset" USING btree ("cusip");