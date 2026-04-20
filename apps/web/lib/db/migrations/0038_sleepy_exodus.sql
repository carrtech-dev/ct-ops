CREATE TABLE "task_schedules" (
	"id" text PRIMARY KEY NOT NULL,
	"organisation_id" text NOT NULL,
	"created_by" text,
	"name" text NOT NULL,
	"description" text,
	"task_type" text NOT NULL,
	"config" jsonb NOT NULL,
	"target_type" text NOT NULL,
	"target_id" text NOT NULL,
	"max_parallel" integer DEFAULT 1 NOT NULL,
	"cron_expression" text NOT NULL,
	"timezone" text DEFAULT 'UTC' NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"last_run_at" timestamp with time zone,
	"next_run_at" timestamp with time zone,
	"last_run_task_run_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"metadata" jsonb
);
--> statement-breakpoint
ALTER TABLE "task_runs" ADD COLUMN "scheduled_from_id" text;--> statement-breakpoint
ALTER TABLE "task_schedules" ADD CONSTRAINT "task_schedules_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_schedules" ADD CONSTRAINT "task_schedules_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "task_schedules_org_idx" ON "task_schedules" USING btree ("organisation_id","created_at");--> statement-breakpoint
CREATE INDEX "task_schedules_due_idx" ON "task_schedules" USING btree ("enabled","next_run_at");--> statement-breakpoint
CREATE INDEX "task_runs_scheduled_from_idx" ON "task_runs" USING btree ("scheduled_from_id");