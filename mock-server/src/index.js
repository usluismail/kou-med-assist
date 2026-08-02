const express = require("express");
const cors = require("cors");
const { createDb } = require("./db");
const { createRoutes } = require("./routes");

const PORT = Number(process.env.PORT) || 3001;
const HOST = process.env.HOST || "0.0.0.0";

const db = createDb();
const app = express();

app.use(cors());
app.use(express.json());

app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()}  ${req.method} ${req.path}`);
  next();
});

app.use(createRoutes(db));

app.use((_req, res) => {
  res.status(404).json({ error: "Not Found", message: "Endpoint bulunamadı" });
});

app.listen(PORT, HOST, () => {
  console.log("");
  console.log("  KOÜ Tıp Mock API");
  console.log(`  http://localhost:${PORT}`);
  console.log(`  http://<LAN-IP>:${PORT}  ← telefonda Expo için`);
  console.log("");
  console.log("  Demo hesaplar:");
  console.log("  öğrenci  → ahmet.yilmaz@kocaeli.edu.tr / ogrenci123");
  console.log("           (veya no: 190101044 / ogrenci123)");
  console.log("  hoca     → ayse.kaya@kocaeli.edu.tr / hoca123");
  console.log("");
  console.log("  GET /health ile kontrol edin");
  console.log("");
});
