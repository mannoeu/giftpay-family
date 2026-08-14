import { QueryClient } from "@tanstack/react-query";

/** Instância única — use fora de componentes React (entries, session, etc.). */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (attempt, error) => {
        const isNetworkError =
          !error?.response && error?.message?.includes("Network Error");

        if (isNetworkError) {
          return true;
        }

        if ([400, 403, 404, 500, 502].includes(error?.response?.status)) {
          return false;
        }

        return attempt < 5;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: true,
      refetchOnReconnect: "always",
    },
    mutations: {
      useErrorBoundary: false,
    },
  },
});
