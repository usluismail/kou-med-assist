/**
 * HeroCard.tsx — İki yüzlü flip hero.
 * Ön yüz: kampüs + selamlama + “Giriş yapmak için dokun”
 * Arka yüz: şimdilik boş (dijital kimlik sonra)
 * Flip yalnızca hero’da; alt sayfa sabit.
 * Dönüş: 21st.dev flipping-card tarzı Y ekseni.
 */
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image as RNImage,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Lock, RotateCw, Sun } from "lucide-react-native";
import { landingColors } from "@/lib/theme";
import { DigitalIdLoginCard } from "./DigitalIdLoginCard";

const { width: W } = Dimensions.get("window");
const HERO_W = W - 24;
/** Giriş yüzü + alt link sığsın */
const HERO_H = Math.round(W * 0.8);
const CLINICAL_MINT = "#10B981";

const now = new Date();
const MONTH_SHORT = [
  "OCAK", "ŞUBAT", "MART", "NİSAN", "MAYIS", "HAZİRAN",
  "TEMMUZ", "AĞUSTOS", "EYLÜL", "EKİM", "KASIM", "ARALIK",
];

const greetingBase =
  now.getHours() < 12 ? "Günaydın" : now.getHours() < 18 ? "İyi günler" : "İyi akşamlar";
const greeting = `${greetingBase}, Meslektaşım`;

/** Tek satır meta: ● 9 EYLÜL · 2026–2027 GÜZ */
const metaLine = `${now.getDate()} ${MONTH_SHORT[now.getMonth()]} · 2026–2027 GÜZ`;

type Props = {
  onSwipeComplete?: () => void;
};

export function HeroCard({ onSwipeComplete: _unused }: Props) {
  const pingScale = useRef(new Animated.Value(1)).current;
  const pingOpacity = useRef(new Animated.Value(0.8)).current;
  const beamSpin = useRef(new Animated.Value(0)).current;
  const flipAnim = useRef(new Animated.Value(0)).current;
  const [flipped, setFlipped] = useState(false);
  const [ctaSize, setCtaSize] = useState({ w: HERO_W - 36, h: 56 });
  const flipping = useRef(false);

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

  /** CTA kenarında yavaş dönen ince ışık izi — kart çevrilince durur */
  useEffect(() => {
    if (flipped) {
      beamSpin.stopAnimation();
      return;
    }
    beamSpin.setValue(0);
    const spin = Animated.loop(
      Animated.timing(beamSpin, {
        toValue: 1,
        duration: 4800,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    spin.start();
    return () => spin.stop();
  }, [beamSpin, flipped]);

  const beamRotate = beamSpin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
  const beamSize = Math.ceil(Math.hypot(ctaSize.w, ctaSize.h)) + 24;

  const flipTo = (toBack: boolean) => {
    if (flipping.current) return;
    flipping.current = true;
    Animated.timing(flipAnim, {
      toValue: toBack ? 180 : 0,
      duration: 620,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setFlipped(toBack);
      flipping.current = false;
    });
  };

  const frontRotate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });
  const backRotate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });
  const frontOpacity = flipAnim.interpolate({
    inputRange: [0, 89, 90, 180],
    outputRange: [1, 1, 0, 0],
  });
  const backOpacity = flipAnim.interpolate({
    inputRange: [0, 89, 90, 180],
    outputRange: [0, 0, 1, 1],
  });

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
          onPress={() => (flipped ? flipTo(false) : flipTo(true))}
          style={({ pressed }) => [styles.loginBtn, pressed && { opacity: 0.85 }]}
        >
          <Lock size={13} color={landingColors.primary} strokeWidth={2.5} />
          <Text style={styles.loginBtnText}>{flipped ? "Kartı çevir" : "Giriş yap"}</Text>
        </Pressable>
      </View>

      {/* Flip sahnesi — yalnızca hero; FeaturedScroll etkilenmez */}
      <View style={[styles.scene, { width: HERO_W, height: HERO_H }]}>
        {/* ÖN YÜZ */}
        <Animated.View
          pointerEvents={flipped ? "none" : "auto"}
          style={[
            styles.face,
            {
              opacity: frontOpacity,
              transform: [{ perspective: 1200 }, { rotateY: frontRotate }],
            },
          ]}
        >
          <Image
            source={require("../../assets/campus/hero-screenshot-compressed.jpg")}
            style={[StyleSheet.absoluteFill, { transform: [{ scale: 1.08 }] }]}
            contentFit="cover"
            /* Referans: bina sağ-orta, gökyüzü üstte nefes alsın */
            contentPosition={{ top: "12%", right: "0%" }}
          />

          {/* Genel koyu-yeşil grade (fotoğraftaki mood) */}
          <View
            pointerEvents="none"
            style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(6, 40, 28, 0.28)" }]}
          />

          {/* Soldan gelen zümrüt — metin okunaklı, sağ üst açık */}
          <LinearGradient
            colors={[
              "rgba(4, 36, 26, 0.92)",
              "rgba(6, 48, 34, 0.72)",
              "rgba(8, 52, 38, 0.38)",
              "rgba(8, 52, 38, 0.12)",
              "transparent",
            ]}
            locations={[0, 0.28, 0.52, 0.72, 0.92]}
            start={{ x: 0, y: 0.55 }}
            end={{ x: 1, y: 0.2 }}
            style={StyleSheet.absoluteFill}
          />

          {/* Alttan koyuluk — CTA / başlık zemini */}
          <LinearGradient
            colors={[
              "transparent",
              "rgba(3, 32, 24, 0.25)",
              "rgba(2, 28, 20, 0.72)",
              "rgba(2, 24, 18, 0.92)",
            ]}
            locations={[0.2, 0.48, 0.74, 1]}
            style={StyleSheet.absoluteFill}
          />

          <View style={styles.weatherPill} pointerEvents="none">
            <BlurView intensity={28} tint="light" style={StyleSheet.absoluteFill} />
            <View style={styles.weatherPillInner}>
              <Sun size={13} color="#FFFFFF" strokeWidth={2.5} />
              <Text style={styles.weatherText}>24°</Text>
            </View>
          </View>

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
              <Text style={styles.liveText}>{metaLine}</Text>
            </View>

            <Text style={styles.headline}>{greeting}</Text>
            <Text style={styles.identity}>1994 · Umuttepe Araştırma Hastanesi</Text>

            <Pressable
              onPress={() => flipTo(true)}
              onLayout={(e) => {
                const { width, height } = e.nativeEvent.layout;
                setCtaSize({ w: width, h: height });
              }}
              style={({ pressed }) => [
                styles.flipCta,
                pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
              ]}
            >
              <View style={styles.flipCtaBeamClip} pointerEvents="none">
                <Animated.View
                  style={[
                    styles.flipCtaBeam,
                    {
                      width: beamSize,
                      height: beamSize,
                      marginLeft: -beamSize / 2,
                      marginTop: -beamSize / 2,
                      transform: [{ rotate: beamRotate }],
                    },
                  ]}
                >
                  <LinearGradient
                    colors={[
                      "transparent",
                      "transparent",
                      "rgba(255,255,255,0.05)",
                      "rgba(255,255,255,0.55)",
                      "rgba(16,185,129,0.65)",
                      "rgba(255,255,255,0.12)",
                      "transparent",
                      "transparent",
                    ]}
                    locations={[0, 0.38, 0.46, 0.5, 0.54, 0.58, 0.66, 1]}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={StyleSheet.absoluteFill}
                  />
                </Animated.View>
              </View>

              <View style={styles.flipCtaInner}>
                <View style={styles.flipKnob}>
                  <RNImage
                    source={require("../../assets/kou-tip-logo.png")}
                    style={styles.flipKnobLogo}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.flipCtaText}>
                  <Text style={styles.flipCtaTitle}>Giriş yapmak için dokun</Text>
                  <Text style={styles.flipCtaSub}>Tıp Fakültesi · dijital kimlik</Text>
                </View>
                <View style={styles.flipHint} pointerEvents="none">
                  <RotateCw size={14} color="rgba(255,255,255,0.75)" strokeWidth={2.4} />
                  <Text style={styles.flipHintChevrons}>› ›</Text>
                </View>
              </View>
            </Pressable>
          </View>
        </Animated.View>

        {/* ARKA YÜZ — dijital kimlik + giriş */}
        <Animated.View
          pointerEvents={flipped ? "auto" : "none"}
          style={[
            styles.face,
            styles.backFace,
            {
              opacity: backOpacity,
              transform: [{ perspective: 1200 }, { rotateY: backRotate }],
            },
          ]}
        >
          <DigitalIdLoginCard onBack={() => flipTo(false)} />
        </Animated.View>
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

  scene: {
    borderRadius: 28,
  },
  face: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 28,
    overflow: "hidden",
    backfaceVisibility: "hidden",
  },
  backFace: {
    backgroundColor: "#083325",
  },

  weatherPill: {
    position: "absolute",
    top: 14,
    right: 14,
    zIndex: 4,
    borderRadius: 999,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.22)",
  },
  weatherPillInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  weatherText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.2,
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
    backgroundColor: CLINICAL_MINT,
    position: "absolute",
  },
  pingRipple: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: CLINICAL_MINT,
    position: "absolute",
  },
  liveText: {
    fontSize: 11,
    fontWeight: "700",
    color: "rgba(255,255,255,0.92)",
    letterSpacing: 0.6,
  },

  headline: {
    fontSize: 30,
    fontWeight: "900",
    color: "#FFFFFF",
    lineHeight: 34,
    letterSpacing: -1.0,
    marginBottom: 8,
  },
  identity: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255,255,255,0.88)",
    letterSpacing: 0.3,
    marginBottom: 16,
  },

  flipCta: {
    borderRadius: 999,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.16)",
  },
  flipCtaBeamClip: {
    ...StyleSheet.absoluteFill,
    overflow: "hidden",
    borderRadius: 999,
  },
  flipCtaBeam: {
    position: "absolute",
    left: "50%",
    top: "50%",
  },
  flipCtaInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    margin: 1.5,
    backgroundColor: "rgba(0,0,0,0.42)",
    borderRadius: 999,
    paddingVertical: 7,
    paddingLeft: 7,
    paddingRight: 14,
  },
  flipKnob: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(16,185,129,0.18)",
    borderWidth: 1,
    borderColor: "rgba(16,185,129,0.32)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  flipKnobLogo: {
    width: 34,
    height: 34,
  },
  flipCtaText: { flex: 1, gap: 1 },
  flipCtaTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "rgba(255,255,255,0.95)",
  },
  flipCtaSub: {
    fontSize: 10,
    fontWeight: "500",
    color: "rgba(255,255,255,0.62)",
  },
  flipHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingLeft: 2,
  },
  flipHintChevrons: {
    fontSize: 14,
    fontWeight: "700",
    color: "rgba(255,255,255,0.55)",
    letterSpacing: -1,
  },
});
