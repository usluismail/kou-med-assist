/**
 * app/hastane.tsx — Umuttepe Sağlık Yerleşkesi blok/kat rehberi.
 */
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { MapPin, Search } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PortalSubHeader } from "@/components/landing/PortalSubHeader";
import { fetchHospitalPlaces } from "@/lib/api";
import { usePublicResource } from "@/lib/api/hooks/core";
import type { HospitalPlace, HospitalPlaceCategory } from "@/lib/api/types";
import { landingColors } from "@/lib/theme";

const FALLBACK: HospitalPlace[] = [
  {
    id: "hp-1",
    name: "Acil Triyaj",
    block: "Acil Blok",
    floor: "Zemin",
    category: "acil",
    hint: "Ana acil girişi · 7/24",
    tags: ["acil", "triyaj"],
  },
  {
    id: "hp-2",
    name: "Kardiyoloji Polikliniği",
    block: "B Blok",
    floor: "2. Kat",
    category: "poliklinik",
    hint: "Asansör B2 · Poliklinik koridoru",
    tags: ["kardiyoloji"],
  },
  {
    id: "hp-4",
    name: "Amfi 1",
    block: "Morfoloji",
    floor: "Zemin",
    category: "amfi",
    hint: "Ana amfi · 280 kişilik",
    tags: ["amfi"],
  },
  {
    id: "hp-8",
    name: "Dekanlık",
    block: "İdari Blok",
    floor: "2. Kat",
    category: "idari",
    hint: "Öğrenci işleri aynı koridorda",
    tags: ["dekanlık"],
  },
];

const CAT_META: Record<
  HospitalPlaceCategory,
  { label: string; bg: string; fg: string }
> = {
  poliklinik: { label: "Poliklinik", bg: "#DCEAF8", fg: "#1B4F7A" },
  amfi: { label: "Amfi", bg: "#E7E1F6", fg: "#5B3A9E" },
  acil: { label: "Acil", bg: "#F8DDD4", fg: "#8B3A2A" },
  lab: { label: "Laboratuvar", bg: "#D8F0E4", fg: "#0C5C3D" },
  idari: { label: "İdari", bg: "#FDE8D0", fg: "#9A4A12" },
  servis: { label: "Servis", bg: "#E8EEF2", fg: "#3A4A55" },
};

const FILTERS: Array<"tumu" | HospitalPlaceCategory> = [
  "tumu",
  "poliklinik",
  "amfi",
  "acil",
  "lab",
  "servis",
  "idari",
];

export default function HastaneScreen() {
  const insets = useSafeAreaInsets();
  const { data, loading } = usePublicResource(fetchHospitalPlaces);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("tumu");

  const items = data?.length ? data : FALLBACK;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((p) => {
      if (filter !== "tumu" && p.category !== filter) return false;
      if (!q) return true;
      const hay = `${p.name} ${p.block} ${p.floor} ${p.hint} ${p.tags.join(" ")}`.toLowerCase();
      return hay.includes(q);
    });
  }, [items, query, filter]);

  return (
    <View style={styles.root}>
      <PortalSubHeader kicker="UMUTTEPE" title="Hastane Rehberi" />

      <View style={styles.searchWrap}>
        <Search size={16} color={landingColors.textMuted} strokeWidth={2.2} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Poliklinik, amfi veya blok ara"
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
          const label = f === "tumu" ? "Tümü" : CAT_META[f].label;
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

        {filtered.map((place) => {
          const meta = CAT_META[place.category] ?? CAT_META.servis;
          return (
            <View key={place.id} style={styles.card}>
              <View style={[styles.catPill, { backgroundColor: meta.bg }]}>
                <Text style={[styles.catText, { color: meta.fg }]}>{meta.label}</Text>
              </View>
              <Text style={styles.name}>{place.name}</Text>
              <View style={styles.locRow}>
                <MapPin size={13} color={landingColors.primary} strokeWidth={2.4} />
                <Text style={styles.loc}>
                  {place.block} · {place.floor}
                </Text>
              </View>
              <Text style={styles.hint}>{place.hint}</Text>
            </View>
          );
        })}

        {!loading && filtered.length === 0 ? (
          <Text style={styles.empty}>Aramanıza uygun birim bulunamadı.</Text>
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
  searchInput: { flex: 1, fontSize: 14, color: landingColors.text, padding: 0 },
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
    backgroundColor: landingColors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: landingColors.glassBorder,
    padding: 16,
    gap: 6,
  },
  catPill: {
    alignSelf: "flex-start",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 2,
  },
  catText: { fontSize: 10, fontWeight: "800", letterSpacing: 0.4 },
  name: {
    fontSize: 16,
    fontWeight: "800",
    color: landingColors.text,
    letterSpacing: -0.2,
  },
  locRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  loc: { fontSize: 13, fontWeight: "600", color: landingColors.primary },
  hint: { fontSize: 12, color: landingColors.textSub, lineHeight: 16 },
  empty: {
    textAlign: "center",
    marginTop: 32,
    color: landingColors.textMuted,
    fontSize: 13,
  },
});
