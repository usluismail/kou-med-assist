/**
 * Öğrenci — Logbook domain.
 * Sorumluluk: girişim logları, prosedürler, süpervizörler, meslektaşlar.
 */
import { adaptIdentity } from "../adapters";
import { apiRequest } from "../client";
import { endpoints } from "../endpoints";
import type {
  Colleague,
  CreateLogInput,
  CreateLogResponse,
  LogEntry,
  ProcedureProgress,
  Supervisor,
} from "../types";

export async function fetchLogs(token: string): Promise<LogEntry[]> {
  return adaptIdentity(
    await apiRequest<LogEntry[]>(endpoints.studentLogs, { token }),
  );
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

export async function fetchProcedures(
  token: string,
): Promise<ProcedureProgress[]> {
  return adaptIdentity(
    await apiRequest<ProcedureProgress[]>(endpoints.studentProcedures, {
      token,
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
