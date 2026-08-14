import { QueryClient } from "@tanstack/react-query";

/**
 * QueryClient para testes — sem retry, gcTime: Infinity para evitar vazar
 * o timer de GC que segura o worker do Jest.
 * Use sempre este em vez de `new QueryClient()` inline nos testes.
 */
export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
      },
      mutations: {
        retry: false,
      },
    },
  });
