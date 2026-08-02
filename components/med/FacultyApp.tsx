import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  LayoutChangeEvent,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import {
  CheckCircle2,
  ClipboardCheck,
  Cloud,
  CloudOff,
  LogOut,
  Mic,
  ScanLine,
  Stethoscope,
} from "lucide-react-native";
import { SwipeToApprove } from "./SwipeToApprove";
import { EmptyBlock, ErrorBlock, LoadingBlock } from "./StateViews";
import { useAuth } from "@/lib/api/AuthContext";
import { approveLog, requestRevision, submitOsceScore, validateQrPayload } from "@/lib/api";
import { useOsceStation, usePendingApprovals } from "@/lib/api/hooks";
import { relativeTimeTr } from "@/lib/api/labels";
import type { PendingApproval } from "@/lib/api/types";
import { hapticSuccess } from "@/lib/haptics";
import { useToast } from "@/components/Toast";
import { colors } from "@/lib/theme";

type Tab = "pending" | "scanner" | "osce";

export function FacultyApp() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pending = usePendingApprovals();
  const [tab, setTab] = useState<Tab>("pending");
  const [profileOpen, setProfileOpen] = useState(false);
  const pendingCount = pending.data?.length ?? 0;

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  const infoRows: Array<[string, string]> = [
    ["Ad Soyad", user?.name ?? "—"],
    ["E-posta", user?.email ?? "—"],
    ["Fakülte", user?.faculty ?? "—"],
    ["Birim", user?.department ?? "—"],
    ["Rol", "Akademisyen / Öğretim Üyesi"],
  ];

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Pressable
            style={styles.flex1}
            onPress={() => setProfileOpen((v) => !v)}
          >
            <Text style={styles.headerName} numberOfLines={1}>
              {user?.name ?? "Akademisyen"}
            </Text>
            <Text style={styles.headerSub} numberOfLines={1}>
              {user?.department ?? ""}
            </Text>
          </Pressable>
          <View style={styles.headerActions}>
            <View style={styles.headerPill}>
              <Text style={styles.headerPillText}>Hızlı Onay Paneli</Text>
            </View>
            <Pressable
              onPress={handleLogout}
              style={styles.headerLogout}
              hitSlop={8}
              accessibilityLabel="Hesaptan çıkış yap"
            >
              <LogOut size={16} color={colors.white} />
            </Pressable>
          </View>
        </View>
        {profileOpen ? (
          <View style={styles.facultyProfileCard}>
            <Text style={styles.facultyProfileTitle}>Genel Bilgiler</Text>
            <Text style={styles.facultyProfileHint}>
              API’den gelen kayıt — yalnızca görüntüleme
            </Text>
            {infoRows.map(([label, value]) => (
              <View key={label} style={styles.facultyInfoRow}>
                <Text style={styles.facultyInfoLabel}>{label}</Text>
                <Text style={styles.facultyInfoValue}>{value}</Text>
              </View>
            ))}
            <Pressable onPress={handleLogout} style={styles.facultyLogoutBtn}>
              <LogOut size={16} color={colors.danger} />
              <Text style={styles.facultyLogoutText}>Hesaptan Çıkış Yap</Text>
            </Pressable>
          </View>
        ) : null}
        <View style={styles.tabSwitch}>
          {(
            [
              ["pending", `Karneler (${pendingCount})`],
              ["scanner", "QR Tarayıcı"],
              ["osce", "OSCE Rubrik"],
            ] as Array<[Tab, string]>
          ).map(([k, l]) => (
            <Pressable
              key={k}
              onPress={() => setTab(k)}
              style={[styles.tabBtn, tab === k && styles.tabBtnActive]}
            >
              <Text style={[styles.tabBtnText, tab === k && styles.tabBtnTextActive]}>
                {l}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {tab === "pending" && (
          <ApprovalList
            items={pending.data}
            loading={pending.loading}
            error={pending.error}
            onRetry={pending.reload}
            onChanged={pending.reload}
          />
        )}
        {tab === "scanner" && <Scanner onApproved={pending.reload} />}
        {tab === "osce" && <OsceRubric />}
      </ScrollView>
    </View>
  );
}

function ApprovalList({
  items,
  loading,
  error,
  onRetry,
  onChanged,
}: {
  items: PendingApproval[] | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onChanged: () => void;
}) {
  if (loading && !items) return <LoadingBlock label="Onaylar yükleniyor…" />;
  if (error && !items) return <ErrorBlock message={error} onRetry={onRetry} />;
  if (!items || items.length === 0) {
    return <EmptyBlock message="Bekleyen onay yok" />;
  }

  return (
    <View style={styles.listPad}>
      {items.map((item) => (
        <ApprovalCard key={item.id} item={item} onChanged={onChanged} />
      ))}
    </View>
  );
}

function ApprovalCard({
  item,
  onChanged,
}: {
  item: PendingApproval;
  onChanged: () => void;
}) {
  const { token } = useAuth();
  const [note, setNote] = useState("");
  const [recording, setRecording] = useState(false);
  const [approved, setApproved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dictate = () => {
    setRecording(true);
    setTimeout(() => {
      setNote("Teknik usulüne uygun, hasta iletişimi başarılı.");
      setRecording(false);
    }, 900);
  };

  const doApprove = async () => {
    if (!token || busy) return;
    setBusy(true);
    setError(null);
    try {
      await approveLog(token, item.id, { note: note || undefined });
      await hapticSuccess();
      setApproved(true);
      setTimeout(() => onChanged(), 600);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Onay başarısız");
    } finally {
      setBusy(false);
    }
  };

  const doRevision = async () => {
    if (!token || busy) return;
    const revisionNote = note.trim() || "Lütfen kaydı gözden geçirin.";
    setBusy(true);
    setError(null);
    try {
      await requestRevision(token, item.id, revisionNote);
      onChanged();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Düzeltme isteği başarısız");
    } finally {
      setBusy(false);
    }
  };

  const confettiColors = ["#10B981", "#008542", "#F59E0B", "#3B82F6"];

  return (
    <View style={[styles.card, approved && { opacity: 0.9 }]}>
      {approved && (
        <View style={styles.approvedBadge}>
          <CheckCircle2 size={12} color={colors.success} />
          <Text style={styles.approvedBadgeText}>APPROVED</Text>
        </View>
      )}
      <View style={styles.cardHeader}>
        <View style={styles.cardIcon}>
          <ClipboardCheck size={20} color={colors.kou} />
        </View>
        <View style={styles.flex1}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.studentName}
          </Text>
          <Text style={styles.cardSub} numberOfLines={1}>
            {item.procedureName}
          </Text>
          <Text style={styles.meta}>
            Protokol: {item.encounterId} · {relativeTimeTr(item.submittedAt)}
          </Text>
        </View>
      </View>

      <View style={styles.noteBox}>
        <View style={styles.noteHeader}>
          <Text style={styles.noteLabel}>Sesli Geri Bildirim</Text>
          <Pressable
            onPress={dictate}
            style={[styles.micBtn, recording && styles.micBtnRecording]}
          >
            <Mic size={16} color={colors.white} />
          </Pressable>
        </View>
        <Text style={styles.noteText}>
          {note || (recording ? "Dinleniyor…" : "Mikrofona dokunun (Talk-to-Text)")}
        </Text>
      </View>

      {error ? (
        <Text style={{ color: "#DC2626", marginTop: 8, fontWeight: "600" }}>
          {error}
        </Text>
      ) : null}

      <View style={{ marginTop: 12 }}>
        <SwipeToApprove approved={approved} onApprove={doApprove} />
      </View>

      {!approved ? (
        <Pressable
          onPress={doRevision}
          disabled={busy}
          style={{ marginTop: 10, alignItems: "center", paddingVertical: 8 }}
        >
          <Text style={{ color: colors.clinical, fontWeight: "700", fontSize: 13 }}>
            Düzeltme iste
          </Text>
        </Pressable>
      ) : null}

      {approved &&
        Array.from({ length: 14 }, (_, i) => (
          <View
            key={i}
            pointerEvents="none"
            style={[
              styles.confetti,
              {
                left: `${8 + i * 6.4}%`,
                top: `${20 + ((i * 37) % 60)}%`,
                backgroundColor: confettiColors[i % 4],
              },
            ]}
          />
        ))}
    </View>
  );
}

function Scanner({ onApproved }: { onApproved?: () => void }) {
  const { token } = useAuth();
  const [payload, setPayload] = useState("");
  const [scanned, setScanned] = useState<PendingApproval | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const scanAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scanAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [scanAnim]);

  const scanTranslate = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [8, 180],
  });

  const validate = async () => {
    if (!token || !payload.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const res = await validateQrPayload(token, payload.trim());
      if ("status" in res && res.status === "invalid") {
        setError(res.message || "QR geçersiz");
        setScanned(null);
      } else {
        setScanned(res as PendingApproval);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "QR doğrulanamadı");
      setScanned(null);
    } finally {
      setBusy(false);
    }
  };

  const approveScanned = async () => {
    if (!token || !scanned) return;
    setBusy(true);
    try {
      await approveLog(token, scanned.id);
      setScanned(null);
      setPayload("");
      onApproved?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Onay başarısız");
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.scannerPad}>
      <View style={styles.scannerFrame}>
        <View style={styles.scannerGlow} />
        <View style={styles.scannerTarget}>
          <View style={styles.scannerBorder} />
          <View style={[styles.corner, styles.cornerTL]} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />
          <Animated.View
            style={[styles.scanLine, { transform: [{ translateY: scanTranslate }] }]}
          />
        </View>
        <Text style={styles.scanHint}>
          Öğrencinin QR kodunu çerçeveye hizalayın
        </Text>
        <TextInput
          value={payload}
          onChangeText={setPayload}
          placeholder="QR payload yapıştır (Sprint B — kamera sonra)"
          placeholderTextColor={colors.mutedForeground}
          autoCapitalize="none"
          style={{
            marginTop: 12,
            width: "100%",
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 10,
            paddingHorizontal: 12,
            paddingVertical: 10,
            color: colors.foreground,
            backgroundColor: colors.card,
          }}
        />
        <Pressable
          onPress={validate}
          disabled={busy || !payload.trim()}
          style={[styles.scanBtn, (busy || !payload.trim()) && { opacity: 0.5 }]}
        >
          <ScanLine size={16} color={colors.kouForeground} />
          <Text style={styles.scanBtnText}>
            {busy ? "Doğrulanıyor…" : "Payload doğrula"}
          </Text>
        </Pressable>
      </View>
      {error ? (
        <Text style={{ color: "#DC2626", fontWeight: "600", marginTop: 12 }}>
          {error}
        </Text>
      ) : null}
      {scanned && (
        <View style={styles.scanResult}>
          <Text style={styles.scanResultKicker}>QR Doğrulandı</Text>
          <Text style={styles.cardTitle}>{scanned.studentName}</Text>
          <Text style={styles.cardSub}>
            {scanned.procedureName} · {scanned.encounterId}
          </Text>
          <View style={{ marginTop: 12 }}>
            <SwipeToApprove approved={false} onApprove={approveScanned} />
          </View>
        </View>
      )}
    </View>
  );
}

function OsceRubric() {
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

function RangeSlider({
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

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    backgroundColor: colors.clinical,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  flex1: { flex: 1, minWidth: 0 },
  headerName: { fontSize: 14, fontWeight: "600", color: colors.white },
  headerSub: { fontSize: 11, color: colors.white60, marginTop: 2 },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 8 },
  headerPill: {
    borderRadius: 999,
    backgroundColor: colors.kou20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  headerPillText: { fontSize: 10, fontWeight: "700", color: colors.white },
  headerLogout: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.white10,
    alignItems: "center",
    justifyContent: "center",
  },
  facultyProfileCard: {
    marginTop: 12,
    borderRadius: 16,
    backgroundColor: colors.white10,
    padding: 14,
  },
  facultyProfileTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.white,
  },
  facultyProfileHint: {
    marginTop: 2,
    marginBottom: 10,
    fontSize: 11,
    color: colors.white60,
  },
  facultyInfoRow: {
    paddingVertical: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255,255,255,0.12)",
  },
  facultyInfoLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.white60,
    textTransform: "uppercase",
  },
  facultyInfoValue: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: "600",
    color: colors.white,
  },
  facultyLogoutBtn: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 12,
    backgroundColor: "rgba(239,68,68,0.15)",
    paddingVertical: 10,
  },
  facultyLogoutText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FCA5A5",
  },
  tabSwitch: {
    marginTop: 12,
    flexDirection: "row",
    gap: 4,
    borderRadius: 12,
    backgroundColor: colors.white10,
    padding: 4,
  },
  tabBtn: { flex: 1, borderRadius: 8, paddingVertical: 8, alignItems: "center" },
  tabBtnActive: { backgroundColor: colors.card },
  tabBtnText: { fontSize: 11, fontWeight: "600", color: colors.white70, textAlign: "center" },
  tabBtnTextActive: { color: colors.clinical },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 24 },
  listPad: { padding: 16, gap: 12 },
  card: {
    position: "relative",
    overflow: "hidden",
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  approvedBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 2,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 999,
    backgroundColor: colors.success10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  approvedBadgeText: { fontSize: 10, fontWeight: "700", color: colors.success },
  cardHeader: { flexDirection: "row", gap: 12 },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 16,
    backgroundColor: colors.kou10,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: { fontSize: 14, fontWeight: "600", color: colors.foreground },
  cardSub: { fontSize: 12, color: colors.mutedForeground, marginTop: 2 },
  meta: { fontSize: 11, color: colors.mutedForeground, marginTop: 4 },
  noteBox: {
    marginTop: 12,
    borderRadius: 16,
    backgroundColor: "rgba(241,245,249,0.6)",
    padding: 12,
  },
  noteHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  noteLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.mutedForeground,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  micBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.kou,
    alignItems: "center",
    justifyContent: "center",
  },
  micBtnRecording: { backgroundColor: colors.danger },
  noteText: {
    marginTop: 8,
    minHeight: 32,
    fontSize: 12,
    fontStyle: "italic",
    color: "rgba(26,35,50,0.8)",
  },
  confetti: {
    position: "absolute",
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  scannerPad: { padding: 16, paddingBottom: 24 },
  scannerFrame: {
    aspectRatio: 3 / 4,
    borderRadius: 24,
    backgroundColor: colors.clinical,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  scannerGlow: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  scannerTarget: {
    width: 208,
    height: 208,
    position: "relative",
  },
  scannerBorder: {
    ...StyleSheet.absoluteFill,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.2)",
  },
  corner: {
    position: "absolute",
    width: 40,
    height: 40,
    borderColor: colors.kou,
    borderWidth: 4,
    borderRadius: 12,
  },
  cornerTL: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  cornerTR: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  cornerBL: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  cornerBR: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
  scanLine: {
    position: "absolute",
    left: 8,
    right: 8,
    height: 2,
    backgroundColor: "rgba(0,133,66,0.8)",
  },
  scanHint: {
    position: "absolute",
    bottom: 96,
    left: 16,
    right: 16,
    textAlign: "center",
    fontSize: 12,
    color: colors.white70,
  },
  scanBtn: {
    position: "absolute",
    bottom: 32,
    left: 24,
    right: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 16,
    backgroundColor: colors.kou,
    paddingVertical: 14,
  },
  scanBtnText: { fontSize: 14, fontWeight: "600", color: colors.kouForeground },
  scanResult: {
    marginTop: 12,
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  scanResultKicker: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.success,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  osceExamBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 20,
    backgroundColor: colors.clinical,
    padding: 16,
  },
  osceExamLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.white60,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  osceExamTitle: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: "700",
    color: colors.white,
  },
  osceHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  stationBadge: {
    borderRadius: 999,
    backgroundColor: colors.kou10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  stationBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.kou,
    textTransform: "uppercase",
  },
  osceTitle: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: "700",
    color: colors.foreground,
    lineHeight: 22,
  },
  syncPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  syncOnline: { backgroundColor: colors.success10 },
  syncOffline: { backgroundColor: colors.warning10 },
  syncText: { fontSize: 9, fontWeight: "700" },
  candidateRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 16,
    backgroundColor: "rgba(241,245,249,0.6)",
    padding: 12,
  },
  candidateAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.kou15,
    alignItems: "center",
    justifyContent: "center",
  },
  candidateInitials: { fontSize: 12, fontWeight: "700", color: colors.kou },
  timerBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 12,
    backgroundColor: colors.clinical,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  timerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger,
  },
  timerText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.white,
    fontVariant: ["tabular-nums"],
  },
  scoreSummaryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  scoreCell: { flex: 1, alignItems: "center" },
  scoreCellValue: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.foreground,
  },
  scoreCellLabel: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: "600",
    color: colors.mutedForeground,
    textTransform: "uppercase",
  },
  scoreDivider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: "stretch",
    backgroundColor: colors.border,
  },
  sectionLabel: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "700",
    color: colors.mutedForeground,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  rubricCard: { borderWidth: 1, borderColor: colors.border },
  rubricHead: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  rubricIndex: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: colors.muted,
    alignItems: "center",
    justifyContent: "center",
  },
  rubricIndexDone: { backgroundColor: colors.kou },
  rubricIndexText: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.mutedForeground,
  },
  rubricIndexTextDone: { color: colors.kouForeground },
  rubricQ: { fontSize: 13, fontWeight: "600", color: colors.foreground, lineHeight: 19 },
  rubricRow3: { marginTop: 12, flexDirection: "row", gap: 8 },
  rubricRow5: { marginTop: 8, flexDirection: "row", gap: 8 },
  rubricBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.secondary,
    paddingVertical: 10,
    paddingHorizontal: 4,
    alignItems: "center",
  },
  rubricBtnActive: {
    borderColor: colors.kou,
    backgroundColor: colors.kou,
  },
  rubricBtnText: { fontSize: 11, fontWeight: "700", color: colors.foreground },
  rubricBtnTextActive: { color: colors.kouForeground },
  rubricPts: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: "600",
    color: colors.mutedForeground,
  },
  likertHint: {
    marginTop: 10,
    fontSize: 11,
    color: colors.mutedForeground,
  },
  likertBtn: {
    flex: 1,
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  likertText: { fontSize: 14, fontWeight: "700", color: colors.mutedForeground },
  globalPct: { fontSize: 18, fontWeight: "800", color: colors.kou },
  grsLabels: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  grsLabel: { fontSize: 10, color: colors.mutedForeground, fontWeight: "600" },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sliderTrack: {
    marginTop: 14,
    height: 10,
    borderRadius: 999,
    backgroundColor: colors.muted,
    position: "relative",
    justifyContent: "center",
  },
  sliderFill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 999,
    backgroundColor: colors.kou,
  },
  sliderThumb: {
    position: "absolute",
    width: 22,
    height: 22,
    marginLeft: -11,
    borderRadius: 11,
    backgroundColor: colors.kou,
    borderWidth: 2,
    borderColor: colors.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  completeBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 16,
    backgroundColor: colors.kou,
    paddingVertical: 14,
    shadowColor: colors.kou,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 4,
  },
  completeBtnText: { fontSize: 14, fontWeight: "600", color: colors.kouForeground },
});
