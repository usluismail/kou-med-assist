/**
 * app/index.tsx — Landing & auth yönlendirme sayfası.
 *
 * SRP: Bu dosya yalnızca iki şeyden sorumlu:
 *   1. Oturum varsa kullanıcıyı rol bazlı anasayfaya yönlendir.
 *   2. Oturum yoksa landing ekranını göster.
 *
 * Tüm görsel bileşenler `@/components/landing/` içinde kendi SRP'leriyle yaşıyor.
 */
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Redirect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LogIn, Stethoscope } from "lucide-react-native";
import { LoginSheet } from "@/components/LoginSheet";
import { useAuth } from "@/lib/api/AuthContext";
import { ROLE_HOME_HREF } from "@/lib/nav";
import { colors } from "@/lib/theme";
import {
  HeroCarousel,
  BentoSection,
  GallerySection,
  IntegrationChips,
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
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ────────────────────────────────────────────────────── */}
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

        {/* ── İçerik ────────────────────────────────────────────────────── */}
        <View style={styles.main}>
          <HeroCarousel />
          <BentoSection />
          <GallerySection />
          <IntegrationChips />
          <Text style={styles.footer}>
            Kocaeli Üniversitesi Bilgi İşlem Daire Başkanlığı © 2026
          </Text>
        </View>
      </ScrollView>

      {sheetOpen && <LoginSheet onClose={() => setSheetOpen(false)} />}
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
  brandSub:   { fontSize: 11, color: "rgba(255,255,255,0.75)", marginTop: 2 },
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
  main:   { paddingHorizontal: 16, paddingTop: 16, gap: 16 },
  footer: { marginTop: 8, textAlign: "center", fontSize: 11, color: colors.mutedForeground },
});
