/**
 * hooks/index.ts — Barrel re-export.
 *
 * Tüm domain hook'larını tek bir noktadan dışa aktarır.
 * Mevcut `@/lib/api/hooks` import'ları bu dosya üzerinden çalışır.
 */

// ─── Çekirdek tipler & utility hook'lar ───────────────────────────────────────
export type { AsyncState, MutationResult } from "./core";
export { useAuthedFetch, useMutation } from "./core";

// ─── Logbook & öğrenci kayıt ──────────────────────────────────────────────────
export {
  useStudentDashboard,
  useLogs,
  useProcedures,
  useSupervisors,
  useColleagues,
  useCreateLog,
} from "./logbook";

// ─── Akademisyen ──────────────────────────────────────────────────────────────
export {
  usePendingApprovals,
  useOsceSessions,
  useOsceStation,
  useApproveLog,
  useRequestRevision,
  useFacultyAnnouncements,
  useSendAnnouncement,
} from "./faculty";

// ─── Pre-klinik (Dönem 1-3) ───────────────────────────────────────────────────
export { useSchedule, useAdvisor, useGrades } from "./preklinik";

// ─── Klinik staj (Dönem 4-5) & nöbet ─────────────────────────────────────────
export { useInternship, useClinicalSchedule, useShifts } from "./klinik";

// ─── Paylaşılan ───────────────────────────────────────────────────────────────
export { useAnnouncements, useMessages } from "./shared";
