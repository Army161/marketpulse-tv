---
name: typecheck
description: Run full typecheck across all workspaces and fix all errors before proceeding
---
# Steps
1. Run `npm run typecheck --workspaces`
2. List all TypeScript errors found
3. Fix each error
4. Re-run until zero errors
5. Report: "Typecheck passed — 0 errors"
