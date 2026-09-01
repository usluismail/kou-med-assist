/**
 * Logbook paylaşılan UI ilkeleri.
 * SRP — Her bileşen yalnızca kendi görsel sorumluluğunu üstlenir.
 * Bu dosyadaki bileşenler domain mantığı içermez; saf UI'dır.
 */
import { type ReactNode, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { ChevronRight } from "lucide-react-native";
import { colors } from "@/lib/theme";

// ─── Field ────────────────────────────────────────────────────────────────

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
    </View>
  );
}

// ─── Segmented ────────────────────────────────────────────────────────────

export function Segmented({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <View style={styles.segmented}>
      {options.map((o) => (
        <Pressable
          key={o}
          onPress={() => onChange(o)}
          style={[styles.segmentedBtn, value === o && styles.segmentedBtnActive]}
        >
          <Text
            style={[
              styles.segmentedBtnText,
              value === o && styles.segmentedBtnTextActive,
            ]}
          >
            {o}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

// ─── SelectField ──────────────────────────────────────────────────────────

export function SelectField({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <View>
      <Pressable onPress={() => setOpen((o) => !o)} style={styles.selectTrigger}>
        <Text style={styles.selectText} numberOfLines={1}>
          {value}
        </Text>
        <ChevronRight
          size={16}
          color={colors.mutedForeground}
          style={{ transform: [{ rotate: open ? "90deg" : "0deg" }] }}
        />
      </Pressable>
      {open && (
        <View style={styles.selectMenu}>
          {options.map((o) => (
            <Pressable
              key={o}
              onPress={() => {
                onChange(o);
                setOpen(false);
              }}
              style={[styles.selectItem, value === o && styles.selectItemActive]}
            >
              <Text
                style={[
                  styles.selectItemText,
                  value === o && styles.selectItemTextActive,
                ]}
                numberOfLines={2}
              >
                {o}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

// ─── ProgressRing ─────────────────────────────────────────────────────────

export function ProgressRing({
  size,
  strokeWidth,
  pct,
  trackColor,
  progressColor,
}: {
  size: number;
  strokeWidth: number;
  pct: number;
  trackColor: string;
  progressColor: string;
}) {
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const cx = size / 2;
  const cy = size / 2;
  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Svg
        width={size}
        height={size}
        style={{ position: "absolute", transform: [{ rotate: "-90deg" }] }}
      >
        <Circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <Circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct / 100)}
        />
      </Svg>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  field: { gap: 6 },
  fieldLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.mutedForeground,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  segmented: {
    flexDirection: "row",
    gap: 4,
    borderRadius: 12,
    backgroundColor: colors.muted,
    padding: 4,
  },
  segmentedBtn: { flex: 1, borderRadius: 8, paddingVertical: 8, alignItems: "center" },
  segmentedBtnActive: {
    backgroundColor: colors.card,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  segmentedBtnText: { fontSize: 12, fontWeight: "600", color: colors.mutedForeground },
  segmentedBtnTextActive: { color: colors.clinical },
  selectTrigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  selectText: { flex: 1, fontSize: 14, color: colors.foreground },
  selectMenu: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: colors.card,
  },
  selectItem: { paddingHorizontal: 12, paddingVertical: 10 },
  selectItemActive: { backgroundColor: colors.muted },
  selectItemText: { fontSize: 14, color: colors.foreground },
  selectItemTextActive: { fontWeight: "600", color: colors.clinical },
});
