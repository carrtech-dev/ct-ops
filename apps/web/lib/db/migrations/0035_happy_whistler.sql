DROP INDEX "resource_tags_org_kv_idx";--> statement-breakpoint
-- Clear any legacy rows that pre-date the tag_id column. The old schema was
-- referenced only by a delete cascade and never had an inserter, so this is a
-- safety net — it is a no-op on any production database.
DELETE FROM "resource_tags" WHERE "tag_id" IS NULL;--> statement-breakpoint
ALTER TABLE "resource_tags" ALTER COLUMN "tag_id" SET NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "resource_tags_unique_uidx" ON "resource_tags" USING btree ("resource_id","resource_type","tag_id");--> statement-breakpoint
ALTER TABLE "resource_tags" DROP COLUMN "key";--> statement-breakpoint
ALTER TABLE "resource_tags" DROP COLUMN "value";