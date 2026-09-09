/**
 * AnnouncementPreview — Klinik bülten dili.
 * Kaynak: tip.kocaeli.edu.tr portal duyuruları (API + canlı fallback).
 */
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { useRouter } from "expo-router";
import { fetchPortalAnnouncements } from "@/lib/api";
import { usePublicResource } from "@/lib/api/hooks/core";
import type { PortalAnnouncement } from "@/lib/api/types";
import { LIVE_PORTAL_ANNOUNCEMENTS } from "@/lib/portal/liveFallbacks";
import { landingColors } from "@/lib/theme";

export function AnnouncementPreview() {
  const router = useRouter();
  const { data, loading } = usePublicResource(fetchPortalAnnouncements);
  const go = () => router.push("/duyurular");

  const announcements = (data?.length ? data : LIVE_PORTAL_ANNOUNCEMENTS).slice(0, 4);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.titleBlock}>
          <Text style={styles.kicker}>FAKÜLTE GÜNDEMİ</Text>
          <Text style={styles.sectionTitle}>Duyurular</Text>
        </View>
        <Pressable style={styles.seeAll} onPress={go} hitSlop={8}>
          <Text style={styles.seeAllText}>Tümünü gör</Text>
          <ChevronRight size={12} color={landingColors.textSub} strokeWidth={2.2} />
        </Pressable>
      </View>

      <View style={styles.bulletin}>
        {loading && !data ? (
          <ActivityIndicator
            color={landingColors.primary}
            style={{ marginVertical: 20 }}
          />
        ) : null}

        {announcements.map((ann: PortalAnnouncement, idx: number) => {
          const isLead = idx === 0;
          return (
            <View key={ann.id}>
              {idx > 0 ? <View style={styles.divider} /> : null}
              <Pressable
                style={({ pressed }) => [
                  styles.row,
                  isLead && styles.rowLead,
                  pressed && styles.rowPressed,
                ]}
                onPress={go}
              >
                <View style={[styles.rail, isLead && styles.railLead]} />

                <View style={styles.dateBadge}>
                  <Text style={[styles.dateDay, isLead && styles.dateDayLead]}>
                    {ann.day}
                  </Text>
                  <Text style={styles.dateMonth}>{ann.month}</Text>
                </View>

                <View style={styles.rowBody}>
                  <Text style={styles.unit}>{ann.unit.toUpperCase()}</Text>
                  <Text
                    style={[styles.annTitle, isLead && styles.annTitleLead]}
                    numberOfLines={2}
                  >
                    {ann.title}
                  </Text>
                </View>

                {!isLead ? (
                  <ChevronRight
                    size={14}
                    color={landingColors.textMuted}
                    strokeWidth={1.8}
                  />
                ) : null}
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { paddingHorizontal: 16, marginTop: 28 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  titleBlock: { gap: 3 },
  kicker: {
    fontSize: 10,
    fontWeight: "700",
    color: landingColors.primary,
    letterSpacing: 1.2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: landingColors.primaryDark,
    letterSpacing: -0.3,
  },
  seeAll: { flexDirection: "row", alignItems: "center", gap: 1, paddingBottom: 2 },
  seeAllText: {
    fontSize: 12,
    fontWeight: "600",
    color: landingColors.textSub,
  },

  bulletin: {
    borderRadius: 18,
    backgroundColor: "#F7FAF8",
    borderWidth: 1,
    borderColor: "rgba(12,92,61,0.12)",
    overflow: "hidden",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    paddingLeft: 12,
  },
  rowLead: {
    backgroundColor: "rgba(12,92,61,0.06)",
    paddingVertical: 15,
  },
  rowPressed: {
    backgroundColor: landingColors.primaryGlow,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: landingColors.divider,
    marginLeft: 12,
  },

  rail: {
    width: 2.5,
    alignSelf: "stretch",
    borderRadius: 2,
    backgroundColor: landingColors.primary,
    opacity: 0.85,
    marginVertical: 2,
  },
  railLead: {
    width: 3.5,
    opacity: 1,
  },

  dateBadge: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  dateDay: {
    fontSize: 17,
    fontWeight: "800",
    color: landingColors.text,
    fontVariant: ["tabular-nums"],
    lineHeight: 20,
    letterSpacing: -0.3,
  },
  dateDayLead: {
    fontSize: 19,
    color: landingColors.primaryDark,
  },
  dateMonth: {
    fontSize: 9,
    fontWeight: "700",
    color: landingColors.textMuted,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginTop: 1,
  },

  rowBody: { flex: 1, gap: 3 },
  unit: {
    fontSize: 9,
    fontWeight: "700",
    color: landingColors.textMuted,
    letterSpacing: 0.9,
  },
  annTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: landingColors.text,
    lineHeight: 18,
  },
  annTitleLead: {
    fontSize: 14,
    fontWeight: "800",
    color: landingColors.primaryDark,
    lineHeight: 19,
    letterSpacing: -0.2,
  },
});
