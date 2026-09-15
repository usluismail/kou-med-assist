import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Calendar, ClipboardList, Home, Plus, Stethoscope, User } from "lucide-react-native";
import { AppTabBar } from "../AppTabBar";
import { Logbook, QrSheet, type QrInfo } from "../LogbookScreen";
import { colors } from "@/lib/theme";
import { Dashboard } from "./Dashboard";
import { OsceStudent } from "./OsceStudent";
import { Profile } from "./Profile";
import { ShiftsScreen, SwapSheet } from "./ShiftsScreen";
import { styles } from "./styles";

type Tab = "home" | "logbook" | "shifts" | "osce" | "profile";

export function InternApp() {
  const [tab, setTab] = useState<Tab>("home");
  const [qrInfo, setQrInfo] = useState<QrInfo | null>(null);
  const [swapOpen, setSwapOpen] = useState(false);
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 88 + Math.max(insets.bottom, 8) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {tab === "home" && (
          <Dashboard onSwap={() => setSwapOpen(true)} onLog={() => setTab("logbook")} />
        )}
        {tab === "logbook" && (
          <Logbook onQrCreated={(info) => setQrInfo(info)} initialTab="list" />
        )}
        {tab === "shifts" && <ShiftsScreen onSwap={() => setSwapOpen(true)} />}
        {tab === "osce" && <OsceStudent />}
        {tab === "profile" && <Profile />}
      </ScrollView>

      {tab === "home" && (
        <Pressable
          onPress={() => setTab("logbook")}
          style={({ pressed }) => [
            styles.fab,
            { bottom: 72 + Math.max(insets.bottom, 8) },
            pressed && { transform: [{ scale: 0.95 }] },
          ]}
        >
          <Plus size={20} color={colors.kouForeground} />
          <Text style={styles.fabText}>Log Ekle</Text>
        </Pressable>
      )}

      <AppTabBar
        active={tab}
        onChange={setTab}
        bottomInset={insets.bottom}
        tabs={[
          { key: "home", label: "Ana Sayfa", icon: Home },
          { key: "logbook", label: "Karne", icon: ClipboardList },
          { key: "shifts", label: "Nöbet", icon: Calendar },
          { key: "osce", label: "OSCE", icon: Stethoscope },
          { key: "profile", label: "Profil", icon: User },
        ]}
      />

      <QrSheet open={!!qrInfo} info={qrInfo} onClose={() => setQrInfo(null)} />
      <SwapSheet open={swapOpen} onClose={() => setSwapOpen(false)} />
    </View>
  );
}

/** Eski import yolu için */
export { InternApp as StudentApp };
