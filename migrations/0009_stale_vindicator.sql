ALTER TABLE "public.authUsers" RENAME TO "authUsers";--> statement-breakpoint
ALTER TABLE "authUsers" DROP CONSTRAINT "public.authUsers_id_unique";--> statement-breakpoint
ALTER TABLE "authUsers" DROP CONSTRAINT "public.authUsers_phone_unique";--> statement-breakpoint
ALTER TABLE "authUsers" ADD CONSTRAINT "authUsers_id_unique" UNIQUE("id");--> statement-breakpoint
ALTER TABLE "authUsers" ADD CONSTRAINT "authUsers_phone_unique" UNIQUE("phone");