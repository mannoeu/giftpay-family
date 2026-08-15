import { Keyboard } from "react-native";
import { Fragment } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { changePassword } from "@/mutations/changePassword";
import { Field } from "@/components/field";
import { Button } from "@/components/ui/button";
import { InputPassword } from "@/components/ui/input";
import { firstAccessFormScheme } from "@/zodSchemes";
import { PasswordRules } from "../PasswordRules";
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
    },
  });

  const onSubmit = (values) => {
    Keyboard.dismiss();
    if (isPending) return;
    mutate({ password: values.password });
  };

  return (
    <Fragment>
      <S.Form>
        <Field
          component={
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <InputPassword
                  placeholder="Nova senha"
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
    </Fragment>
  );
};
