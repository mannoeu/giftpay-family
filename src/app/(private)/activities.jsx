import { SafeHorizontalPadding } from "@/components/ui/safe-horizontal-padding";
import { useTabBarBottomPadding } from "@/hooks/useTabBarBottomPadding";
import { useDependentsQuery } from "@/queries/dependents";
import { useTransactionsInfiniteQuery } from "@/queries/transactions";
import { ActivitiesHeader } from "@/screenComponents/activities/Header";
import { ActivitiesFilterSheet } from "@/screenComponents/activities/FilterSheet";
import { Layout } from "@/screenComponents/activities/Layout";
import {
  ActivitiesError,
  ActivitiesList,
  ActivitiesLoadingList,
} from "@/screenComponents/activities/ActivitiesList";
import {
  getActivitiesEmptyMessage,
  getActivitiesFilterButtonLabel,
  isActivitiesFilterActive,
} from "@/screenComponents/activities/view";
import { useActivitiesFilterStore } from "@/store/activitiesFilter";
import { useSheet } from "@/store/sheet";

const ERROR_MESSAGE =
  "Por favor, tente novamente. Caso o problema persista, contate o suporte.";

export default function ActivitiesScreen() {
  const paddingBottom = useTabBarBottomPadding();
  const openSheet = useSheet((state) => state.openSheet);
  const parentId = useActivitiesFilterStore((state) => state.parentId);
  const setParentId = useActivitiesFilterStore((state) => state.setParentId);
  const { data: dependents = [] } = useDependentsQuery();

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
  } = useTransactionsInfiniteQuery({ parentId });

  const handleOpenFilter = () => {
    openSheet(
      <ActivitiesFilterSheet
        dependents={dependents}
        selectedParentId={parentId}
        onFilter={setParentId}
      />,
    );
  };

  const handleEndReached = () => {
    if (isPending || !hasNextPage || isFetchingNextPage) return;
    fetchNextPage();
  };

  return (
    <Layout>
      <SafeHorizontalPadding>
        <ActivitiesHeader
          filterLabel={getActivitiesFilterButtonLabel(parentId, dependents)}
          isFilterActive={isActivitiesFilterActive(parentId)}
          onPressFilter={handleOpenFilter}
        />
      </SafeHorizontalPadding>

      {isPending ? <ActivitiesLoadingList /> : null}
      {isError ? (
        <ActivitiesError retry={refetch} errorMessage={ERROR_MESSAGE} />
      ) : null}
      {!isPending && !isError ? (
        <ActivitiesList
          data={data}
          paddingBottom={paddingBottom}
          onEndReached={handleEndReached}
          isFetchingNextPage={isFetchingNextPage}
          onRefresh={resetQueries}
          isRefreshing={isRefetching && !isFetchingNextPage}
          emptyMessage={getActivitiesEmptyMessage(parentId, dependents)}
        />
      ) : null}
    </Layout>
  );
}
