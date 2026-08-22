import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";

import { DepositController } from "@/controller";
import { getNextPageParam } from "@/sdk/api";
import { serializeDeposit } from "@/sdk/deposit";

import { QueryKeys, Time } from "./@config";

export const DEPOSITS_PAGE_SIZE = 20;

export const flattenDepositPages = (pages) =>
  (pages ?? []).flatMap((page) => page?.results ?? []);

export const useDepositsInfiniteQuery = ({
  status,
  pageSize = DEPOSITS_PAGE_SIZE,
  ...options
} = {}) => {
  const queryClient = useQueryClient();
  const queryKey = [QueryKeys.getDeposits, { status: status ?? null }];

  const Query = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam }) => {
      const { data } = await DepositController.getDeposits({
        status,
        page: pageParam,
        pageSize,
      });

      return {
        ...data,
        results: (data?.results ?? []).map(serializeDeposit),
      };
    },
    initialPageParam: 1,
    getNextPageParam,
    staleTime: Time(5),
    ...options,
  });

  const data = flattenDepositPages(Query.data?.pages);
  const isReady = Query.isFetched && !Query.isError;
  const isEmpty = isReady && data.length === 0;
  const resetQueries = () =>
    queryClient.resetQueries({ queryKey, exact: true });

  return { ...Query, data, isEmpty, isReady, queryKey, resetQueries };
};
