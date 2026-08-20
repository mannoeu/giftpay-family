import { useQuery } from "@tanstack/react-query";

import { TransactionController } from "@/controller";
import { serializeLastActivity } from "@/sdk/transaction";

import { QueryKeys, Time } from "./@config";

export const LAST_ACTIVITIES_LIMIT = 5;

export const takeLastActivities = (items) =>
  (items ?? []).slice(0, LAST_ACTIVITIES_LIMIT);

export const useLastActivitiesQuery = ({ parentId, ...options } = {}) => {
  const Query = useQuery({
    queryKey: [QueryKeys.getLastActivities, { parentId: parentId ?? null }],
    queryFn: async () => {
      // await new Promise((res, rej) =>
      //   setTimeout(
      //     () =>
      //       rej({
      //         response: {
      //           status: 400,
      //           data: {
      //             details: "Erro ao carregar as atividades",
      //           },
      //         },
      //       }),
      //     1000,
      //   ),
      // );
      const { data } = await TransactionController.getTransactions({
        parentId,
      });

      return takeLastActivities(data).map(serializeLastActivity);
    },
    staleTime: Time(5),
    ...options,
  });

  const isReady = Query.isFetched && !Query.isError;

  return { ...Query, isReady };
};
