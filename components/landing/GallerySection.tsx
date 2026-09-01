/**
 * GallerySection.tsx — Kampüs fotoğraf galerisi kartı.
 *
 * SRP: Yalnızca kampüs görsel galerisi gösteriminden sorumlu.
 */
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { MapPinned } from "lucide-react-native";
import { colors } from "@/lib/theme";

const gallery = [
  { id: "g1", src: require("../../assets/campus/campus-1.jpg"), label: "Ana Giriş",      place: "Tıp Fakültesi Kapısı"  },
  { id: "g2", src: require("../../assets/campus/campus-2.jpg"), label: "Merkez Avlu",    place: "Umuttepe Yerleşkesi"   },
  { id: "g3", src: require("../../assets/campus/campus-3.jpg"), label: "Büyük Amfi",     place: "Eğitim Bloğu"          },
  { id: "g4", src: require("../../assets/campus/hero-campus.jpg"), label: "Araştırma Lab", place: "Laboratuvarlar Bloku" },
  { id: "g5", src: require("../../assets/campus/campus-2.jpg"), label: "Dekanlık",       place: "İdari Binalar"         },
  { id: "g6", src: require("../../assets/campus/campus-1.jpg"), label: "Acil Tıp",       place: "Uygulama Hastanesi"    },
];

export function GallerySection() {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.softIcon}>
          <MapPinned size={18} color={colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>Umuttepe Yerleşkesi</Text>
          <Text style={styles.cardSub}>KOÜ Tıp Fakültesi · Harita ve Blok Rehberi</Text>
        </View>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 16 }}
        contentContainerStyle={{ paddingRight: 4 }}
      >
        {gallery.map((g) => (
          <View key={g.id} style={styles.galleryItem}>
            <Image source={g.src} style={styles.galleryImg} contentFit="cover" />
            <Text style={styles.galleryLabel} numberOfLines={1}>{g.label}</Text>
            <Text style={styles.galleryPlace} numberOfLines={1}>{g.place}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
  },
  cardHeader: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  softIcon: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: { fontSize: 16, fontWeight: "700", color: colors.foreground },
  cardSub: { fontSize: 12, color: colors.mutedForeground, marginTop: 2 },
  galleryItem: { width: 140, marginRight: 12 },
  galleryImg: { width: 140, height: 100, borderRadius: 16 },
  galleryLabel: { marginTop: 8, fontSize: 13, fontWeight: "700", color: colors.foreground },
  galleryPlace: { marginTop: 2, fontSize: 11, color: colors.mutedForeground },
});
