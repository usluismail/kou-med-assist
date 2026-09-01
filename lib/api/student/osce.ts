/**
 * Öğrenci — OSCE domain.
 * Sorumluluk: OSCE sınav oturumları ve istasyon değerlendirme.
 */
import { adaptIdentity } from "../adapters";
import { adaptOsceStation } from "../adapters";
import { apiRequest } from "../client";
import { endpoints } from "../endpoints";
import type {
  OsceScore,
  OsceScoreInput,
  OsceSession,
  OsceStation,
} from "../types";

export async function fetchOsceSessions(
  token: string,
): Promise<OsceSession[]> {
  return adaptIdentity(
    await apiRequest<OsceSession[]>(endpoints.studentOsceSessions, { token }),
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
