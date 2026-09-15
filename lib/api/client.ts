import Constants from "expo-constants";
import type { ApiErrorBody } from "./types";

const DEFAULT_TIMEOUT_MS = 10000;

/**
 * Expo --lan ile açıldığında hostUri makine IP’sini verir.
 * Telefon / simülatör aynı ağdaysa mock-server’a ulaşır.
 */
export function getApiBaseUrl(): string {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL.replace(/\/$/, "");
  }

  const hostUri = Constants.expoConfig?.hostUri;
  const host = hostUri?.split(":")[0];
  if (host && host !== "localhost" && host !== "127.0.0.1") {
    return `http://${host}:3001`;
  }

  return "http://localhost:3001";
}

export class ApiError extends Error {
  status: number;
  body: ApiErrorBody | null;

  constructor(status: number, message: string, body: ApiErrorBody | null = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  token?: string | null;
  signal?: AbortSignal;
  timeoutMs?: number;
};

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body, token, timeoutMs = DEFAULT_TIMEOUT_MS } = options;
  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const base = getApiBaseUrl();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  if (options.signal) {
    if (options.signal.aborted) controller.abort();
    else {
      options.signal.addEventListener("abort", () => controller.abort(), {
        once: true,
      });
    }
  }

  let res: Response;
  try {
    res = await fetch(`${base}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch (e) {
    const aborted =
      (e instanceof Error && e.name === "AbortError") || controller.signal.aborted;
    throw new ApiError(
      0,
      aborted
        ? `İstek zaman aşımı (${base}). mock-server çalışıyor mu?`
        : `Sunucuya ulaşılamadı (${base}). Ayrı terminalde: npm run mock`,
    );
  } finally {
    clearTimeout(timer);
  }

  const text = await res.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!res.ok) {
    const errBody = (data ?? null) as ApiErrorBody | null;
    throw new ApiError(
      res.status,
      errBody?.message || `İstek başarısız (${res.status})`,
      errBody,
    );
  }

  return data as T;
}
