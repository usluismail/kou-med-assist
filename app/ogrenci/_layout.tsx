import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { RequireRole } from "@/components/med/RequireRole";
import { colors } from "@/lib/theme";

export default function OgrenciLayout() {
  return (
    <RequireRole role="student">
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }} edges={["left", "right"]}>
        <Stack screenOptions={{ headerShown: false, animation: "none" }} />
      </SafeAreaView>
    </RequireRole>
  );
}
