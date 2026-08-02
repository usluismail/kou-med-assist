import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Redirect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { FacultyApp } from "@/components/med/FacultyApp";
import { useAuth } from "@/lib/api/AuthContext";
import { colors } from "@/lib/theme";

export default function AkademisyenScreen() {
  const { ready, token, user } = useAuth();

  if (!ready) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator color={colors.kou} size="large" />
      </View>
    );
  }

  if (!token || user?.role !== "faculty") {
    return <Redirect href="/" />;
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <FacultyApp />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
