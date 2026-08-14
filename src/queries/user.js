import { useQuery } from "@tanstack/react-query";

import { UserController } from "@/controller";
import { QueryKeys, Time } from "./@config";

export const useUserQuery = ({ ...options } = {}) => {
  const Query = useQuery({
    queryKey: [QueryKeys.getUserDetails],
    queryFn: async () => {
      const { data } = await UserController.getProfile();
      return data;
    },
    staleTime: Time(5),
    ...options,
    placeholderData: null,
  });

  const isReady = !(
    Query.errorUpdateCount > 0 ||
    !Query.isFetched ||
    Query.isError
  );

  return { ...Query, isReady };
};
