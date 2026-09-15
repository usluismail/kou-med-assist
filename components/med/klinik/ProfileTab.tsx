import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LogOut, MessageCircle, Stethoscope } from "lucide-react-native";
import { useAuth } from "@/lib/api/AuthContext";
import { useAuthedFetch } from "@/lib/api/hooks";
import { fetchInternship } from "@/lib/api/index";
import { colors } from "@/lib/theme";
import { AFTERNOON_COLOR } from "./constants";
import { s } from "./styles";

export function ProfileTab({ onOpenMessage }: { onOpenMessage: () => void }) {
  const { user, logout } = useAuth();
  const internship = useAuthedFetch(fetchInternship);
  const insets = useSafeAreaInsets();

  return (
    <View>
      <View style={[s.pageHeader, { paddingTop: insets.top + 16 }]}>
        <Text style={s.pageTitle}>Profil</Text>
      </View>

      <View style={s.body}>
        {/* Öğrenci Kartı */}
        <View style={s.card}>
          <View style={s.profileAvatarRow}>
            <View style={s.avatarLg}>
              <Text style={s.avatarLgText}>{user?.initials ?? "??"}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.profileName} numberOfLines={1}>{user?.name}</Text>
              <Text style={s.profileMeta} numberOfLines={1}>{user?.role === "student" ? user.studentNo : ""}</Text>
              <View style={[s.pillBlue, { marginTop: 4 }]}>
                <Text style={s.pillBlueText}>{user?.role === "student" ? user.rotation : "Klinik Staj"}</Text>
              </View>
            </View>
          </View>

          <View style={s.profileInfoList}>
            <InfoRow label="Fakülte"   value="Kocaeli Üniversitesi Tıp Fakültesi" />
            <InfoRow label="Bölüm"     value={user?.department ?? "—"} />
          </View>
        </View>

        {/* Staj Bilgisi */}
        {internship.data && (
          <View style={s.card}>
            <View style={s.cardHeader}>
              <View style={[s.softIcon, { backgroundColor: "#3B82F610" }]}>
                <Stethoscope size={16} color={AFTERNOON_COLOR} />
              </View>
              <Text style={s.cardTitle}>Aktif Staj</Text>
            </View>
            <View style={s.profileInfoList}>
              <InfoRow label="Staj Adı"   value={internship.data.name} />
              <InfoRow label="Rotasyon"   value={internship.data.rotation} />
              <InfoRow label="Hafta"      value={`${internship.data.week}. Hafta`} />
              <InfoRow label="Başlangıç" value={new Date(internship.data.startDate).toLocaleDateString("tr-TR")} />
              <InfoRow label="Bitiş"     value={new Date(internship.data.endDate).toLocaleDateString("tr-TR")} />
            </View>
          </View>
        )}

        {/* İletişim Merkezi */}
        <View style={s.card}>
          <View style={s.cardHeader}>
            <View style={[s.softIcon, { backgroundColor: colors.kou10 }]}><MessageCircle size={16} color={colors.primary} /></View>
            <Text style={s.cardTitle}>İletişim Merkezi</Text>
          </View>
          <Text style={{ fontSize: 13, color: colors.mutedForeground, marginBottom: 16, lineHeight: 20 }}>
            Öğrenci işleri, danışman veya staj sorumlusuna doğrudan uygulama içinden mesaj gönderebilirsiniz.
          </Text>
          <Pressable
            style={s.advisorBtnFill}
            onPress={onOpenMessage}
          >
            <MessageCircle size={14} color={colors.white} />
            <Text style={s.advisorBtnFillText}>Mesaj Gönder</Text>
          </Pressable>
        </View>

        {/* Çıkış */}
        <Pressable
          onPress={logout}
          style={({ pressed }) => [s.logoutBtn, pressed && { opacity: 0.8 }]}
        >
          <LogOut size={18} color={colors.danger} />
          <Text style={s.logoutText}>Çıkış Yap</Text>
        </Pressable>
      </View>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.infoRow}>
      <Text style={s.infoLabel}>{label}</Text>
      <Text style={s.infoValue} numberOfLines={2}>{value}</Text>
    </View>
  );
}
