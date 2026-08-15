import { useQuery } from "@tanstack/react-query";

import { DependentController } from "@/controller";
import { WalletEnum } from "@/sdk/wallet";

import { QueryKeys, Time } from "./@config";

export const useFamilyWalletQuery = ({ ...options } = {}) => {
  const Query = useQuery({
    queryKey: [QueryKeys.getFamilyWallet],
    queryFn: async () => {
      const { data } = await DependentController.getFamilyWallet();

      return {
        total_balance: Number(data?.total_balance),
        today_spending: Number(data?.today_spending),
        wallets: data?.wallets
          .filter((w) => w?.type && Object.values(WalletEnum).includes(w.type))
          .map((w) => ({
            id: w.id,
            name: w.type,
            value: Number(w.balance),
          }))
          .sort((a, b) => a.id - b.id),
      };
    },
    staleTime: Time(5),
    ...options,
  });

  const isReady = !(
    Query.errorUpdateCount > 0 ||
    !Query.isFetched ||
    Query.isError
  );

  return { ...Query, isReady };
};
