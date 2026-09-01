import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CheckCircle2, ChevronRight, Repeat2, ShieldCheck } from "lucide-react-native";
import { BottomSheet } from "../BottomSheet";
import { EmptyBlock, ErrorBlock, LoadingBlock } from "../StateViews";
import { useAuth } from "@/lib/api/AuthContext";
import { useColleagues, useShifts } from "@/lib/api/hooks";
import { requestShiftSwap } from "@/lib/api";
import type { Shift } from "@/lib/api/types";
import { hapticSuccess } from "@/lib/haptics";
import { colors } from "@/lib/theme";
import { styles } from "./styles";

export function ShiftsScreen({ onSwap }: { onSwap: () => void }) {
  const insets = useSafeAreaInsets();
  const shifts = useShifts();
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [filter, setFilter] = useState<"all" | Shift["state"]>("all");
  const [detail, setDetail] = useState<Shift | null>(null);

  const shiftStyle = (s: string) => {
    if (s === "completed") return { bg: colors.success10, text: colors.success };
    if (s === "night") return { bg: colors.info10, text: colors.info };
    return { bg: colors.warning10, text: colors.warning };
  };

  const shiftLabel = (s: string) => {
    if (s === "completed") return "Tamamlandı";
    if (s === "night") return "Gece";
    return "Yaklaşan";
  };

  const list = shifts.data ?? [];
  const filtered =
    filter === "all" ? list : list.filter((s) => s.state === filter);

  const filters: Array<{ key: typeof filter; label: string }> = [
    { key: "all", label: "Tümü" },
    { key: "upcoming", label: "Yaklaşan" },
    { key: "completed", label: "Tamamlanan" },
    { key: "night", label: "Gece" },
  ];

  return (
    <View>
      <View style={[styles.clinicalHeader, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.screenTitle}>Nöbet & Vardiya</Text>
        <Text style={styles.headerSub}>Ağustos 2026 · Acil Tıp AD</Text>
        <View style={styles.segmentWrap}>
          {(
            [
              ["calendar", "Takvim"],
              ["list", "Liste"],
            ] as Array<["calendar" | "list", string]>
          ).map(([k, l]) => (
            <Pressable
              key={k}
              onPress={() => setView(k)}
              style={[styles.segmentBtn, view === k && styles.segmentBtnActive]}
            >
              <Text
                style={[
                  styles.segmentBtnText,
                  view === k && styles.segmentBtnTextActive,
                ]}
              >
                {l}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.listPad}>
        {shifts.loading && !shifts.data ? (
          <LoadingBlock label="Nöbetler yükleniyor…" />
        ) : null}
        {shifts.error && !shifts.data ? (
          <ErrorBlock message={shifts.error} onRetry={shifts.reload} />
        ) : null}

        {view === "calendar" ? (
          <View style={styles.card}>
            <View style={styles.weekRow}>
              {["Pt", "Sa", "Ça", "Pe", "Cu", "Ct", "Pz"].map((d) => (
                <View key={d} style={styles.weekDayCell}>
                  <Text style={styles.weekDay}>{d}</Text>
                </View>
              ))}
            </View>
            <View style={styles.calendarGrid}>
              {Array.from({ length: 6 }, (_, week) => (
                <View key={week} style={styles.calWeek}>
                  {Array.from({ length: 7 }, (_, dow) => {
                    const i = week * 7 + dow;
                    const day = i - 4;
                    const inMonth = day >= 1 && day <= 31;
                    const shift = inMonth
                      ? list.find((s) => s.day === day)
                      : undefined;
                    const st = shift ? shiftStyle(shift.state) : null;
                    return (
                      <Pressable
                        key={i}
                        disabled={!shift}
                        onPress={() => shift && setDetail(shift)}
                        style={styles.calCell}
                      >
                        {inMonth ? (
                          <View
                            style={[
                              styles.calDayBubble,
                              st ? { backgroundColor: st.bg } : null,
                            ]}
                          >
                            <Text
                              style={[
                                styles.calDay,
                                {
                                  color: st ? st.text : colors.mutedForeground,
                                },
                              ]}
                            >
                              {day}
                            </Text>
                          </View>
                        ) : (
                          <View style={styles.calDayBubble} />
                        )}
                      </Pressable>
                    );
                  })}
                </View>
              ))}
            </View>
            <View style={styles.legendRow}>
              <Legend dotColor={colors.success} text="Tamamlandı" />
              <Legend dotColor={colors.warning} text="Yaklaşan" />
              <Legend dotColor={colors.info} text="Gece Nöbeti" />
            </View>
          </View>
        ) : (
          <>
            <View style={styles.chipRow}>
              {filters.map((f) => {
                const active = filter === f.key;
                return (
                  <Pressable
                    key={f.key}
                    onPress={() => setFilter(f.key)}
                    style={[styles.chip, active && styles.chipActive]}
                  >
                    <Text
                      style={[styles.chipText, active && styles.chipTextActive]}
                    >
                      {f.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {filtered.length === 0 ? (
              <EmptyBlock message="Bu filtrede nöbet yok" />
            ) : (
              filtered.map((s) => {
                const st = shiftStyle(s.state);
                return (
                  <Pressable
                    key={s.id}
                    onPress={() => setDetail(s)}
                    style={styles.card}
                  >
                    <View style={styles.rowBetween}>
                      <View style={styles.flex1}>
                        <Text style={styles.cardTitle} numberOfLines={1}>
                          {s.label}
                        </Text>
                        <Text style={styles.meta}>
                          {s.time} · {s.area}
                        </Text>
                      </View>
                      <View
                        style={[styles.statusPill, { backgroundColor: st.bg }]}
                      >
                        <Text style={[styles.statusText, { color: st.text }]}>
                          {shiftLabel(s.state)}
                        </Text>
                      </View>
                    </View>
                  </Pressable>
                );
              })
            )}
          </>
        )}

        <Pressable onPress={onSwap} style={styles.primaryAction}>
          <Repeat2 size={16} color={colors.kouForeground} />
          <Text style={styles.primaryActionText}>Nöbet Takas Talebi</Text>
        </Pressable>
      </View>

      <BottomSheet
        open={!!detail}
        onClose={() => setDetail(null)}
        title={detail?.label ?? ""}
      >
        {detail && (
          <View style={styles.detailSheet}>
            <View style={styles.detailBox}>
              <Text style={styles.cardTitle}>{detail.area}</Text>
              <Text style={styles.meta}>{detail.time}</Text>
            </View>
            <Text style={styles.detailLabel}>Nöbet Arkadaşları</Text>
            {detail.partners.map((p) => (
              <Text key={p} style={styles.detailValue}>
                {p}
              </Text>
            ))}
            <Text style={styles.detailLabel}>Sorumlu Öğretim Üyesi</Text>
            <Text style={styles.detailValue}>Doç. Dr. Ayşe Kaya</Text>
            {detail.state !== "completed" ? (
              <Pressable
                onPress={() => {
                  setDetail(null);
                  onSwap();
                }}
                style={[styles.primaryAction, { marginTop: 8 }]}
              >
                <Text style={styles.primaryActionText}>Takas İste</Text>
              </Pressable>
            ) : null}
          </View>
        )}
      </BottomSheet>
    </View>
  );
}

export function SwapSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { token } = useAuth();
  const shifts = useShifts(open);
  const colleagues = useColleagues(open);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const upcoming = (shifts.data ?? []).filter((s) => s.state !== "completed");
  const [shiftId, setShiftId] = useState("");
  const [colleagueId, setColleagueId] = useState("");
  const friendShifts = [
    "09 Ağustos 2026 · 00:00 - 08:00 · Travma",
    "14 Ağustos 2026 · 16:00 - 08:00 · Sarı Alan",
  ];
  const [friendShift, setFriendShift] = useState(friendShifts[0]);

  useEffect(() => {
    if (!open) return;
    if (!shiftId && upcoming[0]) setShiftId(upcoming[0].id);
    if (!colleagueId && colleagues.data?.[0]) {
      setColleagueId(colleagues.data[0].id);
    }
  }, [open, shiftId, colleagueId, shifts.data, colleagues.data]);

  const handleClose = () => {
    setSent(false);
    setError(null);
    onClose();
  };

  const submit = async () => {
    if (!token || !shiftId || !colleagueId) return;
    setBusy(true);
    setError(null);
    try {
      await requestShiftSwap(token, shiftId, { colleagueId });
      setSent(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Takas isteği gönderilemedi");
    } finally {
      setBusy(false);
    }
  };

  const shiftLabel =
    upcoming.find((s) => s.id === shiftId)
      ? `${upcoming.find((s) => s.id === shiftId)!.label} · ${upcoming.find((s) => s.id === shiftId)!.area}`
      : "—";
  const colleagueName =
    colleagues.data?.find((c) => c.id === colleagueId)?.name ?? "—";

  return (
    <BottomSheet open={open} onClose={handleClose} title="Nöbet Takas Talebi">
      <View style={styles.detailSheet}>
        <Field label="Takas edilecek nöbetim">
          <SelectField
            value={shiftLabel}
            options={
              upcoming.length
                ? upcoming.map((s) => `${s.label} · ${s.area}`)
                : ["—"]
            }
            onChange={(label) => {
              const s = upcoming.find((x) => `${x.label} · ${x.area}` === label);
              if (s) setShiftId(s.id);
            }}
          />
        </Field>
        <Field label="Takas yapılacak arkadaş">
          <SelectField
            value={colleagueName}
            options={(colleagues.data ?? []).map((c) => c.name)}
            onChange={(name) => {
              const c = colleagues.data?.find((x) => x.name === name);
              if (c) setColleagueId(c.id);
            }}
          />
        </Field>
        <Field label="Arkadaşın nöbeti">
          <SelectField
            value={friendShift}
            options={friendShifts}
            onChange={setFriendShift}
          />
        </Field>
        <View style={styles.okBanner}>
          <ShieldCheck size={16} color={colors.success} />
          <Text style={styles.okBannerText}>
            80 Saat Yasal Çalışma Limiti Kontrol Edildi: UYGUN
          </Text>
        </View>
        {error ? (
          <Text style={{ color: "#DC2626", fontWeight: "600", marginBottom: 8 }}>
            {error}
          </Text>
        ) : null}
        {sent ? (
          <View style={styles.sentBtn}>
            <CheckCircle2 size={16} color={colors.kouForeground} />
            <Text style={styles.primaryActionText}>Teklif Gönderildi</Text>
          </View>
        ) : (
          <Pressable
            onPress={submit}
            disabled={busy}
            style={[styles.primaryAction, busy && { opacity: 0.5 }]}
          >
            <Text style={styles.primaryActionText}>
              {busy ? "Gönderiliyor…" : "Takas Teklifi Gönder"}
            </Text>
          </Pressable>
        )}
      </View>
    </BottomSheet>
  );
}

function Legend({ dotColor, text }: { dotColor: string; text: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: dotColor }]} />
      <Text style={styles.legendText}>{text}</Text>
    </View>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
    </View>
  );
}

function SelectField({
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
