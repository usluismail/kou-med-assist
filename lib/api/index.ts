import { adaptIdentity } from "./adapters";
import { apiRequest } from "./client";
import { endpoints } from "./endpoints";
import {
  clearSession,
  getStoredToken,
  getStoredUser,
  persistSession,
} from "./storage";
import type {
  Colleague,
  CreateLogInput,
  CreateLogResponse,
  LoginResponse,
  LogEntry,
  PendingApproval,
  ProcedureProgress,
  Shift,
  StudentDashboard,
  Supervisor,
  SwapRequest,
  User,
  UserRole,
} from "./types";

export { clearSession, getStoredToken, getStoredUser, persistSession };

export async function login(params: {
  email: string;
  password: string;
  role: UserRole;
}): Promise<LoginResponse> {
  const data = await apiRequest<LoginResponse>(endpoints.login, {
    method: "POST",
    body: params,
  });
  const adapted = adaptIdentity(data);
  await persistSession(adapted.token, adapted.user);
  return adapted;
}

export async function fetchMe(token: string): Promise<User> {
  return adaptIdentity(await apiRequest<User>(endpoints.me, { token }));
}

export async function fetchStudentDashboard(token: string): Promise<StudentDashboard> {
  return adaptIdentity(
    await apiRequest<StudentDashboard>(endpoints.studentDashboard, { token }),
  );
}

export async function fetchProcedures(token: string): Promise<ProcedureProgress[]> {
  return adaptIdentity(
    await apiRequest<ProcedureProgress[]>(endpoints.studentProcedures, { token }),
  );
}

export async function fetchLogs(token: string): Promise<LogEntry[]> {
  return adaptIdentity(await apiRequest<LogEntry[]>(endpoints.studentLogs, { token }));
}

export async function createLog(
  token: string,
  input: CreateLogInput,
): Promise<CreateLogResponse> {
  return adaptIdentity(
    await apiRequest<CreateLogResponse>(endpoints.studentLogs, {
      method: "POST",
      token,
      body: input,
    }),
  );
}

export async function fetchShifts(token: string): Promise<Shift[]> {
  return adaptIdentity(await apiRequest<Shift[]>(endpoints.studentShifts, { token }));
}

export async function requestShiftSwap(
  token: string,
  shiftId: string,
  body: { colleagueId: string; note?: string },
): Promise<SwapRequest> {
  return adaptIdentity(
    await apiRequest<SwapRequest>(endpoints.studentShiftSwap(shiftId), {
      method: "POST",
      token,
      body,
    }),
  );
}

export async function fetchSupervisors(token: string): Promise<Supervisor[]> {
  return adaptIdentity(
    await apiRequest<Supervisor[]>(endpoints.studentSupervisors, { token }),
  );
}

export async function fetchColleagues(token: string): Promise<Colleague[]> {
  return adaptIdentity(
    await apiRequest<Colleague[]>(endpoints.studentColleagues, { token }),
  );
}

export async function fetchPendingApprovals(token: string): Promise<PendingApproval[]> {
  return adaptIdentity(
    await apiRequest<PendingApproval[]>(endpoints.facultyPendingApprovals, {
      token,
    }),
  );
}

export async function approveLog(
  token: string,
  id: string,
  body?: { note?: string; voiceNoteUrl?: string },
): Promise<LogEntry> {
  return adaptIdentity(
    await apiRequest<LogEntry>(endpoints.facultyApprove(id), {
      method: "POST",
      token,
      body: body ?? {},
    }),
  );
}

export async function requestRevision(
  token: string,
  id: string,
  note: string,
): Promise<LogEntry> {
  return adaptIdentity(
    await apiRequest<LogEntry>(endpoints.facultyRequestRevision(id), {
      method: "POST",
      token,
      body: { note },
    }),
  );
}

export async function validateQrPayload(
  token: string,
  qrPayload: string,
): Promise<PendingApproval | { status: "invalid"; message?: string }> {
  return adaptIdentity(
    await apiRequest(endpoints.facultyQr, {
      method: "POST",
      token,
      body: { qrPayload },
    }),
  );
}
