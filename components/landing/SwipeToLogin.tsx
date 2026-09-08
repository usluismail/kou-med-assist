/**
 * SwipeToLogin.tsx — "Giriş için kaydır" pill (hero üzerinde).
 * KOÜ Mobil referans: lim yeşili knob + yarı saydam koyu pill.
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

const PILL_H = 58;
const KNOB_SIZE = 46;
const SCREEN_W = Dimensions.get("window").width;
const PILL_W = SCREEN_W - 24 * 2 - 22 * 2;
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

  const progressW = dragX.interpolate({
    inputRange: [0, MAX_DRAG],
    outputRange: [KNOB_SIZE + 8, PILL_W],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.pill}>
      <Animated.View style={[styles.progressBar, { width: progressW }]} />
      <Animated.View
        style={[styles.knob, { transform: [{ translateX: dragX }] }]}
        {...panResponder.panHandlers}
      >
        <ArrowRight size={20} color={landingColors.heroEmerald} strokeWidth={2.5} />
      </Animated.View>
      <Animated.View style={[styles.textBlock, { opacity: textOpacity }]}>
        <Animated.Text style={styles.pillText}>Giriş için kaydır</Animated.Text>
        <Animated.Text style={styles.pillSub}>Öğrenci veya akademisyen hesabınla</Animated.Text>
      </Animated.View>
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
    borderColor: "rgba(255,255,255,0.18)",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 6,
    overflow: "hidden",
  },
  progressBar: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(184,212,74,0.22)",
    borderRadius: PILL_H / 2,
  },
  knob: {
    width: KNOB_SIZE,
    height: KNOB_SIZE,
    borderRadius: KNOB_SIZE / 2,
    backgroundColor: landingColors.swipeKnob,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  textBlock: {
    flex: 1,
    alignItems: "center",
    marginRight: KNOB_SIZE + 8,
  },
  pillText: {
    fontSize: 13,
    fontWeight: "700",
    color: landingColors.swipeText,
    letterSpacing: 0.2,
  },
  pillSub: {
    fontSize: 10,
    fontWeight: "500",
    color: "rgba(255,255,255,0.65)",
    marginTop: 1,
  },
});
