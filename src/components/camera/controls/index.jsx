import React from "react";
import { Images, SwitchCamera } from "lucide-react-native";

import { BUTTON_DISABLED_OPACITY } from "@/components/camera/constants";
import * as S from "./styles";

const buttonProps = {
  disabledOpacity: BUTTON_DISABLED_OPACITY,
};

export const FlipCamera = React.memo(({ onPress }) => {
  return (
    <S.Button {...buttonProps} onPress={onPress}>
      <SwitchCamera size={24} color="white" />
    </S.Button>
  );
});

export const Gallery = React.memo(({ onPress }) => {
  return (
    <S.Button {...buttonProps} onPress={onPress}>
      <Images size={24} color="white" />
    </S.Button>
  );
});
