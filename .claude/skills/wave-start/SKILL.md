---
name: wave-start
description: Execute the next wave of tasks. Use when starting implementation of the next batch of tasks.
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - Task
  - TaskCreate
  - TaskUpdate
  - TaskList
  - TaskGet
---

# Wave Execution

## Step 1: Identify the Current Wave

1. Call TaskList to retrieve all tasks
2. Find the next incomplete wave:
   - Tasks are grouped by wave number (stored in task name prefix like "Wave 1: ...")
   - Skip any task explicitly marked as "skip" or matching user override in $ARGUMENTS
   - If no tasks exist, inform the user and suggest running the planning prompt first
3. Display the wave summary: wave number, task count, task names

## Step 2: Analyze Task Dependencies

For each task in the wave:

1. Read the task description and acceptance criteria
2. Identify which files each task will create or modify
3. Build a conflict map:
   - **Independent tasks**: touch completely different files — can run in parallel
   - **Conflicting tasks**: share files — must run sequentially
4. Display the execution plan: which tasks run in parallel, which sequential, and why

## Step 3: Execute Tasks

For **independent tasks** (no shared files):

- Launch parallel sub-agents via the Task tool
- Each sub-agent MUST follow the CLAUDE.md protocol:
  1. Read the FULL target file before modifying
  2. Read a similar existing file as reference pattern
  3. State which pattern is being followed
  4. Write the code
  5. Re-read the written file
  6. Run `yarn build` — must pass

For **conflicting tasks** (shared files):

- Execute sequentially in dependency order
- Each task follows the same CLAUDE.md protocol
- Run `yarn build` between tasks to catch integration issues early

## Step 4: Post-Wave Verification

After all tasks complete:

1. Run `yarn build` — must pass
2. Run `yarn lint` — must pass
3. Run `yarn format:check` — check formatting
4. If any check fails: fix the issue, do not move on
5. Update each completed task status via TaskUpdate (mark as done with notes)
6. Summarize results:
   - Tasks completed successfully
   - Tasks that needed fixes
   - Any tasks that failed (with reason)
   - Files created/modified

## User Overrides

$ARGUMENTS

Parse user arguments for:

- "Skip TASK-XXX" — exclude specific tasks from this wave
- "Only TASK-XXX" — execute only specified tasks
- "TASK-XXX is complex — [instructions]" — pass extra context to the sub-agent
- "Sequential only" — disable parallel execution for debugging
