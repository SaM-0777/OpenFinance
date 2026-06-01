CREATE TABLE "asset" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ticker" varchar(20),
	"cusip" varchar(20),
	"issuer" text,
	"asset_type" text,
	"exchange" text,
	"sector" text,
	"industry" text,
	"country" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "asset_cusip_unique" UNIQUE("cusip")
);
--> statement-breakpoint
ALTER TABLE "holding" ADD COLUMN "security_class" text;