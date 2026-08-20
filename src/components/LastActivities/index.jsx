import { Fragment } from "react";
import { Link } from "expo-router";
import { RefreshCw } from "lucide-react-native";
import { useTheme } from "styled-components/native";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { Transaction, TransactionSkeleton } from "@/components/Transaction";
import { useLastActivitiesQuery } from "@/queries/lastActivities";
import noActivitiesImage from "@/assets/images/no-activities.png";

import {
  getLastActivitiesView,
  LastActivitiesView,
  getExtractHref,
} from "./view";
import * as S from "./styles";

const SKELETON_COUNT = 5;

const Title = () => {
  const theme = useTheme();

  return (
    <Text fontSize="sm" color={theme.colors.stone}>
      Últimas atividades
    </Text>
  );
};

const LoadingList = () =>
  Array.from({ length: SKELETON_COUNT }).map((_, index) => (
    <Fragment key={`last-activities-skeleton-${index}`}>
      {index > 0 ? <Separator /> : null}
      <TransactionSkeleton />
    </Fragment>
  ));

const EmptyContent = ({ emptyMessage }) => (
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

const ErrorContent = ({ retry, errorMessage }) => (
  <S.ErrorState>
    <Text fontSize="base" fontWeight="bold" textAlign="center">
      Não foi possível carregar as atividades
    </Text>
    {errorMessage ? (
      <Text fontSize="sm" textAlign="center">
        {errorMessage}
      </Text>
    ) : null}
    <Button variant="outline" icon={<RefreshCw />} onPress={retry}></Button>
  </S.ErrorState>
);

const ActivitiesList = ({ data }) =>
  data?.map((item, index) => (
    <Fragment key={item?.id ?? index}>
      {index > 0 ? <Separator /> : null}
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
    </Fragment>
  ));

const SeeMore = ({ href }) => {
  const theme = useTheme();

  return (
    <S.Footer>
      <Link href={href}>
        <Text
          fontSize="sm"
          decoration="underline"
          color={theme.colors.charcoal}
        >
          Ver mais
        </Text>
      </Link>
    </S.Footer>
  );
};

export const LastActivities = ({
  parentId,
  emptyMessage,
  errorMessage = "Por favor, tente novamente. Caso o problema persista, contate o suporte.",
}) => {
  const {
    data = [],
    isPending,
    isError,
    refetch,
  } = useLastActivitiesQuery({
    parentId,
  });
  const view = getLastActivitiesView({
    loading: isPending,
    error: isError,
    data,
  });

  return (
    <Card>
      <S.Header>
        <Title />
      </S.Header>

      <S.Body>
        {view === LastActivitiesView.loading ? <LoadingList /> : null}
        {view === LastActivitiesView.empty ? (
          <EmptyContent emptyMessage={emptyMessage} />
        ) : null}
        {view === LastActivitiesView.error ? (
          <ErrorContent retry={refetch} errorMessage={errorMessage} />
        ) : null}
        {view === LastActivitiesView.data ? (
          <ActivitiesList data={data} />
        ) : null}
      </S.Body>

      {view === LastActivitiesView.data ? (
        <SeeMore href={getExtractHref(parentId)} />
      ) : null}
    </Card>
  );
};
