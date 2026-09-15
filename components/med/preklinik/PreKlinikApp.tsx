import { useState } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Calendar, GraduationCap, Home, User } from "lucide-react-native";
import { AppTabBar } from "../AppTabBar";
import { MessageSheet } from "../MessageSheet";
import { GradesTab } from "./GradesTab";
import { HomeTab } from "./HomeTab";
import { ProfileTab } from "./ProfileTab";
import { ScheduleTab } from "./ScheduleTab";
import { s } from "./styles";

type Tab = "home" | "schedule" | "grades" | "profile";

export function PreKlinikApp() {
  const [tab, setTab] = useState<Tab>("home");
  const [messageOpen, setMessageOpen] = useState(false);
  const insets = useSafeAreaInsets();

  return (
    <View style={s.root}>
      <ScrollView
        style={s.scroll}
        contentContainerStyle={[s.scrollContent, { paddingBottom: 88 + Math.max(insets.bottom, 8) }]}
        showsVerticalScrollIndicator={false}
      >
        {tab === "home" && <HomeTab onOpenMessage={() => setMessageOpen(true)} />}
        {tab === "schedule" && <ScheduleTab />}
        {tab === "grades" && <GradesTab />}
        {tab === "profile" && <ProfileTab onOpenMessage={() => setMessageOpen(true)} />}
      </ScrollView>

      <AppTabBar
        active={tab}
        onChange={setTab}
        bottomInset={insets.bottom}
        tabs={[
          { key: "home", label: "Ana Sayfa", icon: Home },
          { key: "schedule", label: "Ders Prog.", icon: Calendar },
          { key: "grades", label: "Notlarım", icon: GraduationCap },
          { key: "profile", label: "Profil", icon: User },
        ]}
      />

      <MessageSheet open={messageOpen} onClose={() => setMessageOpen(false)} />
    </View>
  );
}
