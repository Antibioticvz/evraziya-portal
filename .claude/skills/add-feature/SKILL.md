---
name: add-feature
description: Scaffold a complete feature with page, API, components, and types. Use for new functional modules.
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - Task
---
# Add Feature

Scaffold a complete feature module following the project's architecture.

## Steps

1. **Analyze** — read similar existing features for reference patterns:
   - Clients feature: `src/app/(dashboard)/dashboard/clients/`
   - Brands feature: `src/app/(marketing)/brendy/`
2. **Plan** — determine what files are needed:
   - Page(s): `src/app/(dashboard)/dashboard/<feature>/page.tsx`
   - API route(s): `src/app/api/<feature>/route.ts`
   - Components: `src/components/features/<feature>/`
   - Types: update `src/types/database.ts`
   - Validation: `src/lib/validations/<feature>.ts`
   - Migration (if new table): `supabase/migrations/<timestamp>_add_<feature>.sql`
3. **Implement** — create files in dependency order:
   - Types and validation schemas first
   - Database migration if needed
   - API routes
   - Components (shared, then feature-specific)
   - Pages
4. **Verify** — run `npm run build` and `npm run lint`

## Architecture rules

- **Server Components** for data display pages
- **Client Components** (`'use client'`) only for: forms, interactive tables, modals, toast triggers
- **Data fetching** in server components via `createClient()` from `@/lib/supabase/server`
- **Mutations** via API routes, called from client components with `fetch()` or React Query
- **State management**: React Query for server state, Zustand for complex client state, nuqs for URL state
- **Forms**: React Hook Form + Zod + `@hookform/resolvers`
- **UI**: shadcn/ui components from `src/components/ui/`, Lucide icons
- **Russian language** for all user-facing strings

$ARGUMENTS
