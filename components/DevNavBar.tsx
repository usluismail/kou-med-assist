/**
 * DevNavBar — yalnızca __DEV__ / simülatör testi için alt yönlendirme tuşları.
 * iPhone 17 Pro gibi Home tuşu olmayan cihazlarda geri / ana sayfa / giriş kolaylığı.
 */
import { Pressable, StyleSheet, Text, View } from "react-native";
import { usePathname, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft, House, Lock } from "lucide-react-native";
import { openDevLogin } from "@/lib/devLogin";
import { landingColors } from "@/lib/theme";

export function DevNavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const onHome = pathname === "/" || pathname === "/index";

  if (!__DEV__) return null;

  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 8) }]}
    >
      <View style={styles.bar}>
        <Pressable
          onPress={() => {
            if (router.canGoBack()) router.back();
            else router.replace("/");
          }}
          style={({ pressed }) => [styles.btn, pressed && styles.pressed]}
          accessibilityLabel="Geri"
        >
          <ArrowLeft size={18} color={landingColors.text} strokeWidth={2.4} />
          <Text style={styles.label}>Geri</Text>
        </Pressable>

        <Pressable
          onPress={() => router.replace("/")}
          style={({ pressed }) => [
            styles.btn,
            onHome && styles.btnActive,
            pressed && styles.pressed,
          ]}
          accessibilityLabel="Ana sayfa"
        >
          <House
            size={18}
            color={onHome ? landingColors.primary : landingColors.text}
            strokeWidth={2.4}
          />
          <Text style={[styles.label, onHome && styles.labelActive]}>Ana sayfa</Text>
        </Pressable>

        <Pressable
          onPress={() => {
            if (onHome) openDevLogin();
            else {
              router.replace("/");
              setTimeout(() => openDevLogin(), 350);
            }
          }}
          style={({ pressed }) => [styles.btn, pressed && styles.pressed]}
          accessibilityLabel="Giriş"
        >
          <Lock size={17} color={landingColors.text} strokeWidth={2.4} />
          <Text style={styles.label}>Giriş</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    paddingHorizontal: 16,
    zIndex: 100,
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.96)",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: landingColors.glassBorder,
    paddingHorizontal: 8,
    paddingVertical: 6,
    shadowColor: "#0C2E22",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    minWidth: 88,
    justifyContent: "center",
  },
  btnActive: {
    backgroundColor: landingColors.primaryGlow,
  },
  pressed: { opacity: 0.75 },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: landingColors.text,
  },
  labelActive: {
    color: landingColors.primary,
  },
});
