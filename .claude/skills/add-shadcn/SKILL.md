---
name: add-shadcn
description: Add or customize a shadcn/ui component. Use when you need a new UI component from the shadcn registry.
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
---
# Add shadcn/ui Component

Install a new shadcn/ui component or customize an existing one.

## Steps

1. Check if the component already exists: `src/components/ui/<name>.tsx`
2. If not — install via CLI: `npx shadcn@latest add <component-name>`
3. Read the installed component and verify it follows project conventions
4. Customize if needed (Russian labels, project theme colors, variants)

## Project-specific conventions

- **Tailwind CSS 4** — theme uses `@theme` block in `globals.css` with CSS variables
- **Color scheme**: `--color-primary: hsl(271 94% 42%)` (purple), `--color-evraziya-dark: hsl(260 62% 3%)`
- **cn() utility** — always use `cn()` from `@/lib/utils` for class merging
- **CVA variants** — use `class-variance-authority` for component variants (see `src/components/ui/button.tsx`)
- **React.forwardRef** — all UI components must forward refs
- **Component location**: `src/components/ui/` for primitives
- **shadcn config**: `components.json` uses `rsc: true`, `tsx: true`, style `default`, icon library `lucide`

## Available installed components
- button, input, toast (already installed)
- Radix primitives: avatar, checkbox, dialog, dropdown-menu, label, select, separator, slot, tabs, toast

## Common shadcn components to add
```bash
npx shadcn@latest add card
npx shadcn@latest add table
npx shadcn@latest add form
npx shadcn@latest add badge
npx shadcn@latest add sheet
npx shadcn@latest add skeleton
npx shadcn@latest add pagination
npx shadcn@latest add alert
npx shadcn@latest add textarea
```

$ARGUMENTS
