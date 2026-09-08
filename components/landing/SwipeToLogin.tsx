/**
 * SwipeToLogin.tsx — "Giriş için kaydır" pill.
 * Knob pill içinde tam daire (kırpılmaz), eşit yan boşluk, hafif Border Beam.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  LayoutChangeEvent,
  PanResponder,
  StyleSheet,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowRight } from "lucide-react-native";
import { landingColors } from "@/lib/theme";

/** Knob + üst/alt boşluk net kalsın: (56 - 42) / 2 = 7px */
const PILL_H = 56;
const KNOB = 42;
const PAD = 7;
const BEAM = 2;
const INNER_H = PILL_H - BEAM * 2;

type Props = {
  onSwipeComplete: () => void;
};

function ChevronHint({ opacity }: { opacity: Animated.AnimatedInterpolation<number> }) {
  const a = useRef(new Animated.Value(0.28)).current;
  const b = useRef(new Animated.Value(0.5)).current;
  const c = useRef(new Animated.Value(0.78)).current;

  useEffect(() => {
    const wave = (v: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(v, { toValue: 1, duration: 420, useNativeDriver: true }),
          Animated.timing(v, { toValue: 0.22, duration: 420, useNativeDriver: true }),
        ])
      );
    const loops = [wave(a, 0), wave(b, 140), wave(c, 280)];
    loops.forEach((l) => l.start());
    return () => loops.forEach((l) => l.stop());
  }, [a, b, c]);

  return (
    <Animated.View style={[styles.chevrons, { opacity }]} pointerEvents="none">
      <Animated.Text style={[styles.chevron, { opacity: a }]}>›</Animated.Text>
      <Animated.Text style={[styles.chevron, { opacity: b }]}>›</Animated.Text>
      <Animated.Text style={[styles.chevron, { opacity: c }]}>›</Animated.Text>
    </Animated.View>
  );
}

function BorderBeam({ width }: { width: number }) {
  const spin = useRef(new Animated.Value(0)).current;
  const size = Math.max(width, PILL_H) * 1.85;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 3600,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [spin]);

  if (width <= 0) return null;

  return (
    <View style={styles.beamMask} pointerEvents="none">
      <Animated.View
        style={{
          position: "absolute",
          width: size,
          height: size,
          left: (width - size) / 2,
          top: (PILL_H - size) / 2,
          transform: [
            {
              rotate: spin.interpolate({
                inputRange: [0, 1],
                outputRange: ["0deg", "360deg"],
              }),
            },
          ],
        }}
      >
        <LinearGradient
          colors={[
            "transparent",
            "transparent",
            "rgba(184,212,74,0)",
            "rgba(200,230,120,0.5)",
            "rgba(255,255,255,0.7)",
            "rgba(200,230,120,0.5)",
            "rgba(184,212,74,0)",
            "transparent",
            "transparent",
          ]}
          locations={[0, 0.4, 0.45, 0.48, 0.5, 0.52, 0.55, 0.6, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

export function SwipeToLogin({ onSwipeComplete }: Props) {
  const dragX = useRef(new Animated.Value(0)).current;
  const completed = useRef(false);
  const maxDragRef = useRef(0);
  const [shellW, setShellW] = useState(0);
  const [maxDrag, setMaxDrag] = useState(0);

  const onLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    const innerW = w - BEAM * 2;
    const max = Math.max(0, innerW - PAD * 2 - KNOB);
    setShellW(w);
    setMaxDrag(max);
    maxDragRef.current = max;
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gs) => {
          const max = maxDragRef.current;
          dragX.setValue(Math.max(0, Math.min(gs.dx, max)));
        },
        onPanResponderRelease: (_, gs) => {
          const max = maxDragRef.current;
          const x = Math.max(0, Math.min(gs.dx, max));
          if (max > 0 && x >= max * 0.72 && !completed.current) {
            completed.current = true;
            Animated.timing(dragX, {
              toValue: max,
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
      }),
    [dragX, onSwipeComplete]
  );

  const textOpacity = useMemo(
    () =>
      dragX.interpolate({
        inputRange: [0, Math.max(1, maxDrag) * 0.4],
        outputRange: [1, 0],
        extrapolate: "clamp",
      }),
    [dragX, maxDrag]
  );

  /** Progress sadece sürüklerken — dururken knob arkasında kırpık halo yok */
  const progressW = useMemo(
    () =>
      dragX.interpolate({
        inputRange: [0, Math.max(1, maxDrag)],
        outputRange: [0, Math.max(0, shellW - BEAM * 2)],
        extrapolate: "clamp",
      }),
    [dragX, maxDrag, shellW]
  );

  const progressOpacity = useMemo(
    () =>
      dragX.interpolate({
        inputRange: [0, 8],
        outputRange: [0, 1],
        extrapolate: "clamp",
      }),
    [dragX]
  );

  return (
    <View style={styles.shell} onLayout={onLayout}>
      <BorderBeam width={shellW} />

      <View style={styles.pill}>
        <Animated.View
          style={[styles.progressBar, { width: progressW, opacity: progressOpacity }]}
        />

        <View style={styles.row}>
          <View style={styles.side}>
            {/* Knob flex satırında dikey ortalı — absolute top hesabı yok */}
            <Animated.View
              style={[styles.knob, { transform: [{ translateX: dragX }] }]}
              {...panResponder.panHandlers}
            >
              <ArrowRight size={18} color={landingColors.heroEmerald} strokeWidth={2.5} />
            </Animated.View>
          </View>

          <Animated.View style={[styles.textBlock, { opacity: textOpacity }]}>
            <Animated.Text style={styles.pillText}>Giriş için kaydır</Animated.Text>
            <Animated.Text style={styles.pillSub}>Öğrenci veya akademisyen hesabınla</Animated.Text>
          </Animated.View>

          <View style={styles.side}>
            <ChevronHint opacity={textOpacity} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    width: "100%",
    height: PILL_H,
    borderRadius: PILL_H / 2,
    overflow: "hidden",
    alignSelf: "stretch",
  },
  beamMask: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: PILL_H / 2,
    overflow: "hidden",
  },
  pill: {
    ...StyleSheet.absoluteFillObject,
    margin: BEAM,
    borderRadius: INNER_H / 2,
    backgroundColor: landingColors.swipePill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.2)",
    overflow: "hidden",
    justifyContent: "center",
  },
  progressBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(184,212,74,0.2)",
    borderRadius: INNER_H / 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: PAD,
    height: INNER_H,
  },
  side: {
    width: KNOB,
    height: KNOB,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  knob: {
    width: KNOB,
    height: KNOB,
    borderRadius: KNOB / 2,
    backgroundColor: landingColors.swipeKnob,
    alignItems: "center",
    justifyContent: "center",
  },
  textBlock: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
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
  chevrons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 1,
  },
  chevron: {
    fontSize: 17,
    fontWeight: "700",
    color: "rgba(255,255,255,0.85)",
    lineHeight: 20,
  },
});
