/**
 * KlinikApp — Dönem 4 ve 5 öğrencileri için ekran
 *
 * Tab'lar: Ana Sayfa | Takvim | Logbook | Profil
 * Sabah = Teorik (yeşil), Öğleden sonra = Pratik (mavi) split view
 */
import { useState, useMemo } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Linking,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Bell,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  ClipboardList,
  Home,
  LogOut,
  Mail,
  MapPin,
  Stethoscope,
  User,
  Users,
  Clock,
} from "lucide-react-native";
import { EmptyBlock, ErrorBlock, LoadingBlock } from "./StateViews";
import { useAuth } from "@/lib/api/AuthContext";
import {
  useAnnouncements,
  useAuthedFetch,
} from "@/lib/api/hooks";
import { colors } from "@/lib/theme";
import type { ClinicalScheduleDay } from "@/lib/api/types";
import {
  fetchInternship,
  fetchClinicalSchedule,
} from "@/lib/api/index";

// ─── Renk Sabitleri ──────────────────────────────────────
const MORNING_COLOR  = "#008542"; // teorik → yeşil
const AFTERNOON_COLOR = "#3B82F6"; // pratik → mavi
const MORNING_BG    = "#00854210";
const AFTERNOON_BG  = "#3B82F610";

type Tab = "home" | "schedule" | "logbook" | "profile";

// ─── YARDIMCI: haftanın günü (Pzt=0…Cum=4) ──────────────
function getWeekDayIndex(dateStr: string): number {
  const d = new Date(dateStr);
  const day = d.getDay(); // 0=Sun
  return day === 0 ? 6 : day - 1; // Pzt=0
}

// ─── Ana bileşen ─────────────────────────────────────────
export function KlinikApp() {
  const [tab, setTab] = useState<Tab>("home");
  const insets = useSafeAreaInsets();

  return (
    <View style={s.root}>
      <ScrollView
        style={s.scroll}
        contentContainerStyle={[s.scrollContent, { paddingBottom: 88 + Math.max(insets.bottom, 8) }]}
        showsVerticalScrollIndicator={false}
      >
        {tab === "home"     && <HomeTab />}
        {tab === "schedule" && <ScheduleTab />}
        {tab === "logbook"  && <LogbookTab />}
        {tab === "profile"  && <ProfileTab />}
      </ScrollView>

      {/* Tab Bar */}
      <View style={[s.tabBar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
        {(
          [
            ["home",     "Ana Sayfa",  Home],
            ["schedule", "Takvim",     Calendar],
            ["logbook",  "Logbook",    ClipboardList],
            ["profile",  "Profil",     User],
          ] as Array<[Tab, string, typeof Home]>
        ).map(([key, label, Icon]) => {
          const active = tab === key;
          return (
            <Pressable
              key={key}
              onPress={() => setTab(key)}
              style={[s.tabItem, active && s.tabItemActive]}
            >
              <Icon
                size={20}
                color={active ? colors.kouForeground : colors.mutedForeground}
                strokeWidth={active ? 2.5 : 2}
              />
              <Text style={[s.tabLabel, active && s.tabLabelActive]} numberOfLines={1}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

// ════════════════════════════════════════════════════════
// TAB 1 — ANA SAYFA
// ════════════════════════════════════════════════════════
function HomeTab() {
  const { user } = useAuth();
  const internship = useAuthedFetch(fetchInternship);
  const schedule   = useAuthedFetch(fetchClinicalSchedule);
  const announcements = useAnnouncements();
  const insets = useSafeAreaInsets();

  // Bugünkü program
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayEntry = useMemo(
    () => (schedule.data ?? []).find((d: ClinicalScheduleDay) => d.date === todayStr) ??
          (schedule.data ?? [])[0] ?? null,
    [schedule.data, todayStr],
  );

  const unreadCount = (announcements.data ?? []).filter((a: any) => !a.isRead).length;

  // Staj süresi hesapla
  const stajBilgi = internship.data;
  const startDate = stajBilgi ? new Date(stajBilgi.startDate) : null;
  const endDate   = stajBilgi ? new Date(stajBilgi.endDate)   : null;
  const totalDays = startDate && endDate
    ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  const passedDays = startDate
    ? Math.min(Math.ceil((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24)), totalDays)
    : 0;
  const progressPct = totalDays > 0 ? Math.round((passedDays / totalDays) * 100) : 0;

  return (
    <View>
      {/* Header */}
      <View style={[s.header, { paddingTop: insets.top + 12 }]}>
        <View style={s.headerRow}>
          <View>
            <Text style={s.greeting}>Merhaba, {user?.name?.split(" ")[0]} 👋</Text>
            <Text style={s.headerSub}>{user?.rotation ?? "Klinik staj"}</Text>
          </View>
          <View style={s.bellBtn}>
            <Bell size={20} color={colors.white} />
            {unreadCount > 0 && (
              <View style={s.badgeDot}>
                <Text style={s.badgeDotText}>{unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <View style={s.body}>
        {/* Staj Blok Kartı */}
        {internship.loading && <LoadingBlock label="Staj bilgisi yükleniyor…" />}
        {stajBilgi && (
          <View style={s.card}>
            <View style={s.cardHeader}>
              <View style={[s.softIcon, { backgroundColor: "#3B82F610" }]}>
                <Stethoscope size={16} color={AFTERNOON_COLOR} />
              </View>
              <Text style={s.cardTitle}>{stajBilgi.name}</Text>
              <View style={s.pillBlue}>
                <Text style={s.pillBlueText}>{stajBilgi.week}. Hafta</Text>
              </View>
            </View>

            <Text style={s.rotationText}>{stajBilgi.rotation}</Text>

            <View style={s.progressTrack}>
              <View style={[s.progressFillBlue, { width: `${progressPct}%` as any }]} />
            </View>
            <View style={s.progressMeta}>
              <Text style={s.progressMetaText}>
                {stajBilgi.startDate ? new Date(stajBilgi.startDate).toLocaleDateString("tr-TR", { day: "numeric", month: "short" }) : "—"}
              </Text>
              <Text style={[s.progressMetaText, { fontWeight: "700" }]}>{progressPct}%</Text>
              <Text style={s.progressMetaText}>
                {stajBilgi.endDate ? new Date(stajBilgi.endDate).toLocaleDateString("tr-TR", { day: "numeric", month: "short" }) : "—"}
              </Text>
            </View>
          </View>
        )}

        {/* Bugünkü Program Split View */}
        <View style={s.card}>
          <View style={s.cardHeader}>
            <View style={s.softIcon}><Calendar size={16} color={colors.primary} /></View>
            <Text style={s.cardTitle}>Bugünkü Program</Text>
            {todayEntry && (
              <Text style={s.dayBadge}>
                {new Date(todayEntry.date).toLocaleDateString("tr-TR", { weekday: "long" })}
              </Text>
            )}
          </View>

          {schedule.loading && <LoadingBlock label="Yükleniyor…" />}
          {!schedule.loading && !todayEntry && <EmptyBlock message="Bugün program yok" />}

          {todayEntry && (
            <View style={s.splitRow}>
              {/* Sabah — Teorik */}
              <View style={[s.splitCard, s.splitMorning]}>
                <View style={s.splitHeader}>
                  <View style={[s.splitDot, { backgroundColor: MORNING_COLOR }]} />
                  <Text style={[s.splitType, { color: MORNING_COLOR }]}>Teorik</Text>
                  <Clock size={12} color={MORNING_COLOR} />
                  <Text style={[s.splitTime, { color: MORNING_COLOR }]}>{todayEntry.morning.time}</Text>
                </View>
                <Text style={s.splitSubject} numberOfLines={3}>{todayEntry.morning.subject}</Text>
                <View style={s.splitLocationRow}>
                  <MapPin size={11} color={colors.mutedForeground} />
                  <Text style={s.splitLocation} numberOfLines={1}>{todayEntry.morning.location}</Text>
                </View>
                <Text style={s.splitEnd}>{todayEntry.morning.time} – {todayEntry.morning.endTime}</Text>
              </View>

              {/* Öğleden sonra — Pratik */}
              <View style={[s.splitCard, s.splitAfternoon]}>
                <View style={s.splitHeader}>
                  <View style={[s.splitDot, { backgroundColor: AFTERNOON_COLOR }]} />
                  <Text style={[s.splitType, { color: AFTERNOON_COLOR }]}>Pratik</Text>
                  <Clock size={12} color={AFTERNOON_COLOR} />
                  <Text style={[s.splitTime, { color: AFTERNOON_COLOR }]}>{todayEntry.afternoon.time}</Text>
                </View>
                <Text style={s.splitSubject} numberOfLines={3}>{todayEntry.afternoon.subject}</Text>
                <View style={s.splitLocationRow}>
                  <MapPin size={11} color={colors.mutedForeground} />
                  <Text style={s.splitLocation} numberOfLines={1}>{todayEntry.afternoon.location}</Text>
                </View>
                <Text style={s.splitEnd}>{todayEntry.afternoon.time} – {todayEntry.afternoon.endTime}</Text>
                {todayEntry.afternoon.attendanceRequired && (
                  <View style={[s.attendancePill, { backgroundColor: todayEntry.afternoon.attendanceVerified ? "#00854218" : "#EF444420" }]}>
                    <Text style={[s.attendancePillText, { color: todayEntry.afternoon.attendanceVerified ? MORNING_COLOR : "#EF4444" }]}>
                      {todayEntry.afternoon.attendanceVerified ? "✓ Yoklama Alındı" : "Yoklama Zorunlu"}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}
        </View>

        {/* Duyurular */}
        <View style={s.card}>
          <View style={s.cardHeader}>
            <View style={s.softIcon}><Bell size={16} color={colors.primary} /></View>
            <Text style={s.cardTitle}>Duyurular</Text>
            {unreadCount > 0 && (
              <View style={s.pillAmber}>
                <Text style={s.pillAmberText}>{unreadCount} Yeni</Text>
              </View>
            )}
          </View>
          {announcements.loading && <LoadingBlock label="Yükleniyor…" />}
          {!announcements.loading && (announcements.data ?? []).slice(0, 3).map((ann: any, i: number) => (
            <View key={ann.id} style={[s.annRow, i > 0 && s.annBorder]}>
              <View style={[s.annTypeDot, {
                backgroundColor:
                  ann.actionType === "cancelled"    ? "#EF4444" :
                  ann.actionType === "time_changed" ? colors.warning :
                  ann.actionType === "room_changed" ? AFTERNOON_COLOR :
                  colors.primary,
              }]} />
              <View style={{ flex: 1 }}>
                <Text style={s.annTitle} numberOfLines={2}>{ann.title}</Text>
                <Text style={s.annMeta}>
                  {new Date(ann.sentAt).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}
                </Text>
              </View>
            </View>
          ))}
          {!announcements.loading && (announcements.data ?? []).length === 0 && (
            <Text style={s.emptyText}>Duyuru yok</Text>
          )}
        </View>
      </View>
    </View>
  );
}

// ════════════════════════════════════════════════════════
// TAB 2 — TAKVİM
// ════════════════════════════════════════════════════════
function ScheduleTab() {
  const schedule = useAuthedFetch(fetchClinicalSchedule);
  const todayStr = new Date().toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const insets = useSafeAreaInsets();

  const days: ClinicalScheduleDay[] = schedule.data ?? [];

  // Seçili günün verisi
  const selected = useMemo(
    () => days.find((d) => d.date === selectedDate) ?? days[0] ?? null,
    [days, selectedDate],
  );

  const WEEKDAY_SHORT = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

  return (
    <View>
      <View style={[s.pageHeader, { paddingTop: insets.top + 16 }]}>
        <Text style={s.pageTitle}>Staj Takvimi</Text>
        <Text style={s.pageSubtitle}>Teorik ve pratik program</Text>
      </View>

      <View style={s.body}>
        {/* Renk Lejantı */}
        <View style={s.legendRow}>
          <View style={s.legendItem}>
            <View style={[s.legendDot, { backgroundColor: MORNING_COLOR }]} />
            <Text style={s.legendText}>Teorik (Amfi)</Text>
          </View>
          <View style={s.legendItem}>
            <View style={[s.legendDot, { backgroundColor: AFTERNOON_COLOR }]} />
            <Text style={s.legendText}>Pratik (Servis/Poliklinik)</Text>
          </View>
        </View>

        {/* Gün Seçici */}
        {schedule.loading && <LoadingBlock label="Takvim yükleniyor…" />}
        {schedule.error && <ErrorBlock message={schedule.error} onRetry={schedule.reload} />}

        {!schedule.loading && days.length === 0 && <EmptyBlock message="Takvim verisi yok" />}

        {!schedule.loading && days.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
            <View style={s.daySelectorH}>
              {days.map((d) => {
                const date = new Date(d.date);
                const isActive = d.date === (selected?.date ?? "");
                const isToday  = d.date === todayStr;
                return (
                  <Pressable
                    key={d.id}
                    onPress={() => setSelectedDate(d.date)}
                    style={[s.dayCard, isActive && s.dayCardActive]}
                  >
                    <Text style={[s.dayCardWeekday, isActive && s.dayCardTextActive]}>
                      {WEEKDAY_SHORT[date.getDay() === 0 ? 6 : date.getDay() - 1]}
                    </Text>
                    <Text style={[s.dayCardDate, isActive && s.dayCardTextActive]}>
                      {date.getDate()}
                    </Text>
                    {isToday && <View style={s.todayDot} />}
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        )}

        {/* Seçili Günün Detayı */}
        {selected && (
          <>
            <ClinicalSessionCard
              label="Sabah — Teorik"
              color={MORNING_COLOR}
              bg={MORNING_BG}
              session={selected.morning}
              icon={<BookOpen size={16} color={MORNING_COLOR} />}
            />
            <ClinicalSessionCard
              label="Öğleden Sonra — Pratik"
              color={AFTERNOON_COLOR}
              bg={AFTERNOON_BG}
              session={selected.afternoon}
              icon={<Stethoscope size={16} color={AFTERNOON_COLOR} />}
            />
          </>
        )}
      </View>
    </View>
  );
}

// ─── Klinik Seans Kartı ────────────────────────────────
function ClinicalSessionCard({
  label, color, bg, session, icon,
}: {
  label: string;
  color: string;
  bg: string;
  session: any;
  icon: React.ReactNode;
}) {
  return (
    <View style={[s.sessionCard, { borderLeftColor: color }]}>
      <View style={[s.sessionHeader, { backgroundColor: bg }]}>
        {icon}
        <Text style={[s.sessionLabel, { color }]}>{label}</Text>
        <View style={s.sessionTimeChip}>
          <Text style={[s.sessionTimeText, { color }]}>{session.time} – {session.endTime}</Text>
        </View>
      </View>

      <View style={s.sessionBody}>
        <Text style={s.sessionSubject}>{session.subject}</Text>

        <View style={s.sessionMetaRow}>
          <MapPin size={12} color={colors.mutedForeground} />
          <Text style={s.sessionMeta} numberOfLines={1}>{session.location}</Text>
        </View>

        {session.attendanceRequired && (
          <View style={[s.attendanceBadge, { backgroundColor: session.attendanceVerified ? "#00854218" : "#EF444420" }]}>
            {session.attendanceVerified
              ? <CheckCircle2 size={13} color={MORNING_COLOR} />
              : <CircleDot size={13} color="#EF4444" />}
            <Text style={[s.attendanceBadgeText, { color: session.attendanceVerified ? MORNING_COLOR : "#EF4444" }]}>
              {session.attendanceVerified ? "Yoklama alındı" : "Yoklama zorunlu"}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

// ════════════════════════════════════════════════════════
// TAB 3 — LOGBOOK (basit placeholder, genişletilecek)
// ════════════════════════════════════════════════════════
function LogbookTab() {
  const insets = useSafeAreaInsets();
  return (
    <View>
      <View style={[s.pageHeader, { paddingTop: insets.top + 16 }]}>
        <Text style={s.pageTitle}>Logbook</Text>
        <Text style={s.pageSubtitle}>Staj kayıtlarım</Text>
      </View>
      <View style={s.body}>
        <View style={[s.card, { alignItems: "center", paddingVertical: 40 }]}>
          <ClipboardList size={40} color={colors.mutedForeground} />
          <Text style={[s.emptyText, { marginTop: 12 }]}>Logbook sistemi yakında aktif olacak</Text>
          <Text style={[s.emptyText, { marginTop: 4, fontSize: 11 }]}>Staj kayıtları ve hoca onayı burada görünecek</Text>
        </View>
      </View>
    </View>
  );
}

// ════════════════════════════════════════════════════════
// TAB 4 — PROFİL
// ════════════════════════════════════════════════════════
function ProfileTab() {
  const { user, logout } = useAuth();
  const internship = useAuthedFetch(fetchInternship);
  const insets = useSafeAreaInsets();

  return (
    <View>
      <View style={[s.pageHeader, { paddingTop: insets.top + 16 }]}>
        <Text style={s.pageTitle}>Profil</Text>
      </View>

      <View style={s.body}>
        {/* Öğrenci Kartı */}
        <View style={s.card}>
          <View style={s.profileAvatarRow}>
            <View style={s.avatarLg}>
              <Text style={s.avatarLgText}>{user?.initials ?? "??"}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.profileName} numberOfLines={1}>{user?.name}</Text>
              <Text style={s.profileMeta} numberOfLines={1}>{user?.studentNo}</Text>
              <View style={[s.pillBlue, { marginTop: 4 }]}>
                <Text style={s.pillBlueText}>{user?.rotation ?? "Klinik Staj"}</Text>
              </View>
            </View>
          </View>

          <View style={s.profileInfoList}>
            <InfoRow label="Fakülte"   value="Kocaeli Üniversitesi Tıp Fakültesi" />
            <InfoRow label="Bölüm"     value={user?.department ?? "—"} />
          </View>
        </View>

        {/* Staj Bilgisi */}
        {internship.data && (
          <View style={s.card}>
            <View style={s.cardHeader}>
              <View style={[s.softIcon, { backgroundColor: "#3B82F610" }]}>
                <Stethoscope size={16} color={AFTERNOON_COLOR} />
              </View>
              <Text style={s.cardTitle}>Aktif Staj</Text>
            </View>
            <View style={s.profileInfoList}>
              <InfoRow label="Staj Adı"   value={internship.data.name} />
              <InfoRow label="Rotasyon"   value={internship.data.rotation} />
              <InfoRow label="Hafta"      value={`${internship.data.week}. Hafta`} />
              <InfoRow label="Başlangıç" value={new Date(internship.data.startDate).toLocaleDateString("tr-TR")} />
              <InfoRow label="Bitiş"     value={new Date(internship.data.endDate).toLocaleDateString("tr-TR")} />
            </View>
          </View>
        )}

        {/* Çıkış */}
        <Pressable
          onPress={logout}
          style={({ pressed }) => [s.logoutBtn, pressed && { opacity: 0.8 }]}
        >
          <LogOut size={18} color={colors.danger} />
          <Text style={s.logoutText}>Çıkış Yap</Text>
        </Pressable>
      </View>
    </View>
  );
}

// ─── Yardımcı Bileşenler ──────────────────────────────
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.infoRow}>
      <Text style={s.infoLabel}>{label}</Text>
      <Text style={s.infoValue} numberOfLines={2}>{value}</Text>
    </View>
  );
}

// ════════════════════════════════════════════════════════
// STYLES
// ════════════════════════════════════════════════════════
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1 },

  header: {
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  greeting: { fontSize: 22, fontWeight: "800", color: colors.white, letterSpacing: -0.4 },
  headerSub: { fontSize: 13, color: "rgba(255,255,255,0.72)", marginTop: 2 },
  bellBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center", justifyContent: "center",
  },
  badgeDot: {
    position: "absolute", top: 4, right: 4,
    backgroundColor: colors.warning, borderRadius: 999,
    minWidth: 16, paddingHorizontal: 3, alignItems: "center",
  },
  badgeDotText: { fontSize: 9, fontWeight: "700", color: colors.white },

  pageHeader: {
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  pageTitle:    { fontSize: 22, fontWeight: "800", color: colors.white },
  pageSubtitle: { fontSize: 13, color: "rgba(255,255,255,0.72)", marginTop: 2 },

  body: { padding: 16, gap: 12 },

  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  cardTitle:  { fontSize: 15, fontWeight: "700", color: colors.foreground, flex: 1 },
  softIcon: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: colors.kou10,
    alignItems: "center", justifyContent: "center",
  },
  dayBadge: { fontSize: 11, fontWeight: "600", color: colors.mutedForeground },

  // ── Pills ──
  pillBlue: {
    backgroundColor: "#3B82F618", borderRadius: 999,
    paddingHorizontal: 10, paddingVertical: 3, alignSelf: "flex-start",
  },
  pillBlueText: { fontSize: 11, fontWeight: "600", color: AFTERNOON_COLOR },
  pillAmber: {
    backgroundColor: colors.warning10, borderRadius: 999,
    paddingHorizontal: 10, paddingVertical: 3,
  },
  pillAmberText: { fontSize: 11, fontWeight: "600", color: colors.warning },

  // ── Progress ──
  rotationText:   { fontSize: 13, color: colors.mutedForeground, marginBottom: 10 },
  progressTrack:  { height: 8, borderRadius: 4, backgroundColor: colors.muted, overflow: "hidden", marginBottom: 4 },
  progressFillBlue: { height: "100%", backgroundColor: AFTERNOON_COLOR, borderRadius: 4 },
  progressMeta:   { flexDirection: "row", justifyContent: "space-between" },
  progressMetaText: { fontSize: 11, color: colors.mutedForeground },

  // ── Split View (Bugün) ──
  splitRow: { flexDirection: "row", gap: 10 },
  splitCard: {
    flex: 1, borderRadius: 14, padding: 12, gap: 6,
  },
  splitMorning:   { backgroundColor: MORNING_BG },
  splitAfternoon: { backgroundColor: AFTERNOON_BG },
  splitHeader: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 2 },
  splitDot:    { width: 6, height: 6, borderRadius: 3 },
  splitType:   { fontSize: 11, fontWeight: "700", flex: 1 },
  splitTime:   { fontSize: 10, fontWeight: "600" },
  splitSubject:  { fontSize: 13, fontWeight: "700", color: colors.foreground, lineHeight: 18 },
  splitLocationRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  splitLocation: { fontSize: 10, color: colors.mutedForeground, flex: 1 },
  splitEnd:    { fontSize: 10, color: colors.mutedForeground },
  attendancePill: { borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3, alignSelf: "flex-start", marginTop: 4 },
  attendancePillText: { fontSize: 10, fontWeight: "700" },

  // ── Announcements ──
  annRow:    { flexDirection: "row", alignItems: "flex-start", paddingVertical: 8, gap: 10 },
  annBorder: { borderTopWidth: 1, borderTopColor: colors.border },
  annTypeDot: { width: 8, height: 8, borderRadius: 4, marginTop: 5 },
  annTitle:  { fontSize: 13, fontWeight: "600", color: colors.foreground, lineHeight: 18 },
  annMeta:   { fontSize: 11, color: colors.mutedForeground, marginTop: 2 },
  emptyText: { fontSize: 13, color: colors.mutedForeground, textAlign: "center", paddingVertical: 12 },

  // ── Day Selector (Takvim) ──
  legendRow:  { flexDirection: "row", gap: 16, marginBottom: 10 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot:  { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 12, color: colors.mutedForeground },

  daySelectorH: { flexDirection: "row", gap: 8, paddingHorizontal: 2, paddingVertical: 4 },
  dayCard: {
    width: 52, alignItems: "center", paddingVertical: 10,
    borderRadius: 14, backgroundColor: colors.muted, position: "relative",
  },
  dayCardActive:   { backgroundColor: colors.primary },
  dayCardWeekday: { fontSize: 11, fontWeight: "600", color: colors.mutedForeground },
  dayCardDate:    { fontSize: 18, fontWeight: "800", color: colors.foreground, marginTop: 2 },
  dayCardTextActive: { color: colors.white },
  todayDot: {
    position: "absolute", bottom: 6,
    width: 5, height: 5, borderRadius: 2.5, backgroundColor: colors.warning,
  },

  // ── Session Card (Takvim Detay) ──
  sessionCard: {
    borderRadius: 16, overflow: "hidden",
    borderLeftWidth: 4,
    backgroundColor: colors.card,
    marginBottom: 10,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
  },
  sessionHeader: {
    flexDirection: "row", alignItems: "center", gap: 8,
    paddingHorizontal: 14, paddingVertical: 10,
  },
  sessionLabel:   { flex: 1, fontSize: 13, fontWeight: "700" },
  sessionTimeChip: { borderRadius: 6, backgroundColor: "rgba(0,0,0,0.06)", paddingHorizontal: 8, paddingVertical: 3 },
  sessionTimeText: { fontSize: 11, fontWeight: "700" },
  sessionBody:   { padding: 14, paddingTop: 4, gap: 8 },
  sessionSubject: { fontSize: 14, fontWeight: "700", color: colors.foreground, lineHeight: 20 },
  sessionMetaRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  sessionMeta:    { fontSize: 12, color: colors.mutedForeground, flex: 1 },
  attendanceBadge: { flexDirection: "row", alignItems: "center", gap: 5, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, alignSelf: "flex-start" },
  attendanceBadgeText: { fontSize: 12, fontWeight: "600" },

  // ── Profile ──
  profileAvatarRow: { flexDirection: "row", alignItems: "center", gap: 16, marginBottom: 16 },
  avatarLg: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: "#3B82F618", alignItems: "center", justifyContent: "center",
  },
  avatarLgText:  { fontSize: 22, fontWeight: "800", color: AFTERNOON_COLOR },
  profileName:   { fontSize: 17, fontWeight: "800", color: colors.foreground },
  profileMeta:   { fontSize: 13, color: colors.mutedForeground, marginTop: 1 },
  profileInfoList: { gap: 2, marginTop: 8 },
  infoRow:  { flexDirection: "row", paddingVertical: 7, borderTopWidth: 1, borderTopColor: colors.border, gap: 8 },
  infoLabel: { width: 100, fontSize: 12, color: colors.mutedForeground },
  infoValue: { flex: 1, fontSize: 13, color: colors.foreground, fontWeight: "500" },

  logoutBtn: {
    flexDirection: "row", alignItems: "center", gap: 10,
    backgroundColor: "#FEF2F2", borderRadius: 16,
    paddingHorizontal: 20, paddingVertical: 15,
  },
  logoutText: { fontSize: 15, fontWeight: "700", color: colors.danger },

  // ── Tab Bar ──
  tabBar: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    flexDirection: "row", backgroundColor: colors.card,
    borderTopWidth: 1, borderTopColor: colors.border,
    paddingHorizontal: 6, gap: 4,
    shadowColor: "#000", shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 8,
  },
  tabItem: {
    flex: 1, alignItems: "center", justifyContent: "center",
    gap: 3, paddingVertical: 8, paddingHorizontal: 4,
    borderRadius: 12, minHeight: 52,
  },
  tabItemActive: { backgroundColor: colors.primary },
  tabLabel:      { fontSize: 10, fontWeight: "600", color: colors.mutedForeground, textAlign: "center" },
  tabLabelActive: { fontWeight: "700", color: colors.kouForeground },
});
