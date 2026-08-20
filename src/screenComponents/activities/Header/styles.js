import styled from "styled-components/native";

export const Container = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
`;

export const Title = styled.View`
  flex-shrink: 0;
`;

export const FilterIconWrap = styled.View`
  position: relative;
`;

export const FilterDot = styled.View`
  position: absolute;
  top: -2px;
  right: -2px;
  width: 8px;
  height: 8px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.danger};
  border-width: 1.5px;
  border-color: ${({ theme }) => theme.colors.white};
`;

export const FilterButton = styled.TouchableOpacity.attrs({
  activeOpacity: 0.75,
})`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.mint};
  border-radius: 100px;
  flex-shrink: 1;
`;
