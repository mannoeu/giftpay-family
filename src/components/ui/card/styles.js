import styled from "styled-components/native";

export const Container = styled.View`
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.mint};
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 16px;
  padding: 16px;
  flex-direction: column;
  gap: 16px;
`;
