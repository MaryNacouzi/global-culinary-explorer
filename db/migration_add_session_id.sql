-- migration_add_session_id.sql
-- Run this ONCE against your existing Neon database (via the Neon SQL
-- editor or `psql $DATABASE_URL -f db/migration_add_session_id.sql`).
-- It adds session-based isolation to the grocery_list table so items
-- are scoped per-visitor instead of shared globally.
--
-- Any rows that already exist were created before this fix and have no
-- real owner (they came from the shared-state bug), so they're cleared
-- out rather than assigned to a fake session.

DELETE FROM grocery_list;

ALTER TABLE grocery_list ADD COLUMN IF NOT EXISTS session_id VARCHAR(64);
ALTER TABLE grocery_list ALTER COLUMN session_id SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_grocery_list_session ON grocery_list(session_id);
