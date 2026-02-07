---
name: add-page
description: Scaffold a new Next.js App Router page following project conventions. Use when adding a new page/route.
allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - Bash
---
# Add Page

Create a new Next.js App Router page following the project's established patterns.

## Steps

1. Determine the route group: `(marketing)` for public, `(auth)` for auth, `(dashboard)` for protected
2. Read the layout of the target route group (`src/app/<group>/layout.tsx`)
3. Read an existing page in the same group as reference pattern
4. Create the page file at `src/app/<group>/<route>/page.tsx`

## Conventions

- **Server Components by default** — only add `'use client'` if the page needs interactivity
- **Supabase data fetching** — use `createClient` from `@/lib/supabase/server` in async server components
- **Parallel data loading** — use `Promise.all()` for multiple independent queries
- **Russian UI strings** — all labels, headings, empty states in Russian
- **Tailwind CSS 4** — use theme variables: `text-primary`, `bg-background`, etc.
- **Protected pages** — dashboard pages are auto-protected by middleware, no extra auth needed in component
- **Type safety** — import interfaces from `@/types/database.ts` or define inline

## Reference files
- Server page with data: `src/app/(dashboard)/dashboard/page.tsx`
- Marketing page: `src/app/(marketing)/page.tsx`
- Client page with params: `src/app/(dashboard)/dashboard/clients/[id]/page.tsx`

$ARGUMENTS
