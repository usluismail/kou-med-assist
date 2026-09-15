import { useState } from "react";
import { Pressable, Text } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Plus } from "lucide-react-native";
import { TabScreen } from "@/components/med/TabScreen";
import { Dashboard } from "@/components/med/intern/Dashboard";
import { SwapSheet } from "@/components/med/intern/ShiftsScreen";
import { styles } from "@/components/med/intern/styles";
import { colors } from "@/lib/theme";

export default function IntornHome() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [swapOpen, setSwapOpen] = useState(false);

  return (
    <TabScreen
      style={styles.root}
      fab={
        <Pressable
          onPress={() => router.navigate("/ogrenci/intorn/karne")}
          style={({ pressed }) => [
            styles.fab,
            { bottom: 72 + Math.max(insets.bottom, 8) },
            pressed && { transform: [{ scale: 0.95 }] },
          ]}
        >
          <Plus size={20} color={colors.kouForeground} />
          <Text style={styles.fabText}>Log Ekle</Text>
        </Pressable>
      }
    >
      <Dashboard
        onSwap={() => setSwapOpen(true)}
        onLog={() => router.navigate("/ogrenci/intorn/karne")}
      />
      <SwapSheet open={swapOpen} onClose={() => setSwapOpen(false)} />
    </TabScreen>
  );
}
