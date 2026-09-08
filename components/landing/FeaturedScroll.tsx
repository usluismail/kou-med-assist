/**
 * FeaturedScroll.tsx — Öne çıkanlar carousel.
 * 1. kart sola yaslı (başlık hizası); 2+ kart ortalı + yan peek/blur/zoom.
 * docs/ONE-CIKANLAR.md
 */
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { ArrowRight } from "lucide-react-native";
import { fetchFeaturedItems } from "@/lib/api/shared";
import type { FeaturedItem } from "@/lib/api/types";
import { landingColors } from "@/lib/theme";

const { width: W } = Dimensions.get("window");
/** Ortadaki kart ekranın ~%72’si → yanlarda ~%14 peek */
const CARD_W = Math.round(W * 0.72);
const SIDE_PAD = Math.round((W - CARD_W) / 2);
/** 1. kart: başlıkla hizalı sola yaslı (ortalanmaz) */
const LEFT_INSET = 16;
const GAP = 12;
const ITEM_W = CARD_W + GAP;
const CARD_H = Math.round(CARD_W * 1.1); // dikey ~%10 daha kompakt

/**
 * Snap / fokus offset’leri:
 * - index 0 → 0 (sola yaslı)
 * - index ≥ 1 → kart ekranda ortalanır (önceki+sonraki peek)
 * - index < 0 → interpolasyon için sentetik
 */
function focusOffset(index: number) {
  if (index < 0) return index * ITEM_W;
  if (index === 0) return 0;
  return LEFT_INSET + index * ITEM_W - SIDE_PAD;
}

function buildSnapOffsets(count: number) {
  return Array.from({ length: count }, (_, i) => focusOffset(i));
}

const MONTHS = [
  "OCA", "ŞUB", "MAR", "NIS", "MAY", "HAZ",
  "TEM", "AĞU", "EYL", "EKİ", "KAS", "ARA",
];

const LOCAL_FALLBACK: FeaturedItem[] = [
  {
    id: "news-1",
    title: "Dikey Entegrasyon Çalışma Grubu Toplantısı",
    publishedAt: "2026-09-03",
    sourceUrl: "https://tip.kocaeli.edu.tr/haberler/dikey-entegrasyon-calisma-grubu-toplantisi-4d3",
    source: "news",
    badge: "HABER",
    summary: "Dikey Entegrasyon Çalışma Grubu Toplantısı",
    imageUrl: null,
  },
  {
    id: "news-2",
    title: "KOÜ Kalplerimize Dokunuyor...",
    publishedAt: "2026-07-16",
    sourceUrl: "https://tip.kocaeli.edu.tr/haberler/kou-kalplerimize-dokunuyor-752",
    source: "news",
    badge: "HABER",
    summary: "KOÜ Kalplerimize Dokunuyor...",
    imageUrl: null,
  },
  {
    id: "news-3",
    title:
      "Fakültemiz Öğretim Üyeleri Uluslararası FAIMER Enstitüsü (IFI) Programından Mezun Oldu",
    publishedAt: "2026-07-10",
    sourceUrl:
      "https://tip.kocaeli.edu.tr/haberler/fakultemiz-ogretim-uyeleri-uluslararasi-faimer-enstitusu-ifi-programindan-mezun-oldu-450",
    source: "news",
    badge: "HABER",
    summary:
      "Fakültemiz Öğretim Üyeleri Uluslararası FAIMER Enstitüsü (IFI) Programından Mezun Oldu",
    imageUrl: null,
  },
  {
    id: "news-4",
    title: "Fakültemiz Çocuk Cerrahisi Anabilim Dalı Akreditasyon Onayı",
    publishedAt: "2026-07-09",
    sourceUrl:
      "https://tip.kocaeli.edu.tr/haberler/fakultemiz-cocuk-cerrahisi-anabilim-dali-akreditasyon-onayi-035",
    source: "news",
    badge: "HABER",
    summary: "Fakültemiz Çocuk Cerrahisi Anabilim Dalı Akreditasyon Onayı",
    imageUrl: null,
  },
  {
    id: "news-5",
    title: "KOÜSİM Yönetim Kurulu Toplantısı Yapıldı",
    publishedAt: "2026-07-07",
    sourceUrl: "https://tip.kocaeli.edu.tr/haberler/kousim-yonetim-kurulu-toplantisi-yapildi-fd3",
    source: "news",
    badge: "HABER",
    summary: "KOÜSİM Yönetim Kurulu Toplantısı Yapıldı",
    imageUrl: null,
  },
  {
    id: "news-6",
    title: "2026–2027 İntörn Uyum Programı Gerçekleştirildi",
    publishedAt: "2026-07-01",
    sourceUrl:
      "https://tip.kocaeli.edu.tr/haberler/20262027-intorn-uyum-programi-gerceklestirildi-274",
    source: "news",
    badge: "HABER",
    summary: "2026–2027 İntörn Uyum Programı Gerçekleştirildi",
    imageUrl: null,
  },
];

const LOCAL_IMAGES: Record<string, number> = {
  "news-1": require("../../assets/campus/featured/featured-1.jpg"),
  "news-2": require("../../assets/campus/featured/featured-2.jpg"),
  "news-3": require("../../assets/campus/featured/featured-3.png"),
  "news-4": require("../../assets/campus/featured/featured-4.jpg"),
  "news-5": require("../../assets/campus/featured/featured-5.jpg"),
  "news-6": require("../../assets/campus/featured/featured-6.jpg"),
};

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${String(d.getDate()).padStart(2, "0")} ${MONTHS[d.getMonth()]} · ${d.getFullYear()}`;
}

type CardProps = {
  item: FeaturedItem;
  index: number;
  scrollX: Animated.Value;
  isLast: boolean;
};

function PosterCard({ item, index, scrollX, isLast }: CardProps) {
  const local = LOCAL_IMAGES[item.id];
  const source = item.imageUrl
    ? { uri: item.imageUrl }
    : local
      ? local
      : LOCAL_IMAGES["news-1"];

  // 1. kart sola yaslı focus(0)=0; sonrakiler ortalı
  const inputRange = [
    focusOffset(index - 1),
    focusOffset(index),
    focusOffset(index + 1),
  ];

  const scale = scrollX.interpolate({
    inputRange,
    outputRange: [0.9, 1.04, 0.9],
    extrapolate: "clamp",
  });

  const blurOpacity = scrollX.interpolate({
    inputRange,
    outputRange: [0.72, 0, 0.72],
    extrapolate: "clamp",
  });

  const contentOpacity = scrollX.interpolate({
    inputRange,
    outputRange: [0.45, 1, 0.45],
    extrapolate: "clamp",
  });

  const onPress = () => {
    if (item.sourceUrl) Linking.openURL(item.sourceUrl).catch(() => {});
  };

  return (
    <Animated.View
      style={[
        styles.cardShell,
        {
          width: CARD_W,
          height: CARD_H,
          marginRight: isLast ? 0 : GAP,
          transform: [{ scale }],
        },
      ]}
    >
      <Pressable onPress={onPress} style={styles.card}>
        <Image source={source} style={StyleSheet.absoluteFill} contentFit="cover" />

        <Animated.View style={[StyleSheet.absoluteFill, { opacity: blurOpacity }]} pointerEvents="none">
          <BlurView intensity={28} tint="dark" style={StyleSheet.absoluteFill} />
          <View style={styles.blurDim} />
        </Animated.View>

        <LinearGradient
          colors={["transparent", "rgba(4,36,26,0.25)", "rgba(4,32,24,0.88)"]}
          locations={[0.35, 0.62, 1]}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />

        <Animated.View style={[styles.cardContent, { opacity: contentOpacity }]}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.badge}</Text>
          </View>
          <Text style={styles.date}>{formatDate(item.publishedAt)}</Text>
          <Text style={styles.title} numberOfLines={3}>
            {item.title}
          </Text>

          <View style={styles.cta}>
            <Text style={styles.ctaText}>Haberi aç</Text>
            <ArrowRight size={16} color="#FFFFFF" strokeWidth={2.4} />
          </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

export function FeaturedScroll() {
  const [items, setItems] = useState<FeaturedItem[]>(LOCAL_FALLBACK);
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let cancelled = false;
    fetchFeaturedItems(6)
      .then((data) => {
        if (!cancelled && data?.length) setItems(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const snapOffsets = buildSnapOffsets(items.length);

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: true }
  );

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Öne çıkanlar</Text>
      <Animated.ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingLeft: LEFT_INSET,
          paddingRight: SIDE_PAD,
          alignItems: "center",
          paddingVertical: 10,
        }}
        decelerationRate="fast"
        snapToOffsets={snapOffsets}
        disableIntervalMomentum
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {items.map((item, index) => (
          <PosterCard
            key={item.id}
            item={item}
            index={index}
            scrollX={scrollX}
            isLast={index === items.length - 1}
          />
        ))}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: 22 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: landingColors.text,
    marginBottom: 8,
    paddingHorizontal: 16,
    letterSpacing: -0.3,
  },
  cardShell: {
    borderRadius: 26,
  },
  card: {
    flex: 1,
    borderRadius: 26,
    overflow: "hidden",
    backgroundColor: landingColors.heroEmerald,
  },
  blurDim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(8,28,22,0.28)",
  },
  cardContent: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 16,
    paddingBottom: 14,
    gap: 0,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(184,212,74,0.92)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: landingColors.heroEmerald,
    letterSpacing: 0.8,
  },
  date: {
    fontSize: 11,
    fontWeight: "600",
    color: "rgba(255,255,255,0.78)",
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
    lineHeight: 24,
    letterSpacing: -0.3,
    marginBottom: 14,
  },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(8,48,36,0.72)",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.16)",
  },
  ctaText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
});
