import { Pressable, Text } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Plus } from "lucide-react-native";
import { TabScreen } from "@/components/med/TabScreen";
import { HomeTab } from "@/components/med/klinik/HomeTab";
import { s } from "@/components/med/klinik/styles";
import { colors } from "@/lib/theme";

export default function KlinikHome() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const openNew = () =>
    router.navigate({
      pathname: "/ogrenci/klinik/logbook",
      params: { mode: "new" },
    });

  return (
    <TabScreen
      style={s.root}
      fab={
        <Pressable
          onPress={openNew}
          style={({ pressed }) => [
            s.fab,
            { bottom: 72 + Math.max(insets.bottom, 8) },
            pressed && { transform: [{ scale: 0.95 }] },
          ]}
        >
          <Plus size={20} color={colors.kouForeground} />
          <Text style={s.fabText}>İşlem Ekle</Text>
        </Pressable>
      }
    >
      <HomeTab onOpenLogbook={openNew} />
    </TabScreen>
  );
}
