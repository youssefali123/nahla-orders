import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    // Keep loader data fresh for 60s: revisiting a route within this window
    // reuses cached data instead of refetching Supabase on every navigation.
    defaultStaleTime: 60_000,
    defaultPreloadStaleTime: 60_000,
    // Show loading feedback fast (200ms) and keep it briefly (300ms min)
    // so first-time navigation never looks stuck on the old page.
    defaultPendingMs: 200,
    defaultPendingMinMs: 300,
  });

  return router;
};
