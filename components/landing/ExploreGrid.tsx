/**
 * ExploreGrid.tsx — "Giriş yapmadan keşfet" yatay kaydırılabilir tile grid.
 *
 * SRP: Yalnızca giriş-öncesi keşif tile düzeninden sorumlu.
 * 2×2 grid yerine yatay kaydırılabilir scroll — daha vizyoner & akıcı.
 */
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import {
  UtensilsCrossed,
  Building2,
  Megaphone,
  Microscope,
  ArrowUpRight,
  Stethoscope,
  CalendarDays,
} from "lucide-react-native";
import { landingColors } from "@/lib/theme";
import { useRef } from "react";

type Tile = {
  id: string;
  icon: typeof UtensilsCrossed;
  title: string;
  sub: string;
  iconBg: string;
  iconFg: string;
  accent: string;   // sol kenar şerit rengi
};

const tiles: Tile[] = [
  {
    id: "cafeteria",
    icon: UtensilsCrossed,
    title: "Yemekhane",
    sub: "Günün Menüsü",
    iconBg: landingColors.tileAmber,
    iconFg: landingColors.tileAmberFg,
    accent: "#F59E0B",
  },
  {
    id: "hospital",
    icon: Building2,
    title: "Hastane Rehberi",
    sub: "Blok & Kat Haritası",
    iconBg: landingColors.tileEmerald,
    iconFg: landingColors.tileEmeraldFg,
    accent: "#10B981",
  },
  {
    id: "announcements",
    icon: Megaphone,
    title: "Duyurular",
    sub: "Fakülte Haberleri",
    iconBg: landingColors.tileSky,
    iconFg: landingColors.tileSkyFg,
    accent: "#38BDF8",
  },
  {
    id: "academic",
    icon: Microscope,
    title: "Akademik Ajanda",
    sub: "Etkinlik & Seminer",
    iconBg: landingColors.tileViolet,
    iconFg: landingColors.tileVioletFg,
    accent: "#A78BFA",
  },
  {
    id: "clinic",
    icon: Stethoscope,
    title: "Klinik Rotasyonlar",
    sub: "Staj & Nöbet",
    iconBg: "rgba(230,57,70,0.15)",
    iconFg: "#FCA5A5",
    accent: "#E63946",
  },
  {
    id: "calendar",
    icon: CalendarDays,
    title: "Akademik Takvim",
    sub: "2026-2027 Dönemi",
    iconBg: "rgba(251,191,36,0.15)",
    iconFg: "#FCD34D",
    accent: "#FBBF24",
  },
];

function TileCard({ tile }: { tile: Tile }) {
  const scale = useRef(new Animated.Value(1)).current;
  const Icon = tile.icon;

  const onPressIn = () =>
    Animated.spring(scale, { toValue: 0.95, useNativeDriver: true, friction: 8 }).start();
  const onPressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 8 }).start();

  return (
    <Animated.View style={[styles.tile, { transform: [{ scale }] }]}>
      {/* Sol kenar accent şerit */}
      <View style={[styles.accentBar, { backgroundColor: tile.accent }]} />

      <Pressable
        style={styles.tilePressable}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={() => {}}
      >
        <View style={styles.tileRow}>
          {/* Icon */}
          <View style={[styles.iconWrap, { backgroundColor: tile.iconBg }]}>
            <Icon size={20} color={tile.iconFg} strokeWidth={2.2} />
          </View>

          {/* Metin */}
          <View style={styles.tileText}>
            <Text style={styles.tileTitle} numberOfLines={1}>{tile.title}</Text>
            <Text style={styles.tileSub} numberOfLines={1}>{tile.sub}</Text>
          </View>

          {/* Ok */}
          <ArrowUpRight size={15} color={landingColors.textMuted} strokeWidth={2.5} />
        </View>
      </Pressable>
    </Animated.View>
  );
}

export function ExploreGrid() {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Giriş yapmadan keşfet</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        decelerationRate="fast"
        snapToInterval={220}
        snapToAlignment="start"
      >
        {tiles.map((t) => (
          <TileCard key={t.id} tile={t} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: 28 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: landingColors.text,
    marginBottom: 14,
    paddingHorizontal: 16,
    letterSpacing: -0.3,
  },
  scroll: {
    paddingHorizontal: 16,
    gap: 10,
    paddingRight: 32,
  },
  tile: {
    width: 210,
    borderRadius: 18,
    backgroundColor: landingColors.bgCard,
    borderWidth: 1,
    borderColor: landingColors.glassBorder,
    overflow: "hidden",
    // Hafif glow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  accentBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
  },
  tilePressable: {
    padding: 16,
    paddingLeft: 18,
  },
  tileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  tileText: { flex: 1, gap: 3 },
  tileTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: landingColors.text,
    letterSpacing: -0.2,
  },
  tileSub: {
    fontSize: 11,
    fontWeight: "500",
    color: landingColors.textSub,
  },
});
