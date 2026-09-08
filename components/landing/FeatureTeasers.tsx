/**
 * FeatureTeasers.tsx — Giriş sonrası özelliklerin vitrin kartları.
 * Kullanıcıya "bu bizim uygulamamız" güveni verir; girişe yönlendirir.
 */
import { Pressable, StyleSheet, Text, View } from "react-native";
import { BookOpenCheck, ClipboardList, Lock, MoonStar } from "lucide-react-native";
import { landingColors } from "@/lib/theme";

type Props = {
  onLoginPress: () => void;
};

const teasers = [
  {
    id: "logbook",
    icon: ClipboardList,
    title: "E-Karne / U-ÇEP",
    sub: "Klinik girişimleri dijital kaydet, hocaya onaylat",
    bg: landingColors.tileEmerald,
    fg: landingColors.tileEmeraldFg,
  },
  {
    id: "osce",
    icon: BookOpenCheck,
    title: "OSCE Notlama",
    sub: "İstasyon rubrikleri ve sınav takibi tek yerde",
    bg: landingColors.tileViolet,
    fg: landingColors.tileVioletFg,
  },
  {
    id: "shifts",
    icon: MoonStar,
    title: "Nöbet & Takas",
    sub: "İntörn çizelgesi ve takas talepleri",
    bg: landingColors.tileSky,
    fg: landingColors.tileSkyFg,
  },
];

export function FeatureTeasers({ onLoginPress }: Props) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Giriş sonrası özellikler</Text>
      <Text style={styles.sectionSub}>
        Öğrenci ve akademisyen panelleri hesabınla açılır.
      </Text>

      <View style={styles.list}>
        {teasers.map((t) => {
          const Icon = t.icon;
          return (
            <Pressable
              key={t.id}
              onPress={onLoginPress}
              style={({ pressed }) => [
                styles.card,
                { backgroundColor: t.bg },
                pressed && { opacity: 0.9 },
              ]}
            >
              <View style={styles.cardTop}>
                <Icon size={22} color={t.fg} strokeWidth={2} />
                <View style={styles.lockChip}>
                  <Lock size={11} color={t.fg} strokeWidth={2.5} />
                </View>
              </View>
              <Text style={[styles.title, { color: t.fg }]}>{t.title}</Text>
              <Text style={[styles.sub, { color: t.fg }]}>{t.sub}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 28,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: landingColors.primaryDark,
    letterSpacing: -0.3,
  },
  sectionSub: {
    fontSize: 12,
    color: landingColors.textSub,
    marginTop: 4,
    marginBottom: 14,
  },
  list: { gap: 10 },
  card: {
    borderRadius: 20,
    padding: 16,
    gap: 8,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  lockChip: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "rgba(255,255,255,0.55)",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
  sub: {
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 16,
    opacity: 0.85,
  },
});
