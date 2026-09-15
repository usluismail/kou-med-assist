import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { LogOut } from "lucide-react-native";
import { useAuth } from "@/lib/api/AuthContext";
import { colors } from "@/lib/theme";
import { styles } from "./styles";

export function FacultyHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  const infoRows: Array<[string, string]> = [
    ["Ad Soyad", user?.name ?? "—"],
    ["E-posta", user?.email ?? "—"],
    ["Fakülte", user?.faculty ?? "—"],
    ["Birim", user?.department ?? "—"],
    ["Rol", "Akademisyen / Öğretim Üyesi"],
  ];

  return (
    <View style={styles.header}>
      <View style={styles.headerRow}>
        <Pressable
          style={styles.flex1}
          onPress={() => setProfileOpen((v) => !v)}
        >
          <Text style={styles.headerName} numberOfLines={1}>
            {user?.name ?? "Akademisyen"}
          </Text>
          <Text style={styles.headerSub} numberOfLines={1}>
            {user?.department ?? ""}
          </Text>
        </Pressable>
        <View style={styles.headerActions}>
          <View style={styles.headerPill}>
            <Text style={styles.headerPillText}>Hızlı Onay Paneli</Text>
          </View>
          <Pressable
            onPress={handleLogout}
            style={styles.headerLogout}
            hitSlop={8}
            accessibilityLabel="Hesaptan çıkış yap"
          >
            <LogOut size={16} color={colors.white} />
          </Pressable>
        </View>
      </View>
      {profileOpen ? (
        <View style={styles.facultyProfileCard}>
          <Text style={styles.facultyProfileTitle}>Genel Bilgiler</Text>
          <Text style={styles.facultyProfileHint}>
            API’den gelen kayıt — yalnızca görüntüleme
          </Text>
          {infoRows.map(([label, value]) => (
            <View key={label} style={styles.facultyInfoRow}>
              <Text style={styles.facultyInfoLabel}>{label}</Text>
              <Text style={styles.facultyInfoValue}>{value}</Text>
            </View>
          ))}
          <Pressable onPress={handleLogout} style={styles.facultyLogoutBtn}>
            <LogOut size={16} color={colors.danger} />
            <Text style={styles.facultyLogoutText}>Hesaptan Çıkış Yap</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}
