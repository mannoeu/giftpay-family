import { Text } from "react-native";

import { usePushNotificationPermissionPrompt } from "@/hooks/usePushNotificationPermissionPrompt";

import { Layout } from "./_components/Layout";
import { TopHeader } from "./_components/TopHeader";

export default function HomeScreen() {
  usePushNotificationPermissionPrompt();

  return (
    <Layout>
      <TopHeader />
      <Text>Home</Text>
    </Layout>
  );
}
