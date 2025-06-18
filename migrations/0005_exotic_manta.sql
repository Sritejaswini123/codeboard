ALTER TABLE "projects" ADD COLUMN "projectProfile" text;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_projectProfile_unique" UNIQUE("projectProfile");