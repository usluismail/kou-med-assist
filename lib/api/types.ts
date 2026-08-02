/** Domain types — UI ve mock API ortak sözleşmesi */

export type UserRole = "student" | "faculty";

export type LogRole = "observed" | "assisted" | "performed";
export type LogStatus = "pending" | "approved" | "revision_requested";
export type AgeGroup = "child" | "adult" | "geriatric";
export type Sex = "f" | "m" | "other";
export type ShiftState = "completed" | "upcoming" | "night";

export type User = {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  studentNo?: string;
  department: string;
  rotation?: string;
  faculty: string;
  initials: string;
};

export type LoginResponse = {
  token: string;
  user: User;
};

export type ProcedureProgress = {
  id: string;
  name: string;
  done: number;
  total: number;
};

export type LogEntry = {
  id: string;
  encounterId: string;
  procedureId: string;
  procedureName: string;
  date: string;
  role: LogRole;
  supervisorId: string;
  supervisorName: string;
  status: LogStatus;
  studentId: string;
  ageGroup: AgeGroup;
  sex: Sex;
};

export type Shift = {
  id: string;
  day: number;
  label: string;
  time: string;
  area: string;
  state: ShiftState;
  partners: string[];
  studentId: string;
};

export type Supervisor = {
  id: string;
  name: string;
};

export type Colleague = {
  id: string;
  name: string;
};

export type PendingApproval = {
  id: string;
  encounterId: string;
  studentId: string;
  studentName: string;
  procedureName: string;
  submittedAt: string;
};

export type StudentDashboard = {
  student: User;
  rotation: string;
  ucepProgress: { done: number; total: number; percent: number };
  upcomingShift: Shift | null;
  logSummary: { approved: number; pending: number; total: number };
};

export type ApprovalMethod = "push" | "qr";

export type CreateLogInput = {
  procedureId: string;
  encounterId: string;
  ageGroup: AgeGroup;
  sex: Sex;
  role: LogRole;
  supervisorId: string;
  approvalMethod: ApprovalMethod;
};

export type CreateLogResponse = LogEntry & {
  qrPayload: string | null;
};

export type SwapRequest = {
  id: string;
  shiftId: string;
  studentId: string;
  colleagueId: string;
  colleagueName: string;
  note: string | null;
  dutyHoursOk: boolean;
  createdAt: string;
  status: string;
};

export type ApiErrorBody = {
  error?: string;
  message?: string;
  status?: string;
};
