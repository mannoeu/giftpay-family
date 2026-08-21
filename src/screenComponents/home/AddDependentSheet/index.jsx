import { useState } from "react";
import { Keyboard } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTheme } from "styled-components/native";
import { SvgXml } from "react-native-svg";

import { Field } from "@/components/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { UserAvatarButton } from "@/components/ui/userAvatar";
import { ADD_DEPENDENT_SUCCESS_XML } from "@/assets/images/addDependentSuccessXml";
import { createDependent } from "@/mutations/createDependent";
import {
  AVATAR_COLORS,
  buildCreateDependentPayload,
} from "@/sdk/dependent";
import { Formatter } from "@/sdk/formatter";
import { useSheet } from "@/store/sheet";
import { addDependentFormScheme } from "@/zodSchemes";

import { getAddDependentSuccessCopy } from "./view";
import * as S from "./styles";

const formScheme = addDependentFormScheme();

export const AddDependentSheet = () => {
  const theme = useTheme();
  const closeSheet = useSheet((state) => state.closeSheet);
  const { mutate, isPending } = createDependent();

  const [step, setStep] = useState("form");
  const [createdName, setCreatedName] = useState("");

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(formScheme),
    defaultValues: {
      name: "",
      birthDate: "",
      color: AVATAR_COLORS[0],
    },
  });

  const name = watch("name");
  const selectedColor = watch("color");
  const successCopy = getAddDependentSuccessCopy(createdName);

  const onSubmit = (values) => {
    Keyboard.dismiss();
    if (isPending) return;

    mutate(
      { data: buildCreateDependentPayload(values) },
      {
        onSuccess: (dependent) => {
          setCreatedName(dependent.name);
          setStep("success");
        },
        onError: (error) => {
          error.feedback?.dispatch();
        },
      },
    );
  };

  if (step === "success") {
    return (
      <S.Container>
        <S.SuccessContent>
          <Text fontSize="xl" fontWeight="bold" textAlign="center">
            {successCopy.title}
          </Text>
          <Text textAlign="center" color={theme.colors.stone}>
            {successCopy.body}
          </Text>
        </S.SuccessContent>

        <S.IllustrationWrap>
          <SvgXml xml={ADD_DEPENDENT_SUCCESS_XML} width={200} height={192} />
        </S.IllustrationWrap>

        <S.Actions>
          <Button
            style={{ flexGrow: 1 }}
            size="lg"
            variant="outline"
            onPress={closeSheet}
          >
            Agora não
          </Button>
          <Button style={{ flexGrow: 1 }} size="lg" onPress={closeSheet}>
            Ver Perfil
          </Button>
        </S.Actions>
      </S.Container>
    );
  }

  return (
    <S.Container>
      <S.Header>
        <Text fontSize="xl" fontWeight="bold">
          Novo filho
        </Text>
      </S.Header>

      <S.AvatarSection>
        <Text fontSize="sm" fontWeight="semibold">
          Escolha um avatar
        </Text>
        <S.AvatarRow>
          {AVATAR_COLORS.map((color) => (
            <UserAvatarButton
              key={color}
              name={name}
              color={color}
              size="md"
              selected={selectedColor === color}
              showName={false}
              onPress={() => setValue("color", color, { shouldValidate: true })}
            />
          ))}
        </S.AvatarRow>
      </S.AvatarSection>

      <S.Fields>
        <Field
          component={
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  insideBottomSheet
                  placeholder="Nome"
                  autoCapitalize="words"
                  onBlur={field.onBlur}
                  onChangeText={field.onChange}
                  value={field.value}
                />
              )}
            />
          }
          error={errors.name?.message}
        />
        <Field
          component={
            <Controller
              name="birthDate"
              control={control}
              render={({ field }) => (
                <Input
                  insideBottomSheet
                  inputMode="numeric"
                  placeholder="Data de nascimento"
                  onBlur={field.onBlur}
                  onChangeText={(text) =>
                    field.onChange(Formatter.birthDate(text))
                  }
                  value={field.value}
                />
              )}
            />
          }
          error={errors.birthDate?.message}
        />
      </S.Fields>

      <Text fontSize="xs" color={theme.colors.stone}>
        As carteiras de Lanche e Mesada são criadas automaticamente com saldo
        zero. Você poderá vincular um cartão depois.
      </Text>

      <Button
        size="lg"
        loading={isPending}
        disabled={!isValid || isPending}
        onPress={handleSubmit(onSubmit)}
      >
        Cadastrar
      </Button>
    </S.Container>
  );
};
