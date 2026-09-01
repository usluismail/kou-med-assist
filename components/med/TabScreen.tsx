import type { ReactNode } from "react";
import { ScrollView, View, type StyleProp, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function TabScreen({
  children,
  fab,
  style,
}: {
  children: ReactNode;
  fab?: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[{ flex: 1 }, style]}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 88 + Math.max(insets.bottom, 8),
        }}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
      {fab}
    </View>
  );
}
