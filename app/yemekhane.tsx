/**
 * app/yemekhane.tsx — Günlük menü (yaklaşım 2).
 * Üstte 5 kutulu gün seçici + altta tek menü listesi (sabah/akşam yok).
 */
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Flame, UtensilsCrossed } from "lucide-react-native";
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

const SCREEN_W = Dimensions.get("window").width;
const DAY_GAP = 8;
const DAY_PAD = 16;
/** Tam 5 kutu — ekranı eşit böler */
const DAY_BOX_W = Math.floor((SCREEN_W - DAY_PAD * 2 - DAY_GAP * 4) / 5);

/** Tek günlük menü = öğle kalemleri (sabah/akşam ayrımı yok) */
function dayMenuItems(menu: CafeteriaMenu | undefined): MenuItem[] {
  return menu?.meals?.lunch ?? [];
}

/** Bugünden başlayarak en fazla 5 gün (veya listedeki 5) */
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

  const dateObj = selected ? parseIso(selected.date) : new Date();
  const monthTitle = `${MONTH_LONG[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
  const weekdayLong = dateObj.toLocaleDateString("tr-TR", { weekday: "long" });
  const headline = weekdayLong.charAt(0).toUpperCase() + weekdayLong.slice(1);

  return (
    <View style={styles.root}>
      <PortalSubHeader kicker="YEMEKHANE" title="Günün menüsü" />

      <ScrollView
        contentContainerStyle={[styles.page, { paddingBottom: insets.bottom + 28 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Ay + 5 kutulu gün seçici */}
        <View style={styles.calendarBlock}>
          <Text style={styles.monthTitle}>{monthTitle}</Text>

          <View style={styles.daysRow}>
            {menus.map((m) => {
              const d = parseIso(m.date);
              const active = m.date === selected?.date;
              return (
                <Pressable
                  key={m.date}
                  onPress={() => setSelectedDate(m.date)}
                  style={[styles.dayBox, active && styles.dayBoxActive]}
                >
                  <View style={[styles.dayTop, active && styles.dayTopActive]}>
                    <Text style={[styles.dayWeek, active && styles.dayWeekActive]}>
                      {DAY_SHORT[d.getDay()]}
                    </Text>
                  </View>
                  <View style={styles.dayBottom}>
                    <Text style={[styles.dayNum, active && styles.dayNumActive]}>
                      {d.getDate()}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        {loading && !data ? (
          <ActivityIndicator color={landingColors.primary} style={{ marginTop: 12 }} />
        ) : null}

        {/* Özet kart — tek menü, sabah/akşam yok */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryTop}>
            <View style={{ flex: 1 }}>
              <Text style={styles.summaryKicker}>Seçili gün</Text>
              <Text style={styles.summaryTitle}>{headline}</Text>
              <Text style={styles.summaryDate}>
                {dateObj.getDate()} {MONTH_LONG[dateObj.getMonth()]}
              </Text>
            </View>
            <View style={styles.kcalRing}>
              <Flame size={16} color={landingColors.ctaLime} strokeWidth={2.4} />
              <Text style={styles.kcalValue}>{totalCal || "—"}</Text>
              <Text style={styles.kcalUnit}>kcal</Text>
            </View>
          </View>

          <View style={styles.statRow}>
            <View style={styles.stat}>
              <UtensilsCrossed size={16} color={landingColors.ctaLime} strokeWidth={2.2} />
              <Text style={styles.statValue}>{items.length}</Text>
              <Text style={styles.statLabel}>kalem</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={[styles.stat, { flex: 1.4 }]}>
              <Text style={styles.statLabelLeft}>Menü özeti</Text>
              <Text style={styles.statHint} numberOfLines={2}>
                {items.length
                  ? items.map((i) => i.name).join(" · ")
                  : "Bu güne ait menü henüz yok"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Menü</Text>
          <Text style={styles.sectionSub}>
            {items.length ? `${items.length} ürün · tek liste` : "Yayın bekleniyor"}
          </Text>
        </View>

        {items.length ? (
          <View style={styles.menuCard}>
            {items.map((item, idx) => (
              <View key={`${item.name}-${idx}`}>
                {idx > 0 ? <View style={styles.divider} /> : null}
                <View style={styles.menuRow}>
                  <View style={styles.itemBullet}>
                    <Text style={styles.itemIndex}>{idx + 1}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    {item.allergens?.length ? (
                      <Text style={styles.allergen}>
                        Alerjen: {item.allergens.join(", ")}
                      </Text>
                    ) : null}
                  </View>
                  <Text style={styles.cal}>{item.calories} kcal</Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <UtensilsCrossed size={28} color={landingColors.primary} strokeWidth={1.8} />
            <Text style={styles.emptyTitle}>Bu güne ait menü yok</Text>
            <Text style={styles.emptySub}>
              Menü yayınlandığında burada otomatik güncellenir.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: landingColors.bg },
  page: {
    paddingHorizontal: DAY_PAD,
    gap: 14,
    paddingTop: 4,
  },

  calendarBlock: {
    gap: 12,
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: landingColors.text,
    letterSpacing: -0.2,
  },
  daysRow: {
    flexDirection: "row",
    gap: DAY_GAP,
  },
  dayBox: {
    width: DAY_BOX_W,
    borderRadius: 18,
    backgroundColor: landingColors.white,
    borderWidth: 1.5,
    borderColor: "rgba(12,92,61,0.28)",
    overflow: "hidden",
  },
  dayBoxActive: {
    borderColor: landingColors.primary,
  },
  dayTop: {
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  dayTopActive: {
    backgroundColor: landingColors.ctaLime,
    margin: 4,
    marginBottom: 0,
    borderRadius: 12,
    paddingVertical: 7,
  },
  dayBottom: {
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  dayWeek: {
    fontSize: 11,
    fontWeight: "700",
    color: landingColors.textMuted,
    letterSpacing: 0.6,
  },
  dayWeekActive: {
    color: landingColors.heroEmerald,
  },
  dayNum: {
    fontSize: 18,
    fontWeight: "800",
    color: landingColors.text,
  },
  dayNumActive: {
    color: landingColors.text,
  },

  summaryCard: {
    backgroundColor: landingColors.primaryDark,
    borderRadius: 24,
    padding: 18,
    gap: 16,
  },
  summaryTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  summaryKicker: {
    fontSize: 11,
    fontWeight: "700",
    color: "rgba(184,212,74,0.9)",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  summaryTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: landingColors.white,
    letterSpacing: -0.5,
  },
  summaryDate: {
    fontSize: 13,
    fontWeight: "500",
    color: "rgba(255,255,255,0.72)",
    marginTop: 2,
  },
  kcalRing: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 3,
    borderColor: "rgba(184,212,74,0.55)",
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  kcalValue: {
    fontSize: 16,
    fontWeight: "800",
    color: landingColors.white,
    marginTop: 2,
  },
  kcalUnit: {
    fontSize: 10,
    fontWeight: "600",
    color: "rgba(255,255,255,0.65)",
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 12,
  },
  stat: {
    alignItems: "center",
    gap: 2,
    minWidth: 56,
  },
  statDivider: {
    width: 1,
    alignSelf: "stretch",
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "800",
    color: landingColors.white,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "rgba(255,255,255,0.65)",
  },
  statLabelLeft: {
    fontSize: 11,
    fontWeight: "700",
    color: landingColors.ctaLime,
    alignSelf: "flex-start",
    marginBottom: 2,
  },
  statHint: {
    fontSize: 12,
    color: "rgba(255,255,255,0.82)",
    lineHeight: 16,
    alignSelf: "stretch",
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
  menuCard: {
    backgroundColor: landingColors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: landingColors.glassBorder,
    overflow: "hidden",
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 12,
  },
  itemBullet: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: landingColors.tileMint,
    alignItems: "center",
    justifyContent: "center",
  },
  itemIndex: {
    fontSize: 12,
    fontWeight: "800",
    color: landingColors.tileMintFg,
  },
  divider: {
    height: 1,
    backgroundColor: landingColors.divider,
    marginHorizontal: 14,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "700",
    color: landingColors.text,
  },
  allergen: {
    fontSize: 11,
    color: landingColors.textMuted,
    marginTop: 2,
  },
  cal: {
    fontSize: 12,
    fontWeight: "700",
    color: landingColors.primary,
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
