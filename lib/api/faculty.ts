/**
 * Akademisyen domain — onay ve OSCE değerlendirme işlemleri.
 * Sorumluluk: bekleyen onaylar, log kabul/revizyon, QR doğrulama, OSCE.
 */
import { adaptIdentity } from "./adapters";
import { adaptOsceStation } from "./adapters";
import { apiRequest } from "./client";
import { endpoints } from "./endpoints";
import type {
  LogEntry,
  OsceScore,
  OsceScoreInput,
  OsceStation,
  PendingApproval,
} from "./types";

export async function fetchPendingApprovals(
  token: string,
): Promise<PendingApproval[]> {
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

export async function fetchOsceStation(
  token: string,
  stationId: string,
): Promise<OsceStation> {
  const raw = await apiRequest<OsceStation>(
    endpoints.facultyOsceStation(stationId),
    { token },
  );
  return adaptOsceStation(raw);
}

export async function submitOsceScore(
  token: string,
  input: OsceScoreInput,
): Promise<OsceScore> {
  return adaptIdentity(
    await apiRequest<OsceScore>(endpoints.facultyOsceScores, {
      method: "POST",
      token,
      body: input,
    }),
  );
}
