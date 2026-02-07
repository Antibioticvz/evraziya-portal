# Project Instructions for Claude

## Project Overview
Evraziya Portal — B2B-портал для группы компаний ЕВРАЗИЯ (оптовая дистрибуция итальянских изделий из кожи и аксессуаров).

## Tech Stack
- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript 5
- **Database/Auth**: Supabase (PostgreSQL, Auth, Realtime)
- **Styling**: Tailwind CSS 4 + shadcn/ui + Radix UI
- **State**: TanStack React Query (server), Zustand (client), nuqs (URL)
- **Forms**: React Hook Form + Zod
- **Package manager**: npm

## Build & Lint
- Build: `npm run build`
- Lint: `npm run lint`
- Lint fix: `npm run lint:fix`
- Type check: `npm run type-check`
- Dev: `npm run dev`
- Test: (not configured yet)

## Path Aliases
- `@/*` → `./src/*`

## Before Writing Code
- Read the FULL target file — never grep or partial-read
- Read a similar existing file as reference pattern
- State which pattern you're following before writing
- Use Server Components by default; add `'use client'` only when needed
- Follow existing shadcn/ui component patterns in `src/components/ui/`

## Code Conventions
- Russian language for UI strings, labels, error messages
- Russian business domain terms: ИП, ООО, ИНН, КПП, ОГРН, БИК
- Use `cn()` from `@/lib/utils` for Tailwind class merging
- Zod schemas for all validation (see `src/lib/validations/`)
- Types/interfaces in `src/types/`
- Supabase clients: `client.ts` (browser), `server.ts` (SSR), `admin.ts` (admin)
- API routes use proper HTTP status codes and error handling
- Role-based access control: admin/user roles via Supabase

## Project Structure
```
src/
  app/
    (marketing)/    — Public pages (routes, brands, contacts)
    (auth)/         — Auth pages (login)
    (dashboard)/    — Protected dashboard pages
    api/            — API routes
  components/
    ui/             — shadcn/ui components
    layout/         — Header, footer, navigation
    features/       — Feature-specific components
    providers/      — React providers
    shared/         — Shared components
  lib/
    supabase/       — Supabase client configs
    validations/    — Zod schemas
    utils.ts        — Utility functions (cn)
  types/            — TypeScript interfaces
  hooks/            — Custom React hooks
  stores/           — Zustand stores
  middleware.ts     — Auth & routing middleware
```

## After Writing Code
- Re-read the file you wrote
- Run `npm run build` — must pass
- Run `npm run lint` — must pass

## Mistakes Log
<!-- Every Claude error becomes a rule here. This is the shared learning mechanism. -->
