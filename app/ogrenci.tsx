import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StudentApp } from "@/components/med/StudentApp";
import { colors } from "@/lib/theme";

export default function OgrenciScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StudentApp />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
});
