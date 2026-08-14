import { Text } from "react-native";

import { Button } from "@/components/ui/button";
import { handleLogout } from "@/sdk/session";

export default function HomeScreen() {
  return (
    <>
      <Text>Home</Text>
      <Button variant="outline" onPress={handleLogout}>
        Sair
      </Button>
    </>
  );
}
