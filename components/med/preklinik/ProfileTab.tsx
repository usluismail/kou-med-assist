import { Linking, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LogOut, Mail, MapPin, MessageCircle } from "lucide-react-native";
import { useAuth } from "@/lib/api/AuthContext";
import { useAdvisor } from "@/lib/api/hooks";
import { colors } from "@/lib/theme";
import { s } from "./styles";

export function ProfileTab({ onOpenMessage }: { onOpenMessage: () => void }) {
  const { user, logout } = useAuth();
  const advisor = useAdvisor();
  const insets = useSafeAreaInsets();

  return (
    <View>
      <View style={[s.pageHeader, { paddingTop: insets.top + 16 }]}>
        <Text style={s.pageTitle}>Profil</Text>
      </View>

      <View style={s.body}>
        {/* Öğrenci Bilgileri */}
        <View style={s.card}>
          <View style={s.profileAvatarRow}>
            <View style={s.avatarLg}>
              <Text style={s.avatarLgText}>{user?.initials ?? "??"}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.profileName} numberOfLines={1}>{user?.name}</Text>
              <Text style={s.profileMeta} numberOfLines={1}>{user?.role === "student" ? user.studentNo : ""}</Text>
              <View style={s.pillGreen}>
                <Text style={s.pillGreenText}>{user?.role === "student" ? user.rotation : "Öğrenci"}</Text>
              </View>
            </View>
          </View>

          <View style={s.profileInfoList}>
            <InfoRow label="Fakülte" value="Kocaeli Üniversitesi Tıp Fakültesi" />
            <InfoRow label="Bölüm" value={user?.department ?? "—"} />
          </View>
        </View>

        {/* İletişim Merkezi */}
        <View style={s.card}>
          <View style={s.cardHeader}>
            <View style={s.softIcon}><MessageCircle size={16} color={colors.primary} /></View>
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
