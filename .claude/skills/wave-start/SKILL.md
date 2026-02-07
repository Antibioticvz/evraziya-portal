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

Check native Tasks (TaskList) for the next incomplete wave.

For independent tasks within the wave: launch parallel sub-agents via the
Task tool, each following the protocol in CLAUDE.md.

For tasks sharing files: run them sequentially.

After all tasks complete: run build, update task status, summarize results.

$ARGUMENTS
