import { Text } from "react-native";

import { Layout } from "./_components/Layout";
import { TopHeader } from "./_components/TopHeader";

export default function HomeScreen() {
  return (
    <Layout>
      <TopHeader />
      <Text>Home</Text>
    </Layout>
  );
}
