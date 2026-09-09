/**
 * Paylaşılan domain — rol bağımsız erişilen kaynaklar.
 * Sorumluluk: duyurular, portal içerik ve mesajlaşma merkezi.
 */
import { adaptIdentity } from "./adapters";
import { apiRequest } from "./client";
import { endpoints } from "./endpoints";
import type {
  Announcement,
  CampusEvent,
  CafeteriaMenu,
  FacultyStaffMember,
  FeaturedItem,
  HospitalPlace,
  Message,
  PortalAnnouncement,
  SendMessageInput,
} from "./types";

export async function fetchAnnouncements(): Promise<Announcement[]> {
  return adaptIdentity(
    await apiRequest<Announcement[]>(endpoints.announcements, {}),
  );
}

export async function fetchPortalAnnouncements(): Promise<PortalAnnouncement[]> {
  return adaptIdentity(
    await apiRequest<PortalAnnouncement[]>(endpoints.portalAnnouncements, {}),
  );
}

export async function fetchCampusEvents(): Promise<CampusEvent[]> {
  return adaptIdentity(
    await apiRequest<CampusEvent[]>(endpoints.campusEvents, {}),
  );
}

export async function fetchCafeteriaWeek(): Promise<CafeteriaMenu[]> {
  return adaptIdentity(
    await apiRequest<CafeteriaMenu[]>(endpoints.cafeteriaWeek, {}),
  );
}

export async function fetchCafeteriaToday(): Promise<CafeteriaMenu | null> {
  return adaptIdentity(
    await apiRequest<CafeteriaMenu | null>(endpoints.cafeteriaToday, {}),
  );
}

export async function fetchHospitalPlaces(): Promise<HospitalPlace[]> {
  return adaptIdentity(
    await apiRequest<HospitalPlace[]>(endpoints.hospitalPlaces, {}),
  );
}

export async function fetchFacultyDirectory(): Promise<FacultyStaffMember[]> {
  return adaptIdentity(
    await apiRequest<FacultyStaffMember[]>(endpoints.facultyDirectory, {}),
  );
}

/** Landing öne çıkanlar — görselli haber/etkinlik/duyuru, tarihe göre */
export async function fetchFeaturedItems(limit = 6): Promise<FeaturedItem[]> {
  return adaptIdentity(
    await apiRequest<FeaturedItem[]>(
      `${endpoints.portalFeatured}?limit=${limit}`,
      {},
    ),
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
