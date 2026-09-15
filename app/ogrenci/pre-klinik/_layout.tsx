import { Redirect, Tabs } from "expo-router";
import { Calendar, GraduationCap, Home, User } from "lucide-react-native";
import { RouterTabBar } from "@/components/med/RouterTabBar";
import { useAuth } from "@/lib/api/AuthContext";
import { studentArea, studentHomeHref } from "@/lib/nav";
import { colors } from "@/lib/theme";

export default function PreKlinikLayout() {
  const { user } = useAuth();
  const period = user?.role === "student" ? user.period : undefined;
  if (studentArea(period) !== "pre-klinik") {
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
            index: { label: "Ana Sayfa", icon: Home, href: "/ogrenci/pre-klinik" },
            program: { label: "Ders Prog.", icon: Calendar, href: "/ogrenci/pre-klinik/program" },
            notlar: { label: "Notlarım", icon: GraduationCap, href: "/ogrenci/pre-klinik/notlar" },
            profil: { label: "Profil", icon: User, href: "/ogrenci/pre-klinik/profil" },
          }}
        />
      )}
    />
  );
}
