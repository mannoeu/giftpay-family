import { usePushNotificationPermissionPrompt } from "@/hooks/usePushNotificationPermissionPrompt";

import { SafeHorizontalPadding } from "@/components/ui/safe-horizontal-padding";
import { LastActivities } from "@/components/LastActivities";

import { Layout } from "./_components/Layout";
import { TopHeader } from "./_components/TopHeader";
import { Dependents } from "./_components/Dependents";
import { Wallet } from "./_components/Wallet";

export default function HomeScreen() {
  usePushNotificationPermissionPrompt();

  return (
    <Layout>
      <SafeHorizontalPadding>
        <TopHeader />
      </SafeHorizontalPadding>

      <Dependents />

      <SafeHorizontalPadding>
        <Wallet />
      </SafeHorizontalPadding>

      <SafeHorizontalPadding>
        <LastActivities emptyMessage="Faça uma recarga para começar a usar os cartões" />
      </SafeHorizontalPadding>
    </Layout>
  );
}
