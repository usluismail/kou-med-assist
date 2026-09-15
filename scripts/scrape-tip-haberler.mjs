/**
 * KOÜ Tıp haber scraper — canlı API (tip.kocaeli.edu.tr sayfasının kullandığı backend).
 *
 * Akış:
 *  1) Admin/Isp/GetIspCodeByName?IspWebUrl=tip.kocaeli.edu.tr → code (1019)
 *  2) News/GetAll?TranslationCode=0&Count=6  (header: code)
 *  3) FileOperation?filePath=<thumbnailUrl> → görseller
 *
 * Kullanım:
 *   node scripts/scrape-tip-haberler.mjs
 *   node scripts/scrape-tip-haberler.mjs --download --out=./tmp/featured.json
 */
const fs = require("fs");
const path = require("path");

const API = "https://api.kocaeli.edu.tr/api/";
const SITE = "tip.kocaeli.edu.tr";

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

async function getNews(code, count = 6) {
  const url = `${API}News/GetAll?TranslationCode=0&Count=${count}`;
  const json = await getJson(url, { code: String(code) });
  return json?.data || [];
}

async function downloadImage(code, thumbnailUrl, destPath) {
  const url = `${API}FileOperation?filePath=${encodeURIComponent(thumbnailUrl)}`;
  const res = await fetch(url, {
    headers: {
      Accept: "*/*",
      "User-Agent": "kou-med-assist-scraper/1.0",
      code: String(code),
    },
  });
  if (!res.ok) throw new Error(`image ${res.status} ${thumbnailUrl}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 2000 || buf[0] === 0x3c) throw new Error("geçersiz görsel");
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, buf);
  return buf.length;
}

async function main() {
  const download = process.argv.includes("--download");
  const outArg = process.argv.find((a) => a.startsWith("--out="));
  const countArg = process.argv.find((a) => a.startsWith("--count="));
  const count = countArg ? Number(countArg.slice(8)) : 6;

  const code = await getIspCode();
  const raw = await getNews(code, count);

  const root = path.join(__dirname, "..");
  const assetDir = path.join(root, "assets/campus/featured");
  const publicDir = path.join(root, "mock-server/public/featured");

  const items = [];
  for (let i = 0; i < raw.length; i++) {
    const it = raw[i];
    const n = i + 1;
    const thumb = it.thumbnailUrl || "";
    let imageFile = null;
    let imagePath = null;

    if (download && thumb) {
      const ext = thumb.toLowerCase().endsWith(".png")
        ? ".png"
        : thumb.toLowerCase().endsWith(".webp")
          ? ".webp"
          : ".jpg";
      imageFile = `featured-${n}${ext}`;
      const size = await downloadImage(code, thumb, path.join(assetDir, imageFile));
      fs.mkdirSync(publicDir, { recursive: true });
      fs.copyFileSync(path.join(assetDir, imageFile), path.join(publicDir, imageFile));
      imagePath = `/featured/${imageFile}`;
      console.error("OK", imageFile, size, it.title);
    }

    items.push({
      id: `news-${n}`,
      remoteId: it.id,
      title: it.title,
      summary: it.summary || it.title,
      publishedAt: (it.createdDate || "").slice(0, 10),
      sourceUrl: it.slug
        ? `https://tip.kocaeli.edu.tr/haberler/${it.slug}`
        : "https://tip.kocaeli.edu.tr/haberler",
      source: "news",
      badge: "HABER",
      slug: it.slug,
      thumbnailUrl: thumb,
      imagePath,
      imageFile,
    });
  }

  const payload = {
    scrapedAt: new Date().toISOString(),
    origin: "api.kocaeli.edu.tr",
    site: SITE,
    ispCode: code,
    count: items.length,
    items,
  };

  if (outArg) {
    const p = outArg.slice(6);
    fs.mkdirSync(path.dirname(path.resolve(p)), { recursive: true });
    fs.writeFileSync(p, JSON.stringify(payload, null, 2), "utf8");
    console.error("wrote", p);
  }

  console.log(JSON.stringify(payload, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
