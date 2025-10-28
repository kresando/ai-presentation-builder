CREATE TABLE "presentations" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"theme" text NOT NULL DEFAULT 'modern',
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "slides" (
	"id" text PRIMARY KEY NOT NULL,
	"presentation_id" text NOT NULL,
	"order" integer NOT NULL,
	"type" text NOT NULL DEFAULT 'content',
	"title" text NOT NULL,
	"content" jsonb NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE INDEX "presentations_user_id_idx" ON "presentations" ("user_id");
--> statement-breakpoint
CREATE INDEX "presentations_created_at_idx" ON "presentations" ("created_at");
--> statement-breakpoint
CREATE INDEX "slides_presentation_id_idx" ON "slides" ("presentation_id");
--> statement-breakpoint
CREATE INDEX "slides_presentation_order_idx" ON "slides" ("presentation_id", "order");
--> statement-breakpoint
ALTER TABLE "presentations" ADD CONSTRAINT "presentations_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "slides" ADD CONSTRAINT "slides_presentation_id_presentations_id_fk" FOREIGN KEY ("presentation_id") REFERENCES "public"."presentations"("id") ON DELETE cascade ON UPDATE no action;