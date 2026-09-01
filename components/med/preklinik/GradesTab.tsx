import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronRight, GraduationCap } from "lucide-react-native";
import { EmptyBlock, ErrorBlock, LoadingBlock } from "../StateViews";
import { useGrades } from "@/lib/api/hooks";
import type { StudentGrades } from "@/lib/api/types";
import { colors } from "@/lib/theme";
import { GRADE_LETTER_COLORS } from "./constants";
import { s } from "./styles";

export function GradesTab() {
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
