/**
 * SwipeToLogin.tsx — "Giriş için kaydır" pill bileşeni.
 *
 * SRP: Yalnızca swipe-to-login etkileşiminden sorumlu.
 * PanResponder kullanır (react-native built-in, extra dep gerekmez).
 */
import { useRef } from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  View,
} from "react-native";
import { ArrowRight } from "lucide-react-native";
import { landingColors } from "@/lib/theme";

const PILL_H = 64;
const KNOB_SIZE = 48;
const SCREEN_W = Dimensions.get("window").width;
const PILL_W = SCREEN_W - 32 * 2;
const MAX_DRAG = PILL_W - KNOB_SIZE - 8;

type Props = {
  onSwipeComplete: () => void;
};

export function SwipeToLogin({ onSwipeComplete }: Props) {
  const dragX = useRef(new Animated.Value(0)).current;
  const completed = useRef(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gs) => {
        dragX.setValue(Math.max(0, Math.min(gs.dx, MAX_DRAG)));
      },
      onPanResponderRelease: (_, gs) => {
        const x = Math.max(0, Math.min(gs.dx, MAX_DRAG));
        if (x >= MAX_DRAG * 0.72 && !completed.current) {
          completed.current = true;
          Animated.timing(dragX, {
            toValue: MAX_DRAG,
            duration: 180,
            useNativeDriver: false,
          }).start(() => {
            onSwipeComplete();
            setTimeout(() => {
              completed.current = false;
              Animated.spring(dragX, { toValue: 0, useNativeDriver: false }).start();
            }, 400);
          });
        } else {
          Animated.spring(dragX, { toValue: 0, useNativeDriver: false, friction: 8 }).start();
        }
      },
    })
  ).current;

  const textOpacity = dragX.interpolate({
    inputRange: [0, MAX_DRAG * 0.4],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const knobBg = dragX.interpolate({
    inputRange: [0, MAX_DRAG],
    outputRange: [landingColors.white, landingColors.primary],
    extrapolate: "clamp",
  });

  const progressW = dragX.interpolate({
    inputRange: [0, MAX_DRAG],
    outputRange: [KNOB_SIZE + 8, PILL_W],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.pill}>
      <Animated.View style={[styles.progressBar, { width: progressW }]} />
      <Animated.View
        style={[styles.knob, { transform: [{ translateX: dragX }], backgroundColor: knobBg }]}
        {...panResponder.panHandlers}
      >
        <ArrowRight size={20} color={landingColors.primary} />
      </Animated.View>
      <Animated.Text style={[styles.pillText, { opacity: textOpacity }]}>
        Giriş için kaydır
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    width: PILL_W,
    height: PILL_H,
    borderRadius: PILL_H / 2,
    backgroundColor: landingColors.swipePill,
    borderWidth: 1,
    borderColor: landingColors.glassBorderStrong,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 4,
    overflow: "hidden",
  },
  progressBar: {
    ...StyleSheet.absoluteFill,
    backgroundColor: landingColors.primaryGlow30,
    borderRadius: PILL_H / 2,
  },
  knob: {
    width: KNOB_SIZE,
    height: KNOB_SIZE,
    borderRadius: KNOB_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    shadowColor: landingColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  pillText: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    color: landingColors.swipeText,
    letterSpacing: 0.3,
    marginRight: KNOB_SIZE + 12,
  },
});
