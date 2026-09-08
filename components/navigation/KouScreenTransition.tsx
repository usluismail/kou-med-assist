/**
 * kou-e-tip-mobil AppShell geçişi (birebir).
 * RN Animated — Expo Go’da reanimated/worklets bozulduğu için reanimated yok.
 *
 * initial={{ opacity: 0, x: isHome ? -60 : 60 }}
 * animate={{ opacity: 1, x: 0 }}
 * exit={{ opacity: 0, x: isHome ? 60 : -60 }}
 * transition={{ type: 'spring', stiffness: 300, damping: 30 }}
 * mode="wait" → girişte WAIT_MS gecikme
 */
import { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";
import { useNavigation } from "expo-router";
import { landingColors } from "@/lib/theme";

const OFFSET = 60;
const WAIT_MS = 180;
const SPRING = {
  stiffness: 300,
  damping: 30,
  mass: 0.9,
  useNativeDriver: true,
} as const;

let isFirstFocus = true;

function isHomeRoute(routeName: string) {
  return routeName === "index";
}

type Props = {
  routeName: string;
  children: React.ReactNode;
};

export function KouScreenTransition({ routeName, children }: Props) {
  const navigation = useNavigation();
  const isHome = isHomeRoute(routeName);
  const opacity = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const closingRef = useRef(false);

  useEffect(() => {
    const runEnter = () => {
      const fromX = isHome ? -OFFSET : OFFSET;
      opacity.setValue(0);
      translateX.setValue(fromX);
      Animated.sequence([
        Animated.delay(WAIT_MS),
        Animated.parallel([
          Animated.spring(opacity, { toValue: 1, ...SPRING }),
          Animated.spring(translateX, { toValue: 0, ...SPRING }),
        ]),
      ]).start();
    };

    const runExit = (onDone?: () => void) => {
      const toX = isHome ? OFFSET : -OFFSET;
      Animated.parallel([
        Animated.spring(opacity, { toValue: 0, ...SPRING }),
        Animated.spring(translateX, { toValue: toX, ...SPRING }),
      ]).start(() => {
        if (onDone) onDone();
      });
    };

    const unsubFocus = navigation.addListener("focus", () => {
      if (isFirstFocus) {
        isFirstFocus = false;
        return;
      }
      if (closingRef.current) return;
      runEnter();
    });

    const unsubBlur = navigation.addListener("blur", () => {
      if (closingRef.current) return;
      runExit();
    });

    const unsubRemove = navigation.addListener("beforeRemove", (e) => {
      if (closingRef.current) return;
      e.preventDefault();
      closingRef.current = true;
      const action = e.data.action;
      runExit(() => {
        navigation.dispatch(action);
      });
    });

    return () => {
      unsubFocus();
      unsubBlur();
      unsubRemove();
    };
  }, [navigation, isHome, opacity, translateX]);

  return (
    <Animated.View
      style={[
        styles.screen,
        { opacity, transform: [{ translateX }] },
      ]}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: landingColors.bg,
  },
});
