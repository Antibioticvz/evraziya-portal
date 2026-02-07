---
name: wave-verify
description: Verify wave completion. Use after implementing a wave of tasks to check quality.
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - TaskUpdate
  - TaskList
  - TaskGet
---

# Wave Verification

## Step 1: Run Build Pipeline

Execute each check and record results:

1. `yarn build` — compilation and bundle must succeed
2. `yarn lint` — no ESLint errors
3. `yarn format:check` — Prettier formatting is correct
4. `yarn type-check` — TypeScript strict mode passes

If any check fails:

- Fix the problem immediately
- Re-run the failing check to confirm the fix
- Continue to next check

## Step 2: Review All Modified Files

1. Run `git diff --name-only` to list all modified files
2. For EACH modified file:
   - Read the FULL file (do not grep or partial-read)
   - Check for:
     - Correct imports (no unused, no missing)
     - Consistent code style (no semicolons, single quotes, trailing commas)
     - Russian UI strings where required
     - Proper TypeScript types (no `any`)
     - Server vs Client component correctness (`'use client'` only where needed)
     - Supabase patterns: correct client (server/static/admin), error handling
     - Zod validation where user input is accepted
3. Note any quality issues found

## Step 3: Fix Problems

For each issue found in Step 2:

1. Fix the code
2. Re-run `yarn build` to confirm no regressions
3. Document what was fixed and why

## Step 4: Update Task Status

1. Call TaskList to get current tasks
2. For each task that was part of this wave:
   - If all acceptance criteria met: update status to done with notes
   - If some criteria not met: update status to failed with specific notes
   - Include file list in the notes for traceability
3. Display summary:
   - Tasks marked done
   - Tasks marked failed (with reasons)
   - Overall wave status: PASS or NEEDS ATTENTION

## Step 5: Prepare for Commit

If all tasks passed:

- Display the suggested commit message: `feat: wave [N] — [brief description]`
- List all files to be committed
- Remind: ready to commit and proceed to next wave
