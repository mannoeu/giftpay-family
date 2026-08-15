import * as S from "./styles";

export const Card = ({ children, ...rest }) => (
  <S.Container {...rest}>{children}</S.Container>
);
