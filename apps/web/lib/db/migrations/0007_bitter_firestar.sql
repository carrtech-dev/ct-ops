CREATE TABLE "agent_queries" (
	"id" text PRIMARY KEY NOT NULL,
	"organisation_id" text NOT NULL,
	"host_id" text NOT NULL,
	"query_type" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"result" jsonb,
	"error" text,
	"requested_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	"metadata" jsonb
);
--> statement-breakpoint
ALTER TABLE "agent_queries" ADD CONSTRAINT "agent_queries_organisation_id_organisations_id_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agent_queries" ADD CONSTRAINT "agent_queries_host_id_hosts_id_fk" FOREIGN KEY ("host_id") REFERENCES "public"."hosts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "agent_queries_host_status_idx" ON "agent_queries" USING btree ("host_id","status");--> statement-breakpoint
CREATE INDEX "agent_queries_org_idx" ON "agent_queries" USING btree ("organisation_id","requested_at");