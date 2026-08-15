import { useQuery } from "@tanstack/react-query";

import { DependentController } from "@/controller";

import { QueryKeys } from "./@config";

export const useDependentsQuery = ({ ...options } = {}) => {
  const Query = useQuery({
    queryKey: [QueryKeys.getDependents],
    queryFn: async () => {
      const { data } = await DependentController.getDependents();
      return data;
    },
    staleTime: Infinity,
    ...options,
  });

  const isReady = !(
    Query.errorUpdateCount > 0 ||
    !Query.isFetched ||
    Query.isError
  );

  return { ...Query, isReady };
};
