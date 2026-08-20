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
