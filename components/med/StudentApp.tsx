import { useEffect, useState, type ReactNode } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";
import {
  Bell,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Home,
  LogOut,
  Plus,
  QrCode as QrIcon,
  Repeat2,
  ScanBarcode,
  Search,
  ShieldCheck,
  Stethoscope,
  Timer,
  User,
  Wifi,
} from "lucide-react-native";
import { BottomSheet } from "./BottomSheet";
import { QrCode } from "./QrCode";
import { EmptyBlock, ErrorBlock, LoadingBlock } from "./StateViews";
import { useAuth } from "@/lib/api/AuthContext";
import {
  useColleagues,
  useLogs,
  useProcedures,
  useShifts,
  useOsceSessions,
  useStudentDashboard,
  useSupervisors,
} from "@/lib/api/hooks";
import { createLog, requestShiftSwap } from "@/lib/api";
import { formatLogDateTr, logRoleLabel, logStatusLabel } from "@/lib/api/labels";
import type { LogEntry, Shift } from "@/lib/api/types";
import { hapticSuccess } from "@/lib/haptics";
import { colors } from "@/lib/theme";

type Tab = "home" | "logbook" | "shifts" | "osce" | "profile";

export type QrInfo = {
  payload: string;
  procedureName: string;
  encounterId: string;
};

export function StudentApp() {
  const [tab, setTab] = useState<Tab>("home");
  const [qrInfo, setQrInfo] = useState<QrInfo | null>(null);
  const [swapOpen, setSwapOpen] = useState(false);
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 88 + Math.max(insets.bottom, 8) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {tab === "home" && (
          <Dashboard onSwap={() => setSwapOpen(true)} onLog={() => setTab("logbook")} />
        )}
        {tab === "logbook" && (
          <Logbook
            onQrCreated={(info) => setQrInfo(info)}
            initialTab="list"
          />
        )}
        {tab === "shifts" && <ShiftsScreen onSwap={() => setSwapOpen(true)} />}
        {tab === "osce" && <OsceStudent />}
        {tab === "profile" && <Profile />}
      </ScrollView>

      {tab === "home" && (
        <Pressable
          onPress={() => setTab("logbook")}
          style={({ pressed }) => [
            styles.fab,
            { bottom: 72 + Math.max(insets.bottom, 8) },
            pressed && { transform: [{ scale: 0.95 }] },
          ]}
        >
          <Plus size={20} color={colors.kouForeground} />
          <Text style={styles.fabText}>Log Ekle</Text>
        </Pressable>
      )}

      <View style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
        {(
          [
            ["home", "Ana Sayfa", Home],
            ["logbook", "Karne", ClipboardList],
            ["shifts", "Nöbet", Calendar],
            ["osce", "OSCE", Stethoscope],
            ["profile", "Profil", User],
          ] as Array<[Tab, string, typeof Home]>
        ).map(([key, label, Icon]) => {
          const active = tab === key;
          return (
            <Pressable
              key={key}
              onPress={() => setTab(key)}
              style={[styles.tabItem, active && styles.tabItemActive]}
            >
              <Icon
                size={20}
                color={active ? colors.kouForeground : colors.mutedForeground}
                strokeWidth={active ? 2.5 : 2}
              />
              <Text
                style={[styles.tabLabel, active && styles.tabLabelActive]}
                numberOfLines={1}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <QrSheet
        open={!!qrInfo}
        info={qrInfo}
        onClose={() => setQrInfo(null)}
      />
      <SwapSheet open={swapOpen} onClose={() => setSwapOpen(false)} />
    </View>
  );
}

function ProgressRing({
  size,
  strokeWidth,
  pct,
  trackColor,
  progressColor,
  children,
}: {
  size: number;
  strokeWidth: number;
  pct: number;
  trackColor: string;
  progressColor: string;
  children?: ReactNode;
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
      {children}
    </View>
  );
}

function Dashboard({
  onSwap,
  onLog,
}: {
  onSwap: () => void;
  onLog: () => void;
}) {
  const { data, loading, error, reload } = useStudentDashboard();
  const procedures = useProcedures();

  if (loading && !data) return <LoadingBlock label="Dashboard yükleniyor…" />;
  if (error && !data) return <ErrorBlock message={error} onRetry={reload} />;
  if (!data) return <EmptyBlock message="Dashboard verisi yok" />;

  const pct = data.ucepProgress.percent;
  const { done, total } = data.ucepProgress;
  const procs = procedures.data ?? [];
  const shift = data.upcomingShift;

  return (
    <View style={styles.screenPad}>
      <View style={[styles.clinicalHeader, styles.homeHeader]}>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <View style={styles.avatarSm}>
              <Text style={styles.avatarSmText}>{data.student.initials}</Text>
            </View>
            <View style={styles.headerTextWrap}>
              <Text style={styles.headerName} numberOfLines={1}>
                {data.student.name}
              </Text>
              <Text style={styles.headerSub} numberOfLines={1}>
                {data.rotation}
              </Text>
            </View>
          </View>
          <Pressable style={styles.bellBtn}>
            <Bell size={20} color={colors.white} />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{data.logSummary.pending}</Text>
            </View>
          </Pressable>
        </View>
      </View>

      <View style={styles.dashboardBody}>
        <View style={styles.card}>
          <View style={styles.progressRow}>
            <View style={styles.ringWrap}>
              <ProgressRing
                size={112}
                strokeWidth={10}
                pct={pct}
                trackColor={colors.muted}
                progressColor={colors.kou}
              >
                <View style={styles.ringCenter}>
                  <Text style={styles.ringPct}>%{pct}</Text>
                  <Text style={styles.ringSub}>
                    {done}/{total}
                  </Text>
                </View>
              </ProgressRing>
            </View>
            <View style={styles.progressInfo}>
              <Text style={styles.kicker}>U-ÇEP İlerlemesi</Text>
              <Text style={styles.progressTitle}>
                {done}/{total} girişim tamamlandı
              </Text>
              <View style={styles.procList}>
                {procs.slice(0, 3).map((p) => (
                  <View key={p.id} style={styles.procItem}>
                    <Text style={styles.procName} numberOfLines={1}>
                      {p.name}
                    </Text>
                    <View style={styles.barTrack}>
                      <View
                        style={[
                          styles.barFill,
                          {
                            width: `${(p.done / p.total) * 100}%`,
                            backgroundColor:
                              p.done === p.total ? colors.success : colors.kou,
                          },
                        ]}
                      />
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        {shift ? (
          <View style={[styles.card, styles.warningCard]}>
            <Text style={styles.warningKicker}>Yaklaşan Nöbet</Text>
            <Text style={styles.cardTitle}>{shift.time}</Text>
            <Text style={styles.cardSub}>
              {shift.label} · {shift.area}
            </Text>
            <Pressable onPress={onSwap} style={styles.swapBtn}>
              <Repeat2 size={16} color={colors.clinical} />
              <Text style={styles.swapBtnText}>Takas İstet</Text>
            </Pressable>
          </View>
        ) : null}

        <Pressable onPress={onLog} style={styles.card}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.cardTitle}>Son Karne Kayıtları</Text>
              <Text style={styles.cardSub}>
                {data.logSummary.pending} kayıt onay bekliyor
              </Text>
            </View>
            <ChevronRight size={16} color={colors.mutedForeground} />
          </View>
        </Pressable>
      </View>
    </View>
  );
}

function Logbook({
  onQrCreated,
}: {
  onQrCreated: (info: QrInfo) => void;
  initialTab?: "list" | "new";
}) {
  const { user, token } = useAuth();
  const logs = useLogs();
  const procedures = useProcedures();
  const supervisors = useSupervisors();
  const [tab, setTab] = useState<"list" | "new">("list");
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [procId, setProcId] = useState<string | null>(null);
  const [procQuery, setProcQuery] = useState("");
  const [encounterId, setEncounterId] = useState("ENC-2026-");
  const [age, setAge] = useState("Yetişkin");
  const [sex, setSex] = useState("Kadın");
  const [roleLabel, setRoleLabel] = useState("Bizzat Yaptım");
  const [supervisorId, setSupervisorId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const procList = procedures.data ?? [];
  const selectedProc = procList.find((p) => p.id === procId) ?? null;
  const supervisorList = supervisors.data ?? [];

  useEffect(() => {
    if (!supervisorId && supervisorList[0]) setSupervisorId(supervisorList[0].id);
  }, [supervisorId, supervisorList]);

  const suggestions = procList.filter(
    (p) =>
      procQuery.length > 1 &&
      p.name.toLowerCase().includes(procQuery.toLowerCase()),
  );

  const ageToApi = (v: string) =>
    v === "Pediatrik" ? "child" : v === "Geriatrik" ? "geriatric" : "adult";
  const sexToApi = (v: string) => (v === "Erkek" ? "m" : "f");
  const roleToApi = (v: string) =>
    v === "Gözlemledim" ? "observed" : v === "Yardım Ettim" ? "assisted" : "performed";

  const resetForm = () => {
    setStep(1);
    setProcId(null);
    setProcQuery("");
    setEncounterId("ENC-2026-");
    setAge("Yetişkin");
    setSex("Kadın");
    setRoleLabel("Bizzat Yaptım");
    setFormError(null);
  };

  const submit = async (method: "push" | "qr") => {
    if (!token || !procId || !supervisorId) return;
    const enc = encounterId.trim();
    if (enc.length < 5) {
      setFormError("Encounter ID girin (hasta adı / TCKN yok)");
      return;
    }
    setSubmitting(true);
    setFormError(null);
    try {
      const created = await createLog(token, {
        procedureId: procId,
        encounterId: enc,
        ageGroup: ageToApi(age) as "child" | "adult" | "geriatric",
        sex: sexToApi(sex) as "f" | "m",
        role: roleToApi(roleLabel) as "observed" | "assisted" | "performed",
        supervisorId,
        approvalMethod: method,
      });
      await hapticSuccess();
      logs.reload();
      if (method === "qr" && created.qrPayload) {
        onQrCreated({
          payload: created.qrPayload,
          procedureName: created.procedureName,
          encounterId: created.encounterId,
        });
      }
      resetForm();
      setTab("list");
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Kayıt gönderilemedi");
    } finally {
      setSubmitting(false);
    }
  };

  const statusColor = (status: LogEntry["status"]) => {
    if (status === "approved") return colors.success;
    if (status === "revision_requested") return colors.clinical;
    return colors.warning;
  };

  return (
    <View>
      <View style={styles.clinicalHeader}>
        <Text style={styles.screenTitle}>Dijital Klinik Karne</Text>
        <Text style={styles.headerSub}>
          {user?.faculty ?? "Kocaeli Üniversitesi Tıp Fakültesi"}
        </Text>
        <View style={styles.segmentWrap}>
          {(
            [
              ["list", "Kayıtlarım"],
              ["new", "Yeni Kayıt"],
            ] as Array<["list" | "new", string]>
          ).map(([k, l]) => (
            <Pressable
              key={k}
              onPress={() => {
                setTab(k);
                if (k === "new") setStep(1);
              }}
              style={[styles.segmentBtn, tab === k && styles.segmentBtnActive]}
            >
              <Text
                style={[
                  styles.segmentBtnText,
                  tab === k && styles.segmentBtnTextActive,
                ]}
              >
                {l}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {tab === "list" ? (
        <View style={styles.listPad}>
          {logs.loading && !logs.data ? (
            <LoadingBlock label="Karneler yükleniyor…" />
          ) : null}
          {logs.error && !logs.data ? (
            <ErrorBlock message={logs.error} onRetry={logs.reload} />
          ) : null}
          {logs.data && logs.data.length === 0 ? (
            <EmptyBlock message="Henüz karne kaydı yok" />
          ) : null}
          {(logs.data ?? []).map((e: LogEntry) => (
            <View key={e.id} style={styles.card}>
              <View style={styles.rowBetweenStart}>
                <Text style={[styles.cardTitle, styles.flex1]}>
                  {e.procedureName}
                </Text>
                <View
                  style={[
                    styles.statusPill,
                    e.status === "approved"
                      ? styles.statusApproved
                      : styles.statusPending,
                  ]}
                >
                  <Text style={[styles.statusText, { color: statusColor(e.status) }]}>
                    {logStatusLabel[e.status]}
                  </Text>
                </View>
              </View>
              <Text style={styles.meta}>
                {formatLogDateTr(e.date)} · {logRoleLabel[e.role]}
              </Text>
              <Text style={styles.meta}>
                Protokol: {e.encounterId} · {e.supervisorName}
              </Text>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.formPad}>
          <Text style={styles.meta}>Adım {step}/3</Text>

          {step === 1 && (
            <>
              <Field label="1 · Prosedür seç">
                <View style={styles.searchWrap}>
                  <View style={styles.searchIcon}>
                    <Search size={16} color={colors.mutedForeground} />
                  </View>
                  <TextInput
                    value={procQuery}
                    onChangeText={setProcQuery}
                    placeholder="Ara veya listeden seç"
                    placeholderTextColor={colors.mutedForeground}
                    style={styles.input}
                  />
                </View>
                {selectedProc ? (
                  <Text style={[styles.meta, { marginTop: 8 }]}>
                    Seçili: {selectedProc.name}
                  </Text>
                ) : null}
                <View style={{ marginTop: 8, gap: 6 }}>
                  {(suggestions.length ? suggestions : procList).map((s) => (
                    <Pressable
                      key={s.id}
                      onPress={() => {
                        setProcId(s.id);
                        setProcQuery(s.name);
                      }}
                      style={[
                        styles.suggestionItem,
                        procId === s.id && { backgroundColor: colors.kou + "22" },
                      ]}
                    >
                      <Text style={styles.suggestionText}>{s.name}</Text>
                    </Pressable>
                  ))}
                </View>
              </Field>
              <Pressable
                disabled={!procId}
                onPress={() => setStep(2)}
                style={[styles.primaryAction, !procId && { opacity: 0.5 }]}
              >
                <Text style={styles.primaryActionText}>Devam</Text>
              </Pressable>
            </>
          )}

          {step === 2 && (
            <>
              <Field label="Encounter ID (HBYS Protokol No)">
                <View style={styles.rowGap}>
                  <TextInput
                    value={encounterId}
                    onChangeText={setEncounterId}
                    autoCapitalize="characters"
                    style={[styles.inputPlain, styles.flex1]}
                  />
                  <Pressable style={styles.barcodeBtn}>
                    <ScanBarcode size={16} color={colors.white} />
                    <Text style={styles.barcodeText}>Barkod</Text>
                  </Pressable>
                </View>
                <Text style={[styles.meta, { marginTop: 6 }]}>
                  Hasta adı / TCKN girilmez (KVKK)
                </Text>
              </Field>

              <Field label="Hasta Demografisi">
                <Segmented
                  options={["Pediatrik", "Yetişkin", "Geriatrik"]}
                  value={age}
                  onChange={setAge}
                />
                <View style={{ marginTop: 8 }}>
                  <Segmented
                    options={["Kadın", "Erkek"]}
                    value={sex}
                    onChange={setSex}
                  />
                </View>
              </Field>

              <Field label="Öğrenci Rolü">
                <View style={styles.chipRow}>
                  {["Gözlemledim", "Yardım Ettim", "Bizzat Yaptım"].map((r) => (
                    <Pressable
                      key={r}
                      onPress={() => setRoleLabel(r)}
                      style={[styles.chip, roleLabel === r && styles.chipActive]}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          roleLabel === r && styles.chipTextActive,
                        ]}
                      >
                        {r}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </Field>

              <Field label="Onaylayacak Öğretim Üyesi">
                <SelectField
                  value={
                    supervisorList.find((s) => s.id === supervisorId)?.name ?? "—"
                  }
                  options={supervisorList.map((s) => s.name)}
                  onChange={(name) => {
                    const s = supervisorList.find((x) => x.name === name);
                    if (s) setSupervisorId(s.id);
                  }}
                />
              </Field>

              <View style={styles.formActions}>
                <Pressable
                  onPress={() => setStep(1)}
                  style={styles.secondaryAction}
                >
                  <Text style={styles.secondaryActionText}>Geri</Text>
                </Pressable>
                <Pressable
                  onPress={() => setStep(3)}
                  style={styles.primaryAction}
                >
                  <Text style={styles.primaryActionText}>Onay yöntemine geç</Text>
                </Pressable>
              </View>
            </>
          )}

          {step === 3 && (
            <>
              <Text style={styles.cardTitle}>{selectedProc?.name}</Text>
              <Text style={styles.meta}>
                {encounterId} · {roleLabel}
              </Text>
              {formError ? (
                <Text style={{ color: "#DC2626", marginTop: 8, fontWeight: "600" }}>
                  {formError}
                </Text>
              ) : null}
              <View style={[styles.formActions, { marginTop: 16 }]}>
                <Pressable
                  disabled={submitting}
                  onPress={() => submit("push")}
                  style={[styles.secondaryAction, submitting && { opacity: 0.5 }]}
                >
                  <Text style={styles.secondaryActionText}>
                    {submitting ? "Gönderiliyor…" : "Push ile onaya gönder"}
                  </Text>
                </Pressable>
                <Pressable
                  disabled={submitting}
                  onPress={() => submit("qr")}
                  style={[styles.primaryAction, submitting && { opacity: 0.5 }]}
                >
                  <QrIcon size={16} color={colors.kouForeground} />
                  <Text style={styles.primaryActionText}>QR oluştur & gönder</Text>
                </Pressable>
              </View>
              <Pressable onPress={() => setStep(2)} style={{ marginTop: 8 }}>
                <Text style={styles.secondaryActionText}>Forma dön</Text>
              </Pressable>
            </>
          )}
        </View>
      )}
    </View>
  );
}

function QrSheet({
  open,
  onClose,
  info,
}: {
  open: boolean;
  onClose: () => void;
  info: QrInfo | null;
}) {
  const { user } = useAuth();
  const [left, setLeft] = useState(30);
  useEffect(() => {
    if (!open) return;
    setLeft(30);
    const t = setInterval(() => setLeft((v) => (v <= 0 ? 30 : v - 1)), 1000);
    return () => clearInterval(t);
  }, [open, info?.payload]);

  return (
    <BottomSheet open={open} onClose={onClose} title="Yüz Yüze Onay QR Kodu">
      <View style={styles.qrSheet}>
        <View style={styles.qrRingWrap}>
          <ProgressRing
            size={220}
            strokeWidth={6}
            pct={(left / 30) * 100}
            trackColor={colors.muted}
            progressColor={colors.kou}
          />
          <View style={styles.qrBox}>
            <QrCode size={150} value={info?.payload} />
          </View>
        </View>
        <Text style={styles.qrTimer}>{left} saniye geçerli</Text>
        <View style={styles.qrMeta}>
          <Text style={styles.qrName}>{user?.name ?? "—"}</Text>
          <Text style={styles.meta}>
            No: {user?.studentNo ?? "—"} · {user?.rotation ?? ""}
          </Text>
          <Text style={styles.meta}>
            {info?.procedureName ?? "—"} · {info?.encounterId ?? "—"}
          </Text>
          <Text style={[styles.meta, { marginTop: 6 }]} selectable>
            Payload: {info?.payload ?? "—"}
          </Text>
        </View>
        <View style={styles.waitRow}>
          <View style={styles.pulseDot} />
          <Text style={styles.waitText}>Akademisyen Taraması Bekleniyor...</Text>
        </View>
      </View>
    </BottomSheet>
  );
}

function ShiftsScreen({ onSwap }: { onSwap: () => void }) {
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
      <View style={styles.clinicalHeader}>
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

function SwapSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
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

function OsceStudent() {
  const sessions = useOsceSessions();
  const list = sessions.data ?? [];
  const primary = list[0] ?? null;

  const daysLeft = (date: string) => {
    const diff = new Date(date + "T00:00:00").getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / 86400000));
  };

  return (
    <View>
      <View style={styles.clinicalHeader}>
        <Text style={styles.screenTitle}>OSCE Sınav Programı</Text>
        <Text style={styles.headerSub}>
          {primary
            ? `${primary.department ?? "Acil Tıp"} · ${primary.stationCount} istasyon`
            : "Objektif Yapılandırılmış Klinik Sınav"}
        </Text>
      </View>
      <View style={styles.listPad}>
        {sessions.loading && !sessions.data ? (
          <LoadingBlock label="OSCE yükleniyor…" />
        ) : null}
        {sessions.error && !sessions.data ? (
          <ErrorBlock message={sessions.error} onRetry={sessions.reload} />
        ) : null}
        {!sessions.loading && list.length === 0 ? (
          <EmptyBlock message="Planlanmış OSCE oturumu yok" />
        ) : null}

        {list.map((session) => {
          const doneCount = session.stations.filter((s) => s.status === "done").length;
          return (
            <View key={session.id} style={{ gap: 10 }}>
              <View style={styles.card}>
                <Text style={styles.infoKicker}>Sınav Oturumu</Text>
                <View style={[styles.rowBetween, { marginTop: 6 }]}>
                  <View style={styles.flex1}>
                    <Text style={styles.cardTitle}>{session.title}</Text>
                    <Text style={styles.meta}>
                      {session.date} · {session.time}
                    </Text>
                  </View>
                  <View style={styles.infoPill}>
                    <Timer size={14} color={colors.info} />
                    <Text style={styles.infoPillText}>
                      {daysLeft(session.date)} Gün
                    </Text>
                  </View>
                </View>
                <View style={styles.osceProgressMeta}>
                  <Text style={styles.meta}>
                    İlerleme: {doneCount}/{session.stationCount} istasyon
                  </Text>
                  <View style={[styles.barTrack, { height: 6, marginTop: 6 }]}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          height: 6,
                          width: `${session.stationCount ? (doneCount / session.stationCount) * 100 : 0}%`,
                          backgroundColor: colors.kou,
                        },
                      ]}
                    />
                  </View>
                </View>
              </View>
              {session.stations.map((st, idx) => (
                <View key={st.id} style={styles.card}>
                  <View style={styles.rowBetween}>
                    <View style={styles.osceStationIndex}>
                      <Text style={styles.osceStationIndexText}>{idx + 1}</Text>
                    </View>
                    <Text style={[styles.cardTitle, styles.flex1]} numberOfLines={2}>
                      {st.title}
                    </Text>
                    <View
                      style={[
                        styles.statusPill,
                        st.status === "done"
                          ? styles.statusApproved
                          : styles.statusPending,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          {
                            color:
                              st.status === "done" ? colors.success : colors.warning,
                          },
                        ]}
                      >
                        {st.status === "done" && st.score != null
                          ? `%${st.score}`
                          : "Bekliyor"}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.meta, { marginLeft: 40 }]}>{st.subtitle}</Text>
                </View>
              ))}
            </View>
          );
        })}

        {primary ? (
          <Pressable style={styles.primaryAction}>
            <Text style={styles.primaryActionText}>Deneme Sınavını Başlat</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

function Profile() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const procedures = useProcedures();
  const integrations: Array<[string, string, boolean]> = [
    ["HBYS Hasta Protokol Servisi", "Bağlı", true],
    ["KOÜ Öğrenci Bilgi Sistemi (OBS)", "Bağlı", true],
    ["Offline SQLCipher Yerel Kasa", "Aktif · 2 kayıt", true],
    ["e-Nabız Girişim Doğrulama", "Bağlı değil", false],
  ];
  const procs = procedures.data ?? [];

  const infoRows: Array<[string, string]> = [
    ["Ad Soyad", user?.name ?? "—"],
    ["E-posta", user?.email ?? "—"],
    ["Öğrenci No", user?.studentNo ?? "—"],
    ["Fakülte", user?.faculty ?? "—"],
    ["Anabilim Dalı", user?.department ?? "—"],
    ["Rotasyon", user?.rotation ?? "—"],
    ["Rol", "Öğrenci / İntörn"],
  ];

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  return (
    <View>
      <View style={[styles.clinicalHeader, { paddingBottom: 24 }]}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarLg}>
            <Text style={styles.avatarLgText}>{user?.initials ?? "—"}</Text>
          </View>
          <View style={styles.headerTextWrap}>
            <Text style={styles.profileName} numberOfLines={1}>
              {user?.name ?? "—"}
            </Text>
            <Text style={styles.headerSub}>
              Öğrenci No: {user?.studentNo ?? "—"}
            </Text>
            <Text style={styles.headerSub}>{user?.rotation ?? ""}</Text>
          </View>
        </View>
      </View>
      <View style={styles.listPad}>
        <View style={styles.card}>
          <Text style={[styles.cardTitle, { marginBottom: 4 }]}>
            Genel Bilgiler
          </Text>
          <Text style={[styles.cardSub, { marginBottom: 12 }]}>
            API’den gelen kayıt — yalnızca görüntüleme
          </Text>
          {infoRows.map(([label, value], i) => (
            <View
              key={label}
              style={[
                styles.infoRow,
                i < infoRows.length - 1 && styles.infoRowBorder,
              ]}
            >
              <Text style={styles.infoLabel}>{label}</Text>
              <Text style={styles.infoValue} numberOfLines={2}>
                {value}
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.card}>
          <Text style={[styles.cardTitle, { marginBottom: 12 }]}>
            U-ÇEP Girişim Karnesi
          </Text>
          {procedures.loading && !procedures.data ? (
            <LoadingBlock label="Prosedürler yükleniyor…" />
          ) : null}
          {procs.map((p) => (
            <View key={p.id} style={styles.profileProc}>
              <View style={styles.rowBetween}>
                <Text style={styles.profileProcName} numberOfLines={1}>
                  {p.name}
                </Text>
                <Text
                  style={[
                    styles.profileProcCount,
                    { color: p.done === p.total ? colors.success : colors.kou },
                  ]}
                >
                  {p.done}/{p.total}
                </Text>
              </View>
              <View style={[styles.barTrack, { height: 8, marginTop: 4 }]}>
                <View
                  style={[
                    styles.barFill,
                    {
                      height: 8,
                      width: `${(p.done / p.total) * 100}%`,
                      backgroundColor: p.done === p.total ? colors.success : colors.kou,
                    },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>
        <View style={styles.card}>
          <Text style={[styles.cardTitle, { marginBottom: 12 }]}>Entegrasyonlar</Text>
          {integrations.map(([label, state, ok], i) => (
            <View
              key={label}
              style={[
                styles.integrationRow,
                i < integrations.length - 1 && styles.integrationBorder,
              ]}
            >
              <View style={styles.integrationLeft}>
                <Wifi
                  size={16}
                  color={ok ? colors.success : colors.mutedForeground}
                />
                <Text style={styles.integrationLabel} numberOfLines={1}>
                  {label}
                </Text>
              </View>
              <Text
                style={[
                  styles.integrationState,
                  { color: ok ? colors.success : colors.mutedForeground },
                ]}
              >
                {state}
              </Text>
            </View>
          ))}
        </View>
        <Pressable
          onPress={handleLogout}
          style={({ pressed }) => [styles.logoutBtn, pressed && { opacity: 0.9 }]}
        >
          <LogOut size={18} color={colors.danger} />
          <Text style={styles.logoutBtnText}>Hesaptan Çıkış Yap</Text>
        </Pressable>
      </View>
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

function Segmented({
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

function Legend({ dotColor, text }: { dotColor: string; text: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: dotColor }]} />
      <Text style={styles.legendText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 96 },
  screenPad: { paddingBottom: 28 },
  clinicalHeader: {
    backgroundColor: colors.clinical,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  homeHeader: {
    paddingBottom: 28,
  },
  ringWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  infoRow: {
    paddingVertical: 10,
  },
  infoRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.mutedForeground,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  infoValue: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "600",
    color: colors.foreground,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.35)",
    backgroundColor: "rgba(239,68,68,0.06)",
    paddingVertical: 14,
  },
  logoutBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.danger,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  headerTextWrap: { flex: 1, minWidth: 0 },
  headerName: { fontSize: 14, fontWeight: "600", color: colors.white },
  headerSub: { fontSize: 11, color: colors.white60, marginTop: 2 },
  avatarSm: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: colors.kou,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarSmText: { fontSize: 14, fontWeight: "700", color: colors.kouForeground },
  avatarLg: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.kou,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLgText: { fontSize: 16, fontWeight: "700", color: colors.kouForeground },
  profileName: { fontSize: 16, fontWeight: "600", color: colors.white },
  bellBtn: {
    borderRadius: 999,
    backgroundColor: colors.white10,
    padding: 10,
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.danger,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { fontSize: 9, fontWeight: "700", color: colors.white },
  dashboardBody: { marginTop: 12, paddingHorizontal: 16, gap: 12 },
  card: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  warningCard: { borderLeftWidth: 4, borderLeftColor: colors.warning },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  ringCenter: { alignItems: "center", justifyContent: "center" },
  ringPct: { fontSize: 20, fontWeight: "700", color: colors.foreground },
  ringSub: { fontSize: 10, color: colors.mutedForeground, marginTop: 2 },
  progressInfo: { flex: 1, minWidth: 0 },
  kicker: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.mutedForeground,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  progressTitle: { fontSize: 14, fontWeight: "600", color: colors.foreground, marginTop: 2 },
  procList: { marginTop: 8, gap: 6 },
  procItem: { gap: 2 },
  procName: { fontSize: 10, color: colors.mutedForeground },
  barTrack: {
    height: 6,
    borderRadius: 999,
    backgroundColor: colors.muted,
    overflow: "hidden",
  },
  barFill: { height: 6, borderRadius: 999 },
  warningKicker: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.warning,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cardTitle: { fontSize: 14, fontWeight: "600", color: colors.foreground },
  cardSub: { fontSize: 12, color: colors.mutedForeground, marginTop: 2 },
  swapBtn: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 12,
    backgroundColor: colors.clinical05,
    paddingVertical: 10,
  },
  swapBtnText: { fontSize: 12, fontWeight: "600", color: colors.clinical },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  rowBetweenStart: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
  },
  flex1: { flex: 1, minWidth: 0 },
  infoKicker: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.info,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 999,
    backgroundColor: colors.info10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  infoPillText: { fontSize: 12, fontWeight: "700", color: colors.info },
  osceProgressMeta: { marginTop: 12 },
  osceStationIndex: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.kou10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  osceStationIndexText: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.kou,
  },
  screenTitle: { fontSize: 18, fontWeight: "600", color: colors.white },
  segmentWrap: {
    marginTop: 12,
    flexDirection: "row",
    gap: 4,
    borderRadius: 12,
    backgroundColor: colors.white10,
    padding: 4,
  },
  segmentBtn: { flex: 1, borderRadius: 8, paddingVertical: 8, alignItems: "center" },
  segmentBtnActive: { backgroundColor: colors.card },
  segmentBtnText: { fontSize: 12, fontWeight: "600", color: colors.white70 },
  segmentBtnTextActive: { color: colors.clinical },
  listPad: { padding: 16, gap: 10 },
  formPad: { padding: 16, gap: 16, paddingBottom: 24 },
  statusPill: { borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 },
  statusApproved: { backgroundColor: colors.success10 },
  statusPending: { backgroundColor: colors.warning10 },
  statusText: { fontSize: 10, fontWeight: "700" },
  meta: { fontSize: 11, color: colors.mutedForeground, marginTop: 4 },
  field: { gap: 6 },
  fieldLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.mutedForeground,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  searchWrap: { position: "relative" },
  searchIcon: { position: "absolute", left: 12, top: 12, zIndex: 1 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.card,
    paddingVertical: 10,
    paddingHorizontal: 12,
    paddingLeft: 36,
    fontSize: 14,
    color: colors.foreground,
  },
  inputPlain: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.card,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    color: colors.foreground,
  },
  suggestions: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: colors.card,
  },
  suggestionItem: { paddingHorizontal: 12, paddingVertical: 8 },
  suggestionText: { fontSize: 12, color: colors.foreground },
  rowGap: { flexDirection: "row", gap: 8, alignItems: "center" },
  barcodeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 12,
    backgroundColor: colors.clinical,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  barcodeText: { fontSize: 12, fontWeight: "600", color: colors.white },
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
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipActive: { borderColor: colors.kou, backgroundColor: colors.kou },
  chipText: { fontSize: 12, fontWeight: "600", color: colors.mutedForeground },
  chipTextActive: { color: colors.kouForeground },
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
  formActions: { gap: 8, paddingTop: 4 },
  secondaryAction: {
    borderRadius: 12,
    backgroundColor: colors.clinical05,
    paddingVertical: 12,
    alignItems: "center",
  },
  secondaryActionText: { fontSize: 14, fontWeight: "600", color: colors.clinical },
  primaryAction: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 12,
    backgroundColor: colors.kou,
    paddingVertical: 14,
  },
  primaryActionText: { fontSize: 14, fontWeight: "600", color: colors.kouForeground },
  sentBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 12,
    backgroundColor: colors.success,
    paddingVertical: 14,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 88,
    zIndex: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 16,
    backgroundColor: colors.kou,
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: colors.kou,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 6,
  },
  fabText: { fontSize: 14, fontWeight: "600", color: colors.kouForeground },
  tabBar: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.card,
    paddingTop: 6,
    paddingHorizontal: 6,
    gap: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    paddingVertical: 8,
    paddingHorizontal: 2,
    borderRadius: 12,
    minHeight: 52,
  },
  tabItemActive: {
    backgroundColor: colors.kou,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.mutedForeground,
    textAlign: "center",
  },
  tabLabelActive: { color: colors.kouForeground },
  qrSheet: { alignItems: "center", paddingBottom: 8 },
  qrRingWrap: {
    width: 220,
    height: 220,
    alignItems: "center",
    justifyContent: "center",
  },
  qrBox: {
    position: "absolute",
    borderRadius: 16,
    backgroundColor: colors.card,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  qrTimer: { marginTop: 8, fontSize: 12, fontWeight: "600", color: colors.kou },
  qrMeta: {
    marginTop: 12,
    width: "100%",
    borderRadius: 16,
    backgroundColor: "rgba(241,245,249,0.6)",
    padding: 12,
    alignItems: "center",
  },
  qrName: { fontSize: 14, fontWeight: "600", color: colors.foreground },
  waitRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.info,
  },
  waitText: { fontSize: 12, fontWeight: "500", color: colors.mutedForeground },
  weekRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  weekDayCell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  weekDay: {
    textAlign: "center",
    fontSize: 11,
    fontWeight: "600",
    color: colors.mutedForeground,
  },
  calendarGrid: {
    width: "100%",
    gap: 4,
  },
  calWeek: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
  },
  calCell: {
    flex: 1,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  calDayBubble: {
    width: "82%",
    aspectRatio: 1,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  calEmpty: {},
  calDay: {
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
    includeFontPadding: false,
  },
  legendRow: {
    marginTop: 14,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 14,
  },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 11, color: colors.mutedForeground },
  detailSheet: { gap: 12, paddingBottom: 8 },
  detailBox: {
    borderRadius: 16,
    backgroundColor: "rgba(241,245,249,0.6)",
    padding: 12,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.mutedForeground,
    marginBottom: 4,
  },
  detailValue: { fontSize: 14, color: colors.foreground, marginBottom: 4 },
  okBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    borderRadius: 12,
    backgroundColor: colors.success10,
    padding: 12,
  },
  okBannerText: {
    flex: 1,
    fontSize: 11,
    fontWeight: "600",
    color: colors.success,
  },
  profileProc: { marginBottom: 12 },
  profileProcName: { flex: 1, fontSize: 12, color: colors.foreground },
  profileProcCount: { fontSize: 11, fontWeight: "700" },
  integrationRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    gap: 8,
  },
  integrationBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  integrationLeft: { flex: 1, flexDirection: "row", alignItems: "center", gap: 8 },
  integrationLabel: { flex: 1, fontSize: 12, color: colors.foreground },
  integrationState: { fontSize: 10, fontWeight: "700" },
});
