/**
 * KOÜ Tıp akademik kadro scraper — anabilim dalı öğretim üyeleri sayfaları.
 *
 * Akış:
 *  1) Admin/Isp/GetIspCodeByName?IspWebUrl=tip.kocaeli.edu.tr → code (1019)
 *  2) Page/GetAll → "* Öğretim Üyeleri" sayfalarını filtrele
 *  3) Page/GetBySlug → HTML parse (ad, unvan, e-posta, rol)
 *
 * Telefon alınmaz (çoğu santral). E-posta zorunlu alan.
 *
 * Kullanım:
 *   node scripts/scrape-tip-kadro.mjs
 *   node scripts/scrape-tip-kadro.mjs --out=./mock-server/data/faculty-directory-live.json
 *   node scripts/scrape-tip-kadro.mjs --limit=3   # deneme
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API = "https://api.kocaeli.edu.tr/api/";
const SITE = "tip.kocaeli.edu.tr";

/** Unvan + aynı satırdaki isim (</p> → \n ile satır kesilir) */
const TITLE_RE =
  /((?:Prof\.?\s*Dr\.|Doç\.?\s*Dr\.|Doc\.?\s*Dr\.|Yrd\.?\s*Doç\.?\s*Dr\.|Dr\.?\s*Öğr\.?\s*Üyesi|Dr\.?\s*Ogr\.?\s*Uyesi|Öğr\.?\s*Gör\.?(?:\s*Dr\.)?|Uzm\.?\s*Dr\.))\s+([^\n]{2,120})/gi;

async function getJson(url, headers = {}) {
  const res = await fetch(url, {
    headers: {
      Accept: "*/*",
      "User-Agent": "kou-med-assist-scraper/1.0",
      ...headers,
    },
  });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

async function getIspCode() {
  const url = `${API}Admin/Isp/GetIspCodeByName?IspWebUrl=${encodeURIComponent(SITE)}`;
  const json = await getJson(url);
  const code = json?.data?.code;
  if (!code) throw new Error("ISP code alınamadı");
  return code;
}

async function listStaffPages(code) {
  const url = `${API}Page/GetAll?TranslationCode=0&Count=500`;
  const json = await getJson(url, { code: String(code) });
  return (json?.data || []).filter(
    (p) =>
      /öğretim üyeleri/i.test(p.title || "") ||
      /ogretim-uyeleri/i.test(p.slug || "")
  );
}

async function getPageBySlug(code, slug) {
  const url = `${API}Page/GetBySlug?slug=${encodeURIComponent(slug)}&TranslationCode=0`;
  const json = await getJson(url, { code: String(code) });
  return json?.data?.page || null;
}

function decodeEntities(s) {
  return s
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

/** HTML → düz metin (e-posta parçaları birleşsin diye tag’ler boşlukla silinir) */
function htmlToText(html) {
  return decodeEntities(
    String(html || "")
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n")
      .replace(/<\/div>/gi, "\n")
      .replace(/<\/td>/gi, "\n")
      .replace(/<\/tr>/gi, "\n\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/\u200b/g, "")
      .replace(/[ \t]+/g, " ")
      .replace(/\n{2,}/g, "\n")
      .trim()
  );
}

function normalizeTitle(raw) {
  const t = raw.replace(/\s+/g, " ").trim();
  if (/^prof/i.test(t)) return "Prof. Dr.";
  if (/^do[cç]/i.test(t) && !/^yrd/i.test(t)) return "Doç. Dr.";
  if (/^yrd/i.test(t)) return "Dr. Öğr. Üyesi";
  if (/öğr\.?\s*üyesi|ogr\.?\s*uyesi/i.test(t)) return "Dr. Öğr. Üyesi";
  if (/öğr\.?\s*gör|ogr\.?\s*gor/i.test(t)) return "Öğr. Gör.";
  if (/^uzm/i.test(t)) return "Uzm. Dr.";
  return t;
}

function normalizeName(title, namePart) {
  const name = namePart
    .replace(/\s+/g, " ")
    .replace(/\s*(Anabilim|Detaylı|E-posta|Eposta|Tel|Rektör|DOSYA).*$/i, "")
    .replace(/[^A-Za-zÇĞİÖŞÜÂÎÛçğıöşüâîû .'-]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (name.length < 2) return null;
  return `${title} ${name}`.replace(/\s+/g, " ").trim();
}

function departmentFromPageTitle(pageTitle) {
  return String(pageTitle || "")
    .replace(/\s*Öğretim Üyeleri\s*$/i, "")
    .replace(/\s*Ogretim Uyeleri\s*$/i, "")
    .trim();
}

function slugify(s) {
  return String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

function extractEmailNear(text, fromIndex, toIndex) {
  const window = text.slice(fromIndex, toIndex);
  // "E-posta: a@b" veya parçalanmış "a @ b"
  const joined = window.replace(/\s*@\s*/g, "@");
  const m =
    joined.match(
      /e-?posta\s*:\s*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i
    ) ||
    joined.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.edu\.tr)/i) ||
    joined.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i);
  return m ? m[1].toLowerCase() : null;
}

function isChairNear(text, fromIndex, toIndex) {
  const window = text.slice(fromIndex, toIndex);
  return /anabilim\s+dal[ıi]\s+ba[sş]kan[ıi]/i.test(window);
}

function parseMembersFromHtml(html, department, pageSlug) {
  const text = htmlToText(html);
  const matches = [...text.matchAll(TITLE_RE)];
  const members = [];
  const seenEmail = new Set();

  for (let i = 0; i < matches.length; i++) {
    const m = matches[i];
    const titleRaw = m[1];
    const namePart = m[2];
    const title = normalizeTitle(titleRaw);
    const name = normalizeName(title, namePart);
    if (!name || name.length < 8) continue;

    const start = m.index ?? 0;
    const end = i + 1 < matches.length ? matches[i + 1].index ?? text.length : text.length;
    const email = extractEmailNear(text, start, end);
    if (!email) continue; // e-posta zorunlu
    if (seenEmail.has(email)) continue;
    seenEmail.add(email);

    const role = isChairNear(text, start, end) ? "chair" : "faculty";

    members.push({
      id: `fd-${slugify(pageSlug)}-${slugify(email.split("@")[0])}`,
      name,
      title,
      department,
      office: null,
      email,
      phone: null,
      role,
      sourceSlug: pageSlug,
      sourceUrl: `https://tip.kocaeli.edu.tr/${pageSlug}`,
    });
  }

  return members;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const outArg = process.argv.find((a) => a.startsWith("--out="));
  const limitArg = process.argv.find((a) => a.startsWith("--limit="));
  const limit = limitArg ? Number(limitArg.slice(8)) : Infinity;

  const code = await getIspCode();
  let pages = await listStaffPages(code);
  pages = pages.sort((a, b) => String(a.title).localeCompare(String(b.title), "tr"));
  if (Number.isFinite(limit)) pages = pages.slice(0, limit);

  console.error(`ISP ${code} · ${pages.length} anabilim dalı sayfası`);

  const all = [];
  const byDept = [];

  for (const page of pages) {
    try {
      const detail = await getPageBySlug(code, page.slug);
      if (!detail?.content) {
        console.error("SKIP boş", page.title);
        continue;
      }
      const department = departmentFromPageTitle(detail.title || page.title);
      const members = parseMembersFromHtml(detail.content, department, page.slug);
      console.error(
        `OK ${department}: ${members.length} kişi (${members.filter((m) => m.role === "chair").length} başkan)`
      );
      byDept.push({
        department,
        slug: page.slug,
        count: members.length,
      });
      all.push(...members);
      await sleep(80);
    } catch (e) {
      console.error("ERR", page.title, e.message);
    }
  }

  // E-posta tekilleştir (aynı hoca birden fazla sayfada olabilir)
  const uniq = [];
  const emails = new Set();
  for (const m of all) {
    if (emails.has(m.email)) continue;
    emails.add(m.email);
    uniq.push(m);
  }

  // UI sıralaması: başkanlar önce, sonra isim
  uniq.sort((a, b) => {
    const roleRank = (r) => (r === "chair" ? 0 : 1);
    const d = String(a.department).localeCompare(String(b.department), "tr");
    if (d !== 0) return d;
    const rr = roleRank(a.role) - roleRank(b.role);
    if (rr !== 0) return rr;
    return String(a.name).localeCompare(String(b.name), "tr");
  });

  // API sözleşmesi alanları (sourceSlug/sourceUrl seed’de kalabilir)
  const members = uniq.map(
    ({ id, name, title, department, office, email, phone, role, sourceSlug, sourceUrl }) => ({
      id,
      name,
      title,
      department,
      office,
      email,
      phone,
      role,
      sourceSlug,
      sourceUrl,
    })
  );

  const payload = {
    scrapedAt: new Date().toISOString(),
    origin: "api.kocaeli.edu.tr",
    site: SITE,
    ispCode: code,
    departmentCount: byDept.length,
    memberCount: members.length,
    withEmail: members.filter((m) => m.email).length,
    departments: byDept,
    members,
  };

  const defaultOut = path.join(
    __dirname,
    "..",
    "mock-server/data/faculty-directory-live.json"
  );
  const outPath = outArg ? path.resolve(outArg.slice(6)) : defaultOut;
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(payload, null, 2), "utf8");
  console.error(`wrote ${outPath} (${members.length} üye)`);
  console.log(
    JSON.stringify(
      {
        scrapedAt: payload.scrapedAt,
        departmentCount: payload.departmentCount,
        memberCount: payload.memberCount,
        sample: members.slice(0, 3),
      },
      null,
      2
    )
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
