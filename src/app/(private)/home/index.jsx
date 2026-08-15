import { usePushNotificationPermissionPrompt } from "@/hooks/usePushNotificationPermissionPrompt";

import { Text } from "@/components/ui/text";
import { SafeHorizontalPadding } from "@/components/ui/safe-horizontal-padding";
import { Layout } from "./_components/Layout";
import { TopHeader } from "./_components/TopHeader";
import { Members } from "./_components/Members";

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
