/**
 * Paylaşılan domain — rol bağımsız erişilen kaynaklar.
 * Sorumluluk: duyurular ve mesajlaşma merkezi.
 */
import { adaptIdentity } from "./adapters";
import { apiRequest } from "./client";
import { endpoints } from "./endpoints";
import type { Announcement, Message, SendMessageInput } from "./types";

export async function fetchAnnouncements(): Promise<Announcement[]> {
  return adaptIdentity(
    await apiRequest<Announcement[]>(endpoints.announcements, {}),
  );
}

export async function fetchMessages(token: string): Promise<Message[]> {
  return adaptIdentity(
    await apiRequest<Message[]>(endpoints.messages, { token }),
  );
}

export async function sendMessage(
  token: string,
  payload: SendMessageInput,
): Promise<Message> {
  return adaptIdentity(
    await apiRequest<Message>(endpoints.sendMessage, {
      method: "POST",
      token,
      body: payload,
    }),
  );
}
