import { useWatch } from "react-hook-form";
import { useTheme } from "styled-components/native";
import { Check } from "lucide-react-native";

import { Text } from "@/components/ui/text";
import { evaluatePasswordRules } from "@/sdk/password";
import * as S from "./styles";

const PasswordRule = ({ met, label }) => {
  const theme = useTheme();

  return (
    <S.RuleRow>
      <S.RuleDot met={met}>
        {met ? (
          <Check size={10} color={theme.colors.white} strokeWidth={3} />
        ) : null}
      </S.RuleDot>
      <Text fontSize="sm" color={theme.colors.mutedForeground}>
        {label}
      </Text>
    </S.RuleRow>
  );
};

export const PasswordRules = ({ control }) => {
  const password = useWatch({ control, name: "password" });
  const rules = evaluatePasswordRules(password);

  return (
    <S.Rules>
      {rules.map((rule) => (
        <PasswordRule key={rule.id} met={rule.met} label={rule.label} />
      ))}
    </S.Rules>
  );
};
