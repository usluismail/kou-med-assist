import { Redirect, Tabs } from "expo-router";
import { Calendar, ClipboardList, Home, User } from "lucide-react-native";
import { RouterTabBar } from "@/components/med/RouterTabBar";
import { useAuth } from "@/lib/api/AuthContext";
import { studentArea, studentHomeHref } from "@/lib/nav";
import { colors } from "@/lib/theme";

export default function KlinikLayout() {
  const { user } = useAuth();
  const period = user?.role === "student" ? user.period : undefined;
  if (studentArea(period) !== "klinik") {
    return <Redirect href={studentHomeHref(period)} />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.background },
      }}
      tabBar={(props) => (
        <RouterTabBar
          {...props}
          items={{
            index: { label: "Ana Sayfa", icon: Home, href: "/ogrenci/klinik" },
            takvim: { label: "Takvim", icon: Calendar, href: "/ogrenci/klinik/takvim" },
            logbook: { label: "Logbook", icon: ClipboardList, href: "/ogrenci/klinik/logbook" },
            profil: { label: "Profil", icon: User, href: "/ogrenci/klinik/profil" },
          }}
        />
      )}
    />
  );
}
