import { useEffect, useRef, useState } from "react";
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
import {
  CheckCircle2,
  ClipboardCheck,
  Cloud,
  CloudOff,
  Mic,
  ScanLine,
  Stethoscope,
} from "lucide-react-native";
import { SwipeToApprove } from "./SwipeToApprove";
import { EmptyBlock, ErrorBlock, LoadingBlock } from "./StateViews";
import { useAuth } from "@/lib/api/AuthContext";
import { approveLog, requestRevision, validateQrPayload } from "@/lib/api";
import { usePendingApprovals } from "@/lib/api/hooks";
import { relativeTimeTr } from "@/lib/api/labels";
import type { PendingApproval } from "@/lib/api/types";
import { colors } from "@/lib/theme";

type Tab = "pending" | "scanner" | "osce";

export function FacultyApp() {
  const { user } = useAuth();
  const pending = usePendingApprovals();
  const [tab, setTab] = useState<Tab>("pending");
  const pendingCount = pending.data?.length ?? 0;

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.flex1}>
            <Text style={styles.headerName} numberOfLines={1}>
              {user?.name ?? "Akademisyen"}
            </Text>
            <Text style={styles.headerSub} numberOfLines={1}>
              {user?.department ?? ""}
            </Text>
          </View>
          <View style={styles.headerPill}>
            <Text style={styles.headerPillText}>Hızlı Onay Paneli</Text>
          </View>
        </View>
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
  const [seconds, setSeconds] = useState(255);
  const [item1, setItem1] = useState<string | null>(null);
  const [likert, setLikert] = useState<number | null>(null);
  const [global, setGlobal] = useState(65);
  const [online, setOnline] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <View style={styles.listPad}>
      <View style={styles.card}>
        <View style={styles.osceHeader}>
          <View style={styles.flex1}>
            <Text style={styles.osceKicker}>İstasyon 3</Text>
            <Text style={styles.osceTitle}>Solunum Sistemi Muayenesi</Text>
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
              {online ? "Online (Synced)" : "Offline (SQLCipher)"}
            </Text>
          </Pressable>
        </View>
        <View style={styles.candidateRow}>
          <View style={styles.candidateAvatar}>
            <Text style={styles.candidateInitials}>ZK</Text>
          </View>
          <View style={styles.flex1}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              Aday #104 - Zeynep Kaya
            </Text>
            <Text style={styles.meta}>Dönem 6 · Grup B</Text>
          </View>
          <View style={styles.timerBox}>
            <View style={styles.timerDot} />
            <Text style={styles.timerText}>
              {mm}:{ss}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.rubricQ}>
          1. Hastanın sırtını doğru pozisyonda oskülte etti.
        </Text>
        <View style={styles.rubricRow3}>
          {(
            [
              ["Evet", "5p"],
              ["Kısmen", "2.5p"],
              ["Hayır", "0p"],
            ] as Array<[string, string]>
          ).map(([l, p]) => (
            <Pressable
              key={l}
              onPress={() => setItem1(l)}
              style={[styles.rubricBtn, item1 === l && styles.rubricBtnActive]}
            >
              <Text
                style={[styles.rubricBtnText, item1 === l && styles.rubricBtnTextActive]}
              >
                {l} <Text style={{ opacity: 0.7 }}>({p})</Text>
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.rubricQ}>2. İletişim ve aydınlatılmış onam.</Text>
        <View style={styles.rubricRow5}>
          {[1, 2, 3, 4, 5].map((n) => (
            <Pressable
              key={n}
              onPress={() => setLikert(n)}
              style={[styles.likertBtn, likert === n && styles.rubricBtnActive]}
            >
              <Text
                style={[styles.likertText, likert === n && styles.rubricBtnTextActive]}
              >
                {n}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.rubricQ}>Global Rating Scale</Text>
          <Text style={styles.globalPct}>%{global}</Text>
        </View>
        <RangeSlider value={global} onChange={setGlobal} />
      </View>

      <Pressable style={styles.completeBtn}>
        <Stethoscope size={16} color={colors.kouForeground} />
        <Text style={styles.completeBtnText}>İstasyonu Tamamla ve Kaydet</Text>
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

  const update = (x: number) => {
    const w = trackWidth.current;
    if (w <= 0) return;
    onChange(Math.round(Math.min(100, Math.max(0, (x / w) * 100))));
  };

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => update(evt.nativeEvent.locationX),
      onPanResponderMove: (evt) => update(evt.nativeEvent.locationX),
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
  headerPill: {
    borderRadius: 999,
    backgroundColor: colors.kou20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  headerPillText: { fontSize: 10, fontWeight: "700", color: colors.white },
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
  osceHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  osceKicker: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.kou,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  osceTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.foreground,
    lineHeight: 20,
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
  rubricQ: { fontSize: 12, fontWeight: "600", color: colors.foreground, lineHeight: 18 },
  rubricRow3: { marginTop: 8, flexDirection: "row", gap: 8 },
  rubricRow5: { marginTop: 8, flexDirection: "row", gap: 8 },
  rubricBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.card,
    paddingVertical: 8,
    alignItems: "center",
  },
  rubricBtnActive: {
    borderColor: colors.kou,
    backgroundColor: colors.kou,
  },
  rubricBtnText: { fontSize: 11, fontWeight: "600", color: colors.mutedForeground },
  rubricBtnTextActive: { color: colors.kouForeground },
  likertBtn: {
    flex: 1,
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  likertText: { fontSize: 14, fontWeight: "700", color: colors.mutedForeground },
  globalPct: { fontSize: 14, fontWeight: "700", color: colors.kou },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sliderTrack: {
    marginTop: 12,
    height: 8,
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
    width: 20,
    height: 20,
    marginLeft: -10,
    borderRadius: 10,
    backgroundColor: colors.kou,
    borderWidth: 2,
    borderColor: colors.white,
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
