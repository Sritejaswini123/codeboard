ALTER TABLE "authUsers" RENAME TO "public.authUsers";--> statement-breakpoint
ALTER TABLE "public.authUsers" DROP CONSTRAINT "authUsers_id_unique";--> statement-breakpoint
ALTER TABLE "public.authUsers" DROP CONSTRAINT "authUsers_phone_unique";--> statement-breakpoint
ALTER TABLE "public.authUsers" ADD CONSTRAINT "public.authUsers_id_unique" UNIQUE("id");--> statement-breakpoint
ALTER TABLE "public.authUsers" ADD CONSTRAINT "public.authUsers_phone_unique" UNIQUE("phone");