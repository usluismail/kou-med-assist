/**
 * HeroCard.tsx — Açık zemin üzerinde kompakt kurumsal hero.
 *
 * Header (logo + Giriş yap) açık zeminde; hero kartı koyu zümrüt overlay
 * ile Umuttepe görseli taşır. KOÜ Mobil referans akışına uyumlu.
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

const { width: W } = Dimensions.get("window");
const HERO_H = Math.round(W * 0.92);

const now = new Date();
const DAY_NAMES = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
const MONTH_NAMES = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];
const MONTH_SHORT = [
  "OCA", "ŞUB", "MAR", "NIS", "MAY", "HAZ",
  "TEM", "AĞU", "EYL", "EKİ", "KAS", "ARA",
];
const dateLabel = `${now.getDate()} ${MONTH_SHORT[now.getMonth()]} · UMUTTEPE`;
const greeting =
  now.getHours() < 12 ? "Günaydın." : now.getHours() < 18 ? "İyi günler." : "İyi akşamlar.";

type Props = {
  onSwipeComplete: () => void;
};

export function HeroCard({ onSwipeComplete }: Props) {
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
      {/* Açık zemin header */}
      <View style={styles.header}>
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

        <Pressable
          onPress={onSwipeComplete}
          style={({ pressed }) => [styles.loginBtn, pressed && { opacity: 0.85 }]}
        >
          <Lock size={13} color={landingColors.primary} strokeWidth={2.5} />
          <Text style={styles.loginBtnText}>Giriş yap</Text>
        </Pressable>
      </View>

      {/* Koyu zümrüt hero kartı */}
      <View style={[styles.hero, { width: W - 24, height: HERO_H }]}>
        <Image
          source={require("../../assets/campus/hero-campus.jpg")}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
        />
        <View style={styles.heroOverlay} />

        <View style={styles.heroContent}>
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
              <Text style={styles.dateText}>{dateLabel}</Text>
            </View>
            <View style={styles.weatherChip}>
              <Sun size={12} color={landingColors.ctaLime} strokeWidth={2.5} />
              <Text style={styles.weatherText}>24°</Text>
            </View>
          </View>

          <Text style={styles.headline}>{greeting}</Text>
          <Text style={styles.sub}>
            Kocaeli Üniversitesi Tıp Fakültesi · {DAY_NAMES[now.getDay()]},{" "}
            {now.getDate()} {MONTH_NAMES[now.getMonth()]}
          </Text>

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
    gap: 14,
  },

  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    paddingTop: 4,
  },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  logoWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: landingColors.white,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: landingColors.glassBorder,
  },
  logoImg: { width: 40, height: 40 },
  brandText: { gap: 1 },
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
    borderWidth: 1,
    borderColor: landingColors.glassBorder,
  },
  loginBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: landingColors.primary,
  },

  hero: {
    borderRadius: 28,
    overflow: "hidden",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(12,46,34,0.58)",
  },
  heroContent: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 22,
    paddingBottom: 22,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
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
    color: "rgba(255,255,255,0.82)",
    letterSpacing: 0.8,
  },
  weatherChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  weatherText: { fontSize: 11, fontWeight: "600", color: landingColors.white },

  headline: {
    fontSize: 38,
    fontWeight: "900",
    color: landingColors.white,
    lineHeight: 42,
    letterSpacing: -1.4,
    marginBottom: 8,
  },
  sub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.78)",
    lineHeight: 18,
    marginBottom: 22,
  },
  swipeWrap: { alignItems: "stretch" },
});
