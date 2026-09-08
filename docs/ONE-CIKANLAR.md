# Öne Çıkanlar — Veri Akışı

Landing’deki **Öne çıkanlar** vitrini, KOÜ Tıp Fakültesi haber/etkinlik içeriğinin
görsel öncelikli gösterimidir. Duyurular listesinden ayrı tutulur.

## Şu anki (MVP) davranış

| Alan | Değer |
|------|--------|
| Kaynak | KOÜ merkezi API → Tıp Fakültesi ISP `code=1019` (`tip.kocaeli.edu.tr`) |
| Adet | **Son 6** haber |
| UI | Yatay poster carousel — ekranda ~1 kart + sağda peek |
| API (app) | `GET /portal/featured?limit=6` |
| Auth | Gerekmez (portal / pre-login) |

### Canlı haber çekimi

Sayfa HTML’i SSR’da 404 gösterebilir; asıl veri JS ile şu API’den gelir:

1. `GET https://api.kocaeli.edu.tr/api/Admin/Isp/GetIspCodeByName?IspWebUrl=tip.kocaeli.edu.tr`
2. `GET https://api.kocaeli.edu.tr/api/News/GetAll?TranslationCode=0&Count=6` — header: `code: 1019`
3. Görsel: `https://api.kocaeli.edu.tr/api/FileOperation?filePath=<thumbnailUrl>`

Yenilemek için:

```bash
node scripts/scrape-tip-haberler.mjs --download
```

Sonra `mock-server/src/seed.js` → `featuredItems` güncellenir / script çıktısı seed’e işlenir.
## İlerleyen dönem — `öne çıkar` etiketi

Akademik / dekanlık ekranından yetkili kullanıcı; haber, etkinlik veya duyuruyu
**öne çıkar** olarak işaretleyebilir.

### Öncelik sırası (backend çözer)

1. Dekanlık / yetkili `featured=true` seçimleri (haber | etkinlik | duyuru)
2. Büyük etkinlik haftası afişleri (opsiyonel dönemsel kural)
3. Son N fakülte haberi (varsayılan N=6)
4. Fallback: kampüs foto + sabit slogan

İstemci sadece `GET /portal/featured` sonucunu basar; öncelik if-else’i app’te olmaz.

### Ortak kart modeli

```ts
type FeaturedItem = {
  id: string;
  title: string;
  publishedAt: string;      // ISO date
  imageUrl: string;         // mutlak URL
  sourceUrl: string | null;  // web / deep link
  source: "news" | "event" | "announcement" | "editorial" | "fallback";
  badge: string;            // HABER | ETKİNLİK | DUYURU | …
  summary?: string;
};
```

## UI kuralları

- Kart: poster (metin fotoğrafın üzerinde, altta soft zümrüt gradient)
- Genişlik: ~`ekran − 48`, yükseklik ~210–230
- Liste: 4–6 öğe; ekranda aynı anda 1 ana + peek
- Tıklanınca: `sourceUrl` (webview / in-app detay — sonraki faz)

## İlgili dosyalar

- `docs/ONE-CIKANLAR.md` (bu dosya)
- `mock-server/src/seed.js` → `featuredItems`
- `mock-server/src/routes.js` → `GET /portal/featured`
- `lib/api/types.ts` → `FeaturedItem`
- `lib/api/endpoints.ts` → `portalFeatured`
- `components/landing/FeaturedScroll.tsx`
- `scripts/scrape-tip-haberler.mjs`
