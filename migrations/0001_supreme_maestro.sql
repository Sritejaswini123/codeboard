ALTER TABLE "repositories" RENAME COLUMN "repository_name" TO "title";--> statement-breakpoint
ALTER TABLE "repositories" RENAME COLUMN "repository_link" TO "link";--> statement-breakpoint
DROP INDEX "repositories__repository_name_idx";--> statement-breakpoint
ALTER TABLE "repositories" ADD COLUMN "description" text;--> statement-breakpoint
CREATE INDEX "repositories__title_idx" ON "repositories" USING btree ("title");