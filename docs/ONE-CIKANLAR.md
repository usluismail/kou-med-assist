# Öne Çıkanlar — Veri Akışı

Landing’deki **Öne çıkanlar** vitrini, fakülte gündeminin görsel öncelikli
gösterimidir: **haber + etkinlik + duyuru** karışık akış.

## Şu anki davranış

| Alan | Değer |
|------|--------|
| Kaynak havuzları | Haber (`featuredItems`) · Etkinlik (`campusEvents`) · Duyuru (`portalAnnouncements`) |
| Filtre | Yalnızca **görseli olan** öğeler |
| Sıra | `publishedAt` / `dateIso` azalan |
| Adet | İlk **6** |
| UI | Yatay poster carousel — ekranda ~1 kart + sağda peek |
| API (app) | `GET /portal/featured?limit=6` |
| Auth | Gerekmez (portal / pre-login) |

Badge: `HABER` · `ETKİNLİK` · `DUYURU`  
CTA: kaynağa göre “Haberi aç” / “Etkinliği aç” / “Duyuruyu aç”

### Mock birleştirme

`mock-server` route üç havuzu birleştirir, görselsizleri atar, tarihe göre keser.
İstemci fallback: `lib/portal/buildFeatured.ts` → aynı kural.

## İlerleyen dönem — `öne çıkar` etiketi

Akademik / dekanlık ekranından yetkili kullanıcı; haber, etkinlik veya duyuruyu
**öne çıkar** olarak işaretleyebilir.

### Öncelik sırası (backend çözer)

1. Dekanlık / yetkili `featured=true` seçimleri
2. Büyük etkinlik haftası afişleri (opsiyonel)
3. Görselli haber + etkinlik + duyuru, tarihe göre (varsayılan N=6)
4. Fallback: kampüs foto + sabit slogan

İstemci sadece `GET /portal/featured` sonucunu basar.

### Ortak kart modeli

```ts
type FeaturedItem = {
  id: string;
  title: string;
  publishedAt: string;      // ISO date
  imageUrl: string | null;
  sourceUrl: string | null;
  source: "news" | "event" | "announcement" | "editorial" | "fallback";
  badge: string;            // HABER | ETKİNLİK | DUYURU | …
  summary?: string;
};
```

## İlgili dosyalar

- `docs/ONE-CIKANLAR.md` (bu dosya)
- `mock-server/src/routes.js` → `GET /portal/featured`
- `lib/portal/buildFeatured.ts`
- `lib/api/types.ts` → `FeaturedItem`
- `components/landing/FeaturedScroll.tsx`
