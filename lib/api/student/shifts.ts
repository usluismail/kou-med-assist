/**
 * Öğrenci — Nöbet & Takas domain.
 * Sorumluluk: nöbet listesi ve takas talepleri.
 */
import { adaptIdentity } from "../adapters";
import { apiRequest } from "../client";
import { endpoints } from "../endpoints";
import type { Shift, SwapRequest } from "../types";

export async function fetchShifts(token: string): Promise<Shift[]> {
  return adaptIdentity(
    await apiRequest<Shift[]>(endpoints.studentShifts, { token }),
  );
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
