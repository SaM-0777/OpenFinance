CREATE TABLE "company" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cik" varchar(20) NOT NULL,
	"name" text NOT NULL,
	"manager" text NOT NULL,
	"address" text,
	"link" text,
	"state" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "company_cik_unique" UNIQUE("cik")
);
