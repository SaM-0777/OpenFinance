CREATE TABLE "holding" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cik" varchar(20) NOT NULL,
	"cusip" varchar,
	"issuer" text NOT NULL,
	"value" bigint NOT NULL,
	"shares" bigint NOT NULL,
	"report_period" timestamp,
	"filing_date" timestamp NOT NULL,
	"share_type" varchar(20),
	"option_type" varchar(10),
	"investment_discretion" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "holding" ADD CONSTRAINT "holding_cik_company_cik_fk" FOREIGN KEY ("cik") REFERENCES "public"."company"("cik") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "holding_cik_filing_cusip_unique" ON "holding" USING btree ("cik","filing_date","cusip");