/**
 * PortalSubHeader — alt sayfalar için ortak geri + kicker + başlık.
 */
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { landingColors } from "@/lib/theme";

type Props = {
  kicker: string;
  title: string;
};

export function PortalSubHeader({ kicker, title }: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingTop: insets.top + 8 }]}>
      <Pressable
        onPress={() => router.back()}
        style={({ pressed }) => [styles.back, pressed && { opacity: 0.7 }]}
        hitSlop={8}
      >
        <ArrowLeft size={20} color={landingColors.text} strokeWidth={2.2} />
      </Pressable>
      <View style={styles.titles}>
        <Text style={styles.kicker}>{kicker}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.spacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: landingColors.white,
    borderWidth: 1,
    borderColor: landingColors.glassBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  titles: { flex: 1, alignItems: "center" },
  kicker: {
    fontSize: 10,
    fontWeight: "700",
    color: landingColors.primary,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: landingColors.text,
    letterSpacing: -0.4,
    marginTop: 2,
  },
  spacer: { width: 40 },
});
