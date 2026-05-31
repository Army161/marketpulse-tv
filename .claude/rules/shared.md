---
paths: ["shared/**"]
---
# Shared Package Rules

- shared/types/index.ts is the single source of truth for all TypeScript interfaces
- Never import from apps/ inside shared/ — shared is consumed, not consuming
- All shared utilities must have JSDoc comments
- Export everything from shared/index.ts
