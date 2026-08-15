import { useTabBarBottomPadding } from "@/hooks/useTabBarBottomPadding";
import * as S from "./styles";

export const Layout = ({ children }) => {
  const paddingBottom = useTabBarBottomPadding();

  return (
    <S.Container
      $paddingBottom={paddingBottom}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </S.Container>
  );
};
