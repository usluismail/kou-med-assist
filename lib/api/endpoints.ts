export const endpoints = {
  // ── Sistem ──
  health: "/health",

  // ── Auth ──
  login: "/auth/login",
  me: "/auth/me",

  // ── Öğrenci — Mevcut ──
  studentDashboard: "/student/dashboard",
  studentProcedures: "/student/procedures",
  studentLogs: "/student/logs",
  studentShifts: "/student/shifts",
  studentSupervisors: "/student/supervisors",
  studentColleagues: "/student/colleagues",
  studentOsceSessions: "/student/osce/sessions",
  studentShiftSwap: (id: string) => `/student/shifts/${id}/swap-request`,

  // ── Öğrenci — Dönem 1-2-3 (Pre-Klinik) ──
  studentSchedule: "/student/schedule",
  studentAdvisor: "/student/advisor",
  studentGrades: "/student/grades",

  // ── Öğrenci — Dönem 4-5 (Klinik Staj) ──
  studentInternship: "/student/internship",
  studentClinicalSchedule: "/student/clinical-schedule",
  studentClinicalVerifyAttendance: (id: string) =>
    `/student/clinical-schedule/${id}/verify-attendance`,

  // ── Öğrenci — Dönem 6 (İntörn) ──
  studentEkarne: "/student/ekarne",
  studentEkarneGeneratePdf: "/student/ekarne/generate-pdf",

  // ── İletişim (Öğrenci) ──
  messages: "/messages",
  sendMessage: "/messages/send",

  // ── Yemekhane & Duyurular (Herkes) ──
  cafeteriaToday: "/cafeteria/today",
  cafeteriaWeek: "/cafeteria/week",
  announcements: "/announcements",
  portalAnnouncements: "/portal/announcements",
  campusEvents: "/events",
  hospitalPlaces: "/hospital/places",
  facultyDirectory: "/faculty/directory",

  // ── Akademisyen — Mevcut ──
  facultyPendingApprovals: "/faculty/approvals/pending",
  facultyApprove: (id: string) => `/faculty/approvals/${id}/approve`,
  facultyRequestRevision: (id: string) =>
    `/faculty/approvals/${id}/request-revision`,
  facultyQr: "/faculty/approvals/qr",
  facultyOsceStation: (stationId: string) =>
    `/faculty/osce/stations/${stationId}`,
  facultyOsceScores: "/faculty/osce/scores",

  // ── Akademisyen — Duyuru Konsolu ──
  facultyAnnouncements: "/faculty/announcements",

  // ── Akademisyen — Öğrenci listesi ──
  facultyStudents: "/faculty/students",
} as const;

