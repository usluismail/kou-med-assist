/**
 * Oturum saklama — yalnızca bellek.
 * AsyncStorage native modülü Expo Go’da patladığı için kullanılmıyor.
 * (Uygulama kapanınca oturum sıfırlanır; geliştirme için yeterli.)
 */
import type { User } from "./types";

const TOKEN_KEY = "kou_med_token";
const USER_KEY = "kou_med_user";

const memory = new Map<string, string>();

export async function getStoredToken(): Promise<string | null> {
  return memory.get(TOKEN_KEY) ?? null;
}

export async function getStoredUser(): Promise<User | null> {
  const raw = memory.get(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export async function persistSession(token: string, user: User): Promise<void> {
  memory.set(TOKEN_KEY, token);
  memory.set(USER_KEY, JSON.stringify(user));
}

export async function clearSession(): Promise<void> {
  memory.delete(TOKEN_KEY);
  memory.delete(USER_KEY);
}
