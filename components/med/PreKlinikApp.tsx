/**
 * PreKlinikApp — Dönem 1, 2 ve 3 öğrencileri için ekran
 *
 * Tab'lar: Ana Sayfa | Ders Programı | Notlarım | Profil
 * Danışman hoca → Ana sayfa kartı + Profil içinde
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
  ChevronRight,
  GraduationCap,
  Home,
  LogOut,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  User,
} from "lucide-react-native";
import { EmptyBlock, ErrorBlock, LoadingBlock } from "./StateViews";
import { useAuth } from "@/lib/api/AuthContext";
import {
  useSchedule,
  useAdvisor,
  useGrades,
  useAnnouncements,
} from "@/lib/api/hooks";
import type { Lesson, StudentGrades } from "@/lib/api/types";
import { colors } from "@/lib/theme";

// ─── Sabitleler ───────────────────────────────────────────
const DAYS: { key: Lesson["day"]; label: string }[] = [
  { key: "Mon", label: "Pzt" },
  { key: "Tue", label: "Sal" },
  { key: "Wed", label: "Çar" },
  { key: "Thu", label: "Per" },
  { key: "Fri", label: "Cum" },
];

const LESSON_COLORS: Record<string, string> = {
  lecture: colors.primary,
  lab: "#6366F1",
  exam: "#EF4444",
};
const LESSON_LABELS: Record<string, string> = {
  lecture: "Ders",
  lab: "Lab",
  exam: "Sınav",
};

const GRADE_LETTER_COLORS: Record<string, string> = {
  AA: "#008542", BA: "#2D9E5E", BB: "#3B82F6",
  CB: "#6366F1", CC: "#F5A623", DC: "#F97316",
  DD: "#EF4444", FF: "#991B1B",
};

type Tab = "home" | "schedule" | "grades" | "profile";

// ─── Ana bileşen ──────────────────────────────────────────
export function PreKlinikApp() {
  const [tab, setTab] = useState<Tab>("home");
  const insets = useSafeAreaInsets();

  return (
    <View style={s.root}>
      <ScrollView
        style={s.scroll}
        contentContainerStyle={[s.scrollContent, { paddingBottom: 88 + Math.max(insets.bottom, 8) }]}
        showsVerticalScrollIndicator={false}
      >
        {tab === "home" && <HomeTab />}
        {tab === "schedule" && <ScheduleTab />}
        {tab === "grades" && <GradesTab />}
        {tab === "profile" && <ProfileTab />}
      </ScrollView>

      {/* Tab Bar */}
      <View style={[s.tabBar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
        {(
          [
            ["home", "Ana Sayfa", Home],
            ["schedule", "Ders Prog.", Calendar],
            ["grades", "Notlarım", GraduationCap],
            ["profile", "Profil", User],
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

// ═══════════════════════════════════════════════════════════
// TAB 1 — ANA SAYFA
// ═══════════════════════════════════════════════════════════
function HomeTab() {
  const { user } = useAuth();
  const schedule = useSchedule();
  const advisor = useAdvisor();
  const announcements = useAnnouncements();
  const grades = useGrades();
  const insets = useSafeAreaInsets();

  // Bugünkü dersleri filtrele
  const todayKey = DAYS[new Date().getDay() - 1]?.key ?? "Mon";
  const todayLessons = useMemo(
    () => (schedule.data ?? []).filter((l) => l.day === todayKey),
    [schedule.data, todayKey],
  );

  // Aktif kurul
  const activeCommittee = (grades.data?.committees ?? []).find(c => c.status === "ongoing");
  const completedCount = (grades.data?.committees ?? []).filter(c => c.status === "completed").length;
  const totalCommittees = (grades.data?.committees ?? []).length;

  // Okunmamış duyuru sayısı
  const unreadCount = (announcements.data ?? []).filter(a => !a.isRead).length;

  return (
    <View>
      {/* Header */}
      <View style={[s.header, { paddingTop: insets.top + 12 }]}>
        <View style={s.headerRow}>
          <View>
            <Text style={s.greeting}>Merhaba, {user?.name?.split(" ")[0]} 👋</Text>
            <Text style={s.headerSub}>{user?.rotation ?? "Dönem öğrencisi"}</Text>
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
        {/* Kurul İlerlemesi */}
        {activeCommittee && (
          <View style={s.card}>
            <View style={s.cardHeader}>
              <View style={s.softIcon}><BookOpen size={16} color={colors.primary} /></View>
              <Text style={s.cardTitle}>Kurul İlerlemesi</Text>
              <View style={s.pillGreen}>
                <Text style={s.pillGreenText}>{completedCount}/{totalCommittees} Kurul</Text>
              </View>
            </View>
            <View style={s.progressTrack}>
              <View style={[s.progressFill, { width: `${Math.round((completedCount / Math.max(totalCommittees, 1)) * 100)}%` }]} />
            </View>
            <Text style={s.committeeLabel} numberOfLines={1}>{activeCommittee.name}</Text>
          </View>
        )}

        {/* Bugünkü Dersler */}
        <View style={s.card}>
          <View style={s.cardHeader}>
            <View style={s.softIcon}><Calendar size={16} color={colors.primary} /></View>
            <Text style={s.cardTitle}>Bugünkü Dersler</Text>
            <View style={s.pillMuted}>
              <Text style={s.pillMutedText}>{DAYS.find(d => d.key === todayKey)?.label ?? "—"}</Text>
            </View>
          </View>
          {schedule.loading && <LoadingBlock label="Yükleniyor…" />}
          {!schedule.loading && todayLessons.length === 0 && (
            <Text style={s.emptyText}>Bu gün ders yok ✌️</Text>
          )}
          {todayLessons.map((lesson, i) => (
            <View key={i} style={[s.lessonRow, i > 0 && s.lessonRowBorder]}>
              <View style={[s.lessonTypeDot, { backgroundColor: LESSON_COLORS[lesson.type] }]} />
              <View style={s.lessonTime}>
                <Text style={s.lessonTimeText}>{lesson.time}</Text>
                <Text style={s.lessonEndText}>{lesson.endTime}</Text>
              </View>
              <View style={s.lessonMain}>
                <Text style={s.lessonName} numberOfLines={2}>{lesson.subject}</Text>
                <Text style={s.lessonRoom} numberOfLines={1}>
                  <MapPin size={11} color={colors.mutedForeground} /> {lesson.room}
                </Text>
              </View>
              <View style={[s.lessonTypePill, { backgroundColor: LESSON_COLORS[lesson.type] + "18" }]}>
                <Text style={[s.lessonTypePillText, { color: LESSON_COLORS[lesson.type] }]}>
                  {LESSON_LABELS[lesson.type]}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Notlarım Özeti */}
        <View style={s.card}>
          <View style={s.cardHeader}>
            <View style={s.softIcon}><GraduationCap size={16} color={colors.primary} /></View>
            <Text style={s.cardTitle}>Son Notlarım</Text>
          </View>
          {grades.loading && <LoadingBlock label="Yükleniyor…" />}
          {!grades.loading && grades.data && (() => {
            const lastDone = [...grades.data.committees].reverse().find(c => c.status === "completed");
            if (!lastDone) return <Text style={s.emptyText}>Henüz not yok</Text>;
            return (
              <>
                <Text style={s.kurulName} numberOfLines={1}>{lastDone.name}</Text>
                {lastDone.courses.slice(0, 4).map((course, i) => (
                  <View key={i} style={s.gradeRow}>
                    <Text style={s.gradeCourseName} numberOfLines={1}>{course.name}</Text>
                    <View style={s.gradeRight}>
                      {course.score !== null && (
                        <Text style={s.gradeScore}>{course.score}</Text>
                      )}
                      {course.letterGrade && (
                        <View style={[s.gradePill, { backgroundColor: (GRADE_LETTER_COLORS[course.letterGrade] ?? colors.mutedForeground) + "18" }]}>
                          <Text style={[s.gradePillText, { color: GRADE_LETTER_COLORS[course.letterGrade] ?? colors.mutedForeground }]}>
                            {course.letterGrade}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                ))}
                {lastDone.courses.length > 4 && (
                  <Text style={s.seeMore}>+{lastDone.courses.length - 4} ders daha →</Text>
                )}
              </>
            );
          })()}
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
          {!announcements.loading && (announcements.data ?? []).slice(0, 3).map((ann, i) => (
            <View key={ann.id} style={[s.annRow, i > 0 && s.annBorder]}>
              <View style={[s.annTypeDot, {
                backgroundColor:
                  ann.actionType === "cancelled" ? colors.danger :
                  ann.actionType === "time_changed" ? colors.warning :
                  ann.actionType === "room_changed" ? colors.info :
                  colors.primary,
              }]} />
              <View style={{ flex: 1 }}>
                <Text style={s.annTitle} numberOfLines={2}>{ann.title}</Text>
                <Text style={s.annMeta}>{new Date(ann.sentAt).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}</Text>
              </View>
            </View>
          ))}
          {!announcements.loading && (announcements.data ?? []).length === 0 && (
            <Text style={s.emptyText}>Duyuru yok</Text>
          )}
        </View>

        {/* Danışman Hoca */}
        {advisor.data && (
          <View style={s.card}>
            <View style={s.cardHeader}>
              <View style={s.softIcon}><User size={16} color={colors.primary} /></View>
              <Text style={s.cardTitle}>Danışman Hocam</Text>
            </View>
            <View style={s.advisorRow}>
              <View style={s.avatarMd}>
                <Text style={s.avatarMdText}>
                  {advisor.data.name.split(" ").filter(w => /^[A-ZÜÇŞĞİÖ]/.test(w)).slice(-2).map(w => w[0]).join("")}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.advisorName} numberOfLines={1}>{advisor.data.name}</Text>
                <Text style={s.advisorDept} numberOfLines={1}>{advisor.data.department}</Text>
                <Text style={s.advisorMeta} numberOfLines={1}>{advisor.data.office} · {advisor.data.officeHours.split(",")[0]}</Text>
              </View>
            </View>
            <View style={s.advisorBtns}>
              <Pressable
                style={s.advisorBtnOutline}
                onPress={() => Linking.openURL(`mailto:${advisor.data!.email}`).catch(() => {})}
              >
                <Mail size={14} color={colors.primary} />
                <Text style={s.advisorBtnOutlineText}>Soru Sor</Text>
              </Pressable>
              {advisor.data.phone && (
                <Pressable
                  style={s.advisorBtnFill}
                  onPress={() => Linking.openURL(`tel:${(advisor.data!.phone ?? '').replace(/\s/g, '')}`).catch(() => {})}
                >
                  <Phone size={14} color={colors.white} />
                  <Text style={s.advisorBtnFillText}>Ara</Text>
                </Pressable>
              )}
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════
// TAB 2 — DERS PROGRAMI
// ═══════════════════════════════════════════════════════════
function ScheduleTab() {
  const schedule = useSchedule();
  const todayIndex = Math.min(Math.max(new Date().getDay() - 1, 0), 4);
  const [selectedDay, setSelectedDay] = useState<Lesson["day"]>(DAYS[todayIndex]?.key ?? "Mon");
  const insets = useSafeAreaInsets();

  const dayLessons = useMemo(
    () => (schedule.data ?? []).filter((l) => l.day === selectedDay).sort((a, b) => a.time.localeCompare(b.time)),
    [schedule.data, selectedDay],
  );

  return (
    <View>
      <View style={[s.pageHeader, { paddingTop: insets.top + 16 }]}>
        <Text style={s.pageTitle}>Ders Programı</Text>
        <Text style={s.pageSubtitle}>Haftalık ders takvimi</Text>
      </View>

      <View style={s.body}>
        {/* Gün Seçici */}
        <View style={s.daySelector}>
          {DAYS.map((d) => {
            const active = d.key === selectedDay;
            return (
              <Pressable
                key={d.key}
                onPress={() => setSelectedDay(d.key)}
                style={[s.dayPill, active && s.dayPillActive]}
              >
                <Text style={[s.dayPillText, active && s.dayPillTextActive]}>{d.label}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Renk Göstergesi */}
        <View style={s.legendRow}>
          {Object.entries(LESSON_LABELS).map(([type, label]) => (
            <View key={type} style={s.legendItem}>
              <View style={[s.legendDot, { backgroundColor: LESSON_COLORS[type] }]} />
              <Text style={s.legendText}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Ders Listesi */}
        {schedule.loading && <LoadingBlock label="Ders programı yükleniyor…" />}
        {schedule.error && <ErrorBlock message={schedule.error} onRetry={schedule.reload} />}
        {!schedule.loading && dayLessons.length === 0 && (
          <EmptyBlock message="Bu gün ders yok" />
        )}
        {dayLessons.map((lesson, i) => (
          <View key={i} style={[s.scheduleCard, { borderLeftColor: LESSON_COLORS[lesson.type] }]}>
            <View style={s.scheduleTimeCol}>
              <Text style={s.scheduleTime}>{lesson.time}</Text>
              <Text style={s.scheduleTimeEnd}>{lesson.endTime}</Text>
            </View>
            <View style={s.scheduleMain}>
              <Text style={s.scheduleName} numberOfLines={2}>{lesson.subject}</Text>
              <Text style={s.scheduleInstructor} numberOfLines={1}>{lesson.instructorName}</Text>
              <View style={s.scheduleRoomRow}>
                <MapPin size={11} color={colors.mutedForeground} />
                <Text style={s.scheduleRoom}>{lesson.room}</Text>
              </View>
            </View>
            <View style={[s.scheduleTypePill, { backgroundColor: LESSON_COLORS[lesson.type] + "18" }]}>
              <Text style={[s.scheduleTypePillText, { color: LESSON_COLORS[lesson.type] }]}>
                {LESSON_LABELS[lesson.type]}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════
// TAB 3 — NOTLARIM
// ═══════════════════════════════════════════════════════════
function GradesTab() {
  const grades = useGrades();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  if (grades.loading && !grades.data) return <LoadingBlock label="Notlar yükleniyor…" />;
  if (grades.error && !grades.data) return <ErrorBlock message={grades.error} onRetry={grades.reload} />;
  if (!grades.data) return <EmptyBlock message="Not verisi bulunamadı" />;

  const { gpa, committees } = grades.data;

  return (
    <View>
      <View style={[s.pageHeader, { paddingTop: insets.top + 16 }]}>
        <Text style={s.pageTitle}>Notlarım</Text>
        <Text style={s.pageSubtitle}>Kurul bazlı not durumu</Text>
      </View>

      <View style={s.body}>
        {/* GPA Özet Kartı */}
        <View style={[s.card, s.gpaCard]}>
          <View style={s.gpaLeft}>
            <Text style={s.gpaValue}>{gpa.toFixed(2)}</Text>
            <Text style={s.gpaLabel}>Genel Ort.</Text>
          </View>
          <View style={s.gpaDivider} />
          <View style={s.gpaRight}>
            <View style={s.gpaStatRow}>
              <Text style={s.gpaStat}>{committees.filter(c => c.status === "completed").length}</Text>
              <Text style={s.gpaStatLabel}>Tamamlandı</Text>
            </View>
            <View style={s.gpaStatRow}>
              <Text style={[s.gpaStat, { color: colors.warning }]}>{committees.filter(c => c.status === "ongoing").length}</Text>
              <Text style={s.gpaStatLabel}>Devam Eden</Text>
            </View>
          </View>
        </View>

        {/* Kurul Listesi */}
        {committees.map((committee) => {
          const isExpanded = expandedId === committee.id;
          const isOngoing = committee.status === "ongoing";
          const completedCourses = committee.courses.filter(c => c.score !== null);

          return (
            <Pressable
              key={committee.id}
              style={[s.card, isOngoing && s.committeeOngoingCard]}
              onPress={() => setExpandedId(isExpanded ? null : committee.id)}
            >
              <View style={s.committeeHeader}>
                <View style={{ flex: 1 }}>
                  <View style={s.committeeStatusRow}>
                    <View style={[s.committeeDot, {
                      backgroundColor: isOngoing ? colors.warning :
                        committee.status === "completed" ? colors.primary : colors.accent
                    }]} />
                    <Text style={[s.committeeStatus, {
                      color: isOngoing ? colors.warning :
                        committee.status === "completed" ? colors.primary : colors.mutedForeground
                    }]}>
                      {isOngoing ? "Devam Ediyor" : committee.status === "completed" ? "Tamamlandı" : "Başlamadı"}
                    </Text>
                  </View>
                  <Text style={s.committeeTitle} numberOfLines={2}>{committee.name}</Text>
                  {!isOngoing && completedCourses.length > 0 && (
                    <Text style={s.committeeAvg}>
                      Ort: {(completedCourses.reduce((s, c) => s + (c.score ?? 0), 0) / completedCourses.length).toFixed(1)}
                    </Text>
                  )}
                </View>
                <ChevronRight
                  size={18}
                  color={colors.mutedForeground}
                  style={{ transform: [{ rotate: isExpanded ? "90deg" : "0deg" }] }}
                />
              </View>

              {/* Açılır Ders Listesi */}
              {isExpanded && (
                <View style={s.courseList}>
                  <View style={s.courseDivider} />
                  {committee.courses.map((course, i) => (
                    <View key={i} style={[s.courseRow, i < committee.courses.length - 1 && s.courseRowBorder]}>
                      <Text style={s.courseRowName} numberOfLines={1}>{course.name}</Text>
                      <View style={s.courseRowRight}>
                        {course.score !== null ? (
                          <>
                            <Text style={s.courseScore}>{course.score}</Text>
                            {course.letterGrade && (
                              <View style={[s.gradeChip, { backgroundColor: (GRADE_LETTER_COLORS[course.letterGrade] ?? colors.mutedForeground) + "18" }]}>
                                <Text style={[s.gradeChipText, { color: GRADE_LETTER_COLORS[course.letterGrade] ?? colors.mutedForeground }]}>
                                  {course.letterGrade}
                                </Text>
                              </View>
                            )}
                          </>
                        ) : (
                          <Text style={s.courseNoScore}>—</Text>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════
// TAB 4 — PROFİL
// ═══════════════════════════════════════════════════════════
function ProfileTab() {
  const { user, logout } = useAuth();
  const advisor = useAdvisor();
  const insets = useSafeAreaInsets();

  return (
    <View>
      <View style={[s.pageHeader, { paddingTop: insets.top + 16 }]}>
        <Text style={s.pageTitle}>Profil</Text>
      </View>

      <View style={s.body}>
        {/* Öğrenci Bilgileri */}
        <View style={s.card}>
          <View style={s.profileAvatarRow}>
            <View style={s.avatarLg}>
              <Text style={s.avatarLgText}>{user?.initials ?? "??"}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.profileName} numberOfLines={1}>{user?.name}</Text>
              <Text style={s.profileMeta} numberOfLines={1}>{user?.studentNo}</Text>
              <View style={s.pillGreen}>
                <Text style={s.pillGreenText}>{user?.rotation ?? "Öğrenci"}</Text>
              </View>
            </View>
          </View>

          <View style={s.profileInfoList}>
            <InfoRow label="Fakülte" value="Kocaeli Üniversitesi Tıp Fakültesi" />
            <InfoRow label="Bölüm" value={user?.department ?? "—"} />
          </View>
        </View>

        {/* Danışman Detay */}
        {advisor.data && (
          <View style={s.card}>
            <View style={s.cardHeader}>
              <View style={s.softIcon}><User size={16} color={colors.primary} /></View>
              <Text style={s.cardTitle}>Danışman Hocam</Text>
            </View>

            <View style={s.advisorRow}>
              <View style={s.avatarMd}>
                <Text style={s.avatarMdText}>
                  {advisor.data.name.split(" ").filter(w => /^[A-ZÜÇŞĞİÖ]/.test(w)).slice(-2).map(w => w[0]).join("")}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.advisorName}>{advisor.data.name}</Text>
                <Text style={s.advisorDept}>{advisor.data.department}</Text>
              </View>
            </View>

            <View style={s.profileInfoList}>
              <InfoRow label="Oda" value={advisor.data.office} />
              <InfoRow label="Danışmanlık Saatleri" value={advisor.data.officeHours} />
              <InfoRow label="E-posta" value={advisor.data.email} />
              {advisor.data.phone && <InfoRow label="Telefon" value={advisor.data.phone} />}
            </View>

            <View style={[s.advisorBtns, { marginTop: 12 }]}>
              <Pressable
                style={[s.advisorBtnOutline, { flex: 1 }]}
                onPress={() => Linking.openURL(`mailto:${advisor.data!.email}`).catch(() => {})}
              >
                <Mail size={14} color={colors.primary} />
                <Text style={s.advisorBtnOutlineText}>E-posta Gönder</Text>
              </Pressable>
              <Pressable
                style={[s.advisorBtnFill, { flex: 1 }]}
                onPress={() => Linking.openURL(`tel:${(advisor.data!.phone ?? '').replace(/\s/g, '')}`).catch(() => {})}
              >
                <MessageCircle size={14} color={colors.white} />
                <Text style={s.advisorBtnFillText}>Mesaj Gönder</Text>
              </Pressable>
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

// ─── Yardımcı Bileşen ─────────────────────────────────────
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.infoRow}>
      <Text style={s.infoLabel}>{label}</Text>
      <Text style={s.infoValue} numberOfLines={2}>{value}</Text>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1 },

  // ── Header ──
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

  // ── Page header (non-home tabs) ──
  pageHeader: {
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  pageTitle: { fontSize: 22, fontWeight: "800", color: colors.white },
  pageSubtitle: { fontSize: 13, color: "rgba(255,255,255,0.72)", marginTop: 2 },

  // ── Body ──
  body: { padding: 16, gap: 12 },

  // ── Card ──
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
  cardTitle: { fontSize: 15, fontWeight: "700", color: colors.foreground, flex: 1 },
  softIcon: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: colors.kou10,
    alignItems: "center", justifyContent: "center",
  },

  // ── Pills ──
  pillGreen: {
    backgroundColor: colors.kou10, borderRadius: 999,
    paddingHorizontal: 10, paddingVertical: 3, alignSelf: "flex-start",
  },
  pillGreenText: { fontSize: 11, fontWeight: "600", color: colors.primary },
  pillMuted: {
    backgroundColor: colors.muted, borderRadius: 999,
    paddingHorizontal: 10, paddingVertical: 3,
  },
  pillMutedText: { fontSize: 11, fontWeight: "600", color: colors.mutedForeground },
  pillAmber: {
    backgroundColor: colors.warning10, borderRadius: 999,
    paddingHorizontal: 10, paddingVertical: 3,
  },
  pillAmberText: { fontSize: 11, fontWeight: "600", color: colors.warning },

  // ── Progress ──
  progressTrack: {
    height: 8, borderRadius: 4, backgroundColor: colors.muted, overflow: "hidden", marginBottom: 6,
  },
  progressFill: { height: "100%", backgroundColor: colors.primary, borderRadius: 4 },
  committeeLabel: { fontSize: 12, color: colors.mutedForeground },

  // ── Lesson Rows (Home) ──
  lessonRow: { flexDirection: "row", alignItems: "flex-start", paddingVertical: 10, gap: 10 },
  lessonRowBorder: { borderTopWidth: 1, borderTopColor: colors.border },
  lessonTypeDot: { width: 4, height: "100%", borderRadius: 2, minHeight: 40 },
  lessonTime: { width: 44 },
  lessonTimeText: { fontSize: 12, fontWeight: "700", color: colors.foreground },
  lessonEndText: { fontSize: 11, color: colors.mutedForeground, marginTop: 1 },
  lessonMain: { flex: 1 },
  lessonName: { fontSize: 13, fontWeight: "600", color: colors.foreground, lineHeight: 18 },
  lessonRoom: { fontSize: 11, color: colors.mutedForeground, marginTop: 2 },
  lessonTypePill: { borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3, alignSelf: "flex-start" },
  lessonTypePillText: { fontSize: 10, fontWeight: "700" },

  emptyText: { fontSize: 13, color: colors.mutedForeground, textAlign: "center", paddingVertical: 12 },

  // ── Grade Rows (Home) ──
  kurulName: { fontSize: 12, fontWeight: "600", color: colors.primary, marginBottom: 8 },
  gradeRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 6, borderTopWidth: 1, borderTopColor: colors.border },
  gradeCourseName: { flex: 1, fontSize: 13, color: colors.foreground },
  gradeRight: { flexDirection: "row", alignItems: "center", gap: 6 },
  gradeScore: { fontSize: 13, fontWeight: "700", color: colors.foreground },
  gradePill: { borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
  gradePillText: { fontSize: 11, fontWeight: "700" },
  seeMore: { fontSize: 12, color: colors.primary, marginTop: 6, textAlign: "right" },

  // ── Announcements (Home) ──
  annRow: { flexDirection: "row", alignItems: "flex-start", paddingVertical: 8, gap: 10 },
  annBorder: { borderTopWidth: 1, borderTopColor: colors.border },
  annTypeDot: { width: 8, height: 8, borderRadius: 4, marginTop: 5 },
  annTitle: { fontSize: 13, fontWeight: "600", color: colors.foreground, lineHeight: 18 },
  annMeta: { fontSize: 11, color: colors.mutedForeground, marginTop: 2 },

  // ── Advisor ──
  advisorRow: { flexDirection: "row", alignItems: "flex-start", gap: 12, marginBottom: 4 },
  avatarMd: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: colors.kou20, alignItems: "center", justifyContent: "center",
  },
  avatarMdText: { fontSize: 16, fontWeight: "700", color: colors.primary },
  advisorName: { fontSize: 14, fontWeight: "700", color: colors.foreground },
  advisorDept: { fontSize: 12, color: colors.mutedForeground, marginTop: 1 },
  advisorMeta: { fontSize: 11, color: colors.mutedForeground, marginTop: 2 },
  advisorBtns: { flexDirection: "row", gap: 8, marginTop: 12 },
  advisorBtnOutline: {
    flexDirection: "row", alignItems: "center", gap: 6,
    borderWidth: 1.5, borderColor: colors.primary, borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 9,
  },
  advisorBtnOutlineText: { fontSize: 13, fontWeight: "600", color: colors.primary },
  advisorBtnFill: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: colors.primary, borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 9,
  },
  advisorBtnFillText: { fontSize: 13, fontWeight: "600", color: colors.white },

  // ── Day Selector ──
  daySelector: { flexDirection: "row", gap: 6, marginBottom: 8 },
  dayPill: {
    flex: 1, paddingVertical: 8, borderRadius: 12,
    backgroundColor: colors.muted, alignItems: "center",
  },
  dayPillActive: { backgroundColor: colors.primary },
  dayPillText: { fontSize: 12, fontWeight: "600", color: colors.mutedForeground },
  dayPillTextActive: { color: colors.white },

  // ── Legend ──
  legendRow: { flexDirection: "row", gap: 14, marginBottom: 8 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 11, color: colors.mutedForeground },

  // ── Schedule Cards ──
  scheduleCard: {
    backgroundColor: colors.card, borderRadius: 16,
    borderLeftWidth: 4, flexDirection: "row", alignItems: "flex-start",
    padding: 14, marginBottom: 8, gap: 12,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
  },
  scheduleTimeCol: { width: 52, alignItems: "flex-start" },
  scheduleTime: { fontSize: 13, fontWeight: "700", color: colors.foreground },
  scheduleTimeEnd: { fontSize: 11, color: colors.mutedForeground, marginTop: 1 },
  scheduleMain: { flex: 1 },
  scheduleName: { fontSize: 14, fontWeight: "700", color: colors.foreground, lineHeight: 20 },
  scheduleInstructor: { fontSize: 12, color: colors.mutedForeground, marginTop: 2 },
  scheduleRoomRow: { flexDirection: "row", alignItems: "center", gap: 3, marginTop: 3 },
  scheduleRoom: { fontSize: 11, color: colors.mutedForeground },
  scheduleTypePill: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, alignSelf: "flex-start" },
  scheduleTypePillText: { fontSize: 10, fontWeight: "700" },

  // ── GPA Card ──
  gpaCard: { flexDirection: "row", alignItems: "center" },
  gpaLeft: { alignItems: "center", paddingRight: 20 },
  gpaValue: { fontSize: 40, fontWeight: "800", color: colors.primary, lineHeight: 44 },
  gpaLabel: { fontSize: 11, color: colors.mutedForeground, marginTop: 2 },
  gpaDivider: { width: 1, height: 50, backgroundColor: colors.border },
  gpaRight: { flex: 1, paddingLeft: 20, gap: 8 },
  gpaStatRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  gpaStat: { fontSize: 22, fontWeight: "800", color: colors.primary },
  gpaStatLabel: { fontSize: 13, color: colors.mutedForeground },

  // ── Committee Cards ──
  committeeOngoingCard: { borderWidth: 1.5, borderColor: colors.warning + "60" },
  committeeHeader: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  committeeStatusRow: { flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 3 },
  committeeDot: { width: 7, height: 7, borderRadius: 3.5 },
  committeeStatus: { fontSize: 11, fontWeight: "600" },
  committeeTitle: { fontSize: 14, fontWeight: "700", color: colors.foreground, lineHeight: 20 },
  committeeAvg: { fontSize: 12, color: colors.mutedForeground, marginTop: 2 },
  courseList: { marginTop: 2 },
  courseDivider: { height: 1, backgroundColor: colors.border, marginVertical: 10 },
  courseRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 8 },
  courseRowBorder: { borderTopWidth: 1, borderTopColor: colors.border },
  courseRowName: { flex: 1, fontSize: 13, color: colors.foreground },
  courseRowRight: { flexDirection: "row", alignItems: "center", gap: 6 },
  courseScore: { fontSize: 14, fontWeight: "700", color: colors.foreground },
  courseNoScore: { fontSize: 13, color: colors.mutedForeground },
  gradeChip: { borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
  gradeChipText: { fontSize: 11, fontWeight: "700" },

  // ── Profile ──
  profileAvatarRow: { flexDirection: "row", alignItems: "center", gap: 16, marginBottom: 16 },
  avatarLg: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: colors.kou20, alignItems: "center", justifyContent: "center",
  },
  avatarLgText: { fontSize: 22, fontWeight: "800", color: colors.primary },
  profileName: { fontSize: 17, fontWeight: "800", color: colors.foreground },
  profileMeta: { fontSize: 13, color: colors.mutedForeground, marginTop: 1 },
  profileInfoList: { gap: 2, marginTop: 8 },
  infoRow: { flexDirection: "row", paddingVertical: 7, borderTopWidth: 1, borderTopColor: colors.border, gap: 8 },
  infoLabel: { width: 100, fontSize: 12, color: colors.mutedForeground },
  infoValue: { flex: 1, fontSize: 13, color: colors.foreground, fontWeight: "500" },

  // ── Logout ──
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
    shadowColor: "#000", shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 12,
    minHeight: 52,
  },
  tabItemActive: { backgroundColor: colors.primary },
  tabLabel: { fontSize: 10, fontWeight: "600", color: colors.mutedForeground, textAlign: "center" },
  tabLabelActive: { fontWeight: "700", color: colors.kouForeground },
});
