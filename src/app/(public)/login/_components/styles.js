import styled from "styled-components/native";
import { DEFAULT_PADDING } from "@/components/layout-constants";

export const Container = styled.ScrollView.attrs(({ theme }) => ({
  keyboardShouldPersistTaps: "handled",
  alwaysBounceVertical: false,
  contentContainerStyle: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: theme.colors.cream,
    paddingHorizontal: DEFAULT_PADDING,
    paddingVertical: 32,
    gap: 32,
  },
}))`
  flex: 1;
  width: 100%;
`;

export const Brand = styled.View`
  align-items: center;
  gap: 12px;
`;

export const Description = styled.View`
  max-width: 214px;
  margin: 0 auto;
`;

export const LogoMark = styled.View`
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.colors.teal};
  align-items: center;
  justify-content: center;
`;

export const Title = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: baseline;
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
