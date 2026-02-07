---
name: supabase-migrate
description: Create a new Supabase migration with types. Use when modifying the database schema.
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
---
# Supabase Migration

Create a new Supabase SQL migration and update TypeScript types.

## Steps

1. Read the current schema: `supabase/migrations/` (latest migration file)
2. Read existing types: `src/types/database.ts`
3. Create a new timestamped migration file: `supabase/migrations/<timestamp>_<description>.sql`
4. Update `src/types/database.ts` with new/modified interfaces
5. If new table — create data access functions or update existing ones

## Conventions

- **Migration naming**: `YYYYMMDDHHMMSS_description.sql` (e.g., `20260207120000_add_orders_table.sql`)
- **RLS policies**: always add Row Level Security policies for new tables
- **Timestamps**: include `created_at` and `updated_at` with defaults
- **Soft delete**: use `is_active` boolean or `deleted_at` timestamp where appropriate
- **Foreign keys**: use `ON DELETE CASCADE` or `ON DELETE SET NULL` explicitly
- **Indexes**: add indexes for frequently queried columns
- **Enums**: prefer text check constraints over Postgres enums for flexibility

## Type conventions in `src/types/database.ts`

```typescript
export interface Order {
  id: string
  order_number: string
  status: 'draft' | 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total_amount: number | null
  client_id: string
  created_at: string
  updated_at: string
}
```

## Reference files
- Initial schema: `supabase/migrations/20260131000001_initial_schema.sql`
- Existing types: `src/types/database.ts`
- Seed data: `supabase/seed.sql`
- Supabase config: `supabase/config.toml`

$ARGUMENTS
