import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";

import { TransactionController } from "@/controller";
import { getNextPageParam } from "@/sdk/api";
import { serializeLastActivity } from "@/sdk/transaction";

import { QueryKeys, Time } from "./@config";

export const TRANSACTIONS_PAGE_SIZE = 20;

export const flattenTransactionPages = (pages) =>
  (pages ?? []).flatMap((page) => page?.results ?? []);

export const useTransactionsInfiniteQuery = ({
  parentId,
  pageSize = TRANSACTIONS_PAGE_SIZE,
  ...options
} = {}) => {
  const queryClient = useQueryClient();
  const queryKey = [QueryKeys.getTransactions, { parentId: parentId ?? null }];

  const Query = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam }) => {
      const { data } = await TransactionController.getTransactions({
        parentId,
        page: pageParam,
        pageSize,
      });

      return {
        ...data,
        results: (data?.results ?? []).map(serializeLastActivity),
      };
    },
    initialPageParam: 1,
    getNextPageParam,
    staleTime: Time(5),
    ...options,
  });

  const data = flattenTransactionPages(Query.data?.pages);
  const isReady = Query.isFetched && !Query.isError;
  const isEmpty = isReady && data.length === 0;
  const resetQueries = () =>
    queryClient.resetQueries({ queryKey, exact: true });

  return { ...Query, data, isEmpty, isReady, queryKey, resetQueries };
};
