import { ActivityIndicator, StyleSheet, View } from "react-native";
import { colors } from "@/lib/theme";

export function BootScreen() {
  return (
    <View style={styles.boot}>
      <ActivityIndicator color={colors.kou} size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
  },
});
