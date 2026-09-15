/**
 * HospitalBanner.tsx — Umuttepe Sağlık Yerleşkesi hızlı erişim bannerı.
 * Beyaz kart + kontrollü yeşil aksan (farklılaşma noktası).
 */
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { Building2, ArrowUpRight } from "lucide-react-native";
import { useRouter } from "expo-router";
import { landingColors } from "@/lib/theme";
import { useRef } from "react";

export function HospitalBanner() {
  const router = useRouter();
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () =>
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, friction: 8 }).start();
  const onPressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 8 }).start();

  return (
    <View style={styles.section}>
      <Animated.View style={[styles.banner, { transform: [{ scale }] }]}>
        <Pressable
          style={styles.bannerPressable}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          onPress={() => router.push("/hastane")}
        >
          <View style={styles.iconWrap}>
            <Building2 size={22} color={landingColors.primary} strokeWidth={2} />
          </View>

          <View style={styles.textWrap}>
            <Text style={styles.bannerTitle}>Umuttepe Sağlık Yerleşkesi</Text>
            <Text style={styles.bannerSub}>
              Poliklinikler · Amfiler · Morfoloji · Acil Triyaj
            </Text>
          </View>

          <View style={styles.ctaChip}>
            <Text style={styles.ctaText}>Rehberi Aç</Text>
            <ArrowUpRight size={12} color={landingColors.primary} strokeWidth={3} />
          </View>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { paddingHorizontal: 16, marginTop: 16 },
  banner: {
    borderRadius: 22,
    backgroundColor: landingColors.bgCard,
    borderWidth: 1,
    borderColor: landingColors.glassBorder,
    overflow: "hidden",
  },
  bannerPressable: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 18,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: landingColors.primaryGlow,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  textWrap: { flex: 1, gap: 3 },
  bannerTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: landingColors.text,
    letterSpacing: -0.2,
  },
  bannerSub: {
    fontSize: 11,
    color: landingColors.textSub,
    lineHeight: 15,
  },
  ctaChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: landingColors.primaryGlow,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
    flexShrink: 0,
  },
  ctaText: {
    fontSize: 11,
    fontWeight: "700",
    color: landingColors.primary,
  },
});
