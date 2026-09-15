/**
 * app/yemekhane.tsx — Klinik tray + görsel 1+2 karışımı.
 * Chart bandı (zümrüt→klinik mavi) + tepsi bölmeli kurs hücreleri.
 * Prototip: dairesel gün / lime kapsül / koyu kcal ring yok.
 */
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Leaf, MapPin, Stethoscope, UtensilsCrossed } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PortalSubHeader } from "@/components/landing/PortalSubHeader";
import { fetchCafeteriaWeek } from "@/lib/api";
import { usePublicResource } from "@/lib/api/hooks/core";
import type { CafeteriaMenu, MenuItem } from "@/lib/api/types";
import { landingColors } from "@/lib/theme";

const DAY_SHORT = ["PAZ", "PZT", "SAL", "ÇAR", "PER", "CUM", "CMT"];
const MONTH_LONG = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];

const PAD = 16;

type CourseRole = "corba" | "ana" | "garnitur" | "yan" | "tatli";

const COURSE_META: Record<
  CourseRole,
  { label: string; bg: string; fg: string; bar: string }
> = {
  corba: {
    label: "Çorba",
    bg: landingColors.tileSky,
    fg: landingColors.tileSkyFg,
    bar: "#3B82B8",
  },
  ana: {
    label: "Ana",
    bg: landingColors.tileEmerald,
    fg: landingColors.tileEmeraldFg,
    bar: landingColors.primary,
  },
  garnitur: {
    label: "Garnitür",
    bg: landingColors.tileMint,
    fg: landingColors.tileMintFg,
    bar: "#2A9B6E",
  },
  yan: {
    label: "Yan",
    bg: landingColors.tileAmber,
    fg: landingColors.tileAmberFg,
    bar: "#C4782A",
  },
  tatli: {
    label: "Tatlı·İçecek",
    bg: landingColors.tileViolet,
    fg: landingColors.tileVioletFg,
    bar: "#6B4FA0",
  },
};

const SOUP_KEYS = ["çorba", "corba"];
const MAIN_KEYS = [
  "tavuk", "et ", "köfte", "kofte", "fasulye", "şinitzel", "sinitzel",
  "sote", "ızgara", "izgara", "fırın", "firin", "balık", "balik", "kebap",
];
const SIDE_KEYS = ["pilav", "makarna", "bulgur", "patates", "pirinç", "pirinc"];
const YAN_KEYS = ["cacık", "cacik", "salata", "turşu", "tursu", "yoğurt", "yogurt"];
const DESSERT_KEYS = [
  "meyve", "ayran", "sütlaç", "sutlac", "komposto", "tatlı", "tatli",
  "puding", "kek", "su ",
];

function normalize(name: string) {
  return name.toLocaleLowerCase("tr-TR");
}

function matchAny(name: string, keys: string[]) {
  const n = normalize(name);
  return keys.some((k) => n.includes(k.trim()));
}

function courseRole(name: string, index: number, total: number): CourseRole {
  if (matchAny(name, SOUP_KEYS)) return "corba";
  if (matchAny(name, DESSERT_KEYS)) return "tatli";
  if (matchAny(name, YAN_KEYS)) return "yan";
  if (matchAny(name, SIDE_KEYS)) return "garnitur";
  if (matchAny(name, MAIN_KEYS)) return "ana";

  if (index === 0) return "corba";
  if (index === 1) return "ana";
  if (index === total - 1) return "tatli";
  if (index === total - 2) return "yan";
  return "garnitur";
}

function estimateProteinG(totalCal: number) {
  if (!totalCal) return 0;
  return Math.round((totalCal * 0.15) / 4);
}

function dayMenuItems(menu: CafeteriaMenu | undefined): MenuItem[] {
  return menu?.meals?.lunch ?? [];
}

function pickFiveDays(menus: CafeteriaMenu[], todayIso: string): CafeteriaMenu[] {
  if (!menus.length) return [];
  const sorted = [...menus].sort((a, b) => a.date.localeCompare(b.date));
  const todayIdx = sorted.findIndex((m) => m.date >= todayIso);
  const start = todayIdx >= 0 ? todayIdx : 0;
  const slice = sorted.slice(start, start + 5);
  if (slice.length < 5) {
    return sorted.slice(Math.max(0, sorted.length - 5));
  }
  return slice;
}

const FALLBACK: CafeteriaMenu[] = [
  {
    date: "2026-09-07",
    meals: {
      breakfast: [],
      lunch: [
        { name: "Mercimek Çorbası", calories: 150 },
        { name: "Tavuk Şinitzel", calories: 380, allergens: ["gluten"] },
        { name: "Bulgur Pilavı", calories: 220 },
        { name: "Cacık", calories: 90 },
        { name: "Meyve", calories: 60 },
      ],
      dinner: [],
    },
  },
  {
    date: "2026-09-08",
    meals: {
      breakfast: [],
      lunch: [
        { name: "Yayla Çorbası", calories: 130 },
        { name: "Et Sote", calories: 410 },
        { name: "Pirinç Pilavı", calories: 240 },
        { name: "Ayran", calories: 60 },
        { name: "Sütlaç", calories: 180, allergens: ["süt"] },
      ],
      dinner: [],
    },
  },
  {
    date: "2026-09-09",
    meals: {
      breakfast: [],
      lunch: [
        { name: "Kuru Fasulye", calories: 310 },
        { name: "Bulgur Pilavı", calories: 220 },
        { name: "Turşu", calories: 25 },
        { name: "Komposto", calories: 90 },
      ],
      dinner: [],
    },
  },
  {
    date: "2026-09-10",
    meals: {
      breakfast: [],
      lunch: [
        { name: "Izgara Köfte", calories: 360 },
        { name: "Pilav", calories: 230 },
        { name: "Cacık", calories: 90 },
        { name: "Meyve", calories: 55 },
      ],
      dinner: [],
    },
  },
  {
    date: "2026-09-11",
    meals: {
      breakfast: [],
      lunch: [
        { name: "Mercimek Çorbası", calories: 150 },
        { name: "Fırın Tavuk", calories: 340 },
        { name: "Makarna", calories: 280, allergens: ["gluten"] },
        { name: "Ayran", calories: 60 },
      ],
      dinner: [],
    },
  },
];

function parseIso(iso: string) {
  return new Date(iso + "T12:00:00");
}

export default function YemekhaneScreen() {
  const insets = useSafeAreaInsets();
  const { data, loading } = usePublicResource(fetchCafeteriaWeek);
  const allMenus = data?.length ? data : FALLBACK;

  const todayIso = new Date().toISOString().slice(0, 10);
  const menus = useMemo(() => pickFiveDays(allMenus, todayIso), [allMenus, todayIso]);

  const [selectedDate, setSelectedDate] = useState(todayIso);

  useEffect(() => {
    if (!menus.length) return;
    const hasSelected = menus.some((m) => m.date === selectedDate);
    if (!hasSelected) {
      const today = menus.find((m) => m.date === todayIso);
      setSelectedDate(today?.date ?? menus[0].date);
    }
  }, [menus, selectedDate, todayIso]);

  const selected =
    menus.find((m) => m.date === selectedDate) ??
    menus.find((m) => m.date === todayIso) ??
    menus[0];

  const items = dayMenuItems(selected);
  const totalCal = items.reduce((acc, i) => acc + (i.calories || 0), 0);
  const proteinEst = estimateProteinG(totalCal);

  const dateObj = selected ? parseIso(selected.date) : new Date();
  const monthTitle = `${MONTH_LONG[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
  const weekdayLong = dateObj.toLocaleDateString("tr-TR", { weekday: "long" });
  const headline = weekdayLong.charAt(0).toUpperCase() + weekdayLong.slice(1);
  const isToday = selected?.date === todayIso;

  return (
    <View style={styles.root}>
      <PortalSubHeader kicker="UMUTTEPE YEMEKHANE" title="Bugünkü menü" />

      {/* 1 — Klinik chart bandı */}
      <LinearGradient
        colors={["#0C5C3D", "#1A7A52", "#1B5F8A"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.chartBand}
      >
        <View style={styles.bandInner}>
          <MapPin size={14} color="rgba(255,255,255,0.92)" strokeWidth={2.4} />
          <Text style={styles.bandText}>Umuttepe · öğrenci yemekhanesi</Text>
        </View>
        <View style={styles.bandTicks}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <View key={i} style={styles.bandTick} />
          ))}
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={[styles.page, { paddingBottom: insets.bottom + 28 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Tarih şeridi */}
        <View style={styles.railBlock}>
          <Text style={styles.monthTitle}>{monthTitle}</Text>
          <View style={styles.rail}>
            {menus.map((m) => {
              const d = parseIso(m.date);
              const active = m.date === selected?.date;
              const isRailToday = m.date === todayIso;
              return (
                <Pressable
                  key={m.date}
                  onPress={() => setSelectedDate(m.date)}
                  style={[styles.railItem, active && styles.railItemActive]}
                >
                  <Text style={[styles.railWeek, active && styles.railWeekActive]}>
                    {DAY_SHORT[d.getDay()]}
                  </Text>
                  <Text style={[styles.railNum, active && styles.railNumActive]}>
                    {d.getDate()}
                  </Text>
                  {active ? <View style={styles.railUnderline} /> : null}
                  {!active && isRailToday ? <View style={styles.railTodayDot} /> : null}
                </Pressable>
              );
            })}
          </View>
        </View>

        {loading && !data ? (
          <ActivityIndicator color={landingColors.primary} style={{ marginTop: 8 }} />
        ) : null}

        {/* 2 — Tepsi silueti özet kartı */}
        <View style={styles.trayShell}>
          <View style={styles.trayRim} />
          <View style={styles.trayCard}>
            <View style={styles.trayAccent} />
            <View style={styles.trayBody}>
              <View style={styles.trayTop}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.trayKicker}>
                    {isToday ? "Bugünün menüsü" : "Seçili gün"}
                  </Text>
                  <Text style={styles.trayTitle}>{headline}</Text>
                  <Text style={styles.trayDate}>
                    {dateObj.getDate()} {MONTH_LONG[dateObj.getMonth()]} · öğle servisi
                  </Text>
                </View>
                <View style={styles.trayIconWrap}>
                  <UtensilsCrossed size={22} color={landingColors.primary} strokeWidth={2} />
                </View>
              </View>

              <View style={styles.chipRow}>
                <View style={styles.chip}>
                  <View style={[styles.chipDot, { backgroundColor: landingColors.primary }]} />
                  <Text style={styles.chipValue}>{totalCal || "—"}</Text>
                  <Text style={styles.chipLabel}>kcal</Text>
                </View>
                <View style={[styles.chip, styles.chipProtein]}>
                  <Leaf size={12} color={landingColors.primary} strokeWidth={2.4} />
                  <Text style={styles.chipValue}>~{proteinEst || "—"} g</Text>
                  <Text style={styles.chipLabel}>protein*</Text>
                </View>
                <View style={styles.chip}>
                  <View style={[styles.chipDot, { backgroundColor: "#1B5F8A" }]} />
                  <Text style={styles.chipValue}>{items.length}</Text>
                  <Text style={styles.chipLabel}>kalem</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Menü sırası</Text>
          <Text style={styles.sectionSub}>
            {items.length
              ? "Servis sırası · çorba → ana → garnitür → yan → tatlı"
              : "Menü yayınlanınca burada görünür"}
          </Text>
        </View>

        {items.length ? (
          <View style={styles.compartmentTray}>
            <View style={styles.trayHandle} />
            {items.map((item, idx) => {
              const role = courseRole(item.name, idx, items.length);
              const meta = COURSE_META[role];
              const isLast = idx === items.length - 1;
              return (
                <View key={`${item.name}-${idx}`} style={styles.compartmentWrap}>
                  {/* Timeline */}
                  <View style={styles.timelineCol}>
                    <View style={[styles.timelineDot, { backgroundColor: meta.bar }]} />
                    {!isLast ? (
                      <View style={[styles.timelineLine, { backgroundColor: `${meta.bar}33` }]} />
                    ) : null}
                  </View>

                  {/* Bölme hücresi */}
                  <View style={styles.compartment}>
                    <View style={[styles.compartmentBar, { backgroundColor: meta.bar }]} />
                    <View style={styles.compartmentInner}>
                      <View style={[styles.rolePill, { backgroundColor: meta.bg }]}>
                        <Text style={[styles.roleText, { color: meta.fg }]} numberOfLines={1}>
                          {meta.label}
                        </Text>
                      </View>
                      <View style={styles.courseBody}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        {item.allergens?.length ? (
                          <View style={styles.allergenRow}>
                            {item.allergens.map((a) => (
                              <View key={a} style={styles.allergenChip}>
                                <Text style={styles.allergenText}>{a}</Text>
                              </View>
                            ))}
                          </View>
                        ) : null}
                      </View>
                      <Text style={styles.cal}>{item.calories}</Text>
                      <Text style={styles.calUnit}>kcal</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <UtensilsCrossed size={28} color={landingColors.primary} strokeWidth={1.8} />
            <Text style={styles.emptyTitle}>Bu güne ait menü yok</Text>
            <Text style={styles.emptySub}>
              Menü yayınlandığında yemekler burada listelenir.
            </Text>
          </View>
        )}

        <View style={styles.tipCard}>
          <View style={styles.tipIcon}>
            <Stethoscope size={16} color={landingColors.primary} strokeWidth={2.2} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.tipTitle}>Klinik gün notu</Text>
            <Text style={styles.tipBody}>
              Uzun poliklinik veya nöbet öncesi öğünde protein + kompleks karbonhidrat
              dengesi enerjiyi daha dengeli taşır. *Protein değeri kabaca tahmindir;
              tıbbi öneri değildir.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: landingColors.bg },

  chartBand: {
    marginHorizontal: PAD,
    marginBottom: 4,
    borderRadius: 14,
    overflow: "hidden",
    minHeight: 48,
    justifyContent: "center",
  },
  bandInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 8,
  },
  bandText: {
    fontSize: 14,
    fontWeight: "700",
    color: "rgba(255,255,255,0.96)",
    letterSpacing: 0.2,
    textAlign: "center",
  },
  bandTicks: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingBottom: 8,
    opacity: 0.35,
  },
  bandTick: {
    width: 1,
    height: 6,
    backgroundColor: "#fff",
    borderRadius: 1,
  },

  page: {
    paddingHorizontal: PAD,
    gap: 14,
    paddingTop: 12,
  },

  railBlock: { gap: 10 },
  monthTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: landingColors.text,
    letterSpacing: -0.2,
  },
  rail: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: landingColors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: landingColors.glassBorder,
    paddingHorizontal: 6,
    paddingTop: 10,
    paddingBottom: 8,
  },
  railItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
    minHeight: 52,
  },
  railItemActive: {
    backgroundColor: landingColors.primaryGlow,
  },
  railWeek: {
    fontSize: 10,
    fontWeight: "700",
    color: landingColors.textMuted,
    letterSpacing: 0.7,
  },
  railWeekActive: { color: landingColors.primary },
  railNum: {
    fontSize: 17,
    fontWeight: "800",
    color: landingColors.text,
  },
  railNumActive: { color: landingColors.primaryDark },
  railUnderline: {
    marginTop: 2,
    width: 16,
    height: 3,
    borderRadius: 2,
    backgroundColor: landingColors.primary,
  },
  railTodayDot: {
    marginTop: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: landingColors.accent,
  },

  trayShell: {
    gap: 0,
  },
  trayRim: {
    alignSelf: "center",
    width: 56,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(12,46,34,0.12)",
    marginBottom: -2,
    zIndex: 2,
  },
  trayCard: {
    flexDirection: "row",
    backgroundColor: landingColors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: landingColors.glassBorder,
    overflow: "hidden",
    shadowColor: "#0C2E22",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  trayAccent: {
    width: 5,
    backgroundColor: landingColors.primary,
  },
  trayBody: {
    flex: 1,
    padding: 16,
    gap: 14,
  },
  trayTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  trayKicker: {
    fontSize: 11,
    fontWeight: "700",
    color: landingColors.primary,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  trayTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: landingColors.text,
    letterSpacing: -0.4,
  },
  trayDate: {
    fontSize: 13,
    fontWeight: "500",
    color: landingColors.textSub,
    marginTop: 2,
  },
  trayIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: landingColors.tileEmerald,
    alignItems: "center",
    justifyContent: "center",
  },
  chipRow: {
    flexDirection: "row",
    gap: 8,
  },
  chip: {
    flex: 1,
    backgroundColor: landingColors.bgCardAlt,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: "center",
    gap: 2,
  },
  chipProtein: {
    backgroundColor: landingColors.tileMint,
  },
  chipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginBottom: 2,
  },
  chipValue: {
    fontSize: 15,
    fontWeight: "800",
    color: landingColors.text,
    fontVariant: ["tabular-nums"],
  },
  chipLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: landingColors.textMuted,
  },

  sectionHead: { gap: 2, marginTop: 2 },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: landingColors.text,
  },
  sectionSub: {
    fontSize: 12,
    color: landingColors.textMuted,
    fontWeight: "500",
  },

  compartmentTray: {
    backgroundColor: landingColors.white,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "rgba(12,46,34,0.12)",
    paddingTop: 10,
    paddingBottom: 6,
    paddingHorizontal: 10,
    gap: 0,
    shadowColor: "#0C2E22",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  trayHandle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(12,46,34,0.10)",
    marginBottom: 8,
  },
  compartmentWrap: {
    flexDirection: "row",
    gap: 8,
    minHeight: 64,
  },
  timelineCol: {
    width: 14,
    alignItems: "center",
    paddingTop: 22,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: landingColors.white,
  },
  timelineLine: {
    flex: 1,
    width: 2,
    marginTop: 2,
    borderRadius: 1,
    minHeight: 20,
  },
  compartment: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: landingColors.bgCardAlt,
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 8,
    minHeight: 58,
  },
  compartmentBar: {
    width: 4,
  },
  compartmentInner: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    gap: 8,
  },
  rolePill: {
    minWidth: 64,
    maxWidth: 78,
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: 7,
    alignItems: "center",
  },
  roleText: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.15,
  },
  courseBody: { flex: 1, gap: 4 },
  itemName: {
    fontSize: 14,
    fontWeight: "700",
    color: landingColors.text,
    letterSpacing: -0.15,
  },
  allergenRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  allergenChip: {
    backgroundColor: landingColors.accentGlow,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  allergenText: {
    fontSize: 10,
    fontWeight: "700",
    color: landingColors.accent,
    textTransform: "capitalize",
  },
  cal: {
    fontSize: 15,
    fontWeight: "800",
    color: landingColors.primary,
    fontVariant: ["tabular-nums"],
  },
  calUnit: {
    fontSize: 9,
    fontWeight: "600",
    color: landingColors.textMuted,
    marginLeft: -4,
  },

  tipCard: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: landingColors.bgCardAlt,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: landingColors.glassBorder,
    padding: 14,
    marginTop: 2,
  },
  tipIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: landingColors.tileEmerald,
    alignItems: "center",
    justifyContent: "center",
  },
  tipTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: landingColors.text,
    marginBottom: 4,
  },
  tipBody: {
    fontSize: 12,
    lineHeight: 17,
    color: landingColors.textSub,
    fontWeight: "500",
  },

  emptyCard: {
    backgroundColor: landingColors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: landingColors.glassBorder,
    padding: 28,
    alignItems: "center",
    gap: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: landingColors.text,
    marginTop: 4,
  },
  emptySub: {
    fontSize: 12,
    color: landingColors.textSub,
    textAlign: "center",
    lineHeight: 17,
  },
});
