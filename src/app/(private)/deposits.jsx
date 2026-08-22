import { SafeHorizontalPadding } from "@/components/ui/safe-horizontal-padding";
import { useTabBarBottomPadding } from "@/hooks/useTabBarBottomPadding";
import { useDepositsInfiniteQuery } from "@/queries/deposits";
import { DepositsHeader } from "@/screenComponents/deposits/Header";
import { DepositsFilterSheet } from "@/components/sheets/depositsFilterSheet";
import { PaidDepositSheet } from "@/components/sheets/paidDepositSheet";
import { PendingDepositSheet } from "@/components/sheets/pendingDepositSheet";
import { Layout } from "@/screenComponents/deposits/Layout";
import {
  DepositsError,
  DepositsList,
  DepositsLoadingList,
} from "@/screenComponents/deposits/DepositsList";
import {
  getDepositsEmptyMessage,
  getDepositsFilterButtonLabel,
  isDepositsFilterActive,
} from "@/screenComponents/deposits/view";
import { DepositStatus } from "@/sdk/deposit";
import { useDepositsFilterStore } from "@/store/depositsFilter";
import { useSheet } from "@/store/sheet";

export default function DepositsScreen() {
  const paddingBottom = useTabBarBottomPadding();
  const openSheet = useSheet((state) => state.openSheet);
  const status = useDepositsFilterStore((state) => state.status);
  const setStatus = useDepositsFilterStore((state) => state.setStatus);

  const {
    data,
    isPending,
    isError,
    refetch,
    resetQueries,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isRefetching,
  } = useDepositsInfiniteQuery({ status });

  const handleOpenFilter = () => {
    openSheet(
      <DepositsFilterSheet selectedStatus={status} onFilter={setStatus} />,
    );
  };

  const handlePressItem = (item) => {
    if (item?.status === DepositStatus.paid) {
      openSheet(<PaidDepositSheet deposit={item} />);
      return;
    }

    openSheet(<PendingDepositSheet deposit={item} />);
  };

  const handleEndReached = () => {
    if (isPending || !hasNextPage || isFetchingNextPage) return;
    fetchNextPage();
  };

  return (
    <Layout>
      <SafeHorizontalPadding>
        <DepositsHeader
          filterLabel={getDepositsFilterButtonLabel(status)}
          isFilterActive={isDepositsFilterActive(status)}
          onPressFilter={handleOpenFilter}
        />
      </SafeHorizontalPadding>

      {isPending ? <DepositsLoadingList /> : null}
      {isError ? (
        <DepositsError
          retry={refetch}
          errorMessage="Por favor, tente novamente. Caso o problema persista, contate o suporte."
        />
      ) : null}
      {!isPending && !isError ? (
        <DepositsList
          data={data}
          paddingBottom={paddingBottom}
          onEndReached={handleEndReached}
          isFetchingNextPage={isFetchingNextPage}
          onRefresh={resetQueries}
          isRefreshing={isRefetching && !isFetchingNextPage}
          emptyMessage={getDepositsEmptyMessage(status)}
          onPressItem={handlePressItem}
        />
      ) : null}
    </Layout>
  );
}
