import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthContext";
import { ApiError } from "./client";
import {
  fetchColleagues,
  fetchLogs,
  fetchOsceSessions,
  fetchOsceStation,
  fetchPendingApprovals,
  fetchProcedures,
  fetchShifts,
  fetchStudentDashboard,
  fetchSupervisors,
  fetchSchedule,
  fetchAdvisor,
  fetchGrades,
  fetchAnnouncements,
} from "./index";
import type {
  Advisor,
  Announcement,
  Colleague,
  Lesson,
  LogEntry,
  OsceSession,
  OsceStation,
  PendingApproval,
  ProcedureProgress,
  Shift,
  StudentDashboard,
  StudentGrades,
  Supervisor,
} from "./types";

type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
};

function useAuthedResource<T>(
  loader: (token: string) => Promise<T>,
  enabled = true,
): AsyncState<T> {
  const { token, logout, ready } = useAuth();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const loaderRef = useRef(loader);
  loaderRef.current = loader;
  const logoutRef = useRef(logout);
  logoutRef.current = logout;

  const reload = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    if (!ready) return;

    if (!enabled || !token) {
      setLoading(false);
      if (!token) {
        setData(null);
      }
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    loaderRef
      .current(token)
      .then((res) => {
        if (!cancelled) {
          setData(res);
          setLoading(false);
        }
      })
      .catch(async (e: unknown) => {
        if (cancelled) return;
        if (e instanceof ApiError && e.status === 401) {
          setLoading(false);
          setError("Oturum geçersiz — tekrar giriş yapın");
          await logoutRef.current();
          return;
        }
        setError(e instanceof Error ? e.message : "Veri yüklenemedi");
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [token, enabled, tick, ready]);

  return { data, loading, error, reload };
}

// Public (auth gerektirmeyen) kaynak hook'u
function usePublicResource<T>(loader: () => Promise<T>): AsyncState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const loaderRef = useRef(loader);
  loaderRef.current = loader;
  const reload = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    loaderRef.current().then((res) => {
      if (!cancelled) { setData(res); setLoading(false); }
    }).catch((e: unknown) => {
      if (!cancelled) {
        setError(e instanceof Error ? e.message : "Yüklenemedi");
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [tick]);

  return { data, loading, error, reload };
}

// ── Dönem 6 / Logbook hooks ──

export function useStudentDashboard(enabled = true): AsyncState<StudentDashboard> {
  return useAuthedResource(fetchStudentDashboard, enabled);
}

export function useLogs(enabled = true): AsyncState<LogEntry[]> {
  return useAuthedResource(fetchLogs, enabled);
}

export function useProcedures(enabled = true): AsyncState<ProcedureProgress[]> {
  return useAuthedResource(fetchProcedures, enabled);
}

export function useShifts(enabled = true): AsyncState<Shift[]> {
  return useAuthedResource(fetchShifts, enabled);
}

export function useSupervisors(enabled = true): AsyncState<Supervisor[]> {
  return useAuthedResource(fetchSupervisors, enabled);
}

export function useColleagues(enabled = true): AsyncState<Colleague[]> {
  return useAuthedResource(fetchColleagues, enabled);
}

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
    (token: string) => fetchOsceStation(token, stationId),
    [stationId],
  );
  return useAuthedResource(loader, enabled && !!stationId);
}

// ── Pre-Klinik (Dönem 1-3) hooks ──

export function useSchedule(enabled = true): AsyncState<Lesson[]> {
  return useAuthedResource(fetchSchedule, enabled);
}

export function useAdvisor(enabled = true): AsyncState<Advisor> {
  return useAuthedResource(fetchAdvisor, enabled);
}

export function useGrades(enabled = true): AsyncState<StudentGrades> {
  return useAuthedResource(fetchGrades, enabled);
}

export function useAnnouncements(): AsyncState<Announcement[]> {
  return usePublicResource(fetchAnnouncements);
}
