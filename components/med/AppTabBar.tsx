import type { ComponentType } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "@/lib/theme";

type IconProps = { size?: number; color?: string; strokeWidth?: number };

export type AppTabItem<K extends string> = {
  key: K;
  label: string;
  icon: ComponentType<IconProps>;
};

export function AppTabBar<K extends string>({
  tabs,
  active,
  onChange,
  bottomInset,
}: {
  tabs: ReadonlyArray<AppTabItem<K>>;
  active: K;
  onChange: (key: K) => void;
  bottomInset: number;
}) {
  return (
    <View style={[styles.tabBar, { paddingBottom: Math.max(bottomInset, 10) }]}>
      {tabs.map(({ key, label, icon: Icon }) => {
        const isActive = active === key;
        return (
          <Pressable
            key={key}
            onPress={() => onChange(key)}
            style={[styles.tabItem, isActive && styles.tabItemActive]}
          >
            <Icon
              size={20}
              color={isActive ? colors.kouForeground : colors.mutedForeground}
              strokeWidth={isActive ? 2.5 : 2}
            />
            <Text
              style={[styles.tabLabel, isActive && styles.tabLabelActive]}
              numberOfLines={1}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 6,
    gap: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    paddingVertical: 8,
    paddingHorizontal: 2,
    borderRadius: 12,
    minHeight: 52,
  },
  tabItemActive: { backgroundColor: colors.kou },
  tabLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.mutedForeground,
    textAlign: "center",
  },
  tabLabelActive: { fontWeight: "700", color: colors.kouForeground },
});
