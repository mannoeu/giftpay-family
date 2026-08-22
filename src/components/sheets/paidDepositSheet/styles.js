import styled from "styled-components/native";

export const Container = styled.View`
  flex-direction: column;
  gap: 16px;
`;

export const Meta = styled.View`
  flex-direction: row;
  align-items: flex-start;
  gap: 10px;
`;

export const MetaTexts = styled.View`
  flex: 1;
  gap: 2px;
`;

export const Image = styled.Image.attrs({
  resizeMode: "contain",
})`
  width: 220px;
  height: 180px;
  margin-horizontal: auto;
`;
