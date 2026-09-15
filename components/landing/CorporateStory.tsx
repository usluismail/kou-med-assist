/**
 * CorporateStory.tsx — 1994'ten bugüne kısa kurumsal kimlik şeridi.
 */
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { landingColors } from "@/lib/theme";

const milestones = [
  { year: "1994", label: "Kuruluş" },
  { year: "30+", label: "Yıl" },
  { year: "6", label: "Dönem" },
];

export function CorporateStory() {
  const router = useRouter();

  return (
    <View style={styles.section}>
      <View style={styles.card}>
        <Text style={styles.kicker}>KOCAELİ ÜNİVERSİTESİ TIP FAKÜLTESİ</Text>
        <Text style={styles.title}>1994’ten beri Umuttepe’de</Text>
        <Text style={styles.body}>
          Köklü tıp geleneği, klinik eğitim ve Araştırma Hastanesi’nin akademik
          ciddiyetini tek mobil portalda buluşturuyoruz.
        </Text>

        <View style={styles.stats}>
          {milestones.map((m) => (
            <View key={m.year} style={styles.stat}>
              <Text style={styles.statValue}>{m.year}</Text>
              <Text style={styles.statLabel}>{m.label}</Text>
            </View>
          ))}
        </View>

        <Pressable
          style={({ pressed }) => [styles.cta, pressed && { opacity: 0.88 }]}
          onPress={() => router.push("/akademik-kadro")}
        >
          <Text style={styles.ctaText}>Akademik kadroyu gör</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  card: {
    borderRadius: 24,
    backgroundColor: landingColors.primaryDark,
    padding: 22,
    gap: 10,
  },
  kicker: {
    fontSize: 10,
    fontWeight: "800",
    color: landingColors.ctaLime,
    letterSpacing: 1.1,
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: landingColors.white,
    letterSpacing: -0.6,
    lineHeight: 28,
  },
  body: {
    fontSize: 13,
    color: "rgba(255,255,255,0.78)",
    lineHeight: 19,
  },
  stats: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  stat: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "900",
    color: landingColors.white,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "rgba(255,255,255,0.65)",
    marginTop: 2,
  },
  cta: {
    marginTop: 8,
    alignSelf: "flex-start",
    backgroundColor: landingColors.ctaLime,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  ctaText: {
    fontSize: 13,
    fontWeight: "800",
    color: landingColors.heroEmerald,
  },
});
