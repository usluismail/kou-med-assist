/**
 * HeroCarousel.tsx — Kampüs hero slider bileşeni.
 *
 * SRP: Yalnızca yatay kaydırmalı hero slayt gösteriminden sorumlu.
 */
import { useState } from "react";
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Image } from "expo-image";
import { colors } from "@/lib/theme";

const HERO_GAP    = 12;
const SCREEN_PAD  = 16;
const HERO_WIDTH  = Dimensions.get("window").width - SCREEN_PAD * 2;

const heroSlides = [
  {
    id: "h1",
    src: require("../../assets/campus/hero-campus.jpg"),
    badge: "Kampüs & Haberler",
    title: "Yeni Tıp Fakültesi Araştırma Laboratuvarı Hizmete Açıldı",
    place: "Araştırma Laboratuvarları · Umuttepe",
  },
  {
    id: "h2",
    src: require("../../assets/campus/campus-1.jpg"),
    badge: "Yerleşke",
    title: "Kocaeli Üniversitesi Tıp Fakültesi Ana Giriş",
    place: "Ana Giriş Kapısı · Tıp Fakültesi",
  },
  {
    id: "h3",
    src: require("../../assets/campus/campus-2.jpg"),
    badge: "Kampüs",
    title: "Umuttepe Yerleşkesi Merkez Avlu",
    place: "Merkez Avlu · Umuttepe Yerleşkesi",
  },
  {
    id: "h4",
    src: require("../../assets/campus/campus-3.jpg"),
    badge: "Eğitim",
    title: "Tıp Fakültesi Büyük Amfi ve Derslikler",
    place: "Büyük Amfi · Eğitim Bloğu",
  },
  {
    id: "h5",
    src: require("../../assets/campus/hero-campus.jpg"),
    badge: "Hastane",
    title: "KOÜ Araştırma ve Uygulama Hastanesi",
    place: "Uygulama Hastanesi · Umuttepe",
  },
];

export function HeroCarousel() {
  const [heroIndex, setHeroIndex] = useState(0);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x   = e.nativeEvent.contentOffset.x;
    const idx = Math.round(x / (HERO_WIDTH + HERO_GAP));
    if (idx !== heroIndex && idx >= 0 && idx < heroSlides.length) {
      setHeroIndex(idx);
    }
  };

  return (
    <View>
      <ScrollView
        horizontal
        pagingEnabled={false}
        decelerationRate="fast"
        snapToInterval={HERO_WIDTH + HERO_GAP}
        snapToAlignment="start"
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ gap: HERO_GAP }}
      >
        {heroSlides.map((slide) => (
          <View key={slide.id} style={[styles.hero, { width: HERO_WIDTH }]}>
            <Image source={slide.src} style={styles.heroImg} contentFit="cover" />
            <View style={styles.heroGradient} />
            <View style={styles.heroContent}>
              <View style={styles.badgeSuccess}>
                <Text style={styles.badgeSuccessText}>{slide.badge}</Text>
              </View>
              <Text style={styles.heroTitle}>{slide.title}</Text>
              <Text style={styles.heroPlace}>{slide.place}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.dots}>
        {heroSlides.map((s, i) => (
          <View key={s.id} style={[styles.dot, i === heroIndex && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { height: 224, borderRadius: 24, overflow: "hidden" },
  heroImg: { ...StyleSheet.absoluteFill },
  heroGradient: { ...StyleSheet.absoluteFill, backgroundColor: "rgba(26,35,50,0.55)" },
  heroContent: { position: "absolute", left: 0, right: 0, bottom: 0, padding: 20 },
  badgeSuccess: {
    alignSelf: "flex-start",
    backgroundColor: colors.success,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeSuccessText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  heroTitle: { marginTop: 10, fontSize: 18, fontWeight: "800", color: colors.white, lineHeight: 24 },
  heroPlace: { marginTop: 6, fontSize: 12, fontWeight: "500", color: "rgba(255,255,255,0.85)" },
  dots: { flexDirection: "row", justifyContent: "center", gap: 6, marginTop: 10 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.border },
  dotActive: { width: 18, backgroundColor: colors.primary },
});
