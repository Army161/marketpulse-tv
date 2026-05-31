---
paths: ["apps/firetv/**"]
---
# Fire TV Rules

- All components must be focusable via D-pad — no touch-only interactions
- Every interactive element needs hasTVPreferredFocus or explicit focus handler
- Font sizes: minimum 32px body, 48px section headers, 24px labels
- Focus ring: 3px solid, color: theme.accent, borderRadius matching card
- Every screen must have a LoadingState and ErrorState component
- All API calls must use the shared useFetch hook with error boundary
- No inline styles — use StyleSheet.create only
- Component max length: 200 lines. Split into sub-components if larger.
