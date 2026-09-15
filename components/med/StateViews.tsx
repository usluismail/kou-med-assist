import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "@/lib/theme";

export function LoadingBlock({ label = "Yükleniyor…" }: { label?: string }) {
  return (
    <View style={styles.box}>
      <ActivityIndicator color={colors.kou} />
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

export function ErrorBlock({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <View style={styles.box}>
      <Text style={styles.errorTitle}>Bağlantı sorunu</Text>
      <Text style={styles.text}>{message}</Text>
      {onRetry ? (
        <Pressable onPress={onRetry} style={styles.retry}>
          <Text style={styles.retryText}>Tekrar dene</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function EmptyBlock({ message }: { message: string }) {
  return (
    <View style={styles.box}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    padding: 24,
    alignItems: "center",
    gap: 10,
  },
  text: {
    fontSize: 13,
    color: colors.mutedForeground,
    textAlign: "center",
    lineHeight: 18,
  },
  errorTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.foreground,
  },
  retry: {
    marginTop: 4,
    backgroundColor: colors.kou,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryText: {
    color: colors.kouForeground,
    fontWeight: "700",
    fontSize: 13,
  },
});
