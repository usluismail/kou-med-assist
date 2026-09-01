import { useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Bell,
  Calendar,
  ClipboardList,
  Clock,
  MapPin,
  Plus,
  Stethoscope,
} from "lucide-react-native";
import { EmptyBlock, LoadingBlock } from "../StateViews";
import { useAuth } from "@/lib/api/AuthContext";
import { useAnnouncements, useAuthedFetch, useLogs, useProcedures } from "@/lib/api/hooks";
import { fetchClinicalSchedule, fetchInternship } from "@/lib/api/index";
import { formatLogDateTr, logStatusLabel } from "@/lib/api/labels";
import type { ClinicalScheduleDay, LogEntry } from "@/lib/api/types";
import { colors } from "@/lib/theme";
import { AFTERNOON_COLOR, MORNING_COLOR } from "./constants";
import { s } from "./styles";

export function HomeTab({ onOpenLogbook }: { onOpenLogbook: () => void }) {
  const { user } = useAuth();
  const internship = useAuthedFetch(fetchInternship);
  const schedule   = useAuthedFetch(fetchClinicalSchedule);
  const announcements = useAnnouncements();
  const logs = useLogs();
  const procedures = useProcedures();
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

  const procList = procedures.data ?? [];
  const procDone = procList.reduce((sum, p) => sum + p.done, 0);
  const procTotal = procList.reduce((sum, p) => sum + p.total, 0);
  const logItems = logs.data ?? [];
  const pendingLogs = logItems.filter((l) => l.status === "pending").length;
  const recentLogs = logItems.slice(0, 2);

  return (
    <View>
      {/* Header */}
      <View style={[s.header, { paddingTop: insets.top + 12 }]}>
        <View style={s.headerRow}>
          <View>
            <Text style={s.greeting}>Merhaba, {user?.name?.split(" ")[0]} 👋</Text>
            <Text style={s.headerSub}>{user?.role === "student" ? user.rotation : "Klinik staj"}</Text>
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

        {/* Logbook özeti */}
        <View style={s.card}>
          <View style={s.cardHeader}>
            <View style={[s.softIcon, { backgroundColor: "#3B82F610" }]}>
              <ClipboardList size={16} color={AFTERNOON_COLOR} />
            </View>
            <Text style={s.cardTitle}>Logbook</Text>
            {pendingLogs > 0 && (
              <View style={s.pillAmber}>
                <Text style={s.pillAmberText}>{pendingLogs} onay bekliyor</Text>
              </View>
            )}
          </View>
          <Text style={s.rotationText}>
            Bu rotasyonda {procDone}/{procTotal || "—"} işlem
          </Text>
          {recentLogs.map((log: LogEntry) => (
            <View key={log.id} style={s.logPreviewRow}>
              <View style={{ flex: 1 }}>
                <Text style={s.annTitle} numberOfLines={1}>{log.procedureName}</Text>
                <Text style={s.annMeta}>{formatLogDateTr(log.date)}</Text>
              </View>
              <Text
                style={[
                  s.logStatusText,
                  { color: log.status === "approved" ? MORNING_COLOR : colors.warning },
                ]}
              >
                {logStatusLabel[log.status]}
              </Text>
            </View>
          ))}
          {!logs.loading && logItems.length === 0 && (
            <Text style={s.emptyText}>Henüz işlem kaydı yok</Text>
          )}
          <Pressable style={s.advisorBtnFill} onPress={onOpenLogbook}>
            <Plus size={14} color={colors.white} />
            <Text style={s.advisorBtnFillText}>Yeni İşlem Ekle</Text>
          </Pressable>
        </View>

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
