import fs from "fs";
import path from "path";
import sharp from "sharp";

const PUBLIC_DIR = path.resolve("public");

// Input/Output JSON (same file, we update in place)
const JSON_PATH = path.resolve("public/data/solid-colour/pilot-80.json");

// Sampling settings
const SAMPLE_SIZE = 36;          // resize target for averaging
const CENTER_CROP_RATIO = 0.60;  // sample the middle 60% of the image

function clamp01(n) {
  return Math.max(0, Math.min(1, n));
}

function rgbToHex(r, g, b) {
  const toHex = (x) => x.toString(16).padStart(2, "0").toUpperCase();
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

async function averageHexFromImage(diskPath) {
  // Load metadata to compute a central crop region
  const img = sharp(diskPath);
  const meta = await img.metadata();

  const w = meta.width || 0;
  const h = meta.height || 0;
  if (!w || !h) return null;

  // Central crop box
  const cropW = Math.max(1, Math.floor(w * clamp01(CENTER_CROP_RATIO)));
  const cropH = Math.max(1, Math.floor(h * clamp01(CENTER_CROP_RATIO)));
  const left = Math.max(0, Math.floor((w - cropW) / 2));
  const top = Math.max(0, Math.floor((h - cropH) / 2));

  // Extract center, resize, get raw pixels
  const { data, info } = await img
    .extract({ left, top, width: cropW, height: cropH })
    .resize(SAMPLE_SIZE, SAMPLE_SIZE, { fit: "fill" })
    .removeAlpha() // ensures 3 channels
    .raw()
    .toBuffer({ resolveWithObject: true });

  const channels = info.channels; // should be 3
  const pixelCount = SAMPLE_SIZE * SAMPLE_SIZE;

  let rSum = 0, gSum = 0, bSum = 0;
  for (let i = 0; i < pixelCount; i++) {
    const idx = i * channels;
    rSum += data[idx];
    gSum += data[idx + 1];
    bSum += data[idx + 2];
  }

  const r = Math.round(rSum / pixelCount);
  const g = Math.round(gSum / pixelCount);
  const b = Math.round(bSum / pixelCount);

  return rgbToHex(r, g, b);
}

function publicPathToDiskPath(publicPath) {
  if (!publicPath) return null;
  const normalized = publicPath.startsWith("/") ? publicPath : `/${publicPath}`;
  return path.join(PUBLIC_DIR, normalized);
}

async function main() {
  if (!fs.existsSync(JSON_PATH)) {
    console.error(`❌ JSON not found: ${JSON_PATH}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(JSON_PATH, "utf8");
  const rows = JSON.parse(raw);

  let ok = 0;
  let missing = 0;
  let hexAdded = 0;

  for (const row of rows) {
    const imgPublic = row["Swatch_Image"] || "";
    const diskPath = publicPathToDiskPath(imgPublic);

    if (!diskPath || !fs.existsSync(diskPath)) {
      row["Hex_Code"] = row["Hex_Code"] || "";
      row["Swatch_Status"] = "MISSING";
      missing++;
      continue;
    }

    // Keep your existing status lock too
    row["Swatch_Status"] = "OK";
    ok++;

    // Only compute if empty or if you want to force refresh:
    if (!row["Hex_Code"] || String(row["Hex_Code"]).trim() === "") {
      const hex = await averageHexFromImage(diskPath);
      row["Hex_Code"] = hex || "";
      if (hex) hexAdded++;
    }
  }

  fs.writeFileSync(JSON_PATH, JSON.stringify(rows, null, 2), "utf8");

  console.log(`✅ Processed ${rows.length} rows`);
  console.log(`🟢 Swatches OK: ${ok}`);
  console.log(`🔴 Swatches MISSING: ${missing}`);
  console.log(`🎨 Hex codes added/updated: ${hexAdded}`);
  console.log(`📄 Updated: ${JSON_PATH}`);
}

main().catch((e) => {
  console.error("❌ HEX extraction failed:", e);
  process.exit(1);
});
