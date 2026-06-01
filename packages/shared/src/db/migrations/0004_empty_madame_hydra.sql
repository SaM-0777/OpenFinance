ALTER TABLE "asset" ALTER COLUMN "ticker" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "asset" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "asset" ADD COLUMN "summary" text;--> statement-breakpoint
ALTER TABLE "asset" ADD COLUMN "currency" varchar(10);--> statement-breakpoint
ALTER TABLE "asset" ADD COLUMN "industry_group" text;--> statement-breakpoint
ALTER TABLE "asset" ADD COLUMN "mic" varchar(20);--> statement-breakpoint
ALTER TABLE "asset" ADD COLUMN "market" text;--> statement-breakpoint
ALTER TABLE "asset" ADD COLUMN "state" text;--> statement-breakpoint
ALTER TABLE "asset" ADD COLUMN "city" text;--> statement-breakpoint
ALTER TABLE "asset" ADD COLUMN "zip_code" varchar(20);--> statement-breakpoint
ALTER TABLE "asset" ADD COLUMN "website" text;--> statement-breakpoint
ALTER TABLE "asset" ADD COLUMN "isin" varchar(20);--> statement-breakpoint
CREATE UNIQUE INDEX "asset_isin_unique" ON "asset" USING btree ("isin");--> statement-breakpoint
ALTER TABLE "asset" DROP COLUMN "issuer";--> statement-breakpoint
ALTER TABLE "asset" DROP COLUMN "asset_type";