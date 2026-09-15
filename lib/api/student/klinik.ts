/**
 * Öğrenci — Klinik Staj domain (Dönem 4-5).
 * Sorumluluk: staj bloğu bilgisi ve klinik seans takvimi.
 */
import { adaptIdentity } from "../adapters";
import { apiRequest } from "../client";
import { endpoints } from "../endpoints";
import type { ClinicalScheduleDay, InternshipBlock } from "../types";

export async function fetchInternship(
  token: string,
): Promise<InternshipBlock> {
  return adaptIdentity(
    await apiRequest<InternshipBlock>(endpoints.studentInternship, { token }),
  );
}

export async function fetchClinicalSchedule(
  token: string,
): Promise<ClinicalScheduleDay[]> {
  return adaptIdentity(
    await apiRequest<ClinicalScheduleDay[]>(
      endpoints.studentClinicalSchedule,
      { token },
    ),
  );
}
