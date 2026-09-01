/**
 * hooks/faculty.ts — Akademisyen domain hook'ları.
 *
 * SRP: Yalnızca onay, OSCE ve duyuru hook'ları.
 * DIP: approveLog, requestRevision doğrudan import edilmez.
 */
import { useCallback } from "react";
import {
  fetchPendingApprovals,
  fetchOsceSessions,
  approveLog,
  requestRevision,
} from "../index";
import { fetchOsceStation as fetchFacultyOsceStation } from "../faculty";
import { apiRequest } from "../client";
import { endpoints } from "../endpoints";
import { useAuthedResource, useMutation } from "./core";
import type { AsyncState, MutationResult } from "./core";
import type {
  Announcement,
  CreateAnnouncementInput,
  LogEntry,
  OsceSession,
  OsceStation,
  PendingApproval,
} from "../types";

export function usePendingApprovals(enabled = true): AsyncState<PendingApproval[]> {
  return useAuthedResource(fetchPendingApprovals, enabled);
}

export function useOsceSessions(enabled = true): AsyncState<OsceSession[]> {
  return useAuthedResource(fetchOsceSessions, enabled);
}

export function useOsceStation(
  stationId: string,
  enabled = true,
): AsyncState<OsceStation> {
  const loader = useCallback(
    (token: string) => fetchFacultyOsceStation(token, stationId),
    [stationId],
  );
  return useAuthedResource(loader, enabled && !!stationId);
}

/**
 * useApproveLog — DIP uygular.
 * ApprovalCard direkt approveLog import etmez; bu hook üzerinden erişir.
 */
export function useApproveLog(): {
  approve: (id: string, body?: { note?: string; voiceNoteUrl?: string }) => Promise<LogEntry>;
  loading: boolean;
  error: string | null;
  reset: () => void;
} {
  const fn = useCallback(
    (token: string, args: { id: string; body?: { note?: string; voiceNoteUrl?: string } }) =>
      approveLog(token, args.id, args.body),
    [],
  );
  const { submit, loading, error, reset } = useMutation(fn, "Onay başarısız");
  const approve = useCallback(
    (id: string, body?: { note?: string; voiceNoteUrl?: string }) =>
      submit({ id, body }),
    [submit],
  );
  return { approve, loading, error, reset };
}

/**
 * useRequestRevision — DIP uygular.
 * ApprovalCard direkt requestRevision import etmez; bu hook üzerinden erişir.
 */
export function useRequestRevision(): {
  request: (id: string, note: string) => Promise<LogEntry>;
  loading: boolean;
  error: string | null;
  reset: () => void;
} {
  const fn = useCallback(
    (token: string, args: { id: string; note: string }) =>
      requestRevision(token, args.id, args.note),
    [],
  );
  const { submit, loading, error, reset } = useMutation(fn, "Düzeltme isteği başarısız");
  const request = useCallback(
    (id: string, note: string) => submit({ id, note }),
    [submit],
  );
  return { request, loading, error, reset };
}

/**
 * useFacultyAnnouncements — DIP uygular.
 * AnnouncementConsole akademisyen duyuru geçmişini bu hook üzerinden çeker.
 */
export function useFacultyAnnouncements(deps?: unknown): AsyncState<Announcement[]> {
  const loader = useCallback(
    (t: string) =>
      apiRequest<Announcement[]>(endpoints.facultyAnnouncements, { token: t }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [deps],
  );
  return useAuthedResource(loader);
}

/**
 * useSendAnnouncement — DIP uygular.
 * AnnouncementConsole direkt apiRequest çağırmaz; bu hook üzerinden gönderir.
 */
export function useSendAnnouncement(): MutationResult<CreateAnnouncementInput, Announcement> {
  const fn = useCallback(
    (token: string, input: CreateAnnouncementInput) =>
      apiRequest<Announcement>(endpoints.facultyAnnouncements, {
        method: "POST",
        token,
        body: input,
      }),
    [],
  );
  return useMutation(fn, "Gönderilemedi");
}
