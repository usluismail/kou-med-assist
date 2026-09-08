/**
 * HeroCard.tsx — Açık zemin üzerinde kompakt kurumsal hero.
 *
 * Selamlama + hava tek blok; soft soldan-alta gradient; tek satır tıp kimliği.
 * Referans: KOÜ Mobil (hava sağ üstte değil, selamlamanın altında).
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
import { LinearGradient } from "expo-linear-gradient";
import { Lock, Sun } from "lucide-react-native";
import { landingColors } from "@/lib/theme";
import { SwipeToLogin } from "./SwipeToLogin";

const { width: W } = Dimensions.get("window");
/** KOÜ Mobil referansı: kompakt kart (~ekran genişliğinin %68'i yükseklik) */
const HERO_H = Math.round(W * 0.68);

const now = new Date();
const DAY_NAMES = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
const MONTH_NAMES = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];
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

      <View style={[styles.hero, { width: W - 24, height: HERO_H }]}>
        <Image
          source={require("../../assets/campus/hero-screenshot-compressed.jpg")}
          style={[StyleSheet.absoluteFill, { transform: [{ scale: 1.04 }] }]}
          contentFit="cover"
          contentPosition={{ top: "18%", right: "8%" }}
        />

        {/*
          Split light: solda daha dolgun zümrüt;
          sağ üst kampüs hâlâ nefes alsın.
        */}
        <LinearGradient
          colors={[
            "rgba(4,44,32,0.98)",
            "rgba(8,58,42,0.94)",
            "rgba(10,54,40,0.62)",
            "rgba(10,54,40,0.22)",
            "transparent",
          ]}
          locations={[0, 0.26, 0.52, 0.72, 0.9]}
          start={{ x: 0, y: 0.9 }}
          end={{ x: 1, y: 0.08 }}
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient
          colors={[
            "transparent",
            "rgba(4,40,28,0.35)",
            "rgba(4,36,26,0.82)",
            "rgba(2,30,22,0.97)",
          ]}
          locations={[0.25, 0.52, 0.76, 1]}
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.heroContent}>
          <View style={styles.liveRow}>
            <View style={styles.pingWrap}>
              <Animated.View
                style={[
                  styles.pingRipple,
                  { transform: [{ scale: pingScale }], opacity: pingOpacity },
                ]}
              />
              <View style={styles.pingDot} />
            </View>
            <Text style={styles.liveText}>
              {DAY_NAMES[now.getDay()]}, {now.getDate()} {MONTH_NAMES[now.getMonth()]}
            </Text>
          </View>

          {/* Selamlama + hava tek blok */}
          <View style={styles.greetingBlock}>
            <Text style={styles.headline}>{greeting}</Text>
            <View style={styles.weatherRow}>
              <Sun size={15} color={landingColors.ctaLime} strokeWidth={2.5} />
              <Text style={styles.weatherText}>24°</Text>
            </View>
          </View>

          <Text style={styles.identity}>1994 · Umuttepe Araştırma Hastanesi</Text>

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
  heroContent: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 18,
    paddingBottom: 18,
  },

  liveRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
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
  liveText: {
    fontSize: 11,
    fontWeight: "600",
    color: "rgba(255,255,255,0.92)",
    letterSpacing: 0.2,
  },

  greetingBlock: {
    marginBottom: 8,
  },
  headline: {
    fontSize: 34,
    fontWeight: "900",
    color: "#FFFFFF",
    lineHeight: 38,
    letterSpacing: -1.2,
  },
  weatherRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
  },
  weatherText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },

  identity: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255,255,255,0.88)",
    letterSpacing: 0.3,
    marginBottom: 16,
  },

  swipeWrap: { width: "100%" },
});
