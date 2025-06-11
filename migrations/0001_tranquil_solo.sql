CREATE TABLE "otps" (
	"id" serial PRIMARY KEY NOT NULL,
	"target" varchar,
	"otp" varchar(6),
	"used" boolean DEFAULT false,
	"expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "repositories" ALTER COLUMN "title" SET NOT NULL;