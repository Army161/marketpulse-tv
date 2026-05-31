---
name: add-endpoint
description: Scaffold a new backend API endpoint with adapter, caching, error handling, and type contract
---
# Steps
1. Create `services/api/src/adapters/{name}.ts` with typed response
2. Add endpoint to `services/api/src/routes/{name}.ts`
3. Register route in `services/api/src/app.ts`
4. Add response type to `shared/src/types/index.ts`
5. Add cache layer using node-cache via `withCache`
6. Update `docs/api-contracts.md` with new endpoint
