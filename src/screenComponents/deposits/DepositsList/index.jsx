import { ChevronRight, RefreshCw } from "lucide-react-native";
import { RefreshControl } from "react-native";
import { useTheme } from "styled-components/native";

import noActivitiesImage from "@/assets/images/no-activities.png";
import { FlatListFooter } from "@/components/flatListFooter";
import { Transaction, TransactionSkeleton } from "@/components/Transaction";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { DEPOSITS_PAGE_SIZE } from "@/queries/deposits";
import { TransactionVariant } from "@/sdk/transaction";

import * as S from "./styles";

const DepositItem = ({ item, onPress }) => {
  const theme = useTheme();
  const statusColor = theme.colors[item?.valueColorToken] ?? theme.colors.gold;

  return (
    <S.ItemCard>
      <S.PressableRow
        onPress={() => onPress?.(item)}
        accessibilityRole="button"
      >
        <S.TransactionWrap>
          <Transaction
            variant={TransactionVariant.in}
            title={item?.title}
            subtitle={item?.subtitle}
            createdAt={item?.created_at}
            value={item?.value}
            letter={item?.letter}
            color={item?.color}
            valueColor={statusColor}
          />
        </S.TransactionWrap>
        <ChevronRight size={18} color={theme.colors.grey} />
      </S.PressableRow>
    </S.ItemCard>
  );
};

export const DepositsLoadingList = () => (
  <S.SkeletonList>
    {Array.from({ length: DEPOSITS_PAGE_SIZE }).map((_, index) => (
      <S.ItemCard key={`deposits-skeleton-${index}`} testID="deposit-skeleton">
        <TransactionSkeleton />
      </S.ItemCard>
    ))}
  </S.SkeletonList>
);

export const DepositsEmpty = ({ emptyMessage }) => (
  <S.EmptyState>
    <Text fontSize="base" fontWeight="bold" textAlign="center">
      Nenhum depósito encontrado
    </Text>
    {emptyMessage ? (
      <Text fontSize="sm" textAlign="center">
        {emptyMessage}
      </Text>
    ) : null}
    <S.EmptyImage source={noActivitiesImage} />
  </S.EmptyState>
);

export const DepositsError = ({ retry, errorMessage }) => (
  <S.ErrorState>
    <Text fontSize="base" fontWeight="bold" textAlign="center">
      Não foi possível carregar os depósitos
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

export const DepositsList = ({
  data,
  paddingBottom,
  onEndReached,
  isFetchingNextPage,
  onRefresh,
  isRefreshing,
  emptyMessage,
  onPressItem,
}) => {
  const theme = useTheme();

  return (
    <S.List
      data={data}
      keyExtractor={(item, index) => String(item?.id ?? index)}
      renderItem={({ item }) => (
        <DepositItem item={item} onPress={onPressItem} />
      )}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.4}
      ListFooterComponent={
        <FlatListFooter isLoading={isFetchingNextPage} />
      }
      ListEmptyComponent={<DepositsEmpty emptyMessage={emptyMessage} />}
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
