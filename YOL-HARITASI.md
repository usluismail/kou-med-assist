# KOÜ Tıp Mobil — Sistematik Yol Haritası

> Kocaeli Üniversitesi Tıp Fakültesi mobil uygulaması için kaynak araştırması, mevcut arayüz durumu ve sahte → gerçek backend geçiş stratejisi.
>
> Kaynak: *Tıp Eğitiminde Mobil Dijital Dönüşüm: Türkiye ve Dünya Örnekleri, Klinik Logbook Sistemleri ve UX/UI Mimari Raporu*
>
> Proje: `kou-med-assist` (Expo Router / React Native)

---

## 1. Strateji Özeti

**Hedef:** Öğrenci + akademisyen arayüzünü, gerçek API henüz gelmeden, sözleşmeye (contract) dayalı bir yapıya oturtmak.

**Yaklaşım:**

1. UI’yi sabit (`med-data.ts`) veriden kurtarıp **API katmanı + tip sözleşmesi** üzerinden çalıştırmak
2. Sahte (mock) endpoint sunucusu ile geliştirmek
3. Hoca gerçek endpoint şemasını verdiğinde yalnızca **base URL + mapping** değiştirmek; ekranları yeniden yazmamak

```
[Expo App] → [api/ client] → [Mock Server] ──sonra──→ [Gerçek Backend]
                 ↑
           types + adapters
```

---

## 2. Mevcut Durum (Bugün)

| Katman | Durum |
|--------|--------|
| Portal (`/`) | Duyuru / yemek / yerleşke + Giriş Yap |
| Öğrenci (`/ogrenci`) | Dashboard, Logbook, Nöbet, OSCE, Profil — UI hazır |
| Akademisyen (`/akademisyen`) | Onay paneli, QR, OSCE rubrik — UI hazır |
| Veri | `lib/med-data.ts` içinde **hardcoded** sabitler |
| API | Yok |
| Auth | LoginSheet demo; gerçek SSO yok |
| Offline | Yok (UI’de offline göstergesi var, mantık yok) |

**Güçlü yanlar (raporla örtüşen):**

- Bottom tab: Ana Sayfa · Karne · Nöbet · OSCE · Profil
- Encounter ID odaklı log girişi (hasta PII yok)
- Rol seçimi: Gözlemledim / Yardım Ettim / Yaptım
- Push yerine QR onay + swipe-to-approve
- U-ÇEP progress ring, nöbet takvimi, OSCE rubrik iskeleti
- Thumb-zone FAB (“Log Ekle”)

**Eksikler (rapor + mimari):**

- Veri katmanı API’ye bağlı değil
- WBA / Mini-CEX / DOPS yok
- Gerçek QR kamera, barkod, ses→metin yok
- Offline-first / SQLCipher yok
- SSO / RBAC yok
- Tip güvenli domain modelleri dağınık

---

## 3. Nasıl İlerleyelim? (Önerilen Sıra)

### Faz 0 — Sözleşme ve klasör düzeni *(şimdi)*

Arayüzü bozmadan API’ye hazır iskelet:

```
lib/
  api/
    client.ts          # fetch wrapper (baseURL, headers, hatalar)
    endpoints.ts       # path sabitleri
    types.ts           # domain tipleri (LogEntry, Shift, Approval…)
    adapters.ts        # backend JSON ↔ UI modeli (hoca şeması gelince burası değişir)
    mock/              # geliştirme mock’ları (opsiyonel, json-server yanına)
  med-data.ts          # geçici; kademeli kaldırılacak
  theme.ts
```

**Kural:** Ekranlar doğrudan `med-data` import etmez; `api/*` veya hook’lar üzerinden alır.

### Faz 1 — Sahte backend

Ayrı (veya monorepo) mock sunucu:

| Seçenek | Ne zaman |
|---------|----------|
| **json-server** / **msw** | Hızlı demo, sabit JSON |
| **Express / Fastify** | Daha gerçekçi REST, auth header simülasyonu |
| **Expo + lokal IP** | Telefonda LAN ile deneme (`npx expo start --lan` zaten var) |

Örnek base URL (geliştirme):

```
EXPO_PUBLIC_API_URL=http://192.168.x.x:3001
```

Gerçek backend gelince yalnızca env değişir; adapter gerekirse güncellenir.

### Faz 2 — UI’yi sözleşmeye bağlama

Sıra (etki / değer):

1. **Öğrenci dashboard** — profil, rotasyon, U-ÇEP özeti
2. **Logbook listesi + yeni log ekleme**
3. **Akademisyen bekleyen onaylar + approve/reject**
4. **Nöbet / shift listesi**
5. **OSCE** (öğrenci durumu + eğitici rubrik) — sona bırakılabilir

Her ekranda: loading / empty / error durumları.

### Faz 3 — Gerçek endpoint’e geçiş

Hoca şemayı verince:

1. `types.ts` ↔ gerçek payload eşleştir
2. Farkları `adapters.ts` içinde map et
3. `endpoints.ts` path’lerini güncelle
4. Auth header / token akışını ekle
5. Mock sunucuyu kapat veya staging’e yönlendir

### Faz 4 — Rapor öncelikli özellikler (sonra)

MVP sonrası, raporun “En Kritik 5 Modül” sırasıyla:

1. Logbook + onay (push / QR) — *kısmen var*
2. Nöbet & duty hours — *iskelet var*
3. OSCE / MMI — *iskelet var*
4. WBA (Mini-CEX, DOPS, 360°) — *yok*
5. U-ÇEP matrisi & e-portfolyo radar — *basit progress var*

Güvenlik / klinik: Encounter doğrulama (FHIR), offline şifreleme, biyometrik kilit — backend + native yetenekler netleşince.

---

## 4. Backend — Önerilen Mock API Sözleşmesi

Hoca farklı isimler verse bile UI bu domain’e map edilir. Aşağıdaki yapı **hedef sözleşme**; sahte sunucuda birebir uygulanır.

### 4.1 Auth (şimdilik sahte)

```
POST /auth/login
Body: { email, password, role: "student" | "faculty" }
→ { token, user: { id, name, role, department, studentNo? } }

GET /auth/me
Header: Authorization: Bearer <token>
→ User
```

> İleride: Üniversite SSO (OAuth2 / OIDC). Mock’ta Bearer token yeter.

### 4.2 Öğrenci

```
GET  /student/dashboard
→ { student, rotation, ucepProgress, upcomingShift, logSummary }

GET  /student/procedures
→ ProcedureProgress[]   // { id, name, done, total }

GET  /student/logs
→ LogEntry[]

POST /student/logs
Body: {
  procedureId,
  encounterId,          // ENC-… — PII yok
  ageGroup,             // child | adult | geriatric
  sex,                  // f | m | other
  role,                 // observed | assisted | performed
  supervisorId,
  approvalMethod        // push | qr
}
→ LogEntry

GET  /student/shifts
→ Shift[]

POST /student/shifts/:id/swap-request
Body: { colleagueId, note? }

GET  /student/osce/sessions
→ OsceSessionSummary[]
```

### 4.3 Akademisyen

```
GET  /faculty/approvals/pending
→ PendingApproval[]

POST /faculty/approvals/:id/approve
Body: { note?, voiceNoteUrl? }

POST /faculty/approvals/:id/request-revision
Body: { note }

POST /faculty/approvals/qr
Body: { qrPayload }
→ PendingApproval | { status: "invalid" }

GET  /faculty/osce/stations/:stationId
→ OsceRubric

POST /faculty/osce/scores
Body: { sessionId, candidateId, checklist, globalScore, offlineSyncedAt? }
```

### 4.4 Ortak tipler (özet)

```ts
type LogStatus = "pending" | "approved" | "revision_requested";

type LogEntry = {
  id: string;
  encounterId: string;
  procedureName: string;
  date: string;          // ISO
  role: "observed" | "assisted" | "performed";
  supervisorName: string;
  status: LogStatus;
};

type PendingApproval = {
  id: string;
  encounterId: string;
  studentName: string;
  procedureName: string;
  submittedAt: string;
};
```

**KVKK notu:** Mock ve gerçek API’de hasta adı / TCKN / doğum tarihi **asla** taşınmaz. Sadece Encounter ID + yaş grubu + cinsiyet.

---

## 5. Frontend — Arayüzün API’ye Uydurulması

### 5.1 Yapılacak refactor (öncelik sırası)

| # | İş | Neden |
|---|-----|--------|
| 1 | `lib/api/types.ts` + `client.ts` | Tek sözleşme |
| 2 | `useStudentDashboard`, `useLogs`, `usePendingApprovals` hook’ları | Ekranları veriden ayır |
| 3 | `StudentApp` / `FacultyApp` içindeki `med-data` import’larını kaldır | Mock ↔ gerçek geçiş |
| 4 | Form state’li “Yeni Log” bottom sheet’i API `POST`’a bağla | Demo → gerçek akış |
| 5 | Onay swipe → `POST .../approve` | Akademisyen akışı |
| 6 | Env: `EXPO_PUBLIC_API_URL` | Ortam değişimi |

### 5.2 UI iyileştirmeleri (rapor + klinik kullanılabilirlik)

**Hemen (mevcut UI üzerinde):**

- Yeni log akışını 3 adıma böl: Prosedür seç → Minimal form → Onay yöntemi (Push / QR)
- Segmented control: yaş grubu + cinsiyet (rapordaki form)
- Loading skeleton / boş durum (“Bekleyen onay yok”)
- Hata toast’ları (ağ / 401 / 422)
- Rol etiketlerini API enum ↔ Türkçe UI map’i ile göster

**Kısa vadede:**

- Gerçek kamera: Encounter barkod + QR onay (`expo-camera` / `expo-barcode-scanner`)
- Talk-to-Text iskeleti → sonra native speech
- Dark mode token’ları (`theme.ts` genişlet)
- Haptic feedback (onay / log gönderim)

**Orta vadede:**

- Offline kuyruk (log + OSCE skor taslakları)
- Biyometrik uygulama kilidi
- WBA form ekranları
- U-ÇEP radar / yetkinlik matrisi

### 5.3 Ekran → endpoint eşlemesi

| Ekran | Kaynak (hedef) |
|-------|----------------|
| Öğrenci Dashboard | `GET /student/dashboard` |
| Karne listesi | `GET /student/logs` + `GET /student/procedures` |
| Log Ekle | `POST /student/logs` |
| Nöbet | `GET /student/shifts` |
| QR Sheet | Log create `approvalMethod: qr` + payload göster |
| Fakülte onay listesi | `GET /faculty/approvals/pending` |
| Swipe onay | `POST /faculty/approvals/:id/approve` |
| QR tarayıcı | `POST /faculty/approvals/qr` |
| OSCE rubrik | `GET/POST .../osce/...` |

---

## 6. Kapsam Matrisi — Hiçbir Şey Kaçmasın

Aşağıdaki tablo: konuşmada + kaynak raporda geçen **her başlığı** hangi sprint’te ele aldığımızı gösterir.
`UI var` = ekranda çizilmiş ama API’ye bağlı değil. `Sonra` = bilerek MVP dışı bırakıldı.

### 6.1 Senin belirttiğin hedefler

| Madde | Sprint | Not |
|-------|--------|-----|
| Sahte backend / mock endpoint sunucusu | **A** | Express veya json-server |
| UI’yi bu yapıya uygun hale getirme (`med-data` → API) | **A → B** | Önce okuma, sonra yazma |
| Gerçek endpoint gelince yönlendirme (adapter + env) | **C** (hazırlık) + **D** (geçiş) | Ekran yeniden yazılmaz |
| Backend + frontend + genel iyileştirme planı (bu MD) | ✅ | Bu dosya |
| KOÜ Tıp Fakültesi odaklı geliştirme | Tümü | Brand / seed / roller |

### 6.2 Mevcut ekranlar (UI var → API’ye bağla)

| Ekran / özellik | UI | Sprint |
|-----------------|-----|--------|
| Portal (`/`) duyuru, yemek, yerleşke, giriş | var | **A** (login → mock auth), portal içerik seed kalabilir |
| LoginSheet rol seçimi (öğrenci / akademisyen) | var | **A** |
| Öğrenci Dashboard (profil, U-ÇEP ring, nöbet kartı, log özeti) | var | **A** |
| FAB “Log Ekle” | var | **B** (forma götürür) |
| Logbook listesi + durum badge | var | **A** (GET), **B** (yenileme) |
| Yeni log formu (Encounter, rol, eğitici) | var (eksik alanlar) | **B** |
| Yaş grubu + cinsiyet segmented | kısmen / eksik | **B** |
| Onay yöntemi: Push / QR | QR var, Push UI eksik | **B** |
| Öğrenci QR sheet (yüz yüze onay) | var (statik) | **B** |
| Nöbet listesi + takvim | var | **B** |
| Nöbet takas sheet | var | **B** |
| Öğrenci OSCE özeti | var | **C** |
| Öğrenci Profil | var | **A** (auth/me ile) |
| Akademisyen bekleyen onaylar | var | **A** (GET), **B** (POST) |
| Swipe to approve | var | **B** |
| Düzeltme iste | eksik/zayıf | **B** |
| Talk-to-Text (UI mock) | var (sahte) | **C** (iskelet), **E** (gerçek speech) |
| Akademisyen QR tarayıcı | UI mock | **C** (mock validate), **E** (kamera) |
| OSCE rubrik (checklist + global score) | var | **C** |

### 6.3 Kaynak rapordan gelen modüller

| Modül | Sprint | Kapsam |
|-------|--------|--------|
| 1. Dijital klinik karne / logbook + onay | **A–B** | MVP çekirdeği |
| 2. Nöbet / shift (+ takas, 80s uyarısı UI) | **B** | Duty-hours soft uyarı; sert kilit **E** |
| 3. OSCE / MMI | **C** | Rubrik GET/POST mock; psikometri **E** |
| 4. WBA (Mini-CEX, DOPS, 360°) | **E** | Henüz UI yok |
| 5. U-ÇEP matrisi / e-portfolyo radar | **A** basit ring, **E** radar |
| SSO / OIDC | **D/E** | Mock auth **A** yeter |
| HBYS / FHIR Encounter doğrulama | **E** | Şimdilik Encounter ID serbest metin |
| KVKK: PII engeli | **B** | Formda alan yok + tip sözleşmesi |
| Offline-first / SQLCipher | **E** | |
| Geofencing | **E** (opsiyonel) | |
| Push bildirim (gerçek FCM/APNs) | **E** | **B**’de “onaya gönder” durumu yeterli |
| Barkod kamera (Encounter) | **E** | **B**’de manuel giriş |
| Dark mode / haptic / thumb-zone polish | **C** | |
| Certificate pinning, root detect, biyometrik kilit | **E** | |

### 6.4 Genel teknik iyileştirmeler

| Madde | Sprint |
|-------|--------|
| `types` / `client` / `endpoints` / `adapters` | **A** |
| Hook’lar (`useDashboard`, `useLogs`, …) | **A–B** |
| `med-data.ts` → mock seed | **A** |
| `.env.example` + `EXPO_PUBLIC_API_URL` | **A** |
| Mock sunucu README + örnek curl | **A** |
| Loading / empty / error / toast | **C** |
| Büyük component dosyalarını bölme | **C** |
| Uçtan uca demo senaryosu (log → onay) | **B** bitiş kriteri |
| Hoca için API sözleşme özeti | **C** |
| Gerçek backend mapping | **D** |

---

## 7. Sprint Checklist’leri (Sıra Sıra)

Her sprint’te maddeler **yukarıdan aşağı** yapılır. Bir sprint’in bitiş kriteri sağlanmadan sonrakine geçilmez.

---

### Sprint A — Mimari iskelet + okuma bağları

**Amaç:** Sahte sunucu ayakta; uygulama veriyi `med-data` yerine API’den okusun.

**Backend**

- [x] A1. `mock-server/` (veya `server/`) klasörü oluştur
- [x] A2. Seed JSON: student, procedures, logs, shifts, pendingApprovals, supervisors, osce (mevcut `med-data` içeriğini taşı)
- [x] A3. Endpoint’ler (en az):
  `POST /auth/login`, `GET /auth/me`,
  `GET /student/dashboard`, `GET /student/procedures`, `GET /student/logs`,
  `GET /student/shifts`, `GET /faculty/approvals/pending`
- [x] A4. CORS + LAN erişimi (telefonda Expo ile aynı Wi‑Fi)
- [x] A5. Mock kullanıcılar dokümante (öğrenci / akademisyen email+şifre)

**Frontend API katmanı**

- [x] A6. `lib/api/types.ts` — domain tipleri
- [x] A7. `lib/api/endpoints.ts` — path sabitleri
- [x] A8. `lib/api/client.ts` — baseURL, Bearer, hata sarmalama
- [x] A9. `lib/api/adapters.ts` — boş/iskelet (şimdilik identity map)
- [x] A10. `.env.example` → `EXPO_PUBLIC_API_URL`
- [x] A11. Hook’lar: `useAuth`, `useStudentDashboard`, `useLogs`, `usePendingApprovals`

**Ekran bağlama (sadece GET)**

- [x] A12. LoginSheet → `POST /auth/login` + token sakla + role’e göre route
- [x] A13. Öğrenci Dashboard ← `GET /student/dashboard`
- [x] A14. Logbook listesi ← `GET /student/logs` + prosedür progress ← `GET /student/procedures`
- [x] A15. Akademisyen onay listesi ← `GET /faculty/approvals/pending`
- [x] A16. Profil özeti ← `GET /auth/me`
- [x] A17. `med-data.ts` import’larını bu ekranlardan kaldır (seed sadece sunucuda kalsın)

**Dokümantasyon**

- [x] A18. Mock sunucu README: `npm run mock`, curl örnekleri

**Bitiş kriteri:** Uygulama açılır → giriş → öğrenci dashboard ve karne listesi + akademisyen bekleyen listesi **mock API’den** gelir. Sunucu kapalıyken anlamlı hata görünür.

---

### Sprint B — Yazma akışları (MVP çekirdeği)

**Amaç:** Öğrenci log ekler → akademisyen listesinde görünür → onaylar / düzeltme ister. Nöbet okuma + takas isteği.

**Backend**

- [x] B1. `POST /student/logs` (body: procedureId, encounterId, ageGroup, sex, role, supervisorId, approvalMethod)
- [x] B2. Yeni log `pending` olarak `pendingApprovals` kuyruğuna düşsün
- [x] B3. `POST /faculty/approvals/:id/approve`
- [x] B4. `POST /faculty/approvals/:id/request-revision`
- [x] B5. `POST /faculty/approvals/qr` (payload doğrula → approve veya invalid)
- [x] B6. `POST /student/shifts/:id/swap-request` (kayıt tutsun yeter)
- [x] B7. KVKK: seed/API’de hasta adı/TCKN alanı **yok** (doğrulama testi)

**Frontend — Logbook**

- [x] B8. Yeni log formunu 3 adım: Prosedür seç → Form → Onay yöntemi
- [x] B9. Form alanları: Encounter ID, yaş grubu, cinsiyet, rol (3’lü), eğitici
- [x] B10. “Push ile onaya gönder” + “QR oluştur” butonları → `POST /student/logs`
- [x] B11. Başarılı POST sonrası listeyi yenile; QR seçildiyse QR sheet’i **API’den dönen payload** ile aç
- [x] B12. Barkod butonu: şimdilik placeholder (kamera **E**); manuel giriş çalışır

**Frontend — Akademisyen**

- [x] B13. Swipe onay → `POST .../approve` (+ opsiyonel not)
- [x] B14. “Düzeltme iste” → `POST .../request-revision`
- [x] B15. Liste yenileme; onaylanan kart state’i API ile uyumlu

**Frontend — Nöbet**

- [x] B16. Nöbet ekranı ← `GET /student/shifts`
- [x] B17. Takas sheet → `POST .../swap-request`
- [x] B18. 80 saat uyarısı: mock’tan gelen flag veya sabit kural ile soft mesaj (sert rolling lock **E**)

**Bitiş kriteri (zorunlu demo):**
Öğrenci log ekler → akademisyen pending’de görür → swipe ile onaylar → öğrenci logunda “onaylandı”. Aynı akış QR path ile de çalışır (mock).

---

### Sprint C — OSCE + polish + hoca’ya hazırlık

**Amaç:** OSCE mock bağlansın; UX durumları tamamlansın; gerçek backend’e geçiş için sözleşme netleşsin.

**Backend**

- [x] C1. `GET /student/osce/sessions`
- [x] C2. `GET /faculty/osce/stations/:stationId`
- [x] C3. `POST /faculty/osce/scores` (offlineSyncedAt alanı opsiyonel tutulsun)
- [x] C4. Adapter testi: kasıtlı “farklı JSON” örneği + `adapters.ts` map’i (hoca şeması simülasyonu)

**Frontend**

- [x] C5. Öğrenci OSCE sekmesi ← sessions API
- [x] C6. Akademisyen OSCE rubrik ← station API; kayıt → scores POST
- [x] C7. QR tarayıcı sekmesi: kamera yokken manuel payload girişi → `POST /faculty/approvals/qr`
- [x] C8. Talk-to-Text: UI akışı korunur; metin alana yazılır (gerçek speech **E**)
- [x] C9. Tüm bağlı ekranlarda: loading / empty / error
- [x] C10. Basit toast veya banner (ağ, 401, 422)
- [x] C11. Enum ↔ Türkçe etiket map (role, status)
- [x] C12. Dark mode token’ları `theme.ts`’e ekle (toggle opsiyonel)
- [x] C13. Haptic: onay + log gönderim (`expo-haptics`)
- [ ] C14. `StudentApp` / `FacultyApp` dosyalarını alt bileşenlere böl (okunabilirlik)

**Dokümantasyon / teslim**

- [x] C15. Hoca için kısa API sözleşme özeti (path + örnek request/response)
- [x] C16. Geçiş notu: “Gerçek URL gelince sadece env + adapter”

**Bitiş kriteri:** OSCE skor mock’a yazılır; tüm ana sekmeler API’den beslenir; loading/empty/error tutarlı; sözleşme dokümanı paylaşılabilir.

---

### Sprint D — Gerçek backend’e geçiş *(hoca endpoint verince)*

**Amaç:** Mock’tan staging/production API’ye geç; UI aynı kalsın.

- [ ] D1. Gerçek OpenAPI / örnek payload’ları al
- [ ] D2. `types.ts` ↔ gerçek alan adlarını karşılaştır (fark listesi)
- [ ] D3. `adapters.ts` ile map et (UI modeli değişmesin)
- [ ] D4. `endpoints.ts` path’lerini güncelle
- [ ] D5. `EXPO_PUBLIC_API_URL` → gerçek base URL
- [ ] D6. Auth: token / refresh / SSO redirect (hocanın dediği modele göre)
- [ ] D7. RBAC: role claim → route koruması
- [ ] D8. Sprint B demo senaryosunu **gerçek API** üzerinde tekrarla
- [ ] D9. Mock sunucuyu sadece lokal fallback olarak bırak veya kapat

**Bitiş kriteri:** Aynı öğrenci→onay akışı staging’de çalışır; adapter dışı UI değişikliği minimal/yok.

---

### Sprint E — Rapor sonrası / native & güvenlik *(bilerek sonra)*

Bunlar şimdi “yok” diye unutulmasın diye listede; **A–C’ye karıştırma**.

- [ ] E1. Gerçek kamera: Encounter barkod + QR okuma
- [ ] E2. Push bildirim (FCM/APNs) + onay deep link
- [ ] E3. Talk-to-Text native speech
- [ ] E4. Offline kuyruk (log + OSCE) + şifreli lokal depolama
- [ ] E5. Biyometrik uygulama kilidi / idle lock
- [ ] E6. WBA modülü: Mini-CEX, DOPS, 360° formları
- [ ] E7. U-ÇEP radar / yetkinlik matrisi
- [ ] E8. Duty hours rolling lockout (2 hafta kilit)
- [ ] E9. HBYS FHIR Encounter verification
- [ ] E10. Certificate pinning, root/jailbreak politikası
- [ ] E11. OSCE psikometri / borderline (backend ağırlıklı)
- [ ] E12. Geofencing (opsiyonel)

---

## 8. Karar Noktaları (Hocaya Sorulacaklar)

Gerçek backend gelmeden netleştirilirse adapter maliyeti düşer:

1. Auth: kurumsal SSO mu, yoksa geçici email/şifre mi?
2. Encounter ID formatı ve HBYS doğrulama olacak mı?
3. Onay: push zorunlu mu, yoksa önce sadece in-app + QR mi?
4. OSCE offline zorunlu mu (high-stakes)?
5. Roller: yalnızca öğrenci / öğretim üyesi mi, yoksa intörn / asistan / ABD başkanı da mı?
6. U-ÇEP prosedür listesi kimden beslenecek (statik JSON vs API)?

---

## 9. Bu Konuşmadan Çıkan Net Yön

| Soru | Cevap |
|------|--------|
| Şimdi ne yapıyoruz? | UI’yi mock API sözleşmesine bağlamak |
| Backend? | Sahte endpoint sunucusu; gerçek şema gelince adapter |
| Frontend? | `med-data` → `api` katmanı; ekranları bozmadan refactor |
| Kaynak rapor? | Modül önceliği + UX kuralları için referans; hepsini bir anda yapmıyoruz |
| Başarı ölçütü | Öğrenci log ekler → akademisyen listesinde görünür → onaylar; hepsi mock API üzerinden |
| Her şey sprint’te mi? | Evet — §6 matris + §7 checkbox; “Sonra” olanlar Sprint E’de |

---

## 10. Sonraki Adım (Hemen)

Onay sonrası doğrudan **Sprint A** maddelerinden başla:

1. A1–A5 mock sunucu + seed
2. A6–A11 `lib/api` iskeleti
3. A12–A17 okuma bağları
4. A18 README

Sprint A bitiş kriteri sağlanınca Sprint B’ye geç.
