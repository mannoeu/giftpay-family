import { usePushNotificationPermissionPrompt } from "@/hooks/usePushNotificationPermissionPrompt";

import { SafeHorizontalPadding } from "@/components/ui/safe-horizontal-padding";

import { Layout } from "./_components/Layout";
import { TopHeader } from "./_components/TopHeader";
import { Dependents } from "./_components/Dependents";
import { FamilyWallet } from "./_components/FamilyWallet";

export default function HomeScreen() {
  usePushNotificationPermissionPrompt();

  return (
    <Layout>
      <SafeHorizontalPadding>
        <TopHeader />
      </SafeHorizontalPadding>

      <Dependents />

      <SafeHorizontalPadding>
        <FamilyWallet />
      </SafeHorizontalPadding>
    </Layout>
  );
}
