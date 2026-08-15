import { KeyboardAvoidingView } from "@/components/KeyboardAvoidingView";
import * as S from "./styles";

export const Layout = ({ children }) => {
  return (
    <KeyboardAvoidingView>
      <S.Container>{children}</S.Container>
    </KeyboardAvoidingView>
  );
};
