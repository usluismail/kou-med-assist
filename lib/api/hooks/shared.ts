/**
 * hooks/shared.ts — Rol bağımsız (paylaşılan) hook'lar.
 *
 * SRP: Duyurular ve mesajlaşma merkezi hook'ları.
 */
import { fetchAnnouncements, fetchMessages } from "../index";
import { useAuthedResource, usePublicResource } from "./core";
import type { AsyncState } from "./core";
import type { Announcement, Message } from "../types";

/** Auth gerektirmeyen duyuru listesi */
export function useAnnouncements(): AsyncState<Announcement[]> {
  return usePublicResource(fetchAnnouncements);
}

/** Auth gerektiren mesaj listesi */
export function useMessages(enabled = true): AsyncState<Message[]> {
  return useAuthedResource(fetchMessages, enabled);
}
