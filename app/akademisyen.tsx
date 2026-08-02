import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FacultyApp } from "@/components/med/FacultyApp";
import { colors } from "@/lib/theme";

export default function AkademisyenScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <FacultyApp />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
