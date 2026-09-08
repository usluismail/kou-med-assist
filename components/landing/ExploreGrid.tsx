/**
 * ExploreGrid.tsx — "Giriş yapmadan keşfet" pastel kutu grid.
 */
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import {
  UtensilsCrossed,
  Building2,
  Megaphone,
  Users,
  ArrowUpRight,
  CalendarDays,
} from "lucide-react-native";
import { useRouter, type Href } from "expo-router";
import { landingColors } from "@/lib/theme";
import { useRef } from "react";

type Tile = {
  id: string;
  icon: typeof UtensilsCrossed;
  title: string;
  bg: string;
  fg: string;
  href?: Href;
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
  {
    id: "hospital",
    icon: Building2,
    title: "Hastane",
    bg: landingColors.tileMint,
    fg: landingColors.tileMintFg,
    href: "/hastane",
  },
  {
    id: "faculty",
    icon: Users,
    title: "Kadro",
    bg: landingColors.tileAmber,
    fg: landingColors.tileAmberFg,
    href: "/akademik-kadro",
  },
  {
    id: "calendar",
    icon: CalendarDays,
    title: "Ajanda",
    bg: landingColors.tileEmerald,
    fg: landingColors.tileEmeraldFg,
    href: "/etkinlikler",
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
        <View style={styles.iconTop}>
          <Icon size={26} color={tile.fg} strokeWidth={2} />
        </View>
        <View style={styles.tileFooter}>
          <Text style={[styles.tileTitle, { color: tile.fg }]} numberOfLines={1}>
            {tile.title}
          </Text>
          <ArrowUpRight size={16} color={tile.fg} strokeWidth={2.5} />
        </View>
      </Pressable>
    </Animated.View>
  );
}

export function ExploreGrid() {
  const router = useRouter();

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Giriş yapmadan keşfet</Text>
      <View style={styles.grid}>
        {tiles.map((t) => (
          <TileCard
            key={t.id}
            tile={t}
            onPress={() => {
              if (t.href) router.push(t.href);
            }}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 28,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: landingColors.text,
    marginBottom: 14,
    letterSpacing: -0.3,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  tile: {
    flexGrow: 1,
    flexBasis: "30%",
    maxWidth: "32%",
    aspectRatio: 1,
    borderRadius: 20,
    overflow: "hidden",
  },
  tilePressable: {
    flex: 1,
    padding: 14,
    justifyContent: "space-between",
  },
  iconTop: {
    alignSelf: "flex-start",
  },
  tileFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 4,
  },
  tileTitle: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: -0.2,
    flex: 1,
  },
});
