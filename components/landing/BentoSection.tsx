/**
 * BentoSection.tsx — Yemekhane ve duyuru bento kartları.
 *
 * SRP: Yalnızca bento kart düzeninden sorumlu.
 */
import { type ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ArrowUpRight, Bell, UtensilsCrossed } from "lucide-react-native";
import { colors } from "@/lib/theme";

type BentoCardProps = {
  icon: typeof Bell;
  title: string;
  badge?: string;
  badgeBg: string;
  badgeFg: string;
  children: ReactNode;
};

function BentoCard({ icon: Icon, title, badge, badgeBg, badgeFg, children }: BentoCardProps) {
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

export function BentoSection() {
  return (
    <View style={styles.bentoRow}>
      <BentoCard
        icon={UtensilsCrossed}
        title="Tıp Yemekhane"
        badge="Öğle Yemeği"
        badgeBg={colors.success}
        badgeFg={colors.successForeground}
      >
        {["Mercimek Çorbası", "Izgara Köfte", "Pilav"].map((m) => (
          <Text key={m} style={styles.menuItem}>• {m}</Text>
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
  );
}

const styles = StyleSheet.create({
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
});
