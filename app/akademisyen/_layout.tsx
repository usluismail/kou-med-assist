import { Tabs } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FacultyHeader } from "@/components/med/faculty/FacultyHeader";
import { FacultyTabBar } from "@/components/med/faculty/FacultyTabBar";
import { RequireRole } from "@/components/med/RequireRole";
import { colors } from "@/lib/theme";

export default function AkademisyenLayout() {
  return (
    <RequireRole role="faculty">
      <SafeAreaView
        style={{ flex: 1, backgroundColor: colors.clinical }}
        edges={["top", "left", "right"]}
      >
        <FacultyHeader />
        <View style={{ flex: 1 }}>
          <Tabs
            screenOptions={{
              headerShown: false,
              sceneStyle: { backgroundColor: colors.background },
            }}
            tabBar={(props) => <FacultyTabBar {...props} />}
          />
        </View>
      </SafeAreaView>
    </RequireRole>
  );
}
