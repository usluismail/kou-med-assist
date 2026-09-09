/**
 * FeaturedScroll.tsx — Öne çıkanlar carousel.
 * Haber + etkinlik + duyuru (görselli), tarihe göre ilk 6.
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
import type { FeaturedItem, FeaturedSource } from "@/lib/api/types";
import { buildFeaturedPool } from "@/lib/portal/buildFeatured";
import { resolvePortalImage } from "@/lib/portal/localMedia";
import { landingColors } from "@/lib/theme";

const { width: W } = Dimensions.get("window");
/** Ortadaki kart ekranın ~%72’si → yanlarda ~%14 peek */
const CARD_W = Math.round(W * 0.72);
const SIDE_PAD = Math.round((W - CARD_W) / 2);
/** 1. kart: başlıkla hizalı sola yaslı (ortalanmaz) */
const LEFT_INSET = 16;
const GAP = 12;
const ITEM_W = CARD_W + GAP;
const CARD_H = Math.round(CARD_W * 1.1);

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

const LOCAL_FALLBACK = buildFeaturedPool(6);

const NEWS_IMAGES: Record<string, number> = {
  "news-1": require("../../assets/campus/featured/featured-1.jpg"),
  "news-2": require("../../assets/campus/featured/featured-2.jpg"),
  "news-3": require("../../assets/campus/featured/featured-3.png"),
  "news-4": require("../../assets/campus/featured/featured-4.jpg"),
  "news-5": require("../../assets/campus/featured/featured-5.jpg"),
  "news-6": require("../../assets/campus/featured/featured-6.jpg"),
};

const CTA_BY_SOURCE: Record<FeaturedSource, string> = {
  news: "Haberi aç",
  event: "Etkinliği aç",
  announcement: "Duyuruyu aç",
  editorial: "Detayı aç",
  fallback: "İncele",
};

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${String(d.getDate()).padStart(2, "0")} ${MONTHS[d.getMonth()]} · ${d.getFullYear()}`;
}

function resolveCardImage(item: FeaturedItem) {
  const portal = resolvePortalImage(item.id, item.imageUrl);
  if (portal) return portal;
  if (NEWS_IMAGES[item.id]) return NEWS_IMAGES[item.id];
  if (item.imageUrl?.startsWith("http")) return { uri: item.imageUrl };
  return NEWS_IMAGES["news-1"];
}

type CardProps = {
  item: FeaturedItem;
  index: number;
  scrollX: Animated.Value;
  isLast: boolean;
};

function PosterCard({ item, index, scrollX, isLast }: CardProps) {
  const source = resolveCardImage(item);
  const cta = CTA_BY_SOURCE[item.source] ?? "İncele";

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
          <View style={styles.metaRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.badge}</Text>
            </View>
            <View style={styles.datePill}>
              <Text style={styles.date}>{formatDate(item.publishedAt)}</Text>
            </View>
          </View>
          <Text style={styles.title} numberOfLines={3}>
            {item.title}
          </Text>

          <View style={styles.cta}>
            <Text style={styles.ctaText}>{cta}</Text>
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
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: landingColors.heroEmerald,
    letterSpacing: 0.8,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 8,
  },
  datePill: {
    backgroundColor: "rgba(0,0,0,0.45)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.18)",
  },
  date: {
    fontSize: 10,
    fontWeight: "700",
    color: "rgba(255,255,255,0.95)",
    letterSpacing: 0.4,
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
