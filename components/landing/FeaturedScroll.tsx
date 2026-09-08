/**
 * FeaturedScroll.tsx — "Öne çıkanlar" yatay carousel (açık zemin, beyaz kart).
 */
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { landingColors } from "@/lib/theme";

type FeaturedItem = {
  id: string;
  badge: string;
  badgeBg: string;
  badgeText: string;
  title: string;
  date: string;
  src: ReturnType<typeof require>;
};

const items: FeaturedItem[] = [
  {
    id: "f1",
    badge: "KLİNİK",
    badgeBg: landingColors.badgeClinical,
    badgeText: landingColors.badgeClinicalText,
    title: "2026-2027 Dönem 6 İntörn Nöbet Listeleri Yayınlandı",
    date: "05 EYL",
    src: require("../../assets/campus/hero-campus.jpg"),
  },
  {
    id: "f2",
    badge: "ARAŞTIRMA",
    badgeBg: landingColors.badgeAcademic,
    badgeText: landingColors.badgeAcademicText,
    title: "Yeni Tıp Fakültesi Araştırma Laboratuvarı Hizmete Açıldı",
    date: "03 EYL",
    src: require("../../assets/campus/campus-1.jpg"),
  },
  {
    id: "f3",
    badge: "EĞİTİM",
    badgeBg: landingColors.badgeFaculty,
    badgeText: landingColors.badgeFacultyText,
    title: "Dönem 3 Klinik Beceri Sınavları Takvimi Güncellendi",
    date: "01 EYL",
    src: require("../../assets/campus/campus-2.jpg"),
  },
  {
    id: "f4",
    badge: "KLİNİK",
    badgeBg: landingColors.badgeClinical,
    badgeText: landingColors.badgeClinicalText,
    title: "KOÜ Araştırma ve Uygulama Hastanesi Yeni Poliklinik Binası",
    date: "28 AĞU",
    src: require("../../assets/campus/campus-3.jpg"),
  },
];

export function FeaturedScroll() {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Öne çıkanlar</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        decelerationRate="fast"
        snapToInterval={272}
        snapToAlignment="start"
      >
        {items.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.imgWrap}>
              <Image source={item.src} style={StyleSheet.absoluteFill} contentFit="cover" />
              <View style={styles.imgOverlay} />
              <View style={[styles.badge, { backgroundColor: item.badgeBg }]}>
                <Text style={[styles.badgeText, { color: item.badgeText }]}>{item.badge}</Text>
              </View>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardDate}>{item.date} · 2026</Text>
              <Text style={styles.cardTitle} numberOfLines={2}>
                {item.title}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: 28 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: landingColors.text,
    marginBottom: 14,
    paddingHorizontal: 16,
    letterSpacing: -0.3,
  },
  scroll: {
    paddingHorizontal: 16,
    gap: 12,
  },
  card: {
    width: 260,
    borderRadius: 22,
    backgroundColor: landingColors.bgCard,
    borderWidth: 1,
    borderColor: landingColors.glassBorder,
    overflow: "hidden",
  },
  imgWrap: {
    height: 138,
    backgroundColor: landingColors.bgCardAlt,
    overflow: "hidden",
  },
  imgOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(12,46,34,0.18)",
  },
  badge: {
    position: "absolute",
    bottom: 10,
    left: 12,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  cardBody: { padding: 14 },
  cardDate: {
    fontSize: 10,
    fontWeight: "600",
    color: landingColors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 6,
    fontVariant: ["tabular-nums"],
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: landingColors.text,
    lineHeight: 20,
  },
});
