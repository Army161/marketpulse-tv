---
name: add-screen
description: Scaffold a new Fire TV screen with navigation, loading, error, and data fetch wired up
---
# Steps
1. Create `apps/firetv/src/screens/{ScreenName}Screen.tsx`
2. Add LoadingState and ErrorState components
3. Wire useFetch hook to the relevant /api endpoint
4. Add D-pad navigation handlers
5. Register screen in `apps/firetv/src/navigation/TVNavigator.tsx`
6. Export from `apps/firetv/src/screens/index.ts`
