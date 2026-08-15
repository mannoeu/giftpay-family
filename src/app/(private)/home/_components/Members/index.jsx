import {
  MemberAvatarAdd,
  MemberAvatarButton,
} from "@/components/ui/memberAvatar";

import * as S from "./styles";

export const Members = () => {
  return (
    <S.Container>
      <S.HorizontalScroll>
        <MemberAvatarButton name="Família" label="Todos" selected disabled />
        <MemberAvatarButton name="João" color="#557FEA" onPress={() => {}} />
        <MemberAvatarButton name="Maria" color="#C06990" onPress={() => {}} />
        <MemberAvatarAdd onPress={() => {}} />
      </S.HorizontalScroll>
    </S.Container>
  );
};
