import * as S from "./styles";

export const Card = ({ children, gap = 16, ...rest }) => (
  <S.Container $gap={gap} {...rest}>
    {children}
  </S.Container>
);
