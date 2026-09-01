/**
 * IntegrationChips.tsx — Hızlı eklenti chip listesi.
 *
 * SRP: Yalnızca kurumsal servis entegrasyon chip'lerinden sorumlu.
 */
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { BookMarked, Link2, Stethoscope, Syringe } from "lucide-react-native";
import { colors } from "@/lib/theme";

const integrations = [
  { label: "HBYS Servisi",         icon: Stethoscope },
  { label: "OBS Bağlantısı",       icon: Link2       },
  { label: "Kütüphane Veritabanı", icon: BookMarked  },
  { label: "Aşılama Takip",        icon: Syringe     },
];

export function IntegrationChips() {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Hızlı Eklentiler</Text>
      <Text style={styles.cardSub}>Kurumsal servis entegrasyonları</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 12 }}
        contentContainerStyle={{ gap: 8 }}
      >
        {integrations.map((item) => (
          <View key={item.label} style={styles.chip}>
            <item.icon size={14} color={colors.primary} />
            <Text style={styles.chipText}>{item.label}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", color: colors.foreground },
  cardSub: { fontSize: 12, color: colors.mutedForeground, marginTop: 2 },
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
});
