import styled from "styled-components/native";
import { DEFAULT_PADDING } from "@/components/layout-constants";

export const Container = styled.View`
  flex-grow: 1;
  width: 100%;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.cream};
  padding: 32px ${DEFAULT_PADDING}px;
  gap: 32px;
`;

export const Form = styled.View`
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

export const Actions = styled.View`
  margin-top: 16px;
`;

export const Support = styled.View`
  align-items: center;
  gap: 4px;
`;
