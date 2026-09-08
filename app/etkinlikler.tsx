/**
 * app/etkinlikler.tsx — Akademik etkinlik / seminer listesi.
 */
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { CalendarPlus, MapPin } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PortalSubHeader } from "@/components/landing/PortalSubHeader";
import { fetchCampusEvents } from "@/lib/api";
import { usePublicResource } from "@/lib/api/hooks/core";
import type { CampusEvent } from "@/lib/api/types";
import { landingColors } from "@/lib/theme";

const FALLBACK: CampusEvent[] = [
  {
    id: "ev-1",
    day: "16",
    month: "EYL",
    dateIso: "2026-09-16",
    time: "14:00",
    organizer: "KOCAELİ ÜNİVERSİTESİ TIP FAKÜLTESİ",
    title: "Tıp Fakültesi Söyleşileri: Moleküler Biyoloji",
    description: "Klinik genetiğin güncel uygulamaları üzerine akademik söyleşi.",
    location: "Konferans Salonu · Morfoloji",
    speakerName: "Prof. Dr. Aslı Tolun",
    speakerTitle: "Boğaziçi Üniversitesi",
    accent: "sky",
  },
  {
    id: "ev-2",
    day: "22",
    month: "EYL",
    dateIso: "2026-09-22",
    time: "13:30",
    organizer: "DAHİLİYE ANABİLİM DALI",
    title: "Klinik Vaka Sunumu: Kardiyoloji",
    description: "Haftalık vaka tartışması — intörn ve stajyerlere açık.",
    location: "Amfi 3 · Umuttepe",
    speakerName: "Prof. Dr. Hasan Arslan",
    speakerTitle: "Kardiyoloji",
    accent: "emerald",
  },
];

const ACCENT: Record<CampusEvent["accent"], { panel: string; badge: string }> = {
  emerald: { panel: "#0C5C3D", badge: landingColors.primaryDark },
  violet: { panel: "#5B3A9E", badge: "#5B3A9E" },
  sky: { panel: "#1B4F7A", badge: "#1B4F7A" },
  amber: { panel: "#9A4A12", badge: landingColors.academicGold },
};

export default function EtkinliklerScreen() {
  const insets = useSafeAreaInsets();
  const { data, loading } = usePublicResource(fetchCampusEvents);
  const items = data?.length ? data : FALLBACK;

  return (
    <View style={styles.root}>
      <PortalSubHeader kicker="KAMPÜSTE BULUŞALIM" title="Etkinlikler" />

      <View style={styles.metaRow}>
        <Text style={styles.metaLeft}>Takvim</Text>
        <Text style={styles.metaRight}>{items.length} etkinlik</Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        {loading && !data ? (
          <ActivityIndicator color={landingColors.primary} style={{ marginTop: 24 }} />
        ) : null}

        {items.map((ev) => {
          const accent = ACCENT[ev.accent];
          return (
            <View key={ev.id} style={styles.card}>
              <View style={[styles.visual, { backgroundColor: accent.panel }]}>
                <View style={styles.visualContent}>
                  {ev.speakerName ? (
                    <>
                      <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                          {ev.speakerName
                            .split(" ")
                            .filter((w) => w.length > 2)
                            .slice(-2)
                            .map((w) => w[0])
                            .join("")}
                        </Text>
                      </View>
                      <Text style={styles.speakerName}>{ev.speakerName}</Text>
                      {ev.speakerTitle ? (
                        <Text style={styles.speakerTitle}>{ev.speakerTitle}</Text>
                      ) : null}
                    </>
                  ) : (
                    <Text style={styles.visualFallback}>{ev.organizer}</Text>
                  )}
                </View>
                <View style={[styles.dateBadge, { backgroundColor: accent.badge }]}>
                  <Text style={styles.badgeDay}>{ev.day}</Text>
                  <Text style={styles.badgeMonth}>{ev.month}</Text>
                </View>
              </View>

              <View style={styles.body}>
                <Text style={styles.organizer}>{ev.organizer}</Text>
                <Text style={styles.title}>{ev.title}</Text>
                <Text style={styles.desc}>{ev.description}</Text>
                <View style={styles.footer}>
                  <View style={styles.locRow}>
                    <MapPin size={13} color={landingColors.primary} strokeWidth={2.4} />
                    <Text style={styles.loc}>{ev.location}</Text>
                  </View>
                  <Pressable style={styles.addBtn}>
                    <CalendarPlus size={14} color={landingColors.primary} strokeWidth={2.4} />
                    <Text style={styles.addText}>{ev.time}</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: landingColors.bg },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  metaLeft: {
    fontSize: 15,
    fontWeight: "800",
    color: landingColors.text,
  },
  metaRight: {
    fontSize: 13,
    fontWeight: "600",
    color: landingColors.textMuted,
  },
  list: { paddingHorizontal: 16, gap: 14 },
  card: {
    backgroundColor: landingColors.white,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: landingColors.glassBorder,
    overflow: "hidden",
  },
  visual: {
    height: 140,
    padding: 16,
    justifyContent: "flex-end",
  },
  visualContent: { gap: 4, paddingRight: 56 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  avatarText: { color: "#fff", fontWeight: "800", fontSize: 14 },
  speakerName: { color: "#fff", fontWeight: "800", fontSize: 15 },
  speakerTitle: { color: "rgba(255,255,255,0.75)", fontSize: 12, fontWeight: "500" },
  visualFallback: {
    color: "rgba(255,255,255,0.9)",
    fontWeight: "700",
    fontSize: 13,
    letterSpacing: 0.4,
  },
  dateBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 48,
    borderRadius: 12,
    paddingVertical: 6,
    alignItems: "center",
  },
  badgeDay: { color: "#fff", fontSize: 16, fontWeight: "800", lineHeight: 18 },
  badgeMonth: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.6,
  },
  body: { padding: 16, gap: 6 },
  organizer: {
    fontSize: 10,
    fontWeight: "800",
    color: landingColors.primary,
    letterSpacing: 0.6,
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    color: landingColors.text,
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  desc: {
    fontSize: 13,
    color: landingColors.textSub,
    lineHeight: 18,
  },
  footer: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  locRow: { flexDirection: "row", alignItems: "center", gap: 4, flex: 1 },
  loc: { fontSize: 12, fontWeight: "600", color: landingColors.primary, flex: 1 },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: landingColors.primaryGlow,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  addText: { fontSize: 12, fontWeight: "700", color: landingColors.primary },
});
