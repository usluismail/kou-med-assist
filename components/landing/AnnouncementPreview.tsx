/**
 * AnnouncementPreview.tsx — Duyurular önizleme (beyaz kurumsal kart).
 * Referans: sol tarih bloğu + birim etiketi + "Tümünü gör".
 */
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { useRouter } from "expo-router";
import { landingColors } from "@/lib/theme";

type Announcement = {
  id: string;
  day: string;
  month: string;
  unit: string;
  badge: string;
  badgeBg: string;
  badgeText: string;
  title: string;
};

const announcements: Announcement[] = [
  {
    id: "a1",
    day: "05",
    month: "EYL",
    unit: "Dekanlık",
    badge: "KLİNİK",
    badgeBg: landingColors.badgeClinical,
    badgeText: landingColors.badgeClinicalText,
    title: "Dönem 6 İntörn Nöbet Listeleri Yayınlandı",
  },
  {
    id: "a2",
    day: "03",
    month: "EYL",
    unit: "Öğrenci İşleri",
    badge: "AKADEMİK",
    badgeBg: landingColors.badgeAcademic,
    badgeText: landingColors.badgeAcademicText,
    title: "2026-2027 Eğitim-Öğretim Yılı Açılış Programı",
  },
  {
    id: "a3",
    day: "01",
    month: "EYL",
    unit: "Tıp Eğitimi AD",
    badge: "FAKÜLTE",
    badgeBg: landingColors.badgeFaculty,
    badgeText: landingColors.badgeFacultyText,
    title: "OSCE Sınavı Başvuru Takvimi Güncellendi",
  },
  {
    id: "a4",
    day: "28",
    month: "AĞU",
    unit: "Acil Tıp AD",
    badge: "KLİNİK",
    badgeBg: landingColors.badgeClinical,
    badgeText: landingColors.badgeClinicalText,
    title: "Acil Tıp Rotasyon Programı Değişikliği Hk.",
  },
];

export function AnnouncementPreview() {
  const router = useRouter();

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Duyurular</Text>
        <Pressable style={styles.seeAll} onPress={() => router.push("/duyurular")}>
          <Text style={styles.seeAllText}>Tümünü gör</Text>
          <ChevronRight size={13} color={landingColors.primary} strokeWidth={2.5} />
        </Pressable>
      </View>

      <View style={styles.card}>
        {announcements.map((ann, idx) => (
          <View key={ann.id}>
            {idx > 0 && <View style={styles.divider} />}
            <Pressable
              style={({ pressed }) => [
                styles.row,
                pressed && { backgroundColor: landingColors.primaryGlow },
              ]}
              onPress={() => router.push("/duyurular")}
            >
              <View style={styles.dateBadge}>
                <Text style={styles.dateDay}>{ann.day}</Text>
                <Text style={styles.dateMonth}>{ann.month}</Text>
              </View>

              <View style={styles.rowBody}>
                <Text style={styles.unit}>{ann.unit.toUpperCase()}</Text>
                <Text style={styles.annTitle} numberOfLines={2}>
                  {ann.title}
                </Text>
                <View style={[styles.catBadge, { backgroundColor: ann.badgeBg }]}>
                  <Text style={[styles.catBadgeText, { color: ann.badgeText }]}>
                    {ann.badge}
                  </Text>
                </View>
              </View>

              <ChevronRight size={16} color={landingColors.textMuted} strokeWidth={2} />
            </Pressable>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { paddingHorizontal: 16, marginTop: 28 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: landingColors.primaryDark,
    letterSpacing: -0.3,
  },
  seeAll: { flexDirection: "row", alignItems: "center", gap: 2 },
  seeAllText: { fontSize: 13, fontWeight: "600", color: landingColors.primary },

  card: {
    borderRadius: 22,
    backgroundColor: landingColors.bgCard,
    borderWidth: 1,
    borderColor: landingColors.glassBorder,
    overflow: "hidden",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  divider: {
    height: 1,
    backgroundColor: landingColors.divider,
    marginHorizontal: 16,
  },

  dateBadge: {
    width: 46,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  dateDay: {
    fontSize: 18,
    fontWeight: "800",
    color: landingColors.text,
    fontVariant: ["tabular-nums"],
    lineHeight: 20,
  },
  dateMonth: {
    fontSize: 10,
    fontWeight: "700",
    color: landingColors.textMuted,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },

  rowBody: { flex: 1, gap: 4 },
  unit: {
    fontSize: 10,
    fontWeight: "600",
    color: landingColors.textMuted,
    letterSpacing: 0.4,
  },
  catBadge: {
    alignSelf: "flex-start",
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
    marginTop: 2,
  },
  catBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  annTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: landingColors.text,
    lineHeight: 18,
  },
});
