/**
 * app/duyurular.tsx — Detaylı duyuru listesi (arama + kategori + PDF).
 */
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { ChevronRight, FileText, Search } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PortalSubHeader } from "@/components/landing/PortalSubHeader";
import { fetchPortalAnnouncements } from "@/lib/api";
import { usePublicResource } from "@/lib/api/hooks/core";
import type { PortalAnnouncement, PortalAnnouncementCategory } from "@/lib/api/types";
import { landingColors } from "@/lib/theme";

const FALLBACK: PortalAnnouncement[] = [
  {
    id: "pa-1",
    day: "05",
    month: "EYL",
    dateIso: "2026-09-05",
    unit: "Dekanlık",
    category: "klinik",
    title: "Dönem 6 İntörn Nöbet Listeleri Yayınlandı",
    summary: "Eylül-Ekim dönemi nöbet çizelgesi ve takas kuralları.",
    body: "Nöbet listeleri yayınlanmıştır.",
    pdfUrl:
      "https://api.kocaeli.edu.tr/api/FileOperation/OpenFile?filePath=1084%2FDocument%2FFiles%2F2025%2F12%2F20251202_9f076_tip-fakultesi-2025-2026-akademik-takvimi-333.pdf",
  },
  {
    id: "pa-2",
    day: "03",
    month: "EYL",
    dateIso: "2026-09-03",
    unit: "Öğrenci İşleri",
    category: "akademik",
    title: "2026-2027 Eğitim-Öğretim Yılı Açılış Programı",
    summary: "Beyaz önlük töreni ve açılış konferansı takvimi.",
    body: "Açılış programı detayları.",
    pdfUrl: null,
  },
  {
    id: "pa-3",
    day: "01",
    month: "EYL",
    dateIso: "2026-09-01",
    unit: "Tıp Eğitimi AD",
    category: "fakulte",
    title: "OSCE Sınavı Başvuru Takvimi Güncellendi",
    summary: "Klinik beceri sınavı istasyon listesi.",
    body: "OSCE takvimi güncellendi.",
    pdfUrl: null,
  },
];

const CAT_META: Record<
  PortalAnnouncementCategory,
  { label: string; bg: string; fg: string; dateBg: string }
> = {
  klinik: {
    label: "KLİNİK",
    bg: landingColors.badgeClinical,
    fg: landingColors.badgeClinicalText,
    dateBg: "#F8DDD4",
  },
  akademik: {
    label: "AKADEMİK",
    bg: landingColors.badgeAcademic,
    fg: landingColors.badgeAcademicText,
    dateBg: "#DCEAF8",
  },
  fakulte: {
    label: "FAKÜLTE",
    bg: landingColors.badgeFaculty,
    fg: landingColors.badgeFacultyText,
    dateBg: "#D8F0E4",
  },
  staj: {
    label: "STAJ",
    bg: "rgba(180,145,58,0.12)",
    fg: landingColors.academicGold,
    dateBg: "#FDE8D0",
  },
};

const FILTERS: Array<"tumu" | PortalAnnouncementCategory> = [
  "tumu",
  "klinik",
  "akademik",
  "fakulte",
  "staj",
];

export default function DuyurularScreen() {
  const insets = useSafeAreaInsets();
  const { data, loading } = usePublicResource(fetchPortalAnnouncements);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("tumu");

  const items = data?.length ? data : FALLBACK;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((a) => {
      if (filter !== "tumu" && a.category !== filter) return false;
      if (!q) return true;
      return (
        a.title.toLowerCase().includes(q) ||
        a.unit.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q)
      );
    });
  }, [items, query, filter]);

  const openPdf = (url: string | null) => {
    if (!url) return;
    Linking.openURL(url).catch(() => {});
  };

  return (
    <View style={styles.root}>
      <PortalSubHeader kicker="KAMPÜS GÜNDEMİ" title="Duyurular" />

      <View style={styles.searchWrap}>
        <Search size={16} color={landingColors.textMuted} strokeWidth={2.2} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Duyuru veya birim ara"
          placeholderTextColor={landingColors.textMuted}
          style={styles.searchInput}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersScroll}
        contentContainerStyle={styles.filters}
      >
        {FILTERS.map((f) => {
          const active = filter === f;
          const label =
            f === "tumu" ? "Tümü" : CAT_META[f].label.charAt(0) + CAT_META[f].label.slice(1).toLowerCase();
          return (
            <Pressable
              key={f}
              onPress={() => setFilter(f)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView
        style={styles.listScroll}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        {loading && !data ? (
          <ActivityIndicator color={landingColors.primary} style={{ marginTop: 24 }} />
        ) : null}

        {filtered.map((ann) => {
          const meta = CAT_META[ann.category];
          return (
            <Pressable
              key={ann.id}
              style={({ pressed }) => [styles.card, pressed && { opacity: 0.92 }]}
              onPress={() => openPdf(ann.pdfUrl)}
            >
              <View style={[styles.dateBox, { backgroundColor: meta.dateBg }]}>
                <Text style={[styles.dateDay, { color: meta.fg }]}>{ann.day}</Text>
                <Text style={[styles.dateMonth, { color: meta.fg }]}>{ann.month}</Text>
              </View>
              <View style={styles.body}>
                <Text style={[styles.unit, { color: meta.fg }]}>{ann.unit.toUpperCase()}</Text>
                <Text style={styles.title} numberOfLines={2}>
                  {ann.title}
                </Text>
                <Text style={styles.summary} numberOfLines={2}>
                  {ann.summary}
                </Text>
                {ann.pdfUrl ? (
                  <View style={styles.pdfRow}>
                    <FileText size={12} color={landingColors.primary} strokeWidth={2.2} />
                    <Text style={styles.pdfText}>PDF ekini aç</Text>
                  </View>
                ) : null}
              </View>
              <ChevronRight size={16} color={landingColors.textMuted} />
            </Pressable>
          );
        })}

        {!loading && filtered.length === 0 ? (
          <Text style={styles.empty}>Aramanıza uygun duyuru bulunamadı.</Text>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: landingColors.bg },
  searchWrap: {
    marginHorizontal: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: landingColors.white,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: landingColors.glassBorder,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: landingColors.text,
    padding: 0,
  },
  // Horizontal ScrollView flex ile şişmesin (yoksa chip’ler dikey uzar)
  filtersScroll: {
    flexGrow: 0,
    flexShrink: 0,
    maxHeight: 44,
    marginBottom: 12,
  },
  filters: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: "center",
  },
  chip: {
    height: 36,
    borderRadius: 999,
    paddingHorizontal: 14,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: landingColors.white,
    borderWidth: 1,
    borderColor: landingColors.glassBorder,
  },
  chipActive: {
    backgroundColor: landingColors.primaryDark,
    borderColor: landingColors.primaryDark,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 16,
    color: landingColors.textSub,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  chipTextActive: { color: landingColors.white },
  listScroll: { flex: 1 },
  list: { flexGrow: 1, paddingHorizontal: 16, gap: 10 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: landingColors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: landingColors.glassBorder,
    padding: 14,
  },
  dateBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  dateDay: { fontSize: 16, fontWeight: "800", lineHeight: 18 },
  dateMonth: { fontSize: 9, fontWeight: "800", letterSpacing: 0.5 },
  body: { flex: 1, gap: 3 },
  unit: { fontSize: 10, fontWeight: "800", letterSpacing: 0.6 },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: landingColors.text,
    lineHeight: 19,
  },
  summary: {
    fontSize: 12,
    color: landingColors.textSub,
    lineHeight: 16,
  },
  pdfRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  pdfText: { fontSize: 11, fontWeight: "700", color: landingColors.primary },
  empty: {
    textAlign: "center",
    marginTop: 32,
    color: landingColors.textMuted,
    fontSize: 13,
  },
});
