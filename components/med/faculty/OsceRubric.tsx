import { useEffect, useMemo, useRef, useState } from "react";
import {
  LayoutChangeEvent,
  PanResponder,
  Pressable,
  Text,
  View,
} from "react-native";
import {
  Clock,
  Cloud,
  CloudOff,
  Stethoscope,
  Users,
  X,
} from "lucide-react-native";
import { EmptyBlock, ErrorBlock, LoadingBlock } from "../StateViews";
import { useAuth } from "@/lib/api/AuthContext";
import { submitOsceScore } from "@/lib/api";
import { useOsceStation } from "@/lib/api/hooks";
import { hapticSuccess } from "@/lib/haptics";
import { useToast } from "@/components/Toast";
import { colors } from "@/lib/theme";
import { styles } from "./styles";

export function OsceRubric() {
  const { token } = useAuth();
  const toast = useToast();
  const stationId = "station-3";
  const station = useOsceStation(stationId);
  const data = station.data;

  const [seconds, setSeconds] = useState(255);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [global, setGlobal] = useState(65);
  const [online, setOnline] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data?.durationSec) setSeconds(data.durationSec);
    if (data?.globalDefault != null) setGlobal(data.globalDefault);
  }, [data?.durationSec, data?.globalDefault]);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  const scoreSummary = useMemo(() => {
    if (!data) return { answered: 0, total: 0, checklistPts: 0, maxPts: 0 };
    let checklistPts = 0;
    let maxPts = 0;
    let answered = 0;
    for (const item of data.checklist) {
      const ans = answers[item.id];
      if (item.type === "tri") {
        const opts = item.options ?? [];
        maxPts += Math.max(0, ...opts.map((o) => o.points));
        if (ans != null) {
          answered += 1;
          const match = opts.find((o) => (o.id ?? o.value ?? o.label) === ans);
          checklistPts += match?.points ?? 0;
        }
      } else {
        const max = item.max ?? 5;
        maxPts += max;
        if (typeof ans === "number") {
          answered += 1;
          checklistPts += ans;
        }
      }
    }
    return { answered, total: data.checklist.length, checklistPts, maxPts };
  }, [answers, data]);

  const checklistPct =
    scoreSummary.maxPts > 0
      ? Math.round((scoreSummary.checklistPts / scoreSummary.maxPts) * 100)
      : 0;
  const combinedPct = Math.round(checklistPct * 0.7 + global * 0.3);

  const save = async () => {
    if (!token || !data) return;
    if (scoreSummary.answered < scoreSummary.total) {
      toast.show("Tüm rubrik maddelerini işaretleyin", "error");
      return;
    }
    setSaving(true);
    try {
      await submitOsceScore(token, {
        sessionId: data.sessionId,
        stationId: data.id,
        candidateId: data.candidate.id,
        checklist: answers,
        globalScore: global,
        offlineSyncedAt: online ? null : new Date().toISOString(),
      });
      await hapticSuccess();
      toast.show("OSCE skoru kaydedildi", "success");
    } catch (e) {
      toast.show(e instanceof Error ? e.message : "Kayıt başarısız", "error");
    } finally {
      setSaving(false);
    }
  };

  if (station.loading && !data) {
    return <LoadingBlock label="Rubrik yükleniyor…" />;
  }
  if (station.error && !data) {
    return <ErrorBlock message={station.error} onRetry={station.reload} />;
  }
  if (!data) {
    return <EmptyBlock message="İstasyon verisi yok" />;
  }

  const cand = data.candidate;

  return (
    <View style={styles.listPad}>
      <View style={styles.osceExamBanner}>
        <View style={styles.flex1}>
          <Text style={styles.osceExamLabel}>Objektif Yapılandırılmış Klinik Sınav</Text>
          <Text style={styles.osceExamTitle}>Değerlendirme Rubriği</Text>
        </View>
        <Pressable
          onPress={() => setOnline((v) => !v)}
          style={[
            styles.syncPill,
            online ? styles.syncOnline : styles.syncOffline,
          ]}
        >
          {online ? (
            <Cloud size={12} color={colors.success} />
          ) : (
            <CloudOff size={12} color={colors.warning} />
          )}
          <Text
            style={[
              styles.syncText,
              { color: online ? colors.success : colors.warning },
            ]}
          >
            {online ? "Senkron" : "Çevrimdışı"}
          </Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <View style={styles.osceHeader}>
          <View style={styles.stationBadge}>
            <Text style={styles.stationBadgeText}>İstasyon {data.number}</Text>
          </View>
          <View style={styles.timerBox}>
            <View style={[styles.timerDot, seconds < 60 && { backgroundColor: colors.warning }]} />
            <Text style={styles.timerText}>
              {mm}:{ss}
            </Text>
          </View>
        </View>
        <Text style={styles.osceTitle}>{data.title}</Text>
        <View style={styles.candidateRow}>
          <View style={styles.candidateAvatar}>
            <Text style={styles.candidateInitials}>{cand.initials}</Text>
          </View>
          <View style={styles.flex1}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              Aday #{cand.code} · {cand.name}
            </Text>
            <Text style={styles.meta}>
              {cand.period ? `${cand.period} · ` : ""}
              {cand.group}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.scoreSummaryCard}>
        <View style={styles.scoreCell}>
          <Text style={styles.scoreCellValue}>
            {scoreSummary.answered}/{scoreSummary.total}
          </Text>
          <Text style={styles.scoreCellLabel}>Madde</Text>
        </View>
        <View style={styles.scoreDivider} />
        <View style={styles.scoreCell}>
          <Text style={styles.scoreCellValue}>
            {scoreSummary.checklistPts}/{scoreSummary.maxPts}
          </Text>
          <Text style={styles.scoreCellLabel}>Checklist</Text>
        </View>
        <View style={styles.scoreDivider} />
        <View style={styles.scoreCell}>
          <Text style={[styles.scoreCellValue, { color: colors.kou }]}>
            %{combinedPct}
          </Text>
          <Text style={styles.scoreCellLabel}>Birleşik</Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>Kontrol Listesi</Text>
      {data.checklist.map((item, index) => {
        const answered = answers[item.id] != null;
        return (
          <View key={item.id} style={[styles.card, styles.rubricCard]}>
            <View style={styles.rubricHead}>
              <View style={[styles.rubricIndex, answered && styles.rubricIndexDone]}>
                <Text
                  style={[
                    styles.rubricIndexText,
                    answered && styles.rubricIndexTextDone,
                  ]}
                >
                  {index + 1}
                </Text>
              </View>
              <Text style={[styles.rubricQ, styles.flex1]}>{item.prompt}</Text>
            </View>
            {item.type === "tri" ? (
              <View style={styles.rubricRow3}>
                {(item.options ?? []).map((opt) => {
                  const val = opt.id ?? opt.value ?? opt.label;
                  const active = answers[item.id] === val;
                  return (
                    <Pressable
                      key={val}
                      onPress={() =>
                        setAnswers((a) => ({ ...a, [item.id]: val }))
                      }
                      style={[styles.rubricBtn, active && styles.rubricBtnActive]}
                    >
                      <Text
                        style={[
                          styles.rubricBtnText,
                          active && styles.rubricBtnTextActive,
                        ]}
                      >
                        {opt.label}
                      </Text>
                      <Text
                        style={[
                          styles.rubricPts,
                          active && styles.rubricBtnTextActive,
                        ]}
                      >
                        {opt.points} puan
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            ) : (
              <View>
                <Text style={styles.likertHint}>
                  Likert ölçeği ({item.min ?? 1}–{item.max ?? 5})
                </Text>
                <View style={styles.rubricRow5}>
                  {Array.from(
                    { length: item.max ?? 5 },
                    (_, i) => i + (item.min ?? 1),
                  ).map((n) => (
                    <Pressable
                      key={n}
                      onPress={() => setAnswers((a) => ({ ...a, [item.id]: n }))}
                      style={[
                        styles.likertBtn,
                        answers[item.id] === n && styles.rubricBtnActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.likertText,
                          answers[item.id] === n && styles.rubricBtnTextActive,
                        ]}
                      >
                        {n}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}
          </View>
        );
      })}

      <Text style={styles.sectionLabel}>Global Değerlendirme</Text>
      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <View style={styles.flex1}>
            <Text style={styles.rubricQ}>Global Rating Scale (GRS)</Text>
            <Text style={styles.meta}>
              Genel klinik yeterlilik — checklist ağırlığı %70
            </Text>
          </View>
          <Text style={styles.globalPct}>%{global}</Text>
        </View>
        <RangeSlider value={global} onChange={setGlobal} />
        <View style={styles.grsLabels}>
          <Text style={styles.grsLabel}>Yetersiz</Text>
          <Text style={styles.grsLabel}>Sınırda</Text>
          <Text style={styles.grsLabel}>Yetkin</Text>
        </View>
      </View>

      <Pressable
        onPress={save}
        disabled={saving}
        style={[styles.completeBtn, saving && { opacity: 0.6 }]}
      >
        <Stethoscope size={16} color={colors.kouForeground} />
        <Text style={styles.completeBtnText}>
          {saving ? "Kaydediliyor…" : "İstasyonu Tamamla ve Kaydet"}
        </Text>
      </Pressable>
    </View>
  );
}

export function RangeSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const trackWidth = useRef(0);
  const startX = useRef(0);

  const update = (x: number) => {
    const w = trackWidth.current;
    if (w <= 0) return;
    onChange(Math.round(Math.min(100, Math.max(0, (x / w) * 100))));
  };

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) =>
        Math.abs(g.dx) > 4 && Math.abs(g.dx) > Math.abs(g.dy),
      onPanResponderTerminationRequest: () => false,
      onShouldBlockNativeResponder: () => true,
      onPanResponderGrant: (evt) => {
        startX.current = evt.nativeEvent.locationX;
        update(evt.nativeEvent.locationX);
      },
      onPanResponderMove: (_evt, g) => update(startX.current + g.dx),
    }),
  ).current;

  return (
    <View
      style={styles.sliderTrack}
      onLayout={(e: LayoutChangeEvent) => {
        trackWidth.current = e.nativeEvent.layout.width;
      }}
      {...pan.panHandlers}
    >
      <View style={[styles.sliderFill, { width: `${value}%` }]} />
      <View style={[styles.sliderThumb, { left: `${value}%` }]} />
    </View>
  );
}
