import { useState, type ReactNode } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Award,
  ChevronRight,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Mail,
  UserRound,
  X,
} from "lucide-react-native";
import { colors } from "@/lib/theme";

type Role = "student" | "faculty";

const roles = [
  {
    id: "student" as const,
    icon: GraduationCap,
    tone: colors.primary,
    kicker: "İntörn Hekim / Öğrenci Girişi",
    title: "Öğrenci Portalı",
    subtitle: "U-ÇEP Karnesi, Nöbet Takas, OSCE ve Girişim Logları",
  },
  {
    id: "faculty" as const,
    icon: Award,
    tone: colors.clinical,
    kicker: "Öğretim Üyesi / Akademisyen Girişi",
    title: "Akademisyen Portalı",
    subtitle: "Karne Onayları, QR Değerlendirme, Sesli Not ve Rubrikler",
  },
];

export function LoginSheet({ onClose }: { onClose: () => void }) {
  const [role, setRole] = useState<Role | null>(null);

  return (
    <Modal animationType="slide" transparent visible onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          {role === null ? (
            <>
              <View style={styles.sheetHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sheetTitle}>Giriş Türünü Seçin</Text>
                  <Text style={styles.sheetSub}>
                    Devam etmek için yetkinize uygun paneli seçiniz.
                  </Text>
                </View>
                <Pressable onPress={onClose} style={styles.iconBtn} hitSlop={8}>
                  <X size={18} color={colors.mutedForeground} />
                </Pressable>
              </View>
              <View style={{ gap: 12, marginTop: 20 }}>
                {roles.map((r) => (
                  <Pressable
                    key={r.id}
                    onPress={() => setRole(r.id)}
                    style={({ pressed }) => [styles.roleCard, pressed && { opacity: 0.92 }]}
                  >
                    <View style={[styles.roleIcon, { backgroundColor: r.tone }]}>
                      <r.icon size={22} color={colors.white} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.roleKicker}>{r.kicker}</Text>
                      <Text style={styles.roleTitle}>{r.title}</Text>
                      <Text style={styles.roleSub}>{r.subtitle}</Text>
                    </View>
                    <ChevronRight size={20} color={colors.mutedForeground} />
                  </Pressable>
                ))}
              </View>
            </>
          ) : (
            <LoginForm role={role} onBack={() => setRole(null)} />
          )}
          <Text style={styles.footer}>
            Kocaeli Üniversitesi Bilgi İşlem Daire Başkanlığı © 2026
          </Text>
        </View>
      </View>
    </Modal>
  );
}

function LoginForm({ role, onBack }: { role: Role; onBack: () => void }) {
  const student = role === "student";
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const valid = identifier.trim().length > 2 && password.length >= 4;

  const submit = () => {
    if (!valid || loading) return;
    setLoading(true);
    setTimeout(() => {
      router.push(student ? "/ogrenci" : "/akademisyen");
    }, 900);
  };

  return (
    <View style={{ marginTop: 20 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <Pressable onPress={onBack} style={styles.backBtn}>
          <ArrowLeft size={18} color={colors.mutedForeground} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.formTitle}>
            {student ? "Öğrenci Portalı" : "Akademisyen Portalı"}
          </Text>
          <Text style={styles.sheetSub}>
            {student ? "Öğrenci numaranız ile giriş yapın" : "Kurumsal e-posta ile giriş yapın"}
          </Text>
        </View>
      </View>

      <View style={{ gap: 12, marginTop: 20 }}>
        <Field
          icon={student ? UserRound : Mail}
          label={student ? "Öğrenci No" : "Kurumsal E-Posta"}
          placeholder={student ? "2026123456" : "ad.soyad@kocaeli.edu.tr"}
          value={identifier}
          onChange={setIdentifier}
          keyboardType={student ? "number-pad" : "email-address"}
        />
        <Field
          icon={Lock}
          label="Şifre"
          placeholder="••••••••"
          value={password}
          onChange={setPassword}
          secureTextEntry={!showPassword}
          trailing={
            <Pressable onPress={() => setShowPassword((s) => !s)} hitSlop={8}>
              {showPassword ? (
                <EyeOff size={16} color={colors.mutedForeground} />
              ) : (
                <Eye size={16} color={colors.mutedForeground} />
              )}
            </Pressable>
          }
        />
      </View>

      <View style={styles.rowBetween}>
        <Pressable
          onPress={() => setRemember((v) => !v)}
          style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
        >
          <View style={[styles.checkbox, remember && styles.checkboxOn]} />
          <Text style={styles.remember}>Beni Hatırla</Text>
        </Pressable>
        <Text style={styles.forgot}>Şifremi Unuttum?</Text>
      </View>

      <Pressable
        onPress={submit}
        disabled={!valid || loading}
        style={[styles.submit, (!valid || loading) && { opacity: 0.5 }]}
      >
        {loading && <ActivityIndicator color={colors.white} style={{ marginRight: 8 }} />}
        <Text style={styles.submitText}>
          {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
        </Text>
      </Pressable>
    </View>
  );
}

function Field({
  icon: Icon,
  label,
  placeholder,
  value,
  onChange,
  trailing,
  secureTextEntry,
  keyboardType,
}: {
  icon: typeof Lock;
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  trailing?: ReactNode;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "number-pad";
}) {
  return (
    <View>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.fieldBox}>
        <Icon size={16} color={colors.mutedForeground} />
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={colors.mutedForeground}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize="none"
          style={styles.input}
        />
        {trailing}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(26,35,50,0.6)",
  },
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 12,
  },
  handle: {
    alignSelf: "center",
    width: 44,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
  },
  sheetHeader: { flexDirection: "row", gap: 16, marginTop: 20 },
  sheetTitle: { fontSize: 20, fontWeight: "800", color: colors.foreground },
  sheetSub: { marginTop: 4, fontSize: 13, color: colors.mutedForeground },
  iconBtn: { backgroundColor: colors.secondary, borderRadius: 999, padding: 8 },
  roleCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    backgroundColor: colors.card,
    padding: 16,
  },
  roleIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  roleKicker: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.mutedForeground,
    textTransform: "uppercase",
  },
  roleTitle: { fontSize: 16, fontWeight: "700", color: colors.foreground },
  roleSub: { marginTop: 2, fontSize: 12, color: colors.mutedForeground, lineHeight: 16 },
  footer: {
    marginTop: 24,
    textAlign: "center",
    fontSize: 11,
    color: colors.mutedForeground,
  },
  backBtn: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.secondary,
    borderRadius: 999,
    padding: 8,
  },
  formTitle: { fontSize: 17, fontWeight: "800", color: colors.foreground },
  fieldLabel: {
    marginBottom: 6,
    fontSize: 12,
    fontWeight: "600",
    color: colors.secondaryForeground,
  },
  fieldBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.secondary,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  input: { flex: 1, paddingVertical: 12, fontSize: 14, color: colors.foreground },
  rowBetween: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  checkboxOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  remember: { fontSize: 12, fontWeight: "500", color: colors.secondaryForeground },
  forgot: { fontSize: 12, fontWeight: "600", color: colors.primary },
  submit: {
    marginTop: 16,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  submitText: { color: colors.white, fontSize: 14, fontWeight: "700" },
});
