/**
 * ogrenci.tsx — Öğrenci giriş noktası
 *
 * Dönem 1-2-3 → PreKlinikApp
 * Dönem 4-5   → KlinikApp
 * Dönem 6     → StudentApp (mevcut intörn ekranı)
 */
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Redirect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StudentApp } from "@/components/med/StudentApp";
import { PreKlinikApp } from "@/components/med/PreKlinikApp";
import { KlinikApp } from "@/components/med/KlinikApp";
import { useAuth } from "@/lib/api/AuthContext";
import { colors } from "@/lib/theme";

export default function OgrenciScreen() {
  const { ready, token, user } = useAuth();

  if (!ready) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator color={colors.kou} size="large" />
      </View>
    );
  }

  if (!token || user?.role !== "student") {
    return <Redirect href="/" />;
  }

  const period = (user as any)?.period as number | undefined;

  let Screen: React.ReactNode;
  if (period !== undefined && period >= 1 && period <= 3) {
    Screen = <PreKlinikApp />;
  } else if (period !== undefined && period >= 4 && period <= 5) {
    Screen = <KlinikApp />;
  } else {
    Screen = <StudentApp />;   // Dönem 6 (intörn)
  }

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      {Screen}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
  },
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
});
