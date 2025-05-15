CREATE TABLE "commits" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" date NOT NULL,
	"time" time NOT NULL,
	"lines_of_code" integer NOT NULL,
	"commit_link" text NOT NULL,
	"commit_name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"assigned_to" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE INDEX "commits_date_idx" ON "commits" USING btree ("date");--> statement-breakpoint
CREATE INDEX "title_idx" ON "projects" USING btree ("title");--> statement-breakpoint
CREATE INDEX "assigned_to_idx" ON "projects" USING btree ("assigned_to");