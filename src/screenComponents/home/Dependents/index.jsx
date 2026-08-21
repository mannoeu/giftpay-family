import { useRouter } from "expo-router";

import {
  UserAvatarAdd,
  UserAvatarButton,
  UserAvatarButtonSkeleton,
} from "@/components/ui/userAvatar";
import { useDependentsQuery } from "@/queries/dependents";
import { AddDependentSheet } from "@/screenComponents/home/AddDependentSheet";
import { useSheet } from "@/store/sheet";

import * as S from "./styles";

export const Dependents = () => {
  const router = useRouter();
  const openSheet = useSheet((state) => state.openSheet);
  const { data: dependents, isReady } = useDependentsQuery();

  if (!isReady) return <DependentsSkeleton />;

  return (
    <S.Container>
      <S.HorizontalScroll>
        <UserAvatarButton name="Família" label="Todos" selected disabled />
        {dependents?.map((dependent) => (
          <UserAvatarButton
            key={dependent.id}
            name={dependent.name}
            color={dependent.color}
            onPress={() => router.push(`/home/dependent/${dependent.id}`)}
          />
        ))}
        <UserAvatarAdd onPress={() => openSheet(<AddDependentSheet />)} />
      </S.HorizontalScroll>
    </S.Container>
  );
};

export const DependentsSkeleton = () => (
  <S.Container>
    <S.SkeletonContainer>
      {Array.from({ length: 4 }).map((_, index) => (
        <UserAvatarButtonSkeleton
          key={`dependents-skeleton-${index}`}
          name
          size="lg"
        />
      ))}
    </S.SkeletonContainer>
  </S.Container>
);
