/**
 * IStorage — oturum saklama sözleşmesi.
 *
 * OCP: Yeni bir storage implementasyonu (örn. AsyncStorage, SecureStore)
 *      eklenirken bu interface dışındaki hiçbir dosya değişmez.
 *
 * DIP: auth.ts ve AuthContext sadece bu interface'e bağımlıdır;
 *      somut implementasyona değil.
 */
import type { User } from "./types";

export interface IStorage {
  getToken(): Promise<string | null>;
  getUser(): Promise<User | null>;
  persist(token: string, user: User): Promise<void>;
  clear(): Promise<void>;
}
