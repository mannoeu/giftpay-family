import { Keyboard } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { changePassword } from "@/mutations/changePassword";
import { Field } from "@/components/field";
import { Button } from "@/components/ui/button";
import { firstAccessFormScheme } from "@/zodSchemes";
import { PasswordRules } from "./PasswordRules";
import * as S from "./styles";

const formScheme = firstAccessFormScheme();

export const Form = () => {
  const { mutate, isPending } = changePassword();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formScheme),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values) => {
    Keyboard.dismiss();
    if (isPending) return;
    mutate({ password: values.password });
  };

  return (
    <>
      <S.Form>
        <Field
          component={
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <S.PasswordInput
                  placeholder="Nova senha"
                  secureTextEntry
                  autoCapitalize="none"
                  textContentType="newPassword"
                  autoComplete="password-new"
                  onBlur={field.onBlur}
                  onChangeText={field.onChange}
                  value={field.value}
                />
              )}
            />
          }
          error={errors.password && errors.password.message}
        />
        <Field
          component={
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <S.PasswordInput
                  placeholder="Confirmar nova senha"
                  secureTextEntry
                  autoCapitalize="none"
                  textContentType="newPassword"
                  autoComplete="password-new"
                  onBlur={field.onBlur}
                  onChangeText={field.onChange}
                  value={field.value}
                  onKeyPress={(event) => {
                    if (event.nativeEvent.key === "Enter") {
                      handleSubmit(onSubmit)();
                    }
                  }}
                />
              )}
            />
          }
          error={errors.confirmPassword && errors.confirmPassword.message}
        />
      </S.Form>

      <PasswordRules control={control} />

      <S.Actions>
        <Button
          size="lg"
          onPress={handleSubmit(onSubmit)}
          loading={isPending}
          style={{ width: "100%" }}
        >
          Salvar e continuar
        </Button>
      </S.Actions>
    </>
  );
};
