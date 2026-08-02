# KOÜ Tıp Mobil (Expo)

Kocaeli Üniversitesi Tıp Fakültesi mobil uygulaması — **React Native / Expo**.

## Çalıştırma

```bash
npm install --legacy-peer-deps
npx expo start --ios
```

veya Android:

```bash
npx expo start --android
```

## Akış

1. Portal (`/`) — duyurular, yemek, yerleşke, **Giriş Yap**
2. Öğrenci girişi → `/ogrenci` (U-ÇEP, nöbet, OSCE)
3. Akademisyen girişi → `/akademisyen` (onay, QR, rubrik)

## Yapı

- `app/` — Expo Router ekranları
- `components/` — LoginSheet + med panelleri
- `lib/` — tema token’ları + med-data
- `assets/` — ikonlar ve yerleşke görselleri
