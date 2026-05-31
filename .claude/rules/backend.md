---
paths: ["services/api/**"]
---
# Backend Rules

- All endpoints must return normalized JSON matching types in shared/types/index.ts
- Always wrap external API calls in try/catch with typed error response
- Cache all external API responses: stocks/crypto = 30s, news = 5min
- Use express-rate-limit on all public routes
- Log all errors to console.error with timestamp and route
- Never return raw third-party API errors to the client
- All environment variables must be accessed via a central config.ts file
