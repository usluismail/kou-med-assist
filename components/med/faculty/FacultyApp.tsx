import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ClipboardCheck, LogOut, Megaphone, ScanLine } from "lucide-react-native";
import { AppTabBar } from "../AppTabBar";
import { useAuth } from "@/lib/api/AuthContext";
import { usePendingApprovals } from "@/lib/api/hooks";
import { colors } from "@/lib/theme";
import { AnnouncementConsole } from "./AnnouncementConsole";
import { ApprovalList } from "./ApprovalList";
import { Scanner } from "./Scanner";
import { styles } from "./styles";

type Tab = "pending" | "scanner" | "announce";

export function FacultyApp() {
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pending = usePendingApprovals();
  const [tab, setTab] = useState<Tab>("pending");
  const [profileOpen, setProfileOpen] = useState(false);
  const pendingCount = pending.data?.length ?? 0;

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
    <View style={styles.root}>
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

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 88 + Math.max(insets.bottom, 8) }]}
        showsVerticalScrollIndicator={false}
      >
        {tab === "pending" && (
          <ApprovalList
            items={pending.data}
            loading={pending.loading}
            error={pending.error}
            onRetry={pending.reload}
            onChanged={pending.reload}
          />
        )}
        {tab === "scanner" && <Scanner onApproved={pending.reload} />}
        {tab === "announce" && <AnnouncementConsole />}
      </ScrollView>

      <AppTabBar
        active={tab}
        onChange={setTab}
        bottomInset={insets.bottom}
        tabs={[
          { key: "pending", label: `Karneler (${pendingCount})`, icon: ClipboardCheck },
          { key: "scanner", label: "QR", icon: ScanLine },
          { key: "announce", label: "Duyuru", icon: Megaphone },
        ]}
      />
    </View>
  );
}
