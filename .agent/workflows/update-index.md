---
description: Regenerate the workspace library index
---
# /update-index — Workspace Index Regeneration

Trigger this workflow whenever new projects, files, or folders are created that should be catalogued.

// turbo-all

## Steps

1. Run the indexer script to regenerate `workspace/WORKSPACE_INDEX.md`:

```powershell
powershell -ExecutionPolicy Bypass -File "c:\Users\steph\Desktop\Antigravity and Agent 0\workspace\skills\index_workspace.ps1"
```

2. Verify the output file was updated and review dead-weight entries.

3. Stage and commit the updated index:

```powershell
cd "c:\Users\steph\Desktop\Antigravity and Agent 0"; git add workspace/WORKSPACE_INDEX.md; git commit -m "chore: regenerate workspace index [auto]"
```

## When to trigger

- **New project created** — run immediately after scaffold
- **Significant folder restructure** — run after any rename/move
- **Start of session** — optional, run if index feels stale (>7 days old)
- **Pre-PR** — include updated index in all structural PRs
