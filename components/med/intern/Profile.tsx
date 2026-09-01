import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LogOut, Wifi } from "lucide-react-native";
import { LoadingBlock } from "../StateViews";
import { useAuth } from "@/lib/api/AuthContext";
import { useProcedures } from "@/lib/api/hooks";
import type { StudentUser } from "@/lib/api/types";
import { colors } from "@/lib/theme";
import { styles } from "./styles";

export function Profile() {
  const { user, logout } = useAuth();
  // Bu bileşen RequireRole("student") altında render edilir → güvenli narrowing
  const student = user?.role === "student" ? (user as StudentUser) : null;
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const procedures = useProcedures();
  const integrations: Array<[string, string, boolean]> = [
    ["HBYS Hasta Protokol Servisi", "Bağlı", true],
    ["KOÜ Öğrenci Bilgi Sistemi (OBS)", "Bağlı", true],
    ["Offline SQLCipher Yerel Kasa", "Aktif · 2 kayıt", true],
    ["e-Nabız Girişim Doğrulama", "Bağlı değil", false],
  ];
  const procs = procedures.data ?? [];

  const infoRows: Array<[string, string]> = [
    ["Ad Soyad", user?.name ?? "—"],
    ["E-posta", user?.email ?? "—"],
    ["Öğrenci No", student?.studentNo ?? "—"],
    ["Fakülte", user?.faculty ?? "—"],
    ["Anabilim Dalı", user?.department ?? "—"],
    ["Rotasyon", student?.rotation ?? "—"],
    ["Rol", "Öğrenci / İntörn"],
  ];

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  return (
    <View>
      <View style={[styles.clinicalHeader, { paddingTop: insets.top + 16, paddingBottom: 24 }]}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarLg}>
            <Text style={styles.avatarLgText}>{user?.initials ?? "—"}</Text>
          </View>
          <View style={styles.headerTextWrap}>
            <Text style={styles.profileName} numberOfLines={1}>
              {user?.name ?? "—"}
            </Text>
            <Text style={styles.headerSub}>
              Öğrenci No: {student?.studentNo ?? "—"}
            </Text>
            <Text style={styles.headerSub}>{student?.rotation ?? ""}</Text>
          </View>
        </View>
      </View>
      <View style={styles.listPad}>
        <View style={styles.card}>
          <Text style={[styles.cardTitle, { marginBottom: 4 }]}>
            Genel Bilgiler
          </Text>
          <Text style={[styles.cardSub, { marginBottom: 12 }]}>
            API’den gelen kayıt — yalnızca görüntüleme
          </Text>
          {infoRows.map(([label, value], i) => (
            <View
              key={label}
              style={[
                styles.infoRow,
                i < infoRows.length - 1 && styles.infoRowBorder,
              ]}
            >
              <Text style={styles.infoLabel}>{label}</Text>
              <Text style={styles.infoValue} numberOfLines={2}>
                {value}
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.card}>
          <Text style={[styles.cardTitle, { marginBottom: 12 }]}>
            U-ÇEP Girişim Karnesi
          </Text>
          {procedures.loading && !procedures.data ? (
            <LoadingBlock label="Prosedürler yükleniyor…" />
          ) : null}
          {procs.map((p) => (
            <View key={p.id} style={styles.profileProc}>
              <View style={styles.rowBetween}>
                <Text style={styles.profileProcName} numberOfLines={1}>
                  {p.name}
                </Text>
                <Text
                  style={[
                    styles.profileProcCount,
                    { color: p.done === p.total ? colors.success : colors.kou },
                  ]}
                >
                  {p.done}/{p.total}
                </Text>
              </View>
              <View style={[styles.barTrack, { height: 8, marginTop: 4 }]}>
                <View
                  style={[
                    styles.barFill,
                    {
                      height: 8,
                      width: `${(p.done / p.total) * 100}%`,
                      backgroundColor: p.done === p.total ? colors.success : colors.kou,
                    },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>
        <View style={styles.card}>
          <Text style={[styles.cardTitle, { marginBottom: 12 }]}>Entegrasyonlar</Text>
          {integrations.map(([label, state, ok], i) => (
            <View
              key={label}
              style={[
                styles.integrationRow,
                i < integrations.length - 1 && styles.integrationBorder,
              ]}
            >
              <View style={styles.integrationLeft}>
                <Wifi
                  size={16}
                  color={ok ? colors.success : colors.mutedForeground}
                />
                <Text style={styles.integrationLabel} numberOfLines={1}>
                  {label}
                </Text>
              </View>
              <Text
                style={[
                  styles.integrationState,
                  { color: ok ? colors.success : colors.mutedForeground },
                ]}
              >
                {state}
              </Text>
            </View>
          ))}
        </View>
        <Pressable
          onPress={handleLogout}
          style={({ pressed }) => [styles.logoutBtn, pressed && { opacity: 0.9 }]}
        >
          <LogOut size={18} color={colors.danger} />
          <Text style={styles.logoutBtnText}>Hesaptan Çıkış Yap</Text>
        </Pressable>
      </View>
    </View>
  );
}
