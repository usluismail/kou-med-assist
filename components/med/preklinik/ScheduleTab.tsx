import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Calendar, MapPin } from "lucide-react-native";
import { EmptyBlock, ErrorBlock, LoadingBlock } from "../StateViews";
import { useSchedule } from "@/lib/api/hooks";
import type { Lesson } from "@/lib/api/types";
import { colors } from "@/lib/theme";
import { DAYS, LESSON_COLORS, LESSON_LABELS } from "./constants";
import { s } from "./styles";

export function ScheduleTab() {
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
