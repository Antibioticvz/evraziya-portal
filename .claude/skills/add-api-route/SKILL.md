---
name: add-api-route
description: Scaffold a new Next.js API route with Supabase integration. Use when adding backend endpoints.
allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - Bash
---
# Add API Route

Create a new Next.js App Router API route (`route.ts`) with Supabase integration.

## Steps

1. Read an existing API route as reference: `src/app/api/admin/users/route.ts`
2. Determine if the route needs admin access (use `@/lib/supabase/admin`) or user access (`@/lib/supabase/server`)
3. Create `src/app/api/<path>/route.ts` with appropriate HTTP method handlers

## Conventions

- Export named functions: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`
- Use `NextRequest` and `NextResponse` from `next/server`
- Validate request body with Zod schemas from `@/lib/validations/`
- Return proper HTTP status codes: 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error
- Russian error messages in responses
- Admin routes: check user role before processing
- Always handle Supabase errors: `if (error) return NextResponse.json({ error: error.message }, { status: 500 })`

## Template structure

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('table_name')
    .select('*')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
```

## Reference files
- CRUD with admin check: `src/app/api/admin/users/route.ts`
- Single item operations: `src/app/api/admin/users/[id]/route.ts`
- Public endpoint: `src/app/api/contact/route.ts`

$ARGUMENTS
