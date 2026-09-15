/**
 * hooks/core.ts — Temel hook altyapısı.
 *
 * SRP: Bu dosya yalnızca hook çekirdek mekanizmasını içerir.
 *      useAuthedResource, usePublicResource, useAuthedFetch ve
 *      generic useMutation buradadır.
 *
 * DIP: loader fonksiyonu dışarıdan enjekte edilir; hook içinde fetch yok.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../AuthContext";
import { ApiError } from "../client";

// ─── Paylaşılan tipler ────────────────────────────────────────────────────────

export type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
};

export type MutationResult<TInput, TOutput> = {
  submit: (input: TInput) => Promise<TOutput>;
  loading: boolean;
  error: string | null;
  reset: () => void;
};

// ─── Kimlik doğrulama gerektiren kaynak hook'u ────────────────────────────────

export function useAuthedResource<T>(
  loader: (token: string) => Promise<T>,
  enabled = true,
): AsyncState<T> {
  const { token, logout, ready } = useAuth();
  const [data, setData]       = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [tick, setTick]       = useState(0);
  const loaderRef  = useRef(loader);
  loaderRef.current = loader;
  const logoutRef  = useRef(logout);
  logoutRef.current = logout;

  const reload = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    if (!ready) return;
    if (!enabled || !token) {
      setLoading(false);
      if (!token) setData(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    loaderRef
      .current(token)
      .then((res) => {
        if (!cancelled) { setData(res); setLoading(false); }
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

    return () => { cancelled = true; };
  }, [token, enabled, tick, ready]);

  return { data, loading, error, reload };
}

// ─── Kimlik doğrulama gerektirmeyen kaynak hook'u ─────────────────────────────

export function usePublicResource<T>(loader: () => Promise<T>): AsyncState<T> {
  const [data, setData]       = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [tick, setTick]       = useState(0);
  const loaderRef = useRef(loader);
  loaderRef.current = loader;
  const reload = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    loaderRef.current()
      .then((res) => {
        if (!cancelled) { setData(res); setLoading(false); }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Yüklenemedi");
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, [tick]);

  return { data, loading, error, reload };
}

/**
 * useAuthedFetch — genel amaçlı generic query hook.
 * KlinikApp gibi bileşenlerde doğrudan fetch fonksiyonu ile kullanılabilir.
 */
export function useAuthedFetch<T>(
  loader: (token: string) => Promise<T>,
  enabled = true,
): AsyncState<T> {
  return useAuthedResource(loader, enabled);
}

// ─── Generic Mutation Hook ────────────────────────────────────────────────────

/**
 * useMutation — ISP & DRY iyileştirmesi.
 *
 * useCreateLog, useApproveLog, useSendAnnouncement gibi hook'ların
 * tekrar eden loading/error/reset boilerplate'ini ortadan kaldırır.
 *
 * DIP: fn parametresi dışarıdan enjekte edilir; hook içinde API bağımlılığı yok.
 *
 * @param fn      token + input alıp Promise<TOutput> döndüren async fonksiyon
 * @param errorFallback  yakalanan hata Error olmadığında kullanılacak mesaj
 */
export function useMutation<TInput, TOutput>(
  fn: (token: string, input: TInput) => Promise<TOutput>,
  errorFallback = "İşlem başarısız",
): MutationResult<TInput, TOutput> {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const fnRef = useRef(fn);
  fnRef.current = fn;

  const reset = useCallback(() => setError(null), []);

  const submit = useCallback(
    async (input: TInput): Promise<TOutput> => {
      if (!token) throw new Error("Oturum bulunamadı");
      setLoading(true);
      setError(null);
      try {
        return await fnRef.current(token, input);
      } catch (e) {
        const msg = e instanceof Error ? e.message : errorFallback;
        setError(msg);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [token],
  );

  return { submit, loading, error, reset };
}
