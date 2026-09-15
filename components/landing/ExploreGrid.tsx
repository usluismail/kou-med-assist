/**
 * ExploreGrid.tsx — 3 kompakt keşfet kutusu (tek satır, az yer).
 * Duyurular · Etkinlikler · Yemekhane
 */
import { useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import {
  UtensilsCrossed,
  Megaphone,
  ArrowUpRight,
  CalendarDays,
} from "lucide-react-native";
import { useRouter, type Href } from "expo-router";
import { landingColors } from "@/lib/theme";

type Tile = {
  id: string;
  icon: typeof UtensilsCrossed;
  title: string;
  bg: string;
  fg: string;
  href: Href;
};

const tiles: Tile[] = [
  {
    id: "announcements",
    icon: Megaphone,
    title: "Duyurular",
    bg: landingColors.tileSky,
    fg: landingColors.tileSkyFg,
    href: "/duyurular",
  },
  {
    id: "events",
    icon: CalendarDays,
    title: "Etkinlikler",
    bg: landingColors.tileViolet,
    fg: landingColors.tileVioletFg,
    href: "/etkinlikler",
  },
  {
    id: "cafeteria",
    icon: UtensilsCrossed,
    title: "Yemekhane",
    bg: landingColors.tilePeach,
    fg: landingColors.tilePeachFg,
    href: "/yemekhane",
  },
];

function TileCard({ tile, onPress }: { tile: Tile; onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;
  const Icon = tile.icon;

  const onPressIn = () =>
    Animated.spring(scale, { toValue: 0.94, useNativeDriver: true, friction: 8 }).start();
  const onPressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 8 }).start();

  return (
    <Animated.View style={[styles.tile, { backgroundColor: tile.bg, transform: [{ scale }] }]}>
      <Pressable
        style={styles.tilePressable}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={onPress}
      >
        <View style={styles.iconRow}>
          <Icon size={18} color={tile.fg} strokeWidth={2.2} />
          <ArrowUpRight size={12} color={tile.fg} strokeWidth={2.5} />
        </View>
        <Text style={[styles.tileTitle, { color: tile.fg }]} numberOfLines={1}>
          {tile.title}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

export function ExploreGrid() {
  const router = useRouter();

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Keşfet</Text>
      <View style={styles.grid}>
        {tiles.map((t) => (
          <TileCard key={t.id} tile={t} onPress={() => router.push(t.href)} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 22,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: landingColors.text,
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  grid: {
    flexDirection: "row",
    gap: 8,
  },
  tile: {
    flex: 1,
    borderRadius: 14,
    overflow: "hidden",
    minHeight: 72,
  },
  tilePressable: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: "space-between",
    gap: 8,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tileTitle: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
});
