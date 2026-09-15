/**
 * Logbook header — başlık, alt başlık ve tab/segment kontrolü.
 * SRP — Yalnızca header UI'nı render eder; sekme mantığını prop olarak alır.
 */
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "@/lib/theme";

type LogbookTab = "list" | "new";

type LogbookHeaderProps = {
  title: string;
  subtitle: string;
  paddingTop: number;
  headerBackground: string;
  segmentActiveColor: string;
  activeTab: LogbookTab;
  onTabChange: (tab: LogbookTab) => void;
};

const TABS: Array<[LogbookTab, string]> = [
  ["list", "Kayıtlarım"],
  ["new", "Yeni Kayıt"],
];

export function LogbookHeader({
  title,
  subtitle,
  paddingTop,
  headerBackground,
  segmentActiveColor,
  activeTab,
  onTabChange,
}: LogbookHeaderProps) {
  return (
    <View
      style={[
        styles.header,
        { backgroundColor: headerBackground, paddingTop },
      ]}
    >
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <View style={styles.segmentWrap}>
        {TABS.map(([key, label]) => (
          <Pressable
            key={key}
            onPress={() => onTabChange(key)}
            style={[styles.segmentBtn, activeTab === key && styles.segmentBtnActive]}
          >
            <Text
              style={[
                styles.segmentBtnText,
                activeTab === key && { color: segmentActiveColor },
              ]}
            >
              {label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  title: { fontSize: 18, fontWeight: "600", color: colors.white },
  subtitle: { fontSize: 11, color: colors.white60, marginTop: 2 },
  segmentWrap: {
    marginTop: 12,
    flexDirection: "row",
    gap: 4,
    borderRadius: 12,
    backgroundColor: colors.white10,
    padding: 4,
  },
  segmentBtn: { flex: 1, borderRadius: 8, paddingVertical: 8, alignItems: "center" },
  segmentBtnActive: { backgroundColor: colors.card },
  segmentBtnText: { fontSize: 12, fontWeight: "600", color: colors.white70 },
});
