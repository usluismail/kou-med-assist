/**
 * Oturum saklama — MemoryStorage implementasyonu.
 *
 * IStorage interface'ini implement eder; gelecekte AsyncStorage veya
 * SecureStore'a geçmek için yalnızca bu dosyayı değiştirmek yeterli.
 *
 * Not: AsyncStorage native modülü Expo Go'da patladığı için in-memory
 * kullanılıyor. Uygulama kapanınca oturum sıfırlanır (geliştirme yeterli).
 */
import type { IStorage } from "./storage.interface";
import type { User } from "./types";

const TOKEN_KEY = "kou_med_token";
const USER_KEY  = "kou_med_user";

/**
 * MemoryStorage — IStorage'ın in-memory implementasyonu.
 * Test ortamlarında kolayca mock edilebilir.
 */
export class MemoryStorage implements IStorage {
  private readonly store = new Map<string, string>();

  async getToken(): Promise<string | null> {
    return this.store.get(TOKEN_KEY) ?? null;
  }

  async getUser(): Promise<User | null> {
    const raw = this.store.get(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }

  async persist(token: string, user: User): Promise<void> {
    this.store.set(TOKEN_KEY, token);
    this.store.set(USER_KEY, JSON.stringify(user));
  }

  async clear(): Promise<void> {
    this.store.delete(TOKEN_KEY);
    this.store.delete(USER_KEY);
  }
}

/** Uygulama genelinde kullanılan singleton storage instance */
export const appStorage: IStorage = new MemoryStorage();

// ─── Geriye dönük uyumluluk (mevcut import'lar kırılmasın) ──────────────────

export async function getStoredToken(): Promise<string | null> {
  return appStorage.getToken();
}

export async function getStoredUser(): Promise<User | null> {
  return appStorage.getUser();
}

export async function persistSession(token: string, user: User): Promise<void> {
  return appStorage.persist(token, user);
}

export async function clearSession(): Promise<void> {
  return appStorage.clear();
}
