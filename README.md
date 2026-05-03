# 99Meal

## System Architecture

The app uses a React + Vite frontend with a layered structure:

- `src/main.jsx` bootstraps the app, mounts React, and wraps the tree with `AuthProvider`, `QueryClientProvider`, and `RouterProvider`.
- `src/Routes/Routes.jsx` defines the full navigation map with public routes, private routes, and admin-only routes.
- `src/providers/AuthProvider.jsx` owns Firebase authentication state and exposes auth actions through context.
- `src/Routes/PrivateRoute.jsx` and `src/Routes/AdminRoute.jsx` guard protected pages based on login and role state.
- `src/Layout/Main.jsx` provides the shared public layout with navbar, footer, and routed page content.
- `src/Layout/Dashboard.jsx` provides the dashboard shell for authenticated users.
- `src/pages/` contains feature pages, while `src/Components/` contains reusable UI pieces.

### Request Flow

1. The browser loads `index.html` and starts `src/main.jsx`.
2. `RouterProvider` resolves the current route.
3. Public pages render through `Main`, while dashboard pages render through `Dashboard`.
4. Protected pages first pass through `PrivateRoute`; admin pages also pass through `AdminRoute`.
5. Data access is handled by feature hooks in `src/hooks/` and shared API helpers in `src/utils/api.js`.

### Data and State Boundaries

- Authentication state lives in Firebase and is exposed through React context.
- Server data is fetched through hooks and React Query where shared caching is useful.
- Route-level loaders are used where a page needs data before rendering, such as item updates.

### Project Notes

- Keep shared layout logic in `src/Layout/`.
- Keep route protection inside route guard components rather than inside page components.
- Keep reusable UI in `src/Components/` and page-specific UI in `src/pages/`.
