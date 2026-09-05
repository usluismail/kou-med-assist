/**
 * app/index.tsx — Landing & auth yönlendirme sayfası.
 *
 * SRP: Bu dosya yalnızca iki şeyden sorumlu:
 *   1. Oturum varsa kullanıcıyı rol bazlı anasayfaya yönlendir.
 *   2. Oturum yoksa "Clinical Dark Emerald" landing ekranını göster.
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
import { Redirect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LoginSheet } from "@/components/LoginSheet";
import { useAuth } from "@/lib/api/AuthContext";
import { ROLE_HOME_HREF } from "@/lib/nav";
import { landingColors } from "@/lib/theme";
import {
  HeroCard,
  ExploreGrid,
  FeaturedScroll,
  AnnouncementPreview,
  HospitalBanner,
} from "@/components/landing";

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
      <StatusBar barStyle="light-content" backgroundColor={landingColors.bg} />

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

        {/* Hastane rehberi banner */}
        <HospitalBanner />

        {/* Footer */}
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
  footer: {
    marginTop: 32,
    marginBottom: 8,
    textAlign: "center",
    fontSize: 11,
    color: landingColors.textMuted,
    letterSpacing: 0.3,
  },
});

