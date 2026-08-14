import { TouchableWithoutFeedback } from "react-native";

import { Text } from "@/components/ui/text";

import * as S from "./styles";

export const Checkbox = ({ onChange, checked, label }) => {
  return (
    <TouchableWithoutFeedback
      acessible={false}
      onPress={(event) => {
        event.stopPropagation();
        onChange(!checked);
      }}
    >
      <S.Container>
        <S.CheckboxComponent onValueChange={onChange} value={checked} />
        {label && <Text style={{ userSelect: "none" }}>{label}</Text>}
      </S.Container>
    </TouchableWithoutFeedback>
  );
};
