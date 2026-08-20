import { RefreshControl } from "react-native";
import { RefreshCw } from "lucide-react-native";
import { useTheme } from "styled-components/native";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Transaction, TransactionSkeleton } from "@/components/Transaction";
import { FlatListFooter } from "@/components/flatListFooter";
import noActivitiesImage from "@/assets/images/no-activities.png";

import { TRANSACTIONS_PAGE_SIZE } from "@/queries/transactions";

import * as S from "./styles";

const ActivityItem = ({ item }) => (
  <S.ItemCard>
    <Transaction
      variant={item?.variant}
      title={item?.title}
      subtitle={item?.subtitle}
      createdAt={item?.created_at}
      value={item?.value}
      icon={item?.icon}
      letter={item?.letter}
      color={item?.color}
    />
  </S.ItemCard>
);

export const ActivitiesLoadingList = () => (
  <S.SkeletonList>
    {Array.from({ length: TRANSACTIONS_PAGE_SIZE }).map((_, index) => (
      <S.ItemCard key={`activities-skeleton-${index}`} testID="activity-skeleton">
        <TransactionSkeleton />
      </S.ItemCard>
    ))}
  </S.SkeletonList>
);

export const ActivitiesEmpty = ({ emptyMessage }) => (
  <S.EmptyState>
    <Text fontSize="base" fontWeight="bold" textAlign="center">
      Nenhuma atividade encontrada
    </Text>
    {emptyMessage ? (
      <Text fontSize="sm" textAlign="center">
        {emptyMessage}
      </Text>
    ) : null}
    <S.EmptyImage source={noActivitiesImage} />
  </S.EmptyState>
);

export const ActivitiesError = ({ retry, errorMessage }) => (
  <S.ErrorState>
    <Text fontSize="base" fontWeight="bold" textAlign="center">
      Não foi possível carregar as atividades
    </Text>
    {errorMessage ? (
      <Text fontSize="sm" textAlign="center">
        {errorMessage}
      </Text>
    ) : null}
    <Button variant="outline" icon={<RefreshCw />} onPress={retry}>
      Tentar novamente
    </Button>
  </S.ErrorState>
);

export const ActivitiesList = ({
  data,
  paddingBottom,
  onEndReached,
  isFetchingNextPage,
  onRefresh,
  isRefreshing,
  emptyMessage,
}) => {
  const theme = useTheme();

  return (
    <S.List
      data={data}
      keyExtractor={(item, index) => String(item?.id ?? index)}
      renderItem={({ item }) => <ActivityItem item={item} />}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.4}
      ListFooterComponent={
        <FlatListFooter isLoading={isFetchingNextPage} />
      }
      ListEmptyComponent={<ActivitiesEmpty emptyMessage={emptyMessage} />}
      refreshControl={
        <RefreshControl
          refreshing={!!isRefreshing}
          onRefresh={onRefresh}
          tintColor={theme.colors.teal}
        />
      }
      $paddingBottom={paddingBottom}
    />
  );
};
