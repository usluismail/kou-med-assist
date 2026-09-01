import { useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Bell, BookOpen, Calendar, GraduationCap, Mail, MapPin, MessageCircle } from "lucide-react-native";
import { EmptyBlock, ErrorBlock, LoadingBlock } from "../StateViews";
import { useAuth } from "@/lib/api/AuthContext";
import { useAdvisor, useAnnouncements, useGrades, useSchedule } from "@/lib/api/hooks";
import type { Lesson } from "@/lib/api/types";
import { colors } from "@/lib/theme";
import { DAYS, GRADE_LETTER_COLORS, LESSON_COLORS, LESSON_LABELS } from "./constants";
import { s } from "./styles";

export function HomeTab({ onOpenMessage }: { onOpenMessage: () => void }) {
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
            <Text style={s.headerSub}>{user?.role === "student" ? user.rotation : "Dönem öğrencisi"}</Text>
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


      </View>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════
// TAB 2 — DERS PROGRAMI
