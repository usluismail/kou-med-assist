/**
 * app/duyurular.tsx — Klinik Gündem (timeline bülten).
 * KOÜ Mobil kart listesi değil: lead + gün grupları + arama + PDF ikincil.
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
import { Image } from "expo-image";
import { ExternalLink, FileText, Search } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PortalSubHeader } from "@/components/landing/PortalSubHeader";
import { fetchPortalAnnouncements } from "@/lib/api";
import { usePublicResource } from "@/lib/api/hooks/core";
import type { PortalAnnouncement } from "@/lib/api/types";
import { LIVE_PORTAL_ANNOUNCEMENTS } from "@/lib/portal/liveFallbacks";
import { resolvePortalImage } from "@/lib/portal/localMedia";
import { landingColors } from "@/lib/theme";

const PORTAL_DUYURULAR_URL = "https://tip.kocaeli.edu.tr/duyurular";

const MONTH_LONG: Record<string, string> = {
  OCA: "OCAK",
  ŞUB: "ŞUBAT",
  MAR: "MART",
  NİS: "NİSAN",
  MAY: "MAYIS",
  HAZ: "HAZİRAN",
  TEM: "TEMMUZ",
  AĞU: "AĞUSTOS",
  EYL: "EYLÜL",
  EKİ: "EKİM",
  KAS: "KASIM",
  ARA: "ARALIK",
};

type DayGroup = {
  key: string;
  label: string;
  items: PortalAnnouncement[];
};

function dayLabel(ann: PortalAnnouncement) {
  const day = String(Number(ann.day) || ann.day);
  const month = MONTH_LONG[ann.month] ?? ann.month;
  return `${day} ${month}`;
}

function resolveOpenUrl(ann: PortalAnnouncement): string {
  return ann.pdfUrl || ann.sourceUrl || PORTAL_DUYURULAR_URL;
}

function AnnouncementRow({
  ann,
  lead = false,
  showDate = false,
  onOpen,
}: {
  ann: PortalAnnouncement;
  lead?: boolean;
  /** Gün başlığı yoksa (lead) tarih göster; timeline satırında gösterme */
  showDate?: boolean;
  onOpen: (url: string) => void;
}) {
  const localImg = resolvePortalImage(ann.id, ann.imageUrl);
  const hasPdf = Boolean(ann.pdfUrl);
  const hasImage = Boolean(localImg);
  const openUrl = resolveOpenUrl(ann);

  return (
    <Pressable
      onPress={() => onOpen(openUrl)}
      style={({ pressed }) => [
        styles.card,
        lead && styles.cardLead,
        pressed && styles.rowPressed,
      ]}
    >
      {/* Afiş önizleme — tam okunmaz; tıkla → kaynak / PDF */}
      {hasImage ? (
        <Image
          source={localImg}
          style={[styles.cover, lead && styles.coverLead]}
          contentFit="cover"
          contentPosition="top"
        />
      ) : null}

      <View style={styles.row}>
        <View style={[styles.rail, lead && styles.railLead]} />

        {showDate ? (
          <View style={styles.dateCol}>
            <Text style={[styles.dateDay, lead && styles.dateDayLead]}>{ann.day}</Text>
            <Text style={styles.dateMonth}>{ann.month}</Text>
          </View>
        ) : null}

        <View style={styles.rowBody}>
          <Text style={styles.unit} numberOfLines={1}>
            {ann.unit}
          </Text>
          <Text
            style={[styles.title, lead && styles.titleLead]}
            numberOfLines={lead ? 3 : 2}
          >
            {ann.title}
          </Text>
          {ann.summary && ann.summary !== ann.title ? (
            <Text style={styles.summary} numberOfLines={lead ? 2 : 1}>
              {ann.summary}
            </Text>
          ) : null}
          <View style={styles.pdfRow}>
            {hasPdf ? (
              <>
                <FileText size={12} color={landingColors.primary} strokeWidth={2.2} />
                <Text style={styles.pdfText}>Belgeyi aç</Text>
              </>
            ) : (
              <>
                <ExternalLink size={12} color={landingColors.primary} strokeWidth={2.2} />
                <Text style={styles.pdfText}>Kaynağa git</Text>
              </>
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export default function DuyurularScreen() {
  const insets = useSafeAreaInsets();
  const { data, loading } = usePublicResource(fetchPortalAnnouncements);
  const [query, setQuery] = useState("");

  const items = data?.length ? data : LIVE_PORTAL_ANNOUNCEMENTS;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.unit.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q)
    );
  }, [items, query]);

  const lead = filtered[0] ?? null;
  const rest = filtered.slice(1);

  const groups = useMemo(() => {
    const map = new Map<string, DayGroup>();
    for (const ann of rest) {
      const key = ann.dateIso || `${ann.day}-${ann.month}`;
      const existing = map.get(key);
      if (existing) {
        existing.items.push(ann);
      } else {
        map.set(key, { key, label: dayLabel(ann), items: [ann] });
      }
    }
    return Array.from(map.values());
  }, [rest]);

  const openLink = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  return (
    <View style={styles.root}>
      <PortalSubHeader kicker="FAKÜLTE GÜNDEMİ" title="Duyurular" />

      <View style={styles.controls}>
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
      </View>

      <ScrollView
        style={styles.listScroll}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + 32 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {loading && !data ? (
          <ActivityIndicator
            color={landingColors.primary}
            style={{ marginTop: 24 }}
          />
        ) : null}

        {lead ? (
          <View style={styles.leadWrap}>
            <Text style={styles.sectionKicker}>ÖNE ÇIKAN</Text>
            <AnnouncementRow ann={lead} lead showDate onOpen={openLink} />
          </View>
        ) : null}

        {groups.map((group) => (
          <View key={group.key} style={styles.dayBlock}>
            <Text style={styles.dayHeading}>{group.label}</Text>
            <View style={styles.bulletin}>
              {group.items.map((ann, idx) => (
                <View key={ann.id}>
                  {idx > 0 ? <View style={styles.divider} /> : null}
                  <AnnouncementRow ann={ann} onOpen={openLink} />
                </View>
              ))}
            </View>
          </View>
        ))}

        {!loading && filtered.length === 0 ? (
          <Text style={styles.empty}>Aramanıza uygun duyuru bulunamadı.</Text>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: landingColors.bg },

  controls: {
    paddingBottom: 8,
    gap: 10,
    backgroundColor: landingColors.bg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: landingColors.divider,
  },
  searchWrap: {
    marginHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#F7FAF8",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(12,92,61,0.12)",
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: landingColors.text,
    padding: 0,
  },

  listScroll: { flex: 1 },
  list: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 18,
  },

  leadWrap: { gap: 8 },
  sectionKicker: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.1,
    color: landingColors.primary,
  },

  dayBlock: { gap: 8 },
  dayHeading: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.8,
    color: landingColors.textMuted,
  },
  bulletin: {
    borderRadius: 16,
    backgroundColor: "#F7FAF8",
    borderWidth: 1,
    borderColor: "rgba(12,92,61,0.12)",
    overflow: "hidden",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: landingColors.divider,
    marginLeft: 12,
  },

  card: {
    overflow: "hidden",
  },
  cardLead: {
    backgroundColor: "rgba(12,92,61,0.07)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(12,92,61,0.14)",
  },
  cover: {
    width: "100%",
    height: 168,
    backgroundColor: landingColors.bgCardAlt,
  },
  coverLead: {
    height: 200,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 13,
    paddingLeft: 10,
  },
  rowPressed: {
    backgroundColor: landingColors.primaryGlow,
  },

  rail: {
    width: 2.5,
    alignSelf: "stretch",
    borderRadius: 2,
    backgroundColor: landingColors.primary,
    opacity: 0.9,
    marginVertical: 2,
  },
  railLead: {
    width: 3.5,
    opacity: 1,
  },

  dateCol: {
    width: 36,
    alignItems: "center",
    paddingTop: 1,
  },
  dateDay: {
    fontSize: 16,
    fontWeight: "800",
    color: landingColors.text,
    fontVariant: ["tabular-nums"],
    lineHeight: 18,
    letterSpacing: -0.3,
  },
  dateDayLead: {
    fontSize: 18,
    color: landingColors.primaryDark,
  },
  dateMonth: {
    fontSize: 9,
    fontWeight: "700",
    color: landingColors.textMuted,
    letterSpacing: 0.7,
    marginTop: 2,
  },

  rowBody: { flex: 1, gap: 3, minWidth: 0 },
  unit: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.3,
    color: landingColors.primary,
    marginBottom: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: landingColors.text,
    lineHeight: 19,
  },
  titleLead: {
    fontSize: 16,
    fontWeight: "800",
    color: landingColors.primaryDark,
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  summary: {
    fontSize: 12,
    color: landingColors.textSub,
    lineHeight: 16,
  },
  pdfRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  pdfText: {
    fontSize: 11,
    fontWeight: "700",
    color: landingColors.primary,
  },
  empty: {
    textAlign: "center",
    marginTop: 40,
    color: landingColors.textMuted,
    fontSize: 13,
  },
});
