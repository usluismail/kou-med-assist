import { useRef, useState } from "react";
import {
  LayoutChangeEvent,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Check, ChevronsRight } from "lucide-react-native";
import { colors } from "@/lib/theme";

const THUMB = 44;
const PAD = 6;

export function SwipeToApprove({
  onApprove,
  approved,
  label = "Onaylamak için kaydır",
}: {
  onApprove: () => void;
  approved: boolean;
  label?: string;
}) {
  const trackWidth = useRef(0);
  const [pct, setPct] = useState(0);
  const [dragging, setDragging] = useState(false);

  const calcPct = (x: number) => {
    const w = trackWidth.current;
    if (w <= THUMB + PAD * 2) return 0;
    return Math.min(1, Math.max(0, (x - PAD - THUMB / 2) / (w - THUMB - PAD * 2)));
  };

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !approved,
      onMoveShouldSetPanResponder: () => !approved,
      onPanResponderGrant: (evt) => {
        if (approved) return;
        setDragging(true);
        setPct(calcPct(evt.nativeEvent.locationX));
      },
      onPanResponderMove: (evt) => {
        if (approved) return;
        setPct(calcPct(evt.nativeEvent.locationX));
      },
      onPanResponderRelease: (evt) => {
        if (approved) return;
        setDragging(false);
        const v = calcPct(evt.nativeEvent.locationX);
        if (v > 0.92) {
          setPct(1);
          onApprove();
        } else {
          setPct(0);
        }
      },
      onPanResponderTerminate: () => {
        setDragging(false);
        setPct(0);
      },
    }),
  ).current;

  const fill = approved ? 1 : pct;
  const maxTravel = Math.max(0, trackWidth.current - THUMB - PAD * 2);
  const thumbLeft = PAD + fill * maxTravel;

  return (
    <View
      style={[styles.track, approved && styles.trackApproved]}
      onLayout={(e: LayoutChangeEvent) => {
        trackWidth.current = e.nativeEvent.layout.width;
      }}
      {...pan.panHandlers}
    >
      <View
        style={[
          styles.fill,
          { width: thumbLeft + THUMB + PAD },
        ]}
      />
      <View style={styles.labelRow} pointerEvents="none">
        {approved ? (
          <Text style={styles.approvedLabel}>ONAYLANDI</Text>
        ) : (
          <Text style={styles.swipeLabel}>{label}</Text>
        )}
      </View>
      <View
        style={[
          styles.thumb,
          approved && styles.thumbApproved,
          { left: thumbLeft },
          !dragging && styles.thumbAnimated,
        ]}
        pointerEvents="none"
      >
        {approved ? (
          <Check size={20} color={colors.success} />
        ) : (
          <ChevronsRight size={20} color={colors.kouForeground} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    position: "relative",
    height: 56,
    width: "100%",
    borderRadius: 16,
    backgroundColor: colors.clinical05,
    overflow: "hidden",
  },
  trackApproved: {
    backgroundColor: colors.success,
  },
  fill: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: colors.kou15,
  },
  labelRow: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 4,
  },
  swipeLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(26,35,50,0.6)",
  },
  approvedLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.kouForeground,
  },
  thumb: {
    position: "absolute",
    top: 6,
    width: THUMB,
    height: THUMB,
    borderRadius: 12,
    backgroundColor: colors.kou,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  thumbApproved: {
    backgroundColor: colors.card,
  },
  thumbAnimated: {
    // layout animation handled by React state updates
  },
});
