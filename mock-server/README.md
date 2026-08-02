# KOÜ Tıp — Mock API Sunucusu

Sahte backend. Expo uygulaması buraya HTTP istek atar. Hoca gerçek API’yi verince sadece mobil taraftaki `EXPO_PUBLIC_API_URL` (ve gerekirse adapter) değişir; bu klasör lokal geliştirme için kalır veya kapatılır.

## Mimari

```
Expo (React Native)
  └─ lib/api/client.ts     ← SUNUCU DEĞİL; sadece fetch wrapper
       │  HTTP
       ▼
mock-server (Node + Express)  ← şimdiki sahte backend
       │
       └── sonra → hocanın gerçek REST API’si
```

**Arada ikinci bir backend katmanı yok.** Mobil uygulama doğrudan REST endpoint’lere gider.

Dil: **JavaScript (Node.js + Express)** — Expo ile aynı ekosistem, kurulum basit. Hoca’nın backend’i başka dilde (C#, Java, Python…) olabilir; önemli olan HTTP JSON sözleşmesi.

## Çalıştırma

```bash
cd mock-server
npm install
npm start
```

Geliştirmede otomatik yenileme:

```bash
npm run dev
```

Varsayılan: `http://0.0.0.0:3001` (LAN’dan erişilebilir).

Telefonda Expo kullanıyorsan Mac’inin yerel IP’sini kullan:

```
EXPO_PUBLIC_API_URL=http://192.168.x.x:3001
```

## Demo hesaplar

| Rol | E-posta | Şifre |
|-----|---------|-------|
| Öğrenci | `ahmet.yilmaz@kocaeli.edu.tr` veya `190101044` | `ogrenci123` |
| Akademisyen | `ayse.kaya@kocaeli.edu.tr` | `hoca123` |

## Sprint A endpoint’leri

```bash
# Sağlık
curl http://localhost:3001/health

# Giriş
curl -s -X POST http://localhost:3001/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"ahmet.yilmaz@kocaeli.edu.tr","password":"ogrenci123","role":"student"}'

# Token ile (TOKEN yerine login cevabındaki token)
curl -s http://localhost:3001/student/dashboard \
  -H "Authorization: Bearer TOKEN"

curl -s http://localhost:3001/student/logs \
  -H "Authorization: Bearer TOKEN"

curl -s http://localhost:3001/faculty/approvals/pending \
  -H "Authorization: Bearer FAKULTE_TOKEN"
```

| Method | Path | Rol |
|--------|------|-----|
| GET | `/health` | — |
| POST | `/auth/login` | — |
| GET | `/auth/me` | herhangi |
| GET | `/student/dashboard` | student |
| GET | `/student/procedures` | student |
| GET | `/student/logs` | student |
| GET | `/student/shifts` | student |
| GET | `/student/supervisors` | student |
| GET | `/student/colleagues` | student |
| GET | `/faculty/approvals/pending` | faculty |

Yazma endpoint’leri (POST log, approve…) **Sprint B**.

## Sprint B endpoint’leri

| Method | Path | Rol |
|--------|------|-----|
| POST | `/student/logs` | student |
| POST | `/student/shifts/:id/swap-request` | student |
| POST | `/faculty/approvals/:id/approve` | faculty |
| POST | `/faculty/approvals/:id/request-revision` | faculty |
| POST | `/faculty/approvals/qr` | faculty |

```bash
# Log oluştur (push)
curl -s -X POST http://localhost:3001/student/logs \
  -H "Authorization: Bearer TOKEN" -H 'Content-Type: application/json' \
  -d '{"procedureId":"proc-1","encounterId":"ENC-2026-100","ageGroup":"adult","sex":"m","role":"performed","supervisorId":"sup-2","approvalMethod":"push"}'

# Onayla
curl -s -X POST http://localhost:3001/faculty/approvals/LOG_ID/approve \
  -H "Authorization: Bearer FTOKEN" -H 'Content-Type: application/json' \
  -d '{"note":"Uygun"}'
```
