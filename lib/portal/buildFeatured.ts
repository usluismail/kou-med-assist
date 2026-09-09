/**
 * Öne çıkanlar — haber + etkinlik + duyuru birleşimi.
 * Görseli olanlar, tarihe göre azalan; ilk `limit` öğe.
 */
import type { FeaturedItem } from "@/lib/api/types";
import {
  LIVE_CAMPUS_EVENTS,
  LIVE_PORTAL_ANNOUNCEMENTS,
} from "@/lib/portal/liveFallbacks";

/** Canlı haber vitrini (API yoksa) — görseller FeaturedScroll LOCAL_IMAGES */
const LIVE_NEWS: FeaturedItem[] = [
  {
    id: "news-1",
    title: "Dikey Entegrasyon Çalışma Grubu Toplantısı",
    publishedAt: "2026-09-03",
    sourceUrl:
      "https://tip.kocaeli.edu.tr/haberler/dikey-entegrasyon-calisma-grubu-toplantisi-4d3",
    source: "news",
    badge: "HABER",
    summary: "Dikey Entegrasyon Çalışma Grubu Toplantısı",
    imageUrl: "/featured/featured-1.jpg",
  },
  {
    id: "news-2",
    title: "KOÜ Kalplerimize Dokunuyor...",
    publishedAt: "2026-07-16",
    sourceUrl: "https://tip.kocaeli.edu.tr/haberler/kou-kalplerimize-dokunuyor-752",
    source: "news",
    badge: "HABER",
    summary: "KOÜ Kalplerimize Dokunuyor...",
    imageUrl: "/featured/featured-2.jpg",
  },
  {
    id: "news-3",
    title:
      "Fakültemiz Öğretim Üyeleri Uluslararası FAIMER Enstitüsü (IFI) Programından Mezun Oldu",
    publishedAt: "2026-07-10",
    sourceUrl:
      "https://tip.kocaeli.edu.tr/haberler/fakultemiz-ogretim-uyeleri-uluslararasi-faimer-enstitusu-ifi-programindan-mezun-oldu-450",
    source: "news",
    badge: "HABER",
    summary:
      "Fakültemiz Öğretim Üyeleri Uluslararası FAIMER Enstitüsü (IFI) Programından Mezun Oldu",
    imageUrl: "/featured/featured-3.png",
  },
  {
    id: "news-4",
    title: "Fakültemiz Çocuk Cerrahisi Anabilim Dalı Akreditasyon Onayı",
    publishedAt: "2026-07-09",
    sourceUrl:
      "https://tip.kocaeli.edu.tr/haberler/fakultemiz-cocuk-cerrahisi-anabilim-dali-akreditasyon-onayi-035",
    source: "news",
    badge: "HABER",
    summary: "Fakültemiz Çocuk Cerrahisi Anabilim Dalı Akreditasyon Onayı",
    imageUrl: "/featured/featured-4.jpg",
  },
  {
    id: "news-5",
    title: "KOÜSİM Yönetim Kurulu Toplantısı Yapıldı",
    publishedAt: "2026-07-07",
    sourceUrl:
      "https://tip.kocaeli.edu.tr/haberler/kousim-yonetim-kurulu-toplantisi-yapildi-fd3",
    source: "news",
    badge: "HABER",
    summary: "KOÜSİM Yönetim Kurulu Toplantısı Yapıldı",
    imageUrl: "/featured/featured-5.jpg",
  },
  {
    id: "news-6",
    title: "2026–2027 İntörn Uyum Programı Gerçekleştirildi",
    publishedAt: "2026-07-01",
    sourceUrl:
      "https://tip.kocaeli.edu.tr/haberler/20262027-intorn-uyum-programi-gerceklestirildi-274",
    source: "news",
    badge: "HABER",
    summary: "2026–2027 İntörn Uyum Programı Gerçekleştirildi",
    imageUrl: "/featured/featured-6.jpg",
  },
];

export function buildFeaturedPool(limit = 6): FeaturedItem[] {
  const pool: FeaturedItem[] = [];

  for (const n of LIVE_NEWS) {
    if (!n.imageUrl) continue;
    pool.push(n);
  }

  for (const ev of LIVE_CAMPUS_EVENTS) {
    if (!ev.imageUrl) continue;
    pool.push({
      id: ev.id,
      title: ev.title,
      publishedAt: ev.dateIso,
      sourceUrl: "https://tip.kocaeli.edu.tr",
      source: "event",
      badge: "ETKİNLİK",
      summary: ev.description || null,
      imageUrl: ev.imageUrl,
    });
  }

  for (const ann of LIVE_PORTAL_ANNOUNCEMENTS) {
    if (!ann.imageUrl) continue;
    pool.push({
      id: ann.id,
      title: ann.title,
      publishedAt: ann.dateIso,
      sourceUrl: ann.pdfUrl || ann.sourceUrl || "https://tip.kocaeli.edu.tr/duyurular",
      source: "announcement",
      badge: "DUYURU",
      summary: ann.summary || null,
      imageUrl: ann.imageUrl,
    });
  }

  return pool
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .slice(0, limit);
}
