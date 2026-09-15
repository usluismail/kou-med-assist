/**
 * DigitalIdLoginCard — Flip arka yüzü.
 * Ziraat kampüs kartı silueti: çip + kurum şeridi + foto alanı.
 * Üstte Öğrenci / Akademisyen; kart içinde no-eposta + şifre.
 */
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image as RNImage,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Eye, EyeOff, GraduationCap, Award } from "lucide-react-native";
import { useAuth } from "@/lib/api/AuthContext";
import { ROLE_HOME_HREF } from "@/lib/nav";
import type { UserRole } from "@/lib/api/types";

type Role = "student" | "faculty";

type Palette = {
  cardGrad: [string, string];
  stageGrad: [string, string, string];
  banner: string;
  bannerText: string;
  accent: string;
  accentSoft: string;
  text: string;
  muted: string;
  inputBg: string;
  inputBorder: string;
  chipGrad: [string, string];
  chipLine: string;
  footer: string;
  footerLabel: string;
  toggleActive: string;
  toggleActiveText: string;
  submitText: string;
  sealBorder: string;
};

/** Tıp Öğrencisi — nane yeşili + zümrüt */
const STUDENT_PALETTE: Palette = {
  cardGrad: ["#EBF7EE", "#BEE4C7"],
  stageGrad: ["#06281E", "#064E3B", "#065F46"],
  banner: "#064E3B",
  bannerText: "#ECFDF5",
  accent: "#10B981",
  accentSoft: "rgba(16,185,129,0.14)",
  text: "#064E3B",
  muted: "rgba(6,78,59,0.55)",
  inputBg: "rgba(255,255,255,0.82)",
  inputBorder: "rgba(6,95,70,0.18)",
  chipGrad: ["#D1FAE5", "#10B981"],
  chipLine: "rgba(6,78,59,0.35)",
  footer: "#065F46",
  footerLabel: "T.C. Kocaeli Üniversitesi Tıp Fakültesi Öğrencisi",
  toggleActive: "#10B981",
  toggleActiveText: "#FFFFFF",
  submitText: "#FFFFFF",
  sealBorder: "#10B981",
};

/** Akademisyen / Hekim — gece lacivert + altın */
const FACULTY_PALETTE: Palette = {
  cardGrad: ["#1E293B", "#020617"],
  stageGrad: ["#020617", "#0F172A", "#1E293B"],
  banner: "#FBBF24",
  bannerText: "#020617",
  accent: "#FBBF24",
  accentSoft: "rgba(251,191,36,0.16)",
  text: "#FFFBEB",
  muted: "rgba(254,243,199,0.8)",
  inputBg: "rgba(255,255,255,0.08)",
  inputBorder: "rgba(251,191,36,0.35)",
  chipGrad: ["#FEF3C7", "#F59E0B"],
  chipLine: "rgba(146,64,14,0.45)",
  footer: "#FEF3C7",
  footerLabel: "Tıp Fakültesi Öğretim Üyesi / Uzman Hekim",
  toggleActive: "#FBBF24",
  toggleActiveText: "#020617",
  submitText: "#020617",
  sealBorder: "#FBBF24",
};

const CARD_MS = 500;
const CTRL_MS = 300;

type Props = {
  onBack: () => void;
};

export function DigitalIdLoginCard({ onBack }: Props) {
  const [role, setRole] = useState<Role>("student");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const router = useRouter();

  /** 0 = öğrenci, 1 = akademisyen */
  const theme = useRef(new Animated.Value(0)).current;
  const pillScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(theme, {
      toValue: role === "student" ? 0 : 1,
      duration: CARD_MS,
      useNativeDriver: false,
    }).start();
    Animated.sequence([
      Animated.timing(pillScale, {
        toValue: 0.96,
        duration: CTRL_MS / 2,
        useNativeDriver: true,
      }),
      Animated.timing(pillScale, {
        toValue: 1,
        duration: CTRL_MS / 2,
        useNativeDriver: true,
      }),
    ]).start();
  }, [role, theme, pillScale]);

  const p = role === "student" ? STUDENT_PALETTE : FACULTY_PALETTE;
  const valid = identifier.trim().length > 2 && password.length >= 4;

  const facultyOpacity = theme;
  const studentOpacity = theme.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const toggleBg = theme.interpolate({
    inputRange: [0, 1],
    outputRange: [STUDENT_PALETTE.toggleActive, FACULTY_PALETTE.toggleActive],
  });
  const submitBg = toggleBg;
  const bannerBg = theme.interpolate({
    inputRange: [0, 1],
    outputRange: [STUDENT_PALETTE.banner, FACULTY_PALETTE.banner],
  });
  const bannerFg = theme.interpolate({
    inputRange: [0, 1],
    outputRange: [STUDENT_PALETTE.bannerText, FACULTY_PALETTE.bannerText],
  });
  const footerColor = theme.interpolate({
    inputRange: [0, 1],
    outputRange: [STUDENT_PALETTE.footer, FACULTY_PALETTE.footer],
  });
  const accentColor = theme.interpolate({
    inputRange: [0, 1],
    outputRange: [STUDENT_PALETTE.accent, FACULTY_PALETTE.accent],
  });
  const accentSoft = theme.interpolate({
    inputRange: [0, 1],
    outputRange: [STUDENT_PALETTE.accentSoft, FACULTY_PALETTE.accentSoft],
  });
  const inputBg = theme.interpolate({
    inputRange: [0, 1],
    outputRange: [STUDENT_PALETTE.inputBg, FACULTY_PALETTE.inputBg],
  });
  const inputBorder = theme.interpolate({
    inputRange: [0, 1],
    outputRange: [STUDENT_PALETTE.inputBorder, FACULTY_PALETTE.inputBorder],
  });
  const sealBorder = theme.interpolate({
    inputRange: [0, 1],
    outputRange: [STUDENT_PALETTE.sealBorder, FACULTY_PALETTE.sealBorder],
  });
  const submitShadow = theme.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(16,185,129,0.45)", "rgba(251,191,36,0.4)"],
  });

  const submit = async () => {
    if (!valid || loading) return;
    setLoading(true);
    setError(null);
    try {
      const logged = await login({
        email: identifier.trim(),
        password,
        role: role as UserRole,
      });
      const getHref = ROLE_HOME_HREF[logged.role];
      if (getHref) router.replace(getHref(logged));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Giriş başarısız");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    if (role === "student") {
      setIdentifier("can.yilmaz@kocaeli.edu.tr");
      setPassword("ogrenci123");
    } else {
      setIdentifier("ayse.kaya@kocaeli.edu.tr");
      setPassword("hoca123");
    }
  };

  const selectRole = (next: Role) => {
    if (next === role) return;
    setRole(next);
    setError(null);
  };

  return (
    <View style={styles.root}>
      {/* Sahne — 500ms renk geçişi */}
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: studentOpacity }]}>
        <LinearGradient
          colors={STUDENT_PALETTE.stageGrad}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: facultyOpacity }]}>
        <LinearGradient
          colors={FACULTY_PALETTE.stageGrad}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      <View style={styles.wrap}>
        {/* Segment pill — 300ms */}
        <Animated.View style={[styles.toggleRow, { transform: [{ scale: pillScale }] }]}>
          <Pressable
            onPress={() => selectRole("student")}
            style={styles.toggleBtnHit}
          >
            {role === "student" ? (
              <Animated.View
                style={[
                  styles.toggleBtnActive,
                  {
                    backgroundColor: toggleBg,
                    shadowColor: STUDENT_PALETTE.toggleActive,
                  },
                ]}
              >
                <GraduationCap size={14} color="#FFFFFF" strokeWidth={2.2} />
                <Text style={[styles.toggleText, { color: "#FFFFFF" }]}>Öğrenci</Text>
              </Animated.View>
            ) : (
              <View style={styles.toggleBtnIdle}>
                <GraduationCap size={14} color="rgba(255,255,255,0.7)" strokeWidth={2.2} />
                <Text style={styles.toggleText}>Öğrenci</Text>
              </View>
            )}
          </Pressable>
          <Pressable
            onPress={() => selectRole("faculty")}
            style={styles.toggleBtnHit}
          >
            {role === "faculty" ? (
              <Animated.View
                style={[
                  styles.toggleBtnActive,
                  {
                    backgroundColor: toggleBg,
                    shadowColor: FACULTY_PALETTE.toggleActive,
                  },
                ]}
              >
                <Award size={14} color="#020617" strokeWidth={2.2} />
                <Text style={[styles.toggleText, { color: "#020617" }]}>Akademisyen</Text>
              </Animated.View>
            ) : (
              <View style={styles.toggleBtnIdle}>
                <Award size={14} color="rgba(255,255,255,0.7)" strokeWidth={2.2} />
                <Text style={styles.toggleText}>Akademisyen</Text>
              </View>
            )}
          </Pressable>
        </Animated.View>

        {/* Kimlik kartı — yüzey 500ms */}
        <View style={styles.cardShadow}>
          <View style={styles.card}>
            <Animated.View style={[StyleSheet.absoluteFill, { opacity: studentOpacity }]}>
              <LinearGradient
                colors={STUDENT_PALETTE.cardGrad}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>
            <Animated.View style={[StyleSheet.absoluteFill, { opacity: facultyOpacity }]}>
              <LinearGradient
                colors={FACULTY_PALETTE.cardGrad}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>

            <View style={styles.watermark} pointerEvents="none">
              <Animated.View style={[styles.wmBlock, { borderColor: accentColor }]} />
              <Animated.View style={[styles.wmBlockTall, { borderColor: accentColor }]} />
              <Animated.View style={[styles.wmBlock, { borderColor: accentColor }]} />
            </View>

            <View style={styles.cardInner}>
              <View style={styles.cardTopRow}>
                <Animated.View style={[styles.brandBanner, { backgroundColor: bannerBg }]}>
                  <Animated.Text
                    style={[styles.brandBannerText, { color: bannerFg }]}
                    numberOfLines={2}
                  >
                    KOCAELİ ÜNİVERSİTESİ{"\n"}TIP FAKÜLTESİ
                  </Animated.Text>
                </Animated.View>
                <Animated.View
                  style={[
                    styles.sealWrap,
                    { borderColor: sealBorder, borderWidth: role === "faculty" ? 1.5 : 0 },
                  ]}
                >
                  <RNImage
                    source={require("../../assets/kou-tip-logo.png")}
                    style={styles.sealImg}
                    resizeMode="contain"
                  />
                </Animated.View>
              </View>

              <View style={styles.cardMid}>
                <View style={styles.leftCol}>
                  <View style={styles.chip}>
                    <View style={styles.chipPlate}>
                      <Animated.View
                        style={[StyleSheet.absoluteFill, { opacity: studentOpacity }]}
                      >
                        <LinearGradient
                          colors={STUDENT_PALETTE.chipGrad}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={StyleSheet.absoluteFill}
                        />
                      </Animated.View>
                      <Animated.View
                        style={[StyleSheet.absoluteFill, { opacity: facultyOpacity }]}
                      >
                        <LinearGradient
                          colors={FACULTY_PALETTE.chipGrad}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={StyleSheet.absoluteFill}
                        />
                      </Animated.View>
                      <View
                        style={[
                          styles.chipLineH,
                          { backgroundColor: p.chipLine },
                        ]}
                      />
                      <View
                        style={[
                          styles.chipLineH,
                          { top: "33%", backgroundColor: p.chipLine },
                        ]}
                      />
                      <View
                        style={[
                          styles.chipLineH,
                          { top: "66%", backgroundColor: p.chipLine },
                        ]}
                      />
                      <View
                        style={[
                          styles.chipLineV,
                          { backgroundColor: p.chipLine },
                        ]}
                      />
                      <View
                        style={[
                          styles.chipLineV,
                          { left: "50%", backgroundColor: p.chipLine },
                        ]}
                      />
                    </View>
                  </View>

                  <Animated.View
                    style={[
                      styles.fieldShell,
                      { backgroundColor: inputBg, borderColor: inputBorder },
                    ]}
                  >
                    <TextInput
                      value={identifier}
                      onChangeText={(t) => {
                        setIdentifier(t);
                        if (error) setError(null);
                      }}
                      placeholder={
                        role === "student"
                          ? "Öğrenci no veya e-posta"
                          : "Kurumsal e-posta"
                      }
                      placeholderTextColor={p.muted}
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType={role === "student" ? "default" : "email-address"}
                      style={[styles.fieldInput, { color: p.text }]}
                    />
                  </Animated.View>
                  <Animated.View
                    style={[
                      styles.fieldShell,
                      styles.passRow,
                      { backgroundColor: inputBg, borderColor: inputBorder },
                    ]}
                  >
                    <TextInput
                      value={password}
                      onChangeText={(t) => {
                        setPassword(t);
                        if (error) setError(null);
                      }}
                      placeholder="Şifre"
                      placeholderTextColor={p.muted}
                      secureTextEntry={!showPass}
                      style={[styles.fieldInput, styles.passField, { color: p.text }]}
                    />
                    <Pressable
                      onPress={() => setShowPass((s) => !s)}
                      style={styles.eyeBtn}
                      hitSlop={8}
                    >
                      {showPass ? (
                        <EyeOff size={15} color={p.muted} strokeWidth={2.2} />
                      ) : (
                        <Eye size={15} color={p.muted} strokeWidth={2.2} />
                      )}
                    </Pressable>
                  </Animated.View>
                </View>

                {/* Rol amblemi — logo yok, sadece ikon + etiket */}
                <Animated.View
                  style={[
                    styles.emblemBox,
                    {
                      borderColor: accentColor,
                      backgroundColor:
                        role === "student" ? "#EBF7EE" : "#1E293B",
                    },
                  ]}
                >
                  <View style={styles.emblemInner}>
                    {role === "student" ? (
                      <GraduationCap size={22} color="#064E3B" strokeWidth={2.2} />
                    ) : (
                      <Award size={22} color="#FFFBEB" strokeWidth={2.2} />
                    )}
                    <Text
                      style={[
                        styles.emblemRole,
                        { color: role === "student" ? "#064E3B" : "#FFFBEB" },
                      ]}
                    >
                      {role === "student" ? "ÖĞRENCİ" : "AKADEMİ"}
                    </Text>
                  </View>
                </Animated.View>
              </View>

              <Animated.Text style={[styles.cardFooter, { color: footerColor }]}>
                {p.footerLabel}
              </Animated.Text>
            </View>
          </View>
        </View>

        {/* Hata — yer kaplamasın, butonların üstüne biner */}
        {error ? (
          <View style={styles.errorOverlay} pointerEvents="none">
            <Text style={styles.error} numberOfLines={2}>
              {error}
            </Text>
          </View>
        ) : null}

        <View style={styles.footerBlock}>
          <View style={styles.actions}>
            <Pressable onPress={fillDemo} hitSlop={6}>
              <Text style={styles.demoLink}>Demo doldur</Text>
            </Pressable>
            <Pressable
              onPress={submit}
              disabled={!valid || loading}
              style={({ pressed }) => [{ flex: 1, opacity: !valid || loading ? 0.5 : pressed ? 0.9 : 1 }]}
            >
              <Animated.View
                style={[
                  styles.submit,
                  {
                    backgroundColor: submitBg,
                    shadowColor: submitShadow,
                  },
                ]}
              >
                {loading ? (
                  <ActivityIndicator color={p.submitText} />
                ) : (
                  <Text style={[styles.submitText, { color: p.submitText }]}>
                    Portala gir
                  </Text>
                )}
              </Animated.View>
            </Pressable>
          </View>

          <Pressable onPress={onBack} hitSlop={8} style={styles.backHit}>
            <Text style={styles.backLink}>← Ön yüze dön</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  wrap: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 14,
    paddingBottom: 12,
    justifyContent: "space-between",
    gap: 4,
  },
  toggleRow: {
    flexDirection: "row",
    alignSelf: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 999,
    padding: 3,
  },
  toggleBtnHit: {
    borderRadius: 999,
  },
  toggleBtnIdle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  toggleBtnActive: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    shadowOpacity: 0.35,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  toggleText: {
    fontSize: 11,
    fontWeight: "700",
    color: "rgba(255,255,255,0.7)",
  },
  cardShadow: {
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  card: {
    borderRadius: 14,
    overflow: "hidden",
    minHeight: 152,
  },
  cardInner: {
    padding: 10,
    gap: 7,
  },
  watermark: {
    position: "absolute",
    right: 64,
    top: 40,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 3,
    opacity: 0.1,
  },
  wmBlock: {
    width: 22,
    height: 28,
    borderWidth: 1.5,
    borderRadius: 2,
  },
  wmBlockTall: {
    width: 28,
    height: 40,
    borderWidth: 1.5,
    borderRadius: 2,
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 6,
  },
  brandBanner: {
    flex: 1,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    marginLeft: -10,
    paddingLeft: 10,
    paddingVertical: 6,
    paddingRight: 8,
  },
  brandBannerText: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.35,
    lineHeight: 12,
  },
  sealWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  sealImg: { width: 30, height: 30 },
  cardMid: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
  },
  leftCol: {
    flex: 1,
    gap: 5,
  },
  chip: {
    marginBottom: 1,
  },
  chipPlate: {
    width: 36,
    height: 26,
    borderRadius: 4,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.12)",
  },
  chipLineH: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 1,
    opacity: 0.45,
  },
  chipLineV: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: "25%",
    width: 1,
    opacity: 0.45,
  },
  fieldShell: {
    borderWidth: 1,
    borderRadius: 7,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  fieldInput: {
    fontSize: 11,
    fontWeight: "600",
    padding: 0,
    margin: 0,
  },
  passRow: {
    position: "relative",
    justifyContent: "center",
  },
  passField: {
    paddingRight: 24,
  },
  eyeBtn: {
    position: "absolute",
    right: 8,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  emblemBox: {
    width: 58,
    height: 72,
    borderRadius: 8,
    borderWidth: 2,
    overflow: "hidden",
  },
  emblemInner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 4,
  },
  emblemRole: {
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  cardFooter: {
    fontSize: 7,
    fontWeight: "800",
    letterSpacing: 0.4,
    textAlign: "center",
    marginTop: 1,
  },
  errorOverlay: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 72,
    zIndex: 2,
    alignItems: "center",
  },
  error: {
    color: "#FECACA",
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
    backgroundColor: "rgba(0,0,0,0.35)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: "hidden",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    paddingHorizontal: 2,
  },
  footerBlock: {
    gap: 6,
    paddingBottom: 2,
  },
  demoLink: {
    fontSize: 11,
    fontWeight: "700",
    color: "rgba(255,255,255,0.7)",
    textDecorationLine: "underline",
  },
  submit: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    paddingVertical: 9,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  submitText: {
    fontSize: 12,
    fontWeight: "800",
  },
  backHit: {
    alignSelf: "center",
    paddingVertical: 2,
  },
  backLink: {
    fontSize: 11,
    fontWeight: "600",
    color: "rgba(255,255,255,0.65)",
  },
});
