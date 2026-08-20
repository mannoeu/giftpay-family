import { usePushNotificationPermissionPrompt } from "@/hooks/usePushNotificationPermissionPrompt";

import { SafeHorizontalPadding } from "@/components/ui/safe-horizontal-padding";
import { LastActivities } from "@/components/LastActivities";

import { Layout } from "@/screenComponents/home/Layout";
import { TopHeader } from "@/screenComponents/home/TopHeader";
import { Dependents } from "@/screenComponents/home/Dependents";
import { Wallet } from "@/screenComponents/home/Wallet";

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
