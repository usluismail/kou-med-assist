/**
 * Auth domain — giriş ve kimlik doğrulama işlemleri.
 * Sorumluluk: yalnızca auth endpoint'leriyle konuşmak.
 */
import { adaptIdentity } from "./adapters";
import { apiRequest } from "./client";
import { endpoints } from "./endpoints";
import { persistSession } from "./storage";
import type { LoginResponse, User, UserRole } from "./types";

export async function login(params: {
  email: string;
  password: string;
  role: UserRole;
}): Promise<LoginResponse> {
  const data = await apiRequest<LoginResponse>(endpoints.login, {
    method: "POST",
    body: params,
  });
  const adapted = adaptIdentity(data);
  await persistSession(adapted.token, adapted.user);
  return adapted;
}

export async function fetchMe(token: string): Promise<User> {
  return adaptIdentity(await apiRequest<User>(endpoints.me, { token }));
}
