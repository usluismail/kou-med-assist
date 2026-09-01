import { Redirect, Tabs } from "expo-router";
import { Calendar, ClipboardList, Home, Stethoscope, User } from "lucide-react-native";
import { RouterTabBar } from "@/components/med/RouterTabBar";
import { useAuth } from "@/lib/api/AuthContext";
import { studentArea, studentHomeHref } from "@/lib/nav";
import { colors } from "@/lib/theme";

export default function IntornLayout() {
  const { user } = useAuth();
  const period = user?.role === "student" ? user.period : undefined;
  if (studentArea(period) !== "intorn") {
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
            index: { label: "Ana Sayfa", icon: Home, href: "/ogrenci/intorn" },
            karne: { label: "Karne", icon: ClipboardList, href: "/ogrenci/intorn/karne" },
            nobet: { label: "Nöbet", icon: Calendar, href: "/ogrenci/intorn/nobet" },
            osce: { label: "OSCE", icon: Stethoscope, href: "/ogrenci/intorn/osce" },
            profil: { label: "Profil", icon: User, href: "/ogrenci/intorn/profil" },
          }}
        />
      )}
    />
  );
}
