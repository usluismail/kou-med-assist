import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Calendar, ClipboardList, Home, Plus, User } from "lucide-react-native";
import { AppTabBar } from "../AppTabBar";
import { Logbook, QrSheet, type QrInfo } from "../LogbookScreen";
import { MessageSheet } from "../MessageSheet";
import { useAuth } from "@/lib/api/AuthContext";
import { colors } from "@/lib/theme";
import { HomeTab } from "./HomeTab";
import { ProfileTab } from "./ProfileTab";
import { ScheduleTab } from "./ScheduleTab";
import { s } from "./styles";

type Tab = "home" | "schedule" | "logbook" | "profile";

export function KlinikApp() {
  const [tab, setTab] = useState<Tab>("home");
  const [logbookMode, setLogbookMode] = useState<"list" | "new">("list");
  const [qrInfo, setQrInfo] = useState<QrInfo | null>(null);
  const [messageOpen, setMessageOpen] = useState(false);
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const openLogbook = (mode: "list" | "new" = "list") => {
    setLogbookMode(mode);
    setTab("logbook");
  };

  return (
    <View style={s.root}>
      <ScrollView
        style={s.scroll}
        contentContainerStyle={[s.scrollContent, { paddingBottom: 88 + Math.max(insets.bottom, 8) }]}
        showsVerticalScrollIndicator={false}
      >
        {tab === "home"     && <HomeTab onOpenLogbook={() => openLogbook("new")} />}
        {tab === "schedule" && <ScheduleTab />}
        {tab === "logbook"  && (
          <Logbook
            initialTab={logbookMode}
            title="Staj Logbook"
            subtitle={user?.role === "student" ? user.rotation : undefined}
            headerBackground={colors.primaryDark}
            segmentActiveColor={colors.primary}
            onQrCreated={(info) => setQrInfo(info)}
          />
        )}
        {tab === "profile"  && <ProfileTab onOpenMessage={() => setMessageOpen(true)} />}
      </ScrollView>

      {tab === "home" && (
        <Pressable
          onPress={() => openLogbook("new")}
          style={({ pressed }) => [
            s.fab,
            { bottom: 72 + Math.max(insets.bottom, 8) },
            pressed && { transform: [{ scale: 0.95 }] },
          ]}
        >
          <Plus size={20} color={colors.kouForeground} />
          <Text style={s.fabText}>İşlem Ekle</Text>
        </Pressable>
      )}

      <AppTabBar
        active={tab}
        onChange={(key) => {
          if (key === "logbook") setLogbookMode("list");
          setTab(key);
        }}
        bottomInset={insets.bottom}
        tabs={[
          { key: "home", label: "Ana Sayfa", icon: Home },
          { key: "schedule", label: "Takvim", icon: Calendar },
          { key: "logbook", label: "Logbook", icon: ClipboardList },
          { key: "profile", label: "Profil", icon: User },
        ]}
      />

      <MessageSheet open={messageOpen} onClose={() => setMessageOpen(false)} defaultRecipient="internship_supervisor" />
      <QrSheet open={!!qrInfo} info={qrInfo} onClose={() => setQrInfo(null)} />
    </View>
  );
}
