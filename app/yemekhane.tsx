/**
 * app/yemekhane.tsx — Günün menüsü (tek akış, kalori detayı).
 * Referans Ekran 5: gün seçici kapsüller + durum kartı + menü listesi.
 */
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { UtensilsCrossed } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PortalSubHeader } from "@/components/landing/PortalSubHeader";
import { fetchCafeteriaWeek } from "@/lib/api";
import { usePublicResource } from "@/lib/api/hooks/core";
import type { CafeteriaMenu } from "@/lib/api/types";
import { landingColors } from "@/lib/theme";

const DAY_SHORT = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];

const FALLBACK: CafeteriaMenu[] = [
  {
    date: "2026-09-07",
    meals: {
      breakfast: [
        { name: "Menemen", calories: 210 },
        { name: "Peynir Tabağı", calories: 180 },
        { name: "Çay", calories: 5 },
      ],
      lunch: [
        { name: "Mercimek Çorbası", calories: 150 },
        { name: "Tavuk Şinitzel", calories: 380 },
        { name: "Bulgur Pilavı", calories: 220 },
        { name: "Cacık", calories: 90 },
        { name: "Meyve", calories: 60 },
      ],
      dinner: [
        { name: "Domates Çorbası", calories: 120 },
        { name: "Köfte", calories: 350 },
        { name: "Makarna", calories: 280 },
      ],
    },
  },
  {
    date: "2026-09-08",
    meals: {
      breakfast: [{ name: "Haşlanmış Yumurta", calories: 155 }],
      lunch: [
        { name: "Yayla Çorbası", calories: 130 },
        { name: "Et Sote", calories: 410 },
        { name: "Pirinç Pilavı", calories: 240 },
      ],
      dinner: [{ name: "Ezogelin Çorbası", calories: 140 }],
    },
  },
  {
    date: "2026-09-09",
    meals: {
      breakfast: [{ name: "Sahanda Yumurta", calories: 190 }],
      lunch: [
        { name: "Kuru Fasulye", calories: 310 },
        { name: "Bulgur Pilavı", calories: 220 },
      ],
      dinner: [{ name: "Tavuk Sote", calories: 300 }],
    },
  },
  {
    date: "2026-09-10",
    meals: {
      breakfast: [{ name: "Omlet", calories: 200 }],
      lunch: [
        { name: "Izgara Köfte", calories: 360 },
        { name: "Pilav", calories: 230 },
      ],
      dinner: [{ name: "Nohut Yemeği", calories: 290 }],
    },
  },
  {
    date: "2026-09-11",
    meals: {
      breakfast: [{ name: "Peynir - Zeytin", calories: 160 }],
      lunch: [
        { name: "Fırın Tavuk", calories: 340 },
        { name: "Makarna", calories: 280 },
      ],
      dinner: [{ name: "Sebzeli Güveç", calories: 260 }],
    },
  },
];

function formatDayLabel(iso: string) {
  const d = new Date(iso + "T12:00:00");
  return {
    weekday: DAY_SHORT[d.getDay()],
    day: String(d.getDate()).padStart(2, "0"),
  };
}

export default function YemekhaneScreen() {
  const insets = useSafeAreaInsets();
  const { data, loading } = usePublicResource(fetchCafeteriaWeek);
  const menus = data?.length ? data : FALLBACK;

  const todayIso = new Date().toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState(todayIso);

  const selected =
    menus.find((m) => m.date === selectedDate) ??
    menus.find((m) => m.date === todayIso) ??
    menus[0];

  const lunch = selected?.meals.lunch ?? [];
  const lunchCal = lunch.reduce((acc, i) => acc + (i.calories || 0), 0);

  const dateObj = selected ? new Date(selected.date + "T12:00:00") : new Date();
  const dateLabel = dateObj
    .toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      weekday: "long",
    })
    .toUpperCase();

  return (
    <View style={styles.root}>
      <PortalSubHeader kicker="YEMEKHANE" title="Bugün ne var?" />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.days}
      >
        {menus.map((m) => {
          const label = formatDayLabel(m.date);
          const active = m.date === (selected?.date ?? selectedDate);
          return (
            <Pressable
              key={m.date}
              onPress={() => setSelectedDate(m.date)}
              style={[styles.dayChip, active && styles.dayChipActive]}
            >
              <Text style={[styles.dayWeek, active && styles.dayTextActive]}>
                {label.weekday}
              </Text>
              <Text style={[styles.dayNum, active && styles.dayTextActive]}>
                {label.day}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        {loading && !data ? (
          <ActivityIndicator color={landingColors.primary} style={{ marginTop: 24 }} />
        ) : null}

        <View style={styles.statusCard}>
          <View style={styles.statusBadge}>
            <Text style={styles.statusBadgeText}>ÖĞLE MENÜSÜ</Text>
          </View>
          <UtensilsCrossed
            size={22}
            color="rgba(255,255,255,0.7)"
            style={styles.statusIcon}
          />
          <Text style={styles.statusTitle}>{dateLabel}</Text>
          <Text style={styles.statusSub}>
            {lunch.length
              ? `${lunch.length} kalem · toplam ~${lunchCal} kcal`
              : "Bu güne ait menü henüz yayınlanmadı."}
          </Text>
          {lunch.length ? (
            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>Menü özeti</Text>
              <Text style={styles.summaryValue} numberOfLines={2}>
                {lunch.map((i) => i.name).join(" · ")}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Günün menüsü</Text>
          <Text style={styles.sectionSub}>Seçili gün · öğle</Text>
        </View>

        {lunch.length ? (
          <View style={styles.menuCard}>
            {lunch.map((item, idx) => (
              <View key={`${item.name}-${idx}`}>
                {idx > 0 ? <View style={styles.divider} /> : null}
                <View style={styles.menuRow}>
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
  days: {
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 8,
  },
  dayChip: {
    width: 58,
    borderRadius: 16,
    backgroundColor: landingColors.white,
    borderWidth: 1,
    borderColor: landingColors.glassBorder,
    paddingVertical: 10,
    alignItems: "center",
  },
  dayChipActive: {
    backgroundColor: landingColors.primaryDark,
    borderColor: landingColors.primaryDark,
  },
  dayWeek: {
    fontSize: 11,
    fontWeight: "600",
    color: landingColors.textMuted,
  },
  dayNum: {
    fontSize: 16,
    fontWeight: "800",
    color: landingColors.text,
    marginTop: 2,
  },
  dayTextActive: { color: landingColors.white },
  content: { paddingHorizontal: 16, gap: 16, paddingTop: 8 },
  statusCard: {
    backgroundColor: landingColors.primaryDark,
    borderRadius: 24,
    padding: 20,
    overflow: "hidden",
  },
  statusBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(184,212,74,0.22)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 16,
  },
  statusBadgeText: {
    color: landingColors.ctaLime,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  statusIcon: { position: "absolute", top: 18, right: 18 },
  statusTitle: {
    color: landingColors.white,
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  statusSub: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 13,
    lineHeight: 18,
  },
  summaryBox: {
    marginTop: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 14,
    padding: 12,
    gap: 4,
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: landingColors.ctaLime,
  },
  summaryValue: {
    fontSize: 12,
    color: "rgba(255,255,255,0.85)",
    lineHeight: 17,
  },
  sectionHead: { gap: 2 },
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
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  divider: {
    height: 1,
    backgroundColor: landingColors.divider,
    marginHorizontal: 16,
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
