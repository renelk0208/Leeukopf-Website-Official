import fs from "fs";
import path from "path";
import Papa from "papaparse";

const INPUT_CSV = path.resolve("public/data/pilot-80.csv"); // <-- adjust if your CSV is elsewhere
const OUTPUT_JSON = path.resolve("public/data/solid-colour/pilot-80.json");

const csvText = fs.readFileSync(INPUT_CSV, "utf8");

// Parse CSV with headers
const parsed = Papa.parse(csvText, {
  header: true,
  skipEmptyLines: true,
});

// Basic cleanup: trim keys + values
const rows = (parsed.data || []).map((row) => {
  const clean = {};
  for (const [k, v] of Object.entries(row)) {
    const key = (k || "").trim();
    const val = typeof v === "string" ? v.trim() : v;
    clean[key] = val;
  }
  return clean;
});

// Ensure output folder exists
fs.mkdirSync(path.dirname(OUTPUT_JSON), { recursive: true });

// Write pretty JSON
fs.writeFileSync(OUTPUT_JSON, JSON.stringify(rows, null, 2), "utf8");

console.log(`✅ Converted ${rows.length} rows`);
console.log(`📄 ${OUTPUT_JSON}`);
