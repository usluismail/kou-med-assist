/**
 * AcademicCalendarPreview.tsx — Ana sayfa "Akademik Ajanda" yatay önizleme.
 * Referans Ekran 2: pastel etkinlik kartları + "Takvimi aç".
 */
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { ChevronRight, MapPin, ArrowUpRight } from "lucide-react-native";
import { useRouter } from "expo-router";
import { landingColors } from "@/lib/theme";

type PreviewEvent = {
  id: string;
  day: string;
  month: string;
  label: string;
  title: string;
  location: string;
  bg: string;
  fg: string;
};

const preview: PreviewEvent[] = [
  {
    id: "ev-1",
    day: "16",
    month: "EYL",
    label: "SÖYLEŞİ",
    title: "Tıp Fakültesi Söyleşileri: Moleküler Biyoloji",
    location: "Konferans Salonu",
    bg: "#DCEAF8",
    fg: "#1B4F7A",
  },
  {
    id: "ev-2",
    day: "22",
    month: "EYL",
    label: "VAKA",
    title: "Klinik Vaka Sunumu: Kardiyoloji",
    location: "Amfi 3",
    bg: "#D8F0E4",
    fg: "#0C5C3D",
  },
  {
    id: "ev-3",
    day: "02",
    month: "EKİ",
    label: "KURUL",
    title: "Akademik Kurul Toplantısı",
    location: "Dekanlık",
    bg: "#E7E1F6",
    fg: "#5B3A9E",
  },
];

export function AcademicCalendarPreview() {
  const router = useRouter();

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Etkinlik takvimi</Text>
        <Pressable style={styles.seeAll} onPress={() => router.push("/etkinlikler")}>
          <Text style={styles.seeAllText}>Takvimi aç</Text>
          <ChevronRight size={13} color={landingColors.primary} strokeWidth={2.5} />
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        decelerationRate="fast"
      >
        {preview.map((ev) => (
          <Pressable
            key={ev.id}
            style={[styles.card, { backgroundColor: ev.bg }]}
            onPress={() => router.push("/etkinlikler")}
          >
            <View style={styles.cardTop}>
              <Text style={[styles.date, { color: ev.fg }]}>
                {ev.day} {ev.month}
              </Text>
              <View style={[styles.arrowBtn, { backgroundColor: "rgba(255,255,255,0.55)" }]}>
                <ArrowUpRight size={14} color={ev.fg} strokeWidth={2.5} />
              </View>
            </View>
            <Text style={[styles.label, { color: ev.fg }]}>{ev.label}</Text>
            <Text style={[styles.title, { color: ev.fg }]} numberOfLines={3}>
              {ev.title}
            </Text>
            <View style={styles.locRow}>
              <MapPin size={12} color={ev.fg} strokeWidth={2.5} />
              <Text style={[styles.loc, { color: ev.fg }]} numberOfLines={1}>
                {ev.location}
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: 28 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: landingColors.primaryDark,
    letterSpacing: -0.3,
  },
  seeAll: { flexDirection: "row", alignItems: "center", gap: 2 },
  seeAllText: { fontSize: 13, fontWeight: "600", color: landingColors.primary },
  scroll: { paddingHorizontal: 16, gap: 12 },
  card: {
    width: 220,
    borderRadius: 22,
    padding: 16,
    minHeight: 168,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  date: { fontSize: 13, fontWeight: "800", letterSpacing: 0.3 },
  arrowBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 6,
  },
  title: {
    fontSize: 15,
    fontWeight: "800",
    lineHeight: 20,
    letterSpacing: -0.2,
    flex: 1,
  },
  locRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 14,
  },
  loc: { fontSize: 11, fontWeight: "600", flex: 1 },
});
