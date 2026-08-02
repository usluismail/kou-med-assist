export const endpoints = {
  health: "/health",
  login: "/auth/login",
  me: "/auth/me",
  studentDashboard: "/student/dashboard",
  studentProcedures: "/student/procedures",
  studentLogs: "/student/logs",
  studentShifts: "/student/shifts",
  studentSupervisors: "/student/supervisors",
  studentColleagues: "/student/colleagues",
  facultyPendingApprovals: "/faculty/approvals/pending",
  facultyApprove: (id: string) => `/faculty/approvals/${id}/approve`,
  facultyRequestRevision: (id: string) =>
    `/faculty/approvals/${id}/request-revision`,
  facultyQr: "/faculty/approvals/qr",
  studentShiftSwap: (id: string) => `/student/shifts/${id}/swap-request`,
} as const;
