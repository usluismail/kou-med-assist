import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BookOpen, Calendar, CheckCircle2, CircleDot, MapPin, Stethoscope } from "lucide-react-native";
import { EmptyBlock, ErrorBlock, LoadingBlock } from "../StateViews";
import { useAuthedFetch } from "@/lib/api/hooks";
import { fetchClinicalSchedule } from "@/lib/api/index";
import type { ClinicalScheduleDay } from "@/lib/api/types";
import { colors } from "@/lib/theme";
import { AFTERNOON_BG, AFTERNOON_COLOR, MORNING_BG, MORNING_COLOR } from "./constants";
import { s } from "./styles";

export function ScheduleTab() {
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
// TAB 4 — PROFİL
