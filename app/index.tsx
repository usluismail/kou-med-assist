import { useState, type ReactNode } from "react";
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Image } from "expo-image";
import { Redirect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowUpRight,
  Bell,
  BookMarked,
  Link2,
  LogIn,
  MapPinned,
  Stethoscope,
  Syringe,
  UtensilsCrossed,
} from "lucide-react-native";
import { LoginSheet } from "@/components/LoginSheet";
import { useAuth } from "@/lib/api/AuthContext";
import { colors } from "@/lib/theme";

const HERO_GAP = 12;
const SCREEN_PAD = 16;
const HERO_WIDTH = Dimensions.get("window").width - SCREEN_PAD * 2;

const heroSlides = [
  {
    id: "h1",
    src: require("../assets/campus/hero-campus.jpg"),
    badge: "Kampüs & Haberler",
    title: "Yeni Tıp Fakültesi Araştırma Laboratuvarı Hizmete Açıldı",
    place: "Araştırma Laboratuvarları · Umuttepe",
  },
  {
    id: "h2",
    src: require("../assets/campus/campus-1.jpg"),
    badge: "Yerleşke",
    title: "Kocaeli Üniversitesi Tıp Fakültesi Ana Giriş",
    place: "Ana Giriş Kapısı · Tıp Fakültesi",
  },
  {
    id: "h3",
    src: require("../assets/campus/campus-2.jpg"),
    badge: "Kampüs",
    title: "Umuttepe Yerleşkesi Merkez Avlu",
    place: "Merkez Avlu · Umuttepe Yerleşkesi",
  },
  {
    id: "h4",
    src: require("../assets/campus/campus-3.jpg"),
    badge: "Eğitim",
    title: "Tıp Fakültesi Büyük Amfi ve Derslikler",
    place: "Büyük Amfi · Eğitim Bloğu",
  },
  {
    id: "h5",
    src: require("../assets/campus/hero-campus.jpg"),
    badge: "Hastane",
    title: "KOÜ Araştırma ve Uygulama Hastanesi",
    place: "Uygulama Hastanesi · Umuttepe",
  },
];

const gallery = [
  {
    id: "g1",
    src: require("../assets/campus/campus-1.jpg"),
    label: "Ana Giriş",
    place: "Tıp Fakültesi Kapısı",
  },
  {
    id: "g2",
    src: require("../assets/campus/campus-2.jpg"),
    label: "Merkez Avlu",
    place: "Umuttepe Yerleşkesi",
  },
  {
    id: "g3",
    src: require("../assets/campus/campus-3.jpg"),
    label: "Büyük Amfi",
    place: "Eğitim Bloğu",
  },
  {
    id: "g4",
    src: require("../assets/campus/hero-campus.jpg"),
    label: "Araştırma Lab",
    place: "Laboratuvarlar Bloku",
  },
  {
    id: "g5",
    src: require("../assets/campus/campus-2.jpg"),
    label: "Dekanlık",
    place: "İdari Binalar",
  },
  {
    id: "g6",
    src: require("../assets/campus/campus-1.jpg"),
    label: "Acil Tıp",
    place: "Uygulama Hastanesi",
  },
];

const integrations = [
  { label: "HBYS Servisi", icon: Stethoscope },
  { label: "OBS Bağlantısı", icon: Link2 },
  { label: "Kütüphane Veritabanı", icon: BookMarked },
  { label: "Aşılama Takip", icon: Syringe },
];

export default function Index() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);
  const insets = useSafeAreaInsets();
  const { ready, token, user } = useAuth();

  if (ready && token && user?.role === "student") {
    return <Redirect href="/ogrenci" />;
  }
  if (ready && token && user?.role === "faculty") {
    return <Redirect href="/akademisyen" />;
  }

  const onHeroScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const idx = Math.round(x / (HERO_WIDTH + HERO_GAP));
    if (idx !== heroIndex && idx >= 0 && idx < heroSlides.length) {
      setHeroIndex(idx);
    }
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View style={styles.brandRow}>
              <View style={styles.logo}>
                <Stethoscope size={20} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.brandTitle} numberOfLines={1}>
                  KOÜ <Text style={{ color: "#B8F0C8" }}>Tıp</Text> Fakültesi
                </Text>
                <Text style={styles.brandSub} numberOfLines={1}>
                  Umuttepe Yerleşkesi · Kocaeli
                </Text>
              </View>
            </View>
            <Pressable
              onPress={() => setSheetOpen(true)}
              style={({ pressed }) => [styles.loginBtn, pressed && { opacity: 0.9 }]}
            >
              <LogIn size={15} color={colors.primary} />
              <Text style={styles.loginText}>Giriş Yap</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.main}>
          <View>
            <ScrollView
              horizontal
              pagingEnabled={false}
              decelerationRate="fast"
              snapToInterval={HERO_WIDTH + HERO_GAP}
              snapToAlignment="start"
              showsHorizontalScrollIndicator={false}
              onScroll={onHeroScroll}
              scrollEventThrottle={16}
              contentContainerStyle={{ gap: HERO_GAP }}
            >
              {heroSlides.map((slide) => (
                <View key={slide.id} style={[styles.hero, { width: HERO_WIDTH }]}>
                  <Image
                    source={slide.src}
                    style={styles.heroImg}
                    contentFit="cover"
                  />
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
                <View
                  key={s.id}
                  style={[styles.dot, i === heroIndex && styles.dotActive]}
                />
              ))}
            </View>
          </View>

          <View style={styles.bentoRow}>
            <BentoCard
              icon={UtensilsCrossed}
              title="Tıp Yemekhane"
              badge="Öğle Yemeği"
              badgeBg={colors.success}
              badgeFg={colors.successForeground}
            >
              {["Mercimek Çorbası", "Izgara Köfte", "Pilav"].map((m) => (
                <Text key={m} style={styles.menuItem}>
                  • {m}
                </Text>
              ))}
            </BentoCard>
            <BentoCard
              icon={Bell}
              title="Fakülte Duyuruları"
              badge="3 Yeni"
              badgeBg={colors.warning}
              badgeFg={colors.warningForeground}
            >
              <Text style={styles.menuItem}>
                2026-2027 Dönem 6 İntörn Nöbet Listeleri Yayınlandı
              </Text>
            </BentoCard>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.softIcon}>
                <MapPinned size={18} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>Umuttepe Yerleşkesi</Text>
                <Text style={styles.cardSub}>
                  KOÜ Tıp Fakültesi · Harita ve Blok Rehberi
                </Text>
              </View>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginTop: 16 }}
              contentContainerStyle={{ paddingRight: 4 }}
            >
              {gallery.map((g) => (
                <View key={g.id} style={styles.galleryItem}>
                  <Image
                    source={g.src}
                    style={styles.galleryImg}
                    contentFit="cover"
                  />
                  <Text style={styles.galleryLabel} numberOfLines={1}>
                    {g.label}
                  </Text>
                  <Text style={styles.galleryPlace} numberOfLines={1}>
                    {g.place}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Hızlı Eklentiler</Text>
            <Text style={styles.cardSub}>Kurumsal servis entegrasyonları</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginTop: 12 }}
              contentContainerStyle={{ gap: 8 }}
            >
              {integrations.map((i) => (
                <View key={i.label} style={styles.chip}>
                  <i.icon size={14} color={colors.primary} />
                  <Text style={styles.chipText}>{i.label}</Text>
                </View>
              ))}
            </ScrollView>
          </View>

          <Text style={styles.footer}>
            Kocaeli Üniversitesi Bilgi İşlem Daire Başkanlığı © 2026
          </Text>
        </View>
      </ScrollView>

      {sheetOpen && <LoginSheet onClose={() => setSheetOpen(false)} />}
    </View>
  );
}

function BentoCard({
  icon: Icon,
  title,
  badge,
  badgeBg,
  badgeFg,
  children,
}: {
  icon: typeof Bell;
  title: string;
  badge?: string;
  badgeBg: string;
  badgeFg: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.bento}>
      <View style={styles.softIcon}>
        <Icon size={18} color={colors.primary} />
      </View>
      <Text style={styles.bentoTitle}>{title}</Text>
      {badge ? (
        <View style={[styles.badge, { backgroundColor: badgeBg }]}>
          <Text style={[styles.badgeText, { color: badgeFg }]}>{badge}</Text>
        </View>
      ) : null}
      <View style={{ marginTop: 6 }}>{children}</View>
      <View style={styles.bentoArrowWrap}>
        <View style={styles.bentoArrow}>
          <ArrowUpRight size={17} color={colors.white} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.primaryDark,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 8,
  },
  headerRow: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  brandRow: { flex: 1, flexDirection: "row", alignItems: "center", gap: 12 },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  brandTitle: { fontSize: 16, fontWeight: "800", color: colors.white },
  brandSub: { fontSize: 11, color: "rgba(255,255,255,0.75)", marginTop: 2 },
  loginBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.white,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  loginText: { color: colors.primary, fontSize: 12, fontWeight: "700" },
  main: { paddingHorizontal: SCREEN_PAD, paddingTop: 16, gap: 16 },
  hero: { height: 224, borderRadius: 24, overflow: "hidden" },
  heroImg: { ...StyleSheet.absoluteFill },
  heroGradient: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(26,35,50,0.55)",
  },
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
  heroTitle: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "800",
    color: colors.white,
    lineHeight: 24,
  },
  heroPlace: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "500",
    color: "rgba(255,255,255,0.85)",
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginTop: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border,
  },
  dotActive: {
    width: 18,
    backgroundColor: colors.primary,
  },
  bentoRow: { flexDirection: "row", gap: 16 },
  bento: {
    flex: 1,
    minHeight: 176,
    backgroundColor: colors.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
  },
  softIcon: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  bentoTitle: { marginTop: 12, fontSize: 14, fontWeight: "700", color: colors.foreground },
  badge: {
    marginTop: 6,
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: { fontSize: 10, fontWeight: "700", textTransform: "uppercase" },
  menuItem: { fontSize: 12, color: colors.mutedForeground, lineHeight: 18 },
  bentoArrowWrap: { marginTop: "auto", paddingTop: 12, alignItems: "flex-end" },
  bentoArrow: {
    width: 36,
    height: 36,
    borderRadius: 999,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
  },
  cardHeader: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  cardTitle: { fontSize: 16, fontWeight: "700", color: colors.foreground },
  cardSub: { fontSize: 12, color: colors.mutedForeground, marginTop: 2 },
  galleryItem: { width: 140, marginRight: 12 },
  galleryImg: {
    width: 140,
    height: 100,
    borderRadius: 16,
  },
  galleryLabel: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "700",
    color: colors.foreground,
  },
  galleryPlace: {
    marginTop: 2,
    fontSize: 11,
    color: colors.mutedForeground,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.secondary,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipText: { fontSize: 12, fontWeight: "600", color: colors.secondaryForeground },
  footer: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 11,
    color: colors.mutedForeground,
  },
});
