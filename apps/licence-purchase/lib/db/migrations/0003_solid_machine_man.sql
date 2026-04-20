CREATE TABLE "support_ai_job" (
	"id" text PRIMARY KEY NOT NULL,
	"ticket_id" text NOT NULL,
	"status" text DEFAULT 'queued' NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"last_error" text,
	"locked_by" text,
	"locked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "support_ai_rate" (
	"id" text PRIMARY KEY NOT NULL,
	"ticket_id" text NOT NULL,
	"window_start" timestamp with time zone NOT NULL,
	"count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "support_message" (
	"id" text PRIMARY KEY NOT NULL,
	"ticket_id" text NOT NULL,
	"author" text NOT NULL,
	"author_user_id" text,
	"body" text NOT NULL,
	"body_redacted" text,
	"ai_model_id" text,
	"ai_input_tokens" integer,
	"ai_output_tokens" integer,
	"ai_latency_ms" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "support_settings" (
	"id" text PRIMARY KEY DEFAULT 'singleton' NOT NULL,
	"ai_enabled" boolean DEFAULT true NOT NULL,
	"updated_by_user_id" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "support_ticket" (
	"id" text PRIMARY KEY NOT NULL,
	"organisation_id" text NOT NULL,
	"created_by_user_id" text NOT NULL,
	"subject" text NOT NULL,
	"status" text DEFAULT 'open' NOT NULL,
	"ai_paused" boolean DEFAULT false NOT NULL,
	"ai_flag_reason" text,
	"last_message_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "support_ai_job" ADD CONSTRAINT "support_ai_job_ticket_id_support_ticket_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "public"."support_ticket"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_ai_rate" ADD CONSTRAINT "support_ai_rate_ticket_id_support_ticket_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "public"."support_ticket"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_message" ADD CONSTRAINT "support_message_ticket_id_support_ticket_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "public"."support_ticket"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_message" ADD CONSTRAINT "support_message_author_user_id_user_id_fk" FOREIGN KEY ("author_user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_settings" ADD CONSTRAINT "support_settings_updated_by_user_id_user_id_fk" FOREIGN KEY ("updated_by_user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_ticket" ADD CONSTRAINT "support_ticket_organisation_id_organisation_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisation"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_ticket" ADD CONSTRAINT "support_ticket_created_by_user_id_user_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "support_ai_job_status_idx" ON "support_ai_job" USING btree ("status");--> statement-breakpoint
CREATE INDEX "support_ai_job_ticket_idx" ON "support_ai_job" USING btree ("ticket_id");--> statement-breakpoint
CREATE UNIQUE INDEX "support_ai_rate_ticket_window" ON "support_ai_rate" USING btree ("ticket_id","window_start");--> statement-breakpoint
CREATE INDEX "support_message_ticket_idx" ON "support_message" USING btree ("ticket_id");--> statement-breakpoint
CREATE INDEX "support_ticket_org_idx" ON "support_ticket" USING btree ("organisation_id");--> statement-breakpoint
CREATE INDEX "support_ticket_status_idx" ON "support_ticket" USING btree ("status");