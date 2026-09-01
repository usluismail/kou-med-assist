import type { Lesson } from "@/lib/api/types";
import { colors } from "@/lib/theme";

export const DAYS: { key: Lesson["day"]; label: string }[] = [
  { key: "Mon", label: "Pzt" },
  { key: "Tue", label: "Sal" },
  { key: "Wed", label: "Çar" },
  { key: "Thu", label: "Per" },
  { key: "Fri", label: "Cum" },
];

export const LESSON_COLORS: Record<string, string> = {
  lecture: colors.primary,
  lab: "#6366F1",
  exam: "#EF4444",
};
export const LESSON_LABELS: Record<string, string> = {
  lecture: "Ders",
  lab: "Lab",
  exam: "Sınav",
};

export const GRADE_LETTER_COLORS: Record<string, string> = {
  AA: "#008542", BA: "#2D9E5E", BB: "#3B82F6",
  CB: "#6366F1", CC: "#F5A623", DC: "#F97316",
  DD: "#EF4444", FF: "#991B1B",
};
