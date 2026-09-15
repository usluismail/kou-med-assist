/**
 * API katmanı — barrel re-export.
 *
 * Bu dosya hiçbir implementasyon içermez; yalnızca domain alt-modüllerinden
 * dışa aktarım yapar. Böylece mevcut `@/lib/api` import'ları bozulmaz.
 *
 * Domain dosyaları:
 *   auth.ts          → login, fetchMe
 *   shared.ts        → fetchAnnouncements, fetchMessages, sendMessage
 *   faculty.ts       → approveLog, requestRevision, validateQrPayload, fetchOsceStation, submitOsceScore
 *   student/
 *     dashboard.ts   → fetchStudentDashboard
 *     logbook.ts     → fetchLogs, createLog, fetchProcedures, fetchSupervisors, fetchColleagues
 *     shifts.ts      → fetchShifts, requestShiftSwap
 *     osce.ts        → fetchOsceSessions, fetchOsceStation, submitOsceScore
 *     preklinik.ts   → fetchSchedule, fetchAdvisor, fetchGrades
 *     klinik.ts      → fetchInternship, fetchClinicalSchedule
 */

// ─── Oturum yönetimi ───────────────────────────────────────────────────────
export { clearSession, getStoredToken, getStoredUser, persistSession } from "./storage";

// ─── Auth ─────────────────────────────────────────────────────────────────
export { login, fetchMe } from "./auth";

// ─── Öğrenci ──────────────────────────────────────────────────────────────
export { fetchStudentDashboard } from "./student/dashboard";
export { fetchLogs, createLog, fetchProcedures, fetchSupervisors, fetchColleagues } from "./student/logbook";
export { fetchShifts, requestShiftSwap } from "./student/shifts";
export { fetchOsceSessions, fetchOsceStation, submitOsceScore } from "./student/osce";
export { fetchSchedule, fetchAdvisor, fetchGrades } from "./student/preklinik";
export { fetchInternship, fetchClinicalSchedule } from "./student/klinik";

// ─── Akademisyen ───────────────────────────────────────────────────────────
export {
  fetchPendingApprovals,
  approveLog,
  requestRevision,
  validateQrPayload,
  fetchOsceStation as fetchFacultyOsceStation,
  submitOsceScore as submitFacultyOsceScore,
} from "./faculty";

// ─── Paylaşılan ────────────────────────────────────────────────────────────
export {
  fetchAnnouncements,
  fetchPortalAnnouncements,
  fetchCampusEvents,
  fetchCafeteriaWeek,
  fetchCafeteriaToday,
  fetchHospitalPlaces,
  fetchFacultyDirectory,
  fetchMessages,
  sendMessage,
} from "./shared";

