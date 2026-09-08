/**
 * app/index.tsx — Landing & auth yönlendirme sayfası.
 *
 * SRP: Bu dosya yalnızca iki şeyden sorumlu:
 *   1. Oturum varsa kullanıcıyı rol bazlı anasayfaya yönlendir.
 *   2. Oturum yoksa kırık beyaz kurumsal landing ekranını göster.
 *
 * Tüm görsel bileşenler `@/components/landing/` içinde kendi SRP'leriyle yaşıyor.
 */
import { useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Image } from "expo-image";
import { Redirect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LoginSheet } from "@/components/LoginSheet";
import { useAuth } from "@/lib/api/AuthContext";
import { ROLE_HOME_HREF } from "@/lib/nav";
import { landingColors } from "@/lib/theme";
import { HeroCard } from "@/components/landing/HeroCard";
import { ExploreGrid } from "@/components/landing/ExploreGrid";
import { FeaturedScroll } from "@/components/landing/FeaturedScroll";
import { AnnouncementPreview } from "@/components/landing/AnnouncementPreview";
import { AcademicCalendarPreview } from "@/components/landing/AcademicCalendarPreview";
import { HospitalBanner } from "@/components/landing/HospitalBanner";
import { FeatureTeasers } from "@/components/landing/FeatureTeasers";
import { CorporateStory } from "@/components/landing/CorporateStory";

export default function Index() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const insets = useSafeAreaInsets();
  const { ready, token, user } = useAuth();

  // ── Auth redirect ─────────────────────────────────────────────────────────
  if (ready && token && user) {
    const getHref = ROLE_HOME_HREF[user.role];
    if (getHref) return <Redirect href={getHref(user)} />;
  }

  // ── Landing ───────────────────────────────────────────────────────────────
  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={landingColors.bg} />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 48 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero (kendi header'ını içeriyor — logo + giriş yap + kampüs kartı) */}
        <HeroCard onSwipeComplete={() => setSheetOpen(true)} />

        {/* Giriş yapmadan keşfet — yatay kaydırılabilir tile'lar */}
        <ExploreGrid />

        {/* Öne çıkanlar carousel */}
        <FeaturedScroll />

        {/* Duyurular önizleme */}
        <AnnouncementPreview />

        {/* Akademik ajanda önizleme */}
        <AcademicCalendarPreview />

        {/* Hastane rehberi banner */}
        <HospitalBanner />

        {/* Giriş sonrası özellik vitrini */}
        <FeatureTeasers onLoginPress={() => setSheetOpen(true)} />

        {/* 1994 kurumsal kimlik */}
        <CorporateStory />

        {/* Kocaeli silüeti — kenardan kenara, doğal oran */}
        <View style={styles.skylineWrap}>
          <Image
            source={require("../assets/campus/kocaeli-skyline.png")}
            style={styles.skyline}
            contentFit="contain"
            contentPosition="left"
            accessibilityLabel="Kocaeli şehir silüeti"
          />
        </View>

        {/* Footer — silüetin hemen altında */}
        <Text style={styles.footer}>
          Kocaeli Üniversitesi Tıp Fakültesi Dekanlığı © 2026
        </Text>
      </ScrollView>

      {/* ── Login Sheet ─────────────────────────────────────────────────── */}
      {sheetOpen && <LoginSheet onClose={() => setSheetOpen(false)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: landingColors.bg,
  },
  scrollContent: {
    gap: 0,
  },
  skylineWrap: {
    marginTop: 20,
    marginHorizontal: 0,
    width: "100%",
    alignSelf: "stretch",
    overflow: "hidden",
  },
  skyline: {
    width: "100%",
    // Kırpılmış PNG oranı (~1446×283) — yatay full, dikey doğal
    aspectRatio: 1446 / 283,
  },
  footer: {
    marginTop: 6,
    marginBottom: 8,
    paddingHorizontal: 16,
    textAlign: "center",
    fontSize: 11,
    color: landingColors.textMuted,
    letterSpacing: 0.3,
  },
});

