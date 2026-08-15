import { useLocalSearchParams } from "expo-router";

import { ScrollView, View } from "react-native";
import { Text } from "@/components/ui/text";
import { SafeHorizontalPadding } from "@/components/ui/safe-horizontal-padding";
import { Header } from "@/components/header";
import { MemberAvatar } from "@/components/ui/userAvatar";
import { useTabBarBottomPadding } from "@/hooks/useTabBarBottomPadding";

export default function DependentScreen() {
  const { dependentId } = useLocalSearchParams();
  const paddingBottom = useTabBarBottomPadding();

  return (
    <View style={{ flex: 1 }}>
      <Header title="Voltar" defaultBackRoute="/home" />
      <ScrollView
        contentContainerStyle={{ gap: 16, paddingTop: 16, paddingBottom }}
      >
        <SafeHorizontalPadding>
          <View style={{ alignItems: "center", flexDirection: "row", gap: 8 }}>
            <MemberAvatar size="md" letter="J" color="#557FEA" />
            <View>
              <Text fontWeight="semibold">João</Text>
              <Text fontSize="sm">Sem cartão vinculado</Text>
            </View>
          </View>
        </SafeHorizontalPadding>

        {Array.from({ length: 100 }).map((_, index) => (
          <SafeHorizontalPadding key={index}>
            <Text>
              Dependend ID: idx{index} {dependentId}
            </Text>
          </SafeHorizontalPadding>
        ))}
      </ScrollView>
    </View>
  );
}
