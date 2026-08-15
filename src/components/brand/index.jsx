import { useTheme } from "styled-components/native";
import { Gift } from "lucide-react-native";

import { Text } from "@/components/ui/text";
import * as S from "./styles";

const BrandMark = ({ variant }) => {
  const theme = useTheme();
  const isInline = variant === "inline";

  return (
    <>
      <S.LogoMark $variant={variant}>
        <Gift
          size={isInline ? 20 : 28}
          color={theme.colors.white}
          strokeWidth={2}
        />
      </S.LogoMark>
      <S.Title $variant={variant}>
        <Text
          fontSize={isInline ? "lg" : "xxl"}
          fontWeight="bold"
          textAlign={isInline ? undefined : "center"}
        >
          GiftPay{" "}
        </Text>
        <Text
          fontSize={isInline ? "lg" : "xxl"}
          textAlign={isInline ? undefined : "center"}
        >
          Família
        </Text>
      </S.Title>
    </>
  );
};

export const LoginBrand = () => {
  const theme = useTheme();

  return (
    <S.Container $variant="stack">
      <BrandMark variant="stack" />
      <S.Description>
        <Text fontSize="md" color={theme.colors.stone} textAlign="center">
          O cartão dos seus filhos, sob o seu controle.
        </Text>
      </S.Description>
    </S.Container>
  );
};

export const FirstAccessBrand = () => {
  return (
    <S.Container $variant="inline">
      <BrandMark variant="inline" />
    </S.Container>
  );
};
