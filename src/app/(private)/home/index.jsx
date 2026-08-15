import { usePushNotificationPermissionPrompt } from "@/hooks/usePushNotificationPermissionPrompt";

import { Text } from "@/components/ui/text";
import { Layout } from "./_components/Layout";
import { TopHeader } from "./_components/TopHeader";
import { Members } from "./_components/Members";

import { SafeHorizontalPadding } from "./_components/styles";

export default function HomeScreen() {
  usePushNotificationPermissionPrompt();

  return (
    <Layout>
      <SafeHorizontalPadding>
        <TopHeader />
      </SafeHorizontalPadding>

      <Members />

      <SafeHorizontalPadding>
        <Text>Home</Text>
      </SafeHorizontalPadding>
    </Layout>
  );
}
