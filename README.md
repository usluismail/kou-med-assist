# KOU Med Portal

Create a modern, clean, mobile-first Dashboard and Login Portal UI for "Kocaeli Üniversitesi Tıp Fakültesi" (KOU Medical Faculty) inspired by Bento Grid architecture.

### STRICT COLOR PALETTE & DESIGN SYSTEM

- **Primary Green (Brand):** `#008542` (KOÜ Green)

- **Primary Dark:** `#005C2E`

- **Clinical Dark (Header / Dark Elements):** `#0F172A` (Slate 900)

- **Surface Light (Screen Background):** `#F8FAFC` (Slate 50)

- **Surface Card:** `#FFFFFF`

- **Haptic Success:** `#10B981` (Emerald 500)

- **Warning Amber:** `#F59E0B` (Amber 500)

- **Danger Red:** `#EF4444` (Red 500)

- **Info Blue:** `#3B82F6` (Blue 500)

- **Border Radius:** Rounded corners (`20px` to `24px` for main cards, `12px` for buttons)

- **Typography:** Inter or system sans-serif, bold headers, high contrast legibility.

---

### EKRAN DÜZENİ VE BİLEŞENLER (Public Welcome View - Unauthenticated)

1. **Top Header (Clinical Dark - `#0F172A`):**

   - Status bar mockup at top (09:41, KOÜ-WiFi, Battery).

   - KOÜ Tıp Fakültesi Logo / Title text with subtle green accent.

   - Right Action Button: A distinct pill-shaped button `#008542` labeled **"Giriş Yap"** with a user/lock icon. Clicking this opens the **Role Selection Bottom Sheet**.

2. **Featured News & Campus Carousel Slider (Hero Section):**

   - Full-width rounded card (`24px` radius) with a high-quality medical campus background image and a dark gradient overlay.

   - Top tag: `"KAMPÜS & HABERLER"` (small badge in `#10B981`).

   - Headline: `"Yeni Tıp Fakültesi Araştırma Laboratuvarı Hizmete Açıldı"`.

   - Subtle slide indicator dots at the bottom right.

3. **Bento Grid Main Section (2-Column Grid):**

   - **Card 1 (Yemekhane Menüsü):**

     - Icon: Top-left circular icon container (`#F8FAFC`) with a fork-knife icon.

     - Title: `"Tıp Yemekhane"`

     - Subtitle/Mock Content: `"Günün Menüsü: Mercimek Çorbası, Izgara Köfte, Pilav"`

     - Action: Bottom-right circular arrow button (`#008542` background, white diagonal arrow).

   - **Card 2 (Duyurular):**

     - Icon: Top-left circular icon container with a bell/announcement icon.

     - Title: `"Fakülte Duyuruları"`

     - Badge: `"3 Yeni"` in Amber (`#F59E0B`).

     - Subtitle: `"2026-2027 Dönem 6 İntörn Nöbet Listeleri Yayınlandı"`.

     - Action: Bottom-right circular arrow button.

4. **Full-Width Bento Cards:**

   - **Card 3 (Yerleşke & Görseller):**

     - Title: `"Umuttepe Yerleşkesi"`

     - Horizontal scrolling mini thumbnail gallery showing medical faculty buildings and hospital views.

     - Subtitle: `"Fakülte Haritası ve Blok Rehberi"`.

   - **Card 4 (Hızlı Eklentiler & Entegrasyonlar):**

     - Compact horizontal list containing quick badges: `"HBYS Servisi"`, `"OBS Bağlantısı"`, `"Kütüphane Veritabanı"`.

---

### BOTTOM SHEET / MODAL SYSTEM (Giriş Yap Click Event)

When the user clicks the top-right **"Giriş Yap"** button, show a smooth slide-up **Bottom Sheet / Modal** over a dimmed backdrop:

1. **Bottom Sheet Header:**

   - Drag handle bar at top center.

   - Title: `"Giriş Türünü Seçin"`

   - Subtitle: `"Devam etmek için yetkinize uygun paneli seçiniz."`

2. **Role Cards (Interactive Buttons):**

   - **Option A: "İntörn Hekim / Öğrenci Girişi"**

     - Left Icon: Graduation Cap / Stethoscope in green badge (`#008542`).

     - Text: `"Öğrenci Portalı"` -> Subtitle: `"U-ÇEP Karnesi, Nöbet Takas, OSCE ve Girişim Logları"`

     - Right Icon: Chevron Right arrow.

     - On Click: Transition to mock Student Login Form (Öğrenci No & Şifre).

   - **Option B: "Öğretim Üyesi / Akademisyen Girişi"**

     - Left Icon: User Check / Award badge in dark clinical color (`#0F172A`).

     - Text: `"Akademisyen Portalı"` -> Subtitle: `"Karne Onayları, QR Değerlendirme, Sesli Not ve Rubrikler"`

     - Right Icon: Chevron Right arrow.

     - On Click: Transition to mock Faculty Login Form (Kurumsal E-Posta & Şifre).

3. **Bottom Footer Note:**

   - Small muted text: `"Kocaeli Üniversitesi Bilgi İşlem Daire Başkanlığı © 2026"`

---

### TECHNICAL & MOCK DATA INSTRUCTIONS

- Include interactive toggle states so clicking "Giriş Yap" opens the Bottom Sheet cleanly.

- Ensure all cards use `bg-white`, subtle shadows (`shadow-sm` or `shadow-md`), and proper padding (`p-5`).

- Ensure contrast ratios strictly adhere to accessibility standards using `#008542` and `#0F172A`.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/2df35f9c-2dee-4dd3-a536-788632bdfe93).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
