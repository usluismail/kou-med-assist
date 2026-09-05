/**
 * HeroCard.tsx — Full-bleed immersive hero bileşeni.
 *
 * SRP: Yalnızca landing hero ekranından sorumlu.
 * KOÜ Tıp logosu, compact header ve e-tip-mobil referans alınan
 * "Giriş için kaydır" swipe pill içerir.
 */
import { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Image as RNImage,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Image } from "expo-image";
import { Lock, Sun } from "lucide-react-native";
import { landingColors } from "@/lib/theme";
import { SwipeToLogin } from "./SwipeToLogin";

const { width: W, height: H } = Dimensions.get("window");
const HERO_H = Math.round(H * 0.52);

const now = new Date();
const DAY_NAMES = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
const MONTH_NAMES = [
  "Ocak","Şubat","Mart","Nisan","Mayıs","Haziran",
  "Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık",
];
const dateLabel = `${now.getDate()} ${MONTH_NAMES[now.getMonth()]} · ${DAY_NAMES[now.getDay()]}`;

type Props = {
  onSwipeComplete: () => void;
};

export function HeroCard({ onSwipeComplete }: Props) {
  // Ping animasyonu
  const pingScale = useRef(new Animated.Value(1)).current;
  const pingOpacity = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pingScale, { toValue: 2.2, duration: 1000, useNativeDriver: true }),
          Animated.timing(pingScale, { toValue: 1, duration: 1000, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(pingOpacity, { toValue: 0, duration: 1000, useNativeDriver: true }),
          Animated.timing(pingOpacity, { toValue: 0.8, duration: 1000, useNativeDriver: true }),
        ]),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pingOpacity, pingScale]);

  return (
    <View style={styles.wrapper}>
      {/* ── COMPACT HEADER (Logo + Başlık + Giriş Yap) ─────────────────── */}
      <View style={styles.header}>
        {/* Logo + Metin */}
        <View style={styles.brandRow}>
          <View style={styles.logoWrap}>
            <RNImage
              source={require("../../assets/kou-tip-logo.png")}
              style={styles.logoImg}
              resizeMode="contain"
            />
          </View>
          <View style={styles.brandText}>
            <Text style={styles.brandTitle}>KOÜ Tıp</Text>
            <Text style={styles.brandSub}>Fakülte & Araştırma Hastanesi</Text>
          </View>
        </View>

        {/* Giriş Yap butonu */}
        <Pressable
          onPress={onSwipeComplete}
          style={({ pressed }) => [styles.loginBtn, pressed && { opacity: 0.85 }]}
        >
          <Lock size={13} color={landingColors.bg} strokeWidth={2.5} />
          <Text style={styles.loginBtnText}>Giriş yap</Text>
        </Pressable>
      </View>

      {/* ── HERO KARTI ──────────────────────────────────────────────────── */}
      <View style={[styles.hero, { width: W - 24, height: HERO_H }]}>
        {/* Kampüs fotoğrafı */}
        <Image
          source={require("../../assets/campus/hero-campus.jpg")}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
        />

        {/* Koyu yeşil overlay — e-tip-mobil'deki gibi */}
        <View style={styles.heroOverlay} />

        {/* Hero içerik */}
        <View style={styles.heroContent}>
          {/* Üst: tarih + hava */}
          <View style={styles.topRow}>
            <View style={styles.dateRow}>
              <View style={styles.pingWrap}>
                <Animated.View
                  style={[
                    styles.pingRipple,
                    { transform: [{ scale: pingScale }], opacity: pingOpacity },
                  ]}
                />
                <View style={styles.pingDot} />
              </View>
              <Text style={styles.dateText}>{dateLabel.toUpperCase()} · UMUTTEPE</Text>
            </View>
            <View style={styles.weatherChip}>
              <Sun size={12} color={landingColors.primaryLight} strokeWidth={2.5} />
              <Text style={styles.weatherText}>24°C</Text>
            </View>
          </View>

          {/* Ana başlık */}
          <Text style={styles.headline}>İyi günler.</Text>
          <Text style={styles.sub}>
            Kocaeli Üniversitesi Tıp Fakültesi & Uygulama Hastanesi
          </Text>

          {/* Swipe pill — e-tip-mobil stili */}
          <View style={styles.swipeWrap}>
            <SwipeToLogin onSwipeComplete={onSwipeComplete} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 16,
  },

  /* ── Header ─────────────────────────────────────────────────────────── */
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    paddingTop: 8,
  },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  logoWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: landingColors.white,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    // subtle shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  logoImg: {
    width: 44,
    height: 44,
  },
  brandText: { gap: 2 },
  brandTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: landingColors.text,
    letterSpacing: -0.3,
  },
  brandSub: {
    fontSize: 11,
    color: landingColors.textSub,
    fontWeight: "500",
  },
  loginBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: landingColors.white,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  loginBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: landingColors.bg,
  },

  /* ── Hero kart ────────────────────────────────────────────────────── */
  hero: {
    borderRadius: 24,
    overflow: "hidden",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(9,51,37,0.62)",
  },
  heroContent: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 22,
    paddingBottom: 26,
  },

  /* Tarih + hava */
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  dateRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  pingWrap: { width: 10, height: 10, alignItems: "center", justifyContent: "center" },
  pingDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: landingColors.ping,
    position: "absolute",
  },
  pingRipple: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: landingColors.ping,
    position: "absolute",
  },
  dateText: {
    fontSize: 10,
    fontWeight: "700",
    color: "rgba(255,255,255,0.75)",
    letterSpacing: 0.8,
  },
  weatherChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  weatherText: { fontSize: 11, fontWeight: "600", color: landingColors.white },

  /* Başlık */
  headline: {
    fontSize: 40,
    fontWeight: "900",
    color: landingColors.white,
    lineHeight: 44,
    letterSpacing: -1.5,
    marginBottom: 8,
  },
  sub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.72)",
    lineHeight: 18,
    marginBottom: 24,
  },
  swipeWrap: { alignItems: "stretch" },
});
