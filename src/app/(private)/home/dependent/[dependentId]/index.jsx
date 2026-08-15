import { useLocalSearchParams } from "expo-router";

import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { SafeHorizontalPadding } from "@/components/ui/safe-horizontal-padding";
import { Header } from "@/components/header";
import { MemberAvatar } from "@/components/ui/memberAvatar";

export default function DependentScreen() {
  const { dependentId } = useLocalSearchParams();

  return (
    <View style={{ gap: 16 }}>
      <Header title="Voltar" defaultBackRoute="/home" />
      <SafeHorizontalPadding>
        <View style={{ alignItems: "center", flexDirection: "row", gap: 8 }}>
          <MemberAvatar size="md" letter="J" color="#557FEA" />
          <View>
            <Text fontWeight="semibold">João</Text>
            <Text fontSize="sm">Sem cartão vinculado</Text>
          </View>
        </View>
      </SafeHorizontalPadding>

      <SafeHorizontalPadding>
        <Text>Dependend ID: {dependentId}</Text>
      </SafeHorizontalPadding>
    </View>
  );
}
