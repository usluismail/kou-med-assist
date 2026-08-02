import { useState, type ReactNode } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Image } from "expo-image";
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
import { colors } from "@/lib/theme";

const gallery = [
  { src: require("../assets/campus/campus-1.jpg"), alt: "Hastane girişi" },
  { src: require("../assets/campus/campus-2.jpg"), alt: "Yerleşke" },
  { src: require("../assets/campus/campus-3.jpg"), alt: "Amfi" },
];

const integrations = [
  { label: "HBYS Servisi", icon: Stethoscope },
  { label: "OBS Bağlantısı", icon: Link2 },
  { label: "Kütüphane Veritabanı", icon: BookMarked },
  { label: "Aşılama Takip", icon: Syringe },
];

export default function Index() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const insets = useSafeAreaInsets();

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
                <Stethoscope size={20} color={colors.white} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.brandTitle} numberOfLines={1}>
                  KOÜ <Text style={{ color: colors.success }}>Tıp</Text> Fakültesi
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
              <LogIn size={15} color={colors.white} />
              <Text style={styles.loginText}>Giriş Yap</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.main}>
          <View style={styles.hero}>
            <Image
              source={require("../assets/campus/hero-campus.jpg")}
              style={styles.heroImg}
              contentFit="cover"
            />
            <View style={styles.heroGradient} />
            <View style={styles.heroContent}>
              <View style={styles.badgeSuccess}>
                <Text style={styles.badgeSuccessText}>Kampüs & Haberler</Text>
              </View>
              <Text style={styles.heroTitle}>
                Yeni Tıp Fakültesi Araştırma Laboratuvarı Hizmete Açıldı
              </Text>
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
                <Text style={styles.cardSub}>Fakülte Haritası ve Blok Rehberi</Text>
              </View>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 16 }}>
              {gallery.map((g) => (
                <Image
                  key={g.alt}
                  source={g.src}
                  style={styles.galleryImg}
                  contentFit="cover"
                />
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
    backgroundColor: colors.clinical,
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
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  brandTitle: { fontSize: 16, fontWeight: "800", color: colors.clinicalForeground },
  brandSub: { fontSize: 11, color: colors.white60, marginTop: 2 },
  loginBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  loginText: { color: colors.white, fontSize: 12, fontWeight: "700" },
  main: { paddingHorizontal: 16, paddingTop: 16, gap: 16 },
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
  galleryImg: {
    width: 128,
    height: 96,
    borderRadius: 16,
    marginRight: 12,
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
