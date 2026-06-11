import os
import csv
import colorsys
import re
import json
from PIL import Image

# -----------------------
# CONFIG
# -----------------------
IMAGES_DIR = os.path.join("public", "img", "solid-colour")  # adjust if your folder differs
OUTPUT_CSV = "colour-data-0001-1200.csv"
PILOT_JSON = os.path.join("public", "data", "solid-colour", "pilot-80.json")

START_N = 1
END_N = 1200

CENTER_CROP_KEEP = 0.55
WORK_SIZE = (120, 120)
IGNORE_WHITE_ABOVE = 245
IGNORE_BLACK_BELOW = 10


def clamp(v: float, lo: float, hi: float) -> float:
    return max(lo, min(hi, v))


def center_crop(img: Image.Image, keep: float) -> Image.Image:
    w, h = img.size
    keep = clamp(keep, 0.1, 1.0)
    cw, ch = int(w * keep), int(h * keep)
    left = (w - cw) // 2
    top = (h - ch) // 2
    return img.crop((left, top, left + cw, top + ch))


def is_ignored_pixel(r: int, g: int, b: int) -> bool:
    if r >= IGNORE_WHITE_ABOVE and g >= IGNORE_WHITE_ABOVE and b >= IGNORE_WHITE_ABOVE:
        return True
    if r <= IGNORE_BLACK_BELOW and g <= IGNORE_BLACK_BELOW and b <= IGNORE_BLACK_BELOW:
        return True
    return False


def dominant_rgb(img: Image.Image):
    img = img.convert("RGB")
    img = center_crop(img, CENTER_CROP_KEEP).resize(WORK_SIZE)

    counts = {}
    width, height = img.size
    pixels = img.load()
    for y in range(height):
        for x in range(width):
            r, g, b = pixels[x, y]
            if is_ignored_pixel(r, g, b):
                continue
            # light quantization to reduce noise
            key = ((r // 8) * 8, (g // 8) * 8, (b // 8) * 8)
            counts[key] = counts.get(key, 0) + 1

    if not counts:
        w, h = img.size
        return img.getpixel((w // 2, h // 2))

    return max(counts.items(), key=lambda kv: kv[1])[0]


def rgb_to_hex(r: int, g: int, b: int) -> str:
    return f"#{r:02X}{g:02X}{b:02X}"


def rgb_to_hsv(r: int, g: int, b: int):
    rf, gf, bf = r / 255.0, g / 255.0, b / 255.0
    h, s, v = colorsys.rgb_to_hsv(rf, gf, bf)
    return (h * 360.0, s * 100.0, v * 100.0)


def depth_score_from_brightness(v_percent: float) -> int:
    darkness = 100.0 - clamp(v_percent, 0.0, 100.0)
    score = int(round(1 + (darkness / 100.0) * 9))
    return int(clamp(score, 1, 10))


def build_image_index(images_dir: str) -> dict[int, str]:
    index: dict[int, str] = {}
    pattern = re.compile(r"^LC-GP-(\d+)\.webp$", re.IGNORECASE)

    for file_name in os.listdir(images_dir):
        match = pattern.match(file_name)
        if not match:
            continue

        sku_number = int(match.group(1))
        current = index.get(sku_number)

        # Prefer canonical 4-digit naming where available (e.g. 0100 over 00100).
        if current is None or len(file_name) < len(current):
            index[sku_number] = file_name

    return index


def merge_hex_into_pilot_json(hex_rows: list[dict[str, str]]) -> tuple[int, int, int]:
    if not os.path.isfile(PILOT_JSON):
        return (0, 0, 0)

    with open(PILOT_JSON, "r", encoding="utf-8") as f:
        pilot_data = json.load(f)

    if not isinstance(pilot_data, list):
        return (0, 0, 0)

    hex_by_sku = {
        row.get("Internal_SKU", ""): row.get("HEX", "")
        for row in hex_rows
        if row.get("Internal_SKU") and row.get("HEX")
    }

    updated = 0
    matched = 0
    for item in pilot_data:
        if not isinstance(item, dict):
            continue

        sku = item.get("Internal_SKU", "")
        new_hex = hex_by_sku.get(sku)
        if not new_hex:
            continue

        matched += 1
        if item.get("Hex_Code") != new_hex:
            item["Hex_Code"] = new_hex
            updated += 1

    with open(PILOT_JSON, "w", encoding="utf-8", newline="\n") as f:
        json.dump(pilot_data, f, indent=2, ensure_ascii=False)
        f.write("\n")

    return (matched, updated, len(pilot_data))


def main():
    if not os.path.isdir(IMAGES_DIR):
        raise FileNotFoundError(f"Images folder not found: {IMAGES_DIR}")

    image_index = build_image_index(IMAGES_DIR)

    rows = []
    missing = []

    for n in range(START_N, END_N + 1):
        sku = f"LC-GP-{n:04d}"
        file_name = image_index.get(n)
        if not file_name:
            missing.append(sku)
            continue

        img_path = os.path.join(IMAGES_DIR, file_name)

        with Image.open(img_path) as img:
            r, g, b = dominant_rgb(img)

        hex_code = rgb_to_hex(r, g, b)
        hue_deg, sat, bright = rgb_to_hsv(r, g, b)
        depth = depth_score_from_brightness(bright)

        rows.append({
            "Internal_SKU": sku,
            "HEX": hex_code,
            "Hue_Degrees": f"{hue_deg:.1f}",
            "Saturation_Value": f"{sat:.1f}",
            "Brightness_Value": f"{bright:.1f}",
            "Auto_Depth_Score": str(depth),
        })

    with open(OUTPUT_CSV, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(
            f,
            fieldnames=["Internal_SKU","HEX","Hue_Degrees","Saturation_Value","Brightness_Value","Auto_Depth_Score"]
        )
        writer.writeheader()
        writer.writerows(rows)

    print(f"✅ Wrote {OUTPUT_CSV} with {len(rows)} rows")
    if missing:
        print(f"⚠️ Missing {len(missing)} images. First 15: {missing[:15]}")

    matched, updated, total = merge_hex_into_pilot_json(rows)
    if total > 0:
        print(f"✅ Updated {updated} / {matched} matched rows in {PILOT_JSON} (total rows: {total})")
    else:
        print(f"ℹ️ Skipped JSON merge; file missing or invalid: {PILOT_JSON}")


if __name__ == "__main__":
    main()
