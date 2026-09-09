/**
 * AuthIdentityPanel — Landing’in asıl yıldızı: kimlik doğrulama odağı.
 * Beyaz/açık panel + iki güçlü yol: Öğrenci | Akademisyen/Hekim.
 */
import { Pressable, StyleSheet, Text, View } from "react-native";
import { GraduationCap, Stethoscope, ChevronRight } from "lucide-react-native";
import { landingColors } from "@/lib/theme";

type Role = "student" | "faculty";

type Props = {
  onSelectRole: (role: Role) => void;
};

export function AuthIdentityPanel({ onSelectRole }: Props) {
  return (
    <View style={styles.panel}>
      <View style={styles.handle} />
      <Text style={styles.kicker}>KİMLİK DOĞRULAMA</Text>
      <Text style={styles.title}>Portala giriş</Text>
      <Text style={styles.sub}>
        Yetkinize uygun kapıyı seçin — doğrudan kendi alanınıza ilerlersiniz.
      </Text>

      <View style={styles.buttons}>
        <Pressable
          onPress={() => onSelectRole("student")}
          style={({ pressed }) => [styles.btn, styles.btnStudent, pressed && styles.btnPressed]}
          accessibilityRole="button"
          accessibilityLabel="Öğrenci Girişi"
        >
          <View style={[styles.iconWrap, styles.iconStudent]}>
            <GraduationCap size={26} color="#FFFFFF" strokeWidth={2.2} />
          </View>
          <View style={styles.btnText}>
            <Text style={styles.btnLabel}>Öğrenci Girişi</Text>
            <Text style={styles.btnHint}>ÖBS · karne · nöbet · logbook</Text>
          </View>
          <ChevronRight size={22} color="rgba(255,255,255,0.75)" strokeWidth={2.4} />
        </Pressable>

        <Pressable
          onPress={() => onSelectRole("faculty")}
          style={({ pressed }) => [styles.btn, styles.btnFaculty, pressed && styles.btnPressed]}
          accessibilityRole="button"
          accessibilityLabel="Akademisyen veya Hekim Girişi"
        >
          <View style={[styles.iconWrap, styles.iconFaculty]}>
            <Stethoscope size={24} color="#FFFFFF" strokeWidth={2.2} />
          </View>
          <View style={styles.btnText}>
            <Text style={styles.btnLabel}>Akademisyen / Hekim</Text>
            <Text style={styles.btnHint}>Öğretim üyesi · klinik portal</Text>
          </View>
          <ChevronRight size={22} color="rgba(255,255,255,0.7)" strokeWidth={2.4} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 22,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: landingColors.glassBorder,
    shadowColor: "#0C2E22",
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -4 },
    elevation: 6,
  },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(12,46,34,0.12)",
    marginBottom: 16,
  },
  kicker: {
    fontSize: 11,
    fontWeight: "800",
    color: landingColors.primary,
    letterSpacing: 1.4,
    marginBottom: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: landingColors.text,
    letterSpacing: -0.8,
    marginBottom: 6,
  },
  sub: {
    fontSize: 14,
    lineHeight: 20,
    color: landingColors.textSub,
    fontWeight: "500",
    marginBottom: 20,
  },
  buttons: {
    gap: 12,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 16,
    minHeight: 84,
  },
  btnStudent: {
    backgroundColor: landingColors.primaryDark,
  },
  btnFaculty: {
    backgroundColor: "#1A2332",
  },
  btnPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.985 }],
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  iconStudent: {
    backgroundColor: "rgba(16,185,129,0.28)",
  },
  iconFaculty: {
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  btnText: {
    flex: 1,
    gap: 3,
  },
  btnLabel: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.3,
  },
  btnHint: {
    fontSize: 12,
    fontWeight: "500",
    color: "rgba(255,255,255,0.62)",
  },
});
