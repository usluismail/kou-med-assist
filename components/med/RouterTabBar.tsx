import { router, type Href } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppTabBar, type AppTabItem } from "./AppTabBar";

export type RouterTabItem = {
  label: string;
  icon: AppTabItem<string>["icon"];
  href: Href;
};

export function RouterTabBar({
  state,
  items,
}: {
  state: { index: number; routes: Array<{ name: string }> };
  navigation?: unknown;
  items: Record<string, RouterTabItem>;
}) {
  const insets = useSafeAreaInsets();
  const routeMap = Object.fromEntries(state.routes.map((r) => [r.name, r]));
  const visible = Object.keys(items)
    .filter((key) => routeMap[key])
    .map((key) => routeMap[key]);
  const active = state.routes[state.index]?.name ?? visible[0]?.name ?? "";

  return (
    <AppTabBar
      tabs={visible.map((r) => ({
        key: r.name,
        label: items[r.name].label,
        icon: items[r.name].icon,
      }))}
      active={active}
      onChange={(name) => {
        const href = items[name]?.href;
        if (href) router.navigate(href);
      }}
      bottomInset={insets.bottom}
    />
  );
}
