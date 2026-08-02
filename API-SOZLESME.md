# KOÜ Tıp Mobil Uygulama — Durum Raporu & API Sözleşmesi

Kocaeli Üniversitesi Tıp Fakültesi için geliştirdiğimiz mobil uygulamanın **şu ana kadar ne yaptığı**, **neden yaptığı**, **ne eksik** ve **gerçek sunucuya bağlanmak için sizden (backend / hoca tarafı) ne istediğimiz** bu belgede toplanmıştır.

Dil: hem ekip içi anlatım hem de hocaya gösterim için sade tutulmuştur.

---

# Bölüm 1 — Projeyi bir cümlede

Öğrenci (intörn) klinik stajda yaptığı işlemleri telefonda kaydeder; öğretim üyesi aynı uygulamadan onaylar, nöbetleri ve OSCE sınavını da buradan takip eder.  
Şimdilik veriler **sahte (mock) bir API sunucusundan** gelir. Gerçek üniversite/backend endpoint’leri netleşince uygulama aynı ekranlarla o sunucuya bağlanır.

---

# Bölüm 2 — Kimler kullanıyor?

| Rol | Ne yapar? |
|-----|-----------|
| **Öğrenci / İntörn** | Giriş → ana sayfa, dijital karne (logbook), nöbet, OSCE özeti, profil |
| **Akademisyen / Öğretim üyesi** | Giriş → bekleyen karne onayları, QR ile hızlı onay, OSCE rubrik notlama |

Portal (açılış ekranı): duyuru / yerleşke görselleri + **Giriş Yap**. Rol seçilir (öğrenci veya akademisyen), sonra ilgili panele düşülür.

---

# Bölüm 3 — Özellikler: ne var, ne işe yarar?

## 3.1 Giriş (kimlik)

- Öğrenci: öğrenci no veya e-posta + şifre  
- Akademisyen: kurumsal e-posta + şifre  
- Başarılı girişte bir **token** alınır; sonraki isteklerde bu token gönderilir  
- Demo hesaplar geliştirme için hazır (aşağıda)

**Henüz yok:** Üniversite SSO (tek şifre / OBS hesabıyla kurumsal giriş). Şimdilik sahte login.

---

## 3.2 Ana sayfa (öğrenci dashboard)

- Öğrencinin adı, aktif staj / rotasyon bilgisi  
- **U-ÇEP ilerlemesi:** “kaç girişim tamamlandı” halka grafik + kısa prosedür listesi  
- Yaklaşan nöbet kartı  
- Onay bekleyen karne sayısı  

**U-ÇEP nedir?**  
Ulusal Çekirdek Eğitim Programı. Tıp fakültesinde öğrencinin staj boyunca yapması beklenen temel becerilerin listesi (damar yolu, EKG, sutür vb.). Uygulama “şu beceriden X/Y tamamlandı” diye gösterir.

---

## 3.3 Dijital klinik karne (logbook) — en kritik özellik

**Nedir?**  
Eski kağıt staj karnesinin dijital hali. Öğrenci hastanede bir işlem yaptığında (veya izlediğinde) telefona kaydeder; sorumlu hoca onaylar.

**Nasıl işliyor (öğrenci)?**

1. Prosedür seçilir (ör. damar yolu)  
2. Form doldurulur:  
   - **Encounter ID** = hastane protokol / işlem kodu (anonim)  
   - Yaş grubu (pediatrik / yetişkin / geriatrik)  
   - Cinsiyet  
   - Rol: *Gözlemledim / Yardım ettim / Bizzat yaptım*  
   - Onaylayacak öğretim üyesi  
3. Gönderim yöntemi:  
   - **Push ile onaya gönder** → hocanın “bekleyen onaylar” listesine düşer  
   - **QR oluştur** → yüz yüze: öğrenci QR/payload gösterir, hoca doğrular  

**KVKK / hasta gizliliği (bilinçli kural):**  
Uygulamaya **hasta adı, TCKN, doğum tarihi girilmez.** Sadece Encounter ID + yaş grubu + cinsiyet. Bu, kişisel sağlık verisinin mobil tarafa girmesini engellemek içindir.

**Nasıl işliyor (hoca)?**

- Bekleyen listeyi görür  
- Kaydırarak **onaylar** veya **düzeltme ister**  
- İsterse sesli not alanı vardır (şimdilik simülasyon; gerçek ses→metin sonra)  
- QR sekmesinde öğrencinin payload’ını yapıştırıp doğrulayabilir (gerçek kamera sonra)

---

## 3.4 Nöbet & vardiya

**Nedir?**  
İntörnün acil / klinik nöbet çizelgesi.

**Ne var?**

- **Takvim** sekmesi: ay görünümü, renkli günler (tamamlandı / yaklaşan / gece)  
- **Liste** sekmesi: filtreler (Tümü, Yaklaşan, Tamamlanan, Gece)  
- Nöbet detayı: alan, saat, mesai arkadaşları  
- **Nöbet takas talebi:** arkadaş seçip teklif gönderme (mock’a kayıt düşer)  
- 80 saat yasal limit için soft uyarı metni (sert kilit yok)

**Henüz yok:** Gerçek push ile takas onayı, 2 haftalık geriye kilit (rolling lockout), takvim senkronu (Google/iOS Calendar).

---

## 3.5 OSCE

**OSCE nedir?**  
*Objective Structured Clinical Examination* — Objektif Yapılandırılmış Klinik Sınav.  
Öğrenci istasyon istasyon dolaşır (ör. solunum muayenesi, EKG, iletişim). Her istasyonda eğitici bir **rubrik** (puanlama formu) doldurur. Kağıt form yerine tablet/telefonda notlama hedeflenir.

**Neden koyduk?**  
Kaynak araştırmasında (uluslararası + Türkiye örnekleri) mobil tıp eğitiminin kritik 5 modülünden biri. Staj karnesi kadar olmasa da sınav günü operasyonel yükü azaltır; demo’da “sınav da aynı ekosistemde” mesajını verir.

**Öğrencide ne var?**  
Yaklaşan OSCE tarihi, istasyon listesi, tamamlananlarda yüzde skor, bekleyenlerde “—”.

**Hocada ne var?**  
Örnek istasyon rubriği: evet/kısmen/hayır, Likert 1–5, global yüzde kaydırıcı, süre sayacı, “kaydet” → skoru API’ye yazar. Online/offline göstergesi var (gerçek offline kayıt sonra).

**Henüz yok:** Gerçek aday QR okuma, psikometrik analiz (borderline regression), tam offline-first notlama, MMI.

---

## 3.6 Profil

- Öğrenci bilgisi, U-ÇEP prosedür barları  
- Entegrasyon kartları (HBYS, OBS vb.) **görsel / demo** — gerçek bağlantı yok

---

# Bölüm 4 — Sistem nasıl haberleşiyor?

```
[Telefon / Expo uygulaması]
        │  HTTP JSON istekleri
        ▼
[lib/api katmanı]  ← path’ler, tipler, token, gerekirse alan adı çevirisi (adapter)
        │
        ▼
[Şimdilik: mock-server (Node/Express, port 3001)]
[Sonra: hocanın / üniversitenin gerçek API’si]
```

- Arada **ikinci bir mobil backend yok.** Uygulama doğrudan REST endpoint’lere gider.  
- Mock, geliştirme ve demo içindir; gerçek veri burada tutulmaz.  
- Gerçek API gelince çoğu zaman: **base URL değiştir + gerekirse adapter**; ekranlar yeniden yazılmaz.

**Demo hesaplar**

| Rol | Giriş | Şifre |
|-----|--------|--------|
| Öğrenci | `ahmet.yilmaz@kocaeli.edu.tr` veya `190101044` | `ogrenci123` |
| Akademisyen | `ayse.kaya@kocaeli.edu.tr` | `hoca123` |

Çalıştırma (geliştirici): bir terminalde `npm run mock`, diğerinde `npx expo start`.

---

# Bölüm 5 — Ne var / ne yok (özet tablo)

## Var (demo çalışıyor)

- Portal + rol seçimli giriş  
- Öğrenci: dashboard, karne listesi + 3 adımlı yeni kayıt, push/QR gönderim  
- Akademisyen: onay, düzeltme isteği, QR payload doğrulama  
- Nöbet takvim + liste + filtre + takas isteği  
- OSCE öğrenci özeti + akademisyen rubrik kaydı  
- Loading / hata / boş durumlar, toast, haptic  
- KVKK’ya uygun form (PII yok)  
- Yol haritası (`YOL-HARITASI.md`) + bu sözleşme belgesi  

## Yok / sonraki faz (bilinçli ertelendi)

- Gerçek üniversite SSO / LDAP  
- Gerçek HBYS / FHIR Encounter doğrulama  
- Gerçek kamera (barkod + QR)  
- Gerçek push bildirimi (FCM/APNs)  
- Gerçek ses→metin (Talk-to-Text native)  
- Offline-first + şifreli yerel DB  
- WBA (Mini-CEX, DOPS, 360°)  
- U-ÇEP radar / yetkinlik matrisi (şimdilik basit halka)  
- Biyometrik kilit, certificate pinning, root tespiti  
- Dark mode aç/kapa (token’lar hazır, toggle yok)  

---

# Bölüm 6 — Teknik API sözleşmesi (entegrasyon)

Mobil uygulamanın beklediği REST özeti. Gerçek backend bunlara yakın olursa veya adapter ile map edilirse bağlanırız.

**Base URL (geliştirme):** `http://<LAN-IP>:3001`  
**Auth header:** `Authorization: Bearer <token>`

## 6.1 Auth

### POST `/auth/login`
```json
{ "email": "ahmet.yilmaz@kocaeli.edu.tr", "password": "ogrenci123", "role": "student" }
```
→ `{ "token": "...", "user": { "id", "email", "role", "name", "studentNo?", "department", "faculty", "initials", "rotation?" } }`

`role`: `student` | `faculty`

### GET `/auth/me` → User

## 6.2 Öğrenci

| Method | Path | Ne döner / ne yapar |
|--------|------|---------------------|
| GET | `/student/dashboard` | profil, U-ÇEP özeti, yaklaşan nöbet, log özeti |
| GET | `/student/procedures` | prosedür progress listesi |
| GET | `/student/logs` | karne kayıtları |
| POST | `/student/logs` | yeni karne |
| GET | `/student/shifts` | nöbetler |
| POST | `/student/shifts/:id/swap-request` | takas talebi |
| GET | `/student/supervisors` | eğitici listesi |
| GET | `/student/colleagues` | arkadaş listesi |
| GET | `/student/osce/sessions` | OSCE + istasyon ilerleme |

### POST `/student/logs` örnek body
```json
{
  "procedureId": "proc-1",
  "encounterId": "ENC-2026-100",
  "ageGroup": "adult",
  "sex": "m",
  "role": "performed",
  "supervisorId": "sup-2",
  "approvalMethod": "push"
}
```

- `ageGroup`: `child` | `adult` | `geriatric`  
- `sex`: `f` | `m` | `other`  
- `role`: `observed` | `assisted` | `performed`  
- `approvalMethod`: `push` | `qr`  
- Hasta adı / TCKN **gönderilmez**

## 6.3 Akademisyen

| Method | Path | Ne döner / ne yapar |
|--------|------|---------------------|
| GET | `/faculty/approvals/pending` | bekleyen onaylar |
| POST | `/faculty/approvals/:id/approve` | onay (`note` opsiyonel) |
| POST | `/faculty/approvals/:id/request-revision` | düzeltme (`note` zorunlu) |
| POST | `/faculty/approvals/qr` | `{ "qrPayload" }` → kayıt veya invalid |
| GET | `/faculty/osce/stations/:stationId` | rubrik + aday |
| POST | `/faculty/osce/scores` | istasyon skoru |

### POST `/faculty/osce/scores` örnek body
```json
{
  "sessionId": "osce-1",
  "stationId": "station-3",
  "candidateId": "cand-zk",
  "checklist": { "q1": "yes", "q2": 4 },
  "globalScore": 72,
  "offlineSyncedAt": null
}
```

## 6.4 Bizim tarafta geçiş nasıl olacak?

1. `EXPO_PUBLIC_API_URL` → gerçek sunucu adresi  
2. Path’ler farklıysa `lib/api/endpoints.ts`  
3. Alan adları farklıysa `lib/api/adapters.ts` (ekranlar değişmez)  
4. Auth modeli (SSO / refresh token) netleşince oturum katmanı güncellenir  

---

# Bölüm 7 — Hocaya / backend ekibine: lütfen bunları söyleyin

Aşağıdakiler netleşince biz uygulamayı **gerçek API’ye entegre ederiz**. Eksik kalan her madde gecikme veya yanlış varsayım demektir.

## 7.1 Mutlaka netleşsin

1. **Base URL**  
   Staging ve production adresleri nedir? (HTTPS mi?)

2. **Giriş (Auth)**  
   - Şimdilik e-posta/şifre mi, yoksa doğrudan **SSO / OAuth2 / OIDC / SAML** mi?  
   - Token tipi nedir? (Bearer JWT mi?)  
   - Token ömrü ve yenileme (refresh) var mı?  
   - Rol bilgisi token içinde mi, yoksa ayrı endpoint’te mi? (`student` / `faculty` / başka roller?)

3. **Endpoint listesi**  
   Mobilin ihtiyaç duyduğu işler için path’ler:  
   login, me, dashboard, procedures, logs (GET+POST), shifts, swap, approvals (pending/approve/revision/qr), OSCE sessions/station/scores  
   → Mümkünse **OpenAPI / Swagger** veya Postman koleksiyonu.

4. **Örnek request / response JSON**  
   Her kritik endpoint için 1 örnek yeterli. Özellikle:  
   - login cevabı  
   - log oluşturma body + cevap  
   - pending approvals listesi  
   - OSCE station rubrik yapısı  

5. **Alan adı farkları**  
   Sizin JSON’da `exam_name` bizde `title` gibi farklılıklar olacak mı? Varsa sözlük paylaşın; adapter yazarız.

## 7.2 İş kuralları (ürün)

6. **Encounter ID**  
   Formatı nedir? HBYS’den anlık doğrulama olacak mı, yoksa serbest metin mi?

7. **Onay akışı**  
   Push bildirim zorunlu mu? İlk etapta sadece uygulama içi liste + QR yeterli mi?

8. **Roller**  
   Sadece öğrenci + öğretim üyesi mi? İntörn / asistan / anabilim dalı başkanı ayrı ekran ister mi?

9. **U-ÇEP / prosedür kataloğu**  
   Liste API’den mi gelecek, yoksa dönem başı statik JSON mı?

10. **OSCE**  
    İlk sürümde zorunlu mu, yoksa faz-2 mi? Offline notlama şart mı?

## 7.3 Güvenlik & uyumluluk

11. KVKK: mobil tarafta PII yasağı sizin tarafınızda da aynı mı?  
12. Test / staging ortamı ve demo kullanıcıları var mı?  
13. CORS / mobil cihazdan erişim kısıtı var mı?

## 7.4 Bizim net vaadimiz

Siz endpoint + örnek JSON + auth modelini verdikten sonra:

- Mock’u staging URL’ye çeviririz  
- Gerekirse adapter ile alan eşleriz  
- Aynı demo senaryoyu gerçek API üzerinde tekrarlarız:  
  **öğrenci log ekler → hoca listede görür → onaylar → öğrenci karnesinde “onaylandı”**

---

# Bölüm 8 — Tek cümlelik kapanış

**Demo hazır; ürün iskeleti ve haberleşme sözleşmesi net.**  
Sıradaki adım sizin (hoca / backend) endpoint ve auth kararlarınız; sonra entegrasyon (Sprint D).

İletişim / soru için bu belgeyi paylaşmanız yeterli: hem anlatım hem teknik sözleşme aynı dosyada.
