import { useEffect, useState, type ReactNode } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Svg, { Circle } from "react-native-svg";
import {
  Bell,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Home,
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
import {
  COLLEAGUES,
  LOG_ENTRIES,
  PROCEDURES,
  SHIFTS,
  STUDENT,
  SUPERVISORS,
} from "@/lib/med-data";
import { colors } from "@/lib/theme";

type Tab = "home" | "logbook" | "shifts" | "osce" | "profile";

const doneTotal = 42;

export function StudentApp() {
  const [tab, setTab] = useState<Tab>("home");
  const [qrOpen, setQrOpen] = useState(false);
  const [swapOpen, setSwapOpen] = useState(false);

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {tab === "home" && (
          <Dashboard onSwap={() => setSwapOpen(true)} onLog={() => setTab("logbook")} />
        )}
        {tab === "logbook" && <Logbook onQr={() => setQrOpen(true)} />}
        {tab === "shifts" && <ShiftsScreen onSwap={() => setSwapOpen(true)} />}
        {tab === "osce" && <OsceStudent />}
        {tab === "profile" && <Profile />}
      </ScrollView>

      {tab === "home" && (
        <Pressable
          onPress={() => setTab("logbook")}
          style={({ pressed }) => [styles.fab, pressed && { transform: [{ scale: 0.95 }] }]}
        >
          <Plus size={20} color={colors.kouForeground} />
          <Text style={styles.fabText}>Log Ekle</Text>
        </Pressable>
      )}

      <View style={styles.tabBar}>
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
              style={styles.tabItem}
            >
              <Icon
                size={20}
                color={active ? colors.kou : colors.mutedForeground}
                strokeWidth={active ? 2.5 : 2}
              />
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <QrSheet open={qrOpen} onClose={() => setQrOpen(false)} />
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
  const pct = 70;

  return (
    <View style={styles.screenPad}>
      <View style={styles.clinicalHeader}>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <View style={styles.avatarSm}>
              <Text style={styles.avatarSmText}>{STUDENT.initials}</Text>
            </View>
            <View style={styles.headerTextWrap}>
              <Text style={styles.headerName} numberOfLines={1}>
                {STUDENT.name}
              </Text>
              <Text style={styles.headerSub} numberOfLines={1}>
                Dönem 6 - Acil Tıp Stajı
              </Text>
            </View>
          </View>
          <Pressable style={styles.bellBtn}>
            <Bell size={20} color={colors.white} />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </Pressable>
        </View>
      </View>

      <View style={styles.dashboardBody}>
        <View style={styles.card}>
          <View style={styles.progressRow}>
            <ProgressRing
              size={112}
              strokeWidth={10}
              pct={pct}
              trackColor={colors.muted}
              progressColor={colors.kou}
            >
              <View style={styles.ringCenter}>
                <Text style={styles.ringPct}>%{pct}</Text>
                <Text style={styles.ringSub}>{doneTotal}/60</Text>
              </View>
            </ProgressRing>
            <View style={styles.progressInfo}>
              <Text style={styles.kicker}>U-ÇEP İlerlemesi</Text>
              <Text style={styles.progressTitle}>42/60 girişim tamamlandı</Text>
              <View style={styles.procList}>
                {PROCEDURES.slice(0, 3).map((p) => (
                  <View key={p.name} style={styles.procItem}>
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

        <View style={[styles.card, styles.warningCard]}>
          <Text style={styles.warningKicker}>Yaklaşan Nöbet</Text>
          <Text style={styles.cardTitle}>Bu Akşam 16:00 - 08:00</Text>
          <Text style={styles.cardSub}>Acil Servis · Kırmızı Alan</Text>
          <Pressable onPress={onSwap} style={styles.swapBtn}>
            <Repeat2 size={16} color={colors.clinical} />
            <Text style={styles.swapBtnText}>Takas İstet</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <View style={styles.flex1}>
              <Text style={styles.infoKicker}>Komite Sınavı</Text>
              <Text style={styles.cardTitle} numberOfLines={1}>
                Acil Tıp OSCE Sınavı
              </Text>
              <Text style={styles.cardSub}>28 Ağustos 2026 · 09:00</Text>
            </View>
            <View style={styles.infoPill}>
              <Text style={styles.infoPillText}>23 Gün Kaldı</Text>
            </View>
          </View>
        </View>

        <Pressable onPress={onLog} style={styles.card}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.cardTitle}>Son Karne Kayıtları</Text>
              <Text style={styles.cardSub}>1 kayıt onay bekliyor</Text>
            </View>
            <ChevronRight size={16} color={colors.mutedForeground} />
          </View>
        </Pressable>
      </View>
    </View>
  );
}

function Logbook({ onQr }: { onQr: () => void }) {
  const [tab, setTab] = useState<"list" | "new">("list");
  const [proc, setProc] = useState("");
  const [age, setAge] = useState("Yetişkin");
  const [sex, setSex] = useState("Kadın");
  const [role, setRole] = useState("Bizzat Yaptım");
  const [supervisor, setSupervisor] = useState(SUPERVISORS[0]);
  const suggestions = PROCEDURES.filter(
    (p) => proc.length > 1 && p.name.toLowerCase().includes(proc.toLowerCase()),
  );

  return (
    <View>
      <View style={styles.clinicalHeader}>
        <Text style={styles.screenTitle}>Dijital Klinik Karne</Text>
        <Text style={styles.headerSub}>{STUDENT.faculty}</Text>
        <View style={styles.segmentWrap}>
          {(
            [
              ["list", "Kayıtlarım"],
              ["new", "Yeni Kayıt"],
            ] as Array<["list" | "new", string]>
          ).map(([k, l]) => (
            <Pressable
              key={k}
              onPress={() => setTab(k)}
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
          {LOG_ENTRIES.map((e) => (
            <View key={e.id} style={styles.card}>
              <View style={styles.rowBetweenStart}>
                <Text style={[styles.cardTitle, styles.flex1]}>{e.proc}</Text>
                <View
                  style={[
                    styles.statusPill,
                    e.status === "onaylandi"
                      ? styles.statusApproved
                      : styles.statusPending,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color:
                          e.status === "onaylandi" ? colors.success : colors.warning,
                      },
                    ]}
                  >
                    {e.status === "onaylandi" ? "ONAYLANDI" : "BEKLİYOR"}
                  </Text>
                </View>
              </View>
              <Text style={styles.meta}>
                {e.date} · {e.role}
              </Text>
              <Text style={styles.meta}>
                Protokol: {e.id} · {e.supervisor}
              </Text>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.formPad}>
          <Field label="Girişim / Prosedür">
            <View style={styles.searchWrap}>
              <View style={styles.searchIcon}>
                <Search size={16} color={colors.mutedForeground} />
              </View>
              <TextInput
                value={proc}
                onChangeText={setProc}
                placeholder="Damar Yolu Açma / İntravenöz Kanül"
                placeholderTextColor={colors.mutedForeground}
                style={styles.input}
              />
            </View>
            {suggestions.length > 0 && (
              <View style={styles.suggestions}>
                {suggestions.map((s) => (
                  <Pressable
                    key={s.name}
                    onPress={() => setProc(s.name)}
                    style={styles.suggestionItem}
                  >
                    <Text style={styles.suggestionText}>{s.name}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </Field>

          <Field label="Encounter ID (HBYS Protokol No)">
            <View style={styles.rowGap}>
              <TextInput
                defaultValue="ENC-2026-"
                style={[styles.inputPlain, styles.flex1]}
              />
              <Pressable style={styles.barcodeBtn}>
                <ScanBarcode size={16} color={colors.white} />
                <Text style={styles.barcodeText}>Barkod</Text>
              </Pressable>
            </View>
          </Field>

          <Field label="Hasta Demografisi">
            <Segmented
              options={["Pediatrik", "Yetişkin", "Geriatrik"]}
              value={age}
              onChange={setAge}
            />
            <View style={{ marginTop: 8 }}>
              <Segmented options={["Kadın", "Erkek"]} value={sex} onChange={setSex} />
            </View>
          </Field>

          <Field label="Öğrenci Rolü">
            <View style={styles.chipRow}>
              {["Gözlemledim", "Yardım Ettim", "Bizzat Yaptım"].map((r) => (
                <Pressable
                  key={r}
                  onPress={() => setRole(r)}
                  style={[styles.chip, role === r && styles.chipActive]}
                >
                  <Text
                    style={[styles.chipText, role === r && styles.chipTextActive]}
                  >
                    {r}
                  </Text>
                </Pressable>
              ))}
            </View>
          </Field>

          <Field label="Onaylayacak Öğretim Üyesi">
            <SelectField
              value={supervisor}
              options={SUPERVISORS}
              onChange={setSupervisor}
            />
          </Field>

          <View style={styles.formActions}>
            <Pressable style={styles.secondaryAction}>
              <Text style={styles.secondaryActionText}>Push ile Gönder</Text>
            </Pressable>
            <Pressable onPress={onQr} style={styles.primaryAction}>
              <QrIcon size={16} color={colors.kouForeground} />
              <Text style={styles.primaryActionText}>Yüz Yüze QR Kod Oluştur</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

function QrSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [left, setLeft] = useState(30);
  useEffect(() => {
    if (!open) return;
    setLeft(30);
    const t = setInterval(() => setLeft((v) => (v <= 0 ? 30 : v - 1)), 1000);
    return () => clearInterval(t);
  }, [open]);

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
            <QrCode size={150} />
          </View>
        </View>
        <Text style={styles.qrTimer}>{left} saniye geçerli</Text>
        <View style={styles.qrMeta}>
          <Text style={styles.qrName}>{STUDENT.name}</Text>
          <Text style={styles.meta}>
            No: {STUDENT.no} · {STUDENT.rotation}
          </Text>
          <Text style={styles.meta}>
            Damar Yolu Açma · Protokol ENC-2026-881
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
  const [detail, setDetail] = useState<(typeof SHIFTS)[number] | null>(null);

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

  return (
    <View>
      <View style={styles.clinicalHeader}>
        <Text style={styles.screenTitle}>Nöbet Takvimi</Text>
        <Text style={styles.headerSub}>Ağustos 2026 · Acil Tıp AD</Text>
      </View>

      <View style={styles.listPad}>
        <View style={styles.card}>
          <View style={styles.weekRow}>
            {["Pt", "Sa", "Ça", "Pe", "Cu", "Ct", "Pz"].map((d) => (
              <Text key={d} style={styles.weekDay}>
                {d}
              </Text>
            ))}
          </View>
          <View style={styles.calendarGrid}>
            {Array.from({ length: 35 }, (_, i) => {
              const day = i - 4;
              const shift = SHIFTS.find((s) => s.day === day);
              const st = shift ? shiftStyle(shift.state) : null;
              return (
                <Pressable
                  key={i}
                  disabled={!shift}
                  onPress={() => shift && setDetail(shift)}
                  style={[
                    styles.calCell,
                    day < 1 || day > 31 ? styles.calEmpty : null,
                    st ? { backgroundColor: st.bg } : null,
                  ]}
                >
                  <Text
                    style={[
                      styles.calDay,
                      st ? { color: st.text } : { color: colors.mutedForeground },
                      day < 1 || day > 31 ? { opacity: 0 } : null,
                    ]}
                  >
                    {day > 0 && day <= 31 ? day : "·"}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <View style={styles.legendRow}>
            <Legend dotColor={colors.success} text="Tamamlandı" />
            <Legend dotColor={colors.warning} text="Yaklaşan" />
            <Legend dotColor={colors.info} text="Gece Nöbeti" />
          </View>
        </View>

        {SHIFTS.map((s) => {
          const st = shiftStyle(s.state);
          return (
            <Pressable key={s.label} onPress={() => setDetail(s)} style={styles.card}>
              <View style={styles.rowBetween}>
                <View style={styles.flex1}>
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {s.label}
                  </Text>
                  <Text style={styles.meta}>
                    {s.time} · {s.area}
                  </Text>
                </View>
                <View style={[styles.statusPill, { backgroundColor: st.bg }]}>
                  <Text style={[styles.statusText, { color: st.text }]}>
                    {shiftLabel(s.state)}
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        })}

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
          </View>
        )}
      </BottomSheet>
    </View>
  );
}

function SwapSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [sent, setSent] = useState(false);
  const upcoming = SHIFTS.filter((s) => s.state !== "completed");
  const [myShift, setMyShift] = useState(
    `${upcoming[0]?.label ?? ""} · ${upcoming[0]?.area ?? ""}`,
  );
  const [colleague, setColleague] = useState(COLLEAGUES[0]);
  const friendShifts = [
    "09 Ağustos 2026 · 00:00 - 08:00 · Travma",
    "14 Ağustos 2026 · 16:00 - 08:00 · Sarı Alan",
  ];
  const [friendShift, setFriendShift] = useState(friendShifts[0]);

  const handleClose = () => {
    setSent(false);
    onClose();
  };

  return (
    <BottomSheet open={open} onClose={handleClose} title="Nöbet Takas Talebi">
      <View style={styles.detailSheet}>
        <Field label="Takas edilecek nöbetim">
          <SelectField
            value={myShift}
            options={upcoming.map((s) => `${s.label} · ${s.area}`)}
            onChange={setMyShift}
          />
        </Field>
        <Field label="Takas yapılacak arkadaş">
          <SelectField value={colleague} options={COLLEAGUES} onChange={setColleague} />
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
        {sent ? (
          <View style={styles.sentBtn}>
            <CheckCircle2 size={16} color={colors.kouForeground} />
            <Text style={styles.primaryActionText}>Teklif Gönderildi</Text>
          </View>
        ) : (
          <Pressable onPress={() => setSent(true)} style={styles.primaryAction}>
            <Text style={styles.primaryActionText}>Takas Teklifi Gönder</Text>
          </Pressable>
        )}
      </View>
    </BottomSheet>
  );
}

function OsceStudent() {
  const stations: Array<[string, string, "success" | "warning"]> = [
    ["İstasyon 1: Temel Yaşam Desteği", "Pratik tamamlandı", "success"],
    ["İstasyon 2: EKG Yorumlama", "Pratik tamamlandı", "success"],
    ["İstasyon 3: Solunum Sistemi Muayenesi", "Deneme bekliyor", "warning"],
    ["İstasyon 4: Sutür ve Yara Bakımı", "Deneme bekliyor", "warning"],
  ];

  return (
    <View>
      <View style={styles.clinicalHeader}>
        <Text style={styles.screenTitle}>Mobil Pratik Sınav (OSCE)</Text>
        <Text style={styles.headerSub}>Acil Tıp · 6 istasyon</Text>
      </View>
      <View style={styles.listPad}>
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.cardTitle}>Acil Tıp OSCE Sınavı</Text>
              <Text style={styles.meta}>28 Ağustos 2026 · 09:00</Text>
            </View>
            <View style={styles.infoPill}>
              <Timer size={14} color={colors.info} />
              <Text style={styles.infoPillText}>23 Gün</Text>
            </View>
          </View>
        </View>
        {stations.map(([title, sub, tone]) => (
          <View key={title} style={styles.card}>
            <View style={styles.rowBetween}>
              <Text style={[styles.cardTitle, styles.flex1]} numberOfLines={1}>
                {title}
              </Text>
              <View
                style={[
                  styles.statusPill,
                  tone === "success" ? styles.statusApproved : styles.statusPending,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    { color: tone === "success" ? colors.success : colors.warning },
                  ]}
                >
                  {tone === "success" ? "%92" : "—"}
                </Text>
              </View>
            </View>
            <Text style={styles.meta}>{sub}</Text>
          </View>
        ))}
        <Pressable style={styles.primaryAction}>
          <Text style={styles.primaryActionText}>Deneme Sınavını Başlat</Text>
        </Pressable>
      </View>
    </View>
  );
}

function Profile() {
  const integrations: Array<[string, string, boolean]> = [
    ["HBYS Hasta Protokol Servisi", "Bağlı", true],
    ["KOÜ Öğrenci Bilgi Sistemi (OBS)", "Bağlı", true],
    ["Offline SQLCipher Yerel Kasa", "Aktif · 2 kayıt", true],
    ["e-Nabız Girişim Doğrulama", "Bağlı değil", false],
  ];

  return (
    <View>
      <View style={[styles.clinicalHeader, { paddingBottom: 24 }]}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarLg}>
            <Text style={styles.avatarLgText}>{STUDENT.initials}</Text>
          </View>
          <View style={styles.headerTextWrap}>
            <Text style={styles.profileName} numberOfLines={1}>
              {STUDENT.name}
            </Text>
            <Text style={styles.headerSub}>Öğrenci No: {STUDENT.no}</Text>
            <Text style={styles.headerSub}>{STUDENT.rotation}</Text>
          </View>
        </View>
      </View>
      <View style={styles.listPad}>
        <View style={styles.card}>
          <Text style={[styles.cardTitle, { marginBottom: 12 }]}>
            U-ÇEP Girişim Karnesi
          </Text>
          {PROCEDURES.map((p) => (
            <View key={p.name} style={styles.profileProc}>
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
  dashboardBody: { marginTop: -20, paddingHorizontal: 16, gap: 12 },
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
  progressRow: { flexDirection: "row", alignItems: "center", gap: 16 },
  ringCenter: { alignItems: "center" },
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
    paddingTop: 8,
    paddingBottom: 4,
  },
  tabItem: { flex: 1, alignItems: "center", gap: 4, paddingBottom: 8 },
  tabLabel: { fontSize: 10, fontWeight: "500", color: colors.mutedForeground },
  tabLabelActive: { color: colors.kou },
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
  weekRow: { flexDirection: "row" },
  weekDay: {
    flex: 1,
    textAlign: "center",
    fontSize: 10,
    color: colors.mutedForeground,
  },
  calendarGrid: {
    marginTop: 4,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  calCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  calEmpty: {},
  calDay: { fontSize: 11, fontWeight: "600" },
  legendRow: {
    marginTop: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 10, color: colors.mutedForeground },
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
