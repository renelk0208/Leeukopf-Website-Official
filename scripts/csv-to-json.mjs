import fs from "fs";
import path from "path";
import Papa from "papaparse";

const INPUT_CSV = path.resolve("public/data/pilot-80.csv"); // <-- adjust if your CSV is elsewhere
const OUTPUT_JSON = path.resolve("public/data/solid-colour/pilot-80.json");

// Where your images live on disk:
const PUBLIC_DIR = path.resolve("public"); // do not change unless your structure is different

const csvText = fs.readFileSync(INPUT_CSV, "utf8");

// Parse CSV with headers
const parsed = Papa.parse(csvText, {
  header: true,
  skipEmptyLines: true,
});

const fileExistsForPublicPath = (publicPath) => {
  if (!publicPath) return false;
  // publicPath should look like "/img/solid-colour/LC-GP-0001.webp"
  // Normalize: ensure it starts with "/"
  const normalized = publicPath.startsWith("/") ? publicPath : `/${publicPath}`;
  const diskPath = path.join(PUBLIC_DIR, normalized); // -> public/img/...
  return fs.existsSync(diskPath);
};

// Basic cleanup: trim keys + values
const rows = (parsed.data || []).map((row) => {
  const clean = {};
  for (const [k, v] of Object.entries(row)) {
    const key = (k || "").trim();
    const val = typeof v === "string" ? v.trim() : v;
    clean[key] = val;
  }

  const img = clean["Swatch_Image"] || "";
  clean["Swatch_Status"] = fileExistsForPublicPath(img) ? "OK" : "MISSING";

  return clean;
});

// Ensure output folder exists
fs.mkdirSync(path.dirname(OUTPUT_JSON), { recursive: true });

// Write pretty JSON
fs.writeFileSync(OUTPUT_JSON, JSON.stringify(rows, null, 2), "utf8");

const okCount = rows.filter((row) => row["Swatch_Status"] === "OK").length;
const missingCount = rows.filter((row) => row["Swatch_Status"] === "MISSING").length;

console.log(`✅ Converted ${rows.length} rows`);
console.log(`🟢 Swatches OK: ${okCount}`);
console.log(`🔴 Swatches MISSING: ${missingCount}`);
console.log(`📄 ${OUTPUT_JSON}`);
