CREATE TABLE "commits" (
	"id" serial PRIMARY KEY NOT NULL,
	"month" text NOT NULL,
	"date" date NOT NULL,
	"time" text NOT NULL,
	"user_id" integer NOT NULL,
	"project_id" integer NOT NULL,
	"repository_id" integer NOT NULL,
	"commit_message" text NOT NULL,
	"commit_link" text NOT NULL,
	"lines_of_code" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "repositories" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_name" text NOT NULL,
	"repository_name" text,
	"repository_link" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"project_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text,
	"email" text NOT NULL,
	"phone" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"dob" date NOT NULL,
	"doj" date NOT NULL,
	"designation" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
ALTER TABLE "commits" ADD CONSTRAINT "commits_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commits" ADD CONSTRAINT "commits_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commits" ADD CONSTRAINT "commits_repository_id_repositories_id_fk" FOREIGN KEY ("repository_id") REFERENCES "public"."repositories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_projects" ADD CONSTRAINT "user_projects_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_projects" ADD CONSTRAINT "user_projects_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "commits_commit_name_idx" ON "commits" USING btree ("commit_message");--> statement-breakpoint
CREATE INDEX "projects_title_idx" ON "projects" USING btree ("title");--> statement-breakpoint
CREATE INDEX "projects_id_idx" ON "projects" USING btree ("id");--> statement-breakpoint
CREATE INDEX "repositories__project_name_idx" ON "repositories" USING btree ("project_name");--> statement-breakpoint
CREATE INDEX "repositories__repository_name_idx" ON "repositories" USING btree ("repository_name");--> statement-breakpoint
CREATE INDEX "user_projects_user_id_idx" ON "user_projects" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_projects_project_id_idx" ON "user_projects" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_first_name_idx" ON "users" USING btree ("first_name");--> statement-breakpoint
CREATE INDEX "users_phone_idx" ON "users" USING btree ("phone");