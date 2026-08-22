import styled from "styled-components/native";

import { Text } from "@/components/ui/text";

export const Container = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
`;

export const IconCircle = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 40px;
  background-color: ${({ $color, theme }) => $color || theme.colors.teal};
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const Letter = styled(Text)`
  color: ${({ theme }) => theme.colors.white};
  font-family: Outfit-SemiBold;
  flex-shrink: 0;
`;

export const Title = styled(Text)`
  color: ${({ $color, theme }) => $color || theme.colors.charcoal};
`;

export const Amount = styled(Text)`
  color: ${({ $color, theme }) => $color || theme.colors.charcoal};
`;

export const TextGroup = styled.View`
  flex: 1;
  gap: 2px;
`;

export const Value = styled.View`
  flex-shrink: 0;
  margin-left: 8px;
`;
