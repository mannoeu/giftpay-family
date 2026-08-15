import styled from "styled-components/native";

export const Container = styled.View`
  flex-direction: column;
  gap: 20px;
  align-items: center;
`;

export const IconWrapper = styled.View`
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.colors.mint};
  align-items: center;
  justify-content: center;
`;

export const Content = styled.View`
  flex-direction: column;
  gap: 8px;
`;

export const Actions = styled.View`
  margin-top: 16px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;
