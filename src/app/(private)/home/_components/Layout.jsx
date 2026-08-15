import { useTabBarBottomPadding } from "@/hooks/useTabBarBottomPadding";
import { Container } from "./styles";

export const Layout = ({ children }) => {
  const paddingBottom = useTabBarBottomPadding();

  return (
    <Container
      $paddingBottom={paddingBottom}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </Container>
  );
};
