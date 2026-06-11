"""
gelitup_sort_by_colour_family.py
---------------------------------
Reads every product swatch image under:
    gelitup-app/public/gelitup-content/product-images/COLORS/
        CAT EYE/  FRENCH/  GLASS EFFECT/  GLITTERS/  JELLY/
        METALLIC COLLECTION/  NEW YORK/  NUDE/  PASTEL/  PEARL/
        PMA/  RONE/  SHIMMER COLORS/  SNOWFLAKE/  SOLID GEL POLISH/
        SPIX & SPEX/  THERMO/  TUTTI FRUTTI GLASS/  …

Uses Pillow to sample each image's dominant foreground colour, converts to
HSB, and classifies into a colour family.  Images are COPIED (never moved or
deleted) into:
    output/gelitup_colour_families/
        Red/
        Pink/
        Purple/
        Blue/
        Green/
        Yellow/
        Orange/
        Brown_Nude/
        White_Clear/
        Black/
        Grey_Neutral/
        Glitter_Specialty/   ← glitters, pearls, shimmers, holographics
        Other_Specialty/     ← thermo, glass, snowflake, spix etc.

A CSV summary is written to:
    output/gelitup_colour_families/_ALL_gelitup_colours.csv

Run from the repo root:
    python scripts/gelitup_sort_by_colour_family.py

Requirements:  Pillow (pip install Pillow)
"""

import colorsys
import csv
import os
import shutil
from pathlib import Path

from PIL import Image

# ── paths ──────────────────────────────────────────────────────────────────────
REPO_ROOT   = Path(__file__).resolve().parent.parent
COLORS_ROOT = REPO_ROOT / "gelitup-app" / "public" / "gelitup-content" / "product-images" / "COLORS"
OUTPUT_DIR  = REPO_ROOT / "output" / "gelitup_colour_families"

# ── specialty folder names ─────────────────────────────────────────────────────
# Source folders that are classified as glitter/shimmer type regardless of colour
GLITTER_SPECIALTY_FOLDERS = {
    "glitters", "metallic collection", "pearl", "shimmer colors",
    "spix & spex", "dreamy cat eye", "rose quartz cat eye",
    "glass cat eye", "glass effect", "tutti frutti glass",
}

# Source folders that are classified as "other specialty" (effect polishes)
OTHER_SPECIALTY_FOLDERS = {
    "thermo", "snowflake", "pma", "rone", "new york",
    "fan",  # cat eye fan brush sub-collection
}

# ── hue classification ─────────────────────────────────────────────────────────
# (name, hue_start_deg, hue_end_deg)  — checked in order, wrap-around handled
HUE_FAMILIES = [
    ("Red",         345, 360),
    ("Red",           0,  12),
    ("Orange",       12,  35),
    ("Yellow",       35,  65),
    ("Green",        65, 165),
    ("Blue",        165, 255),
    ("Purple",      255, 310),
    ("Pink",        310, 345),
]

# ── thresholds ─────────────────────────────────────────────────────────────────
BG_BRIGHTNESS_CUTOFF   = 230   # pixels brighter than this (per channel) are background
DARK_BG_CUTOFF         = 20    # pixels darker than this are pure-black background
MIN_SATURATION_HSV     = 0.06  # below this → achromatic (grey/white/black/nude)
MIN_SAMPLE_PIXELS      = 10    # need at least this many foreground pixels


# ── helpers ────────────────────────────────────────────────────────────────────

def dominant_foreground_colour(path: Path) -> tuple[int, int, int]:
    """
    Return (R, G, B) of the dominant foreground colour in a swatch image.
    Strips near-white and near-black background pixels, then averages what's left.
    Falls back to full-image average if too few foreground pixels are found.
    """
    img = Image.open(path).convert("RGB")
    img = img.resize((80, 80), Image.LANCZOS)
    pixels = list(img.getdata())

    # Filter out obvious background (near-white or near-black)
    fg = [
        (r, g, b) for r, g, b in pixels
        if not (r > BG_BRIGHTNESS_CUTOFF and g > BG_BRIGHTNESS_CUTOFF and b > BG_BRIGHTNESS_CUTOFF)
        and not (r < DARK_BG_CUTOFF and g < DARK_BG_CUTOFF and b < DARK_BG_CUTOFF)
    ]

    if len(fg) < MIN_SAMPLE_PIXELS:
        fg = pixels  # fallback: use all pixels

    r = int(sum(p[0] for p in fg) / len(fg))
    g = int(sum(p[1] for p in fg) / len(fg))
    b = int(sum(p[2] for p in fg) / len(fg))
    return r, g, b


def rgb_to_hex(r: int, g: int, b: int) -> str:
    return f"#{r:02X}{g:02X}{b:02X}"


def classify_colour(r: int, g: int, b: int) -> str:
    """Return a colour family name from RGB using HSV."""
    h, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
    hue = h * 360
    sat = s * 100
    bri = v * 100

    # Very dark → Black
    if bri < 12:
        return "Black"

    # Very light + low sat → White_Clear
    if bri > 88 and sat < 10:
        return "White_Clear"

    # Achromatic → route by brightness
    if sat < MIN_SATURATION_HSV * 100:
        if bri > 75:
            return "White_Clear"
        if bri < 25:
            return "Black"
        # Warm mid-tone low-sat → Brown_Nude
        if hue <= 45 or hue >= 330:
            if 25 <= bri <= 75:
                return "Brown_Nude"
        return "Grey_Neutral"

    # Low-sat warm mid-tones → Brown_Nude
    if sat < 25 and 20 <= bri <= 80 and (hue <= 45 or hue >= 330):
        return "Brown_Nude"

    # Hue-based
    for family, start, end in HUE_FAMILIES:
        if start <= end:
            if start <= hue <= end:
                return family
        else:
            if hue >= start or hue <= end:
                return family

    return "Unclassified"


def source_family(rel_parts: list[str]) -> str | None:
    """
    Return a forced colour family based on the source folder name, or None to
    fall through to pixel analysis.  rel_parts is the list of folder names
    above the file (relative to COLORS_ROOT).
    """
    # Check every ancestor folder (lowest-level / most-specific first)
    for part in reversed(rel_parts):
        p = part.strip().lower()
        if p in GLITTER_SPECIALTY_FOLDERS:
            return "Glitter_Specialty"
        if p in OTHER_SPECIALTY_FOLDERS:
            return "Other_Specialty"
        # NUDE and PASTEL folders still get pixel-classified
        # so they land in the right hue family
    return None


# ── main ───────────────────────────────────────────────────────────────────────

def main():
    if not COLORS_ROOT.exists():
        raise FileNotFoundError(f"Source folder not found:\n  {COLORS_ROOT}")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    image_exts = {".jpg", ".jpeg", ".png", ".webp"}
    records: list[dict] = []
    family_counts: dict[str, int] = {}
    errors: list[str] = []

    all_images = [
        p for p in COLORS_ROOT.rglob("*")
        if p.is_file() and p.suffix.lower() in image_exts
    ]
    total = len(all_images)
    print(f"Found {total} images under {COLORS_ROOT.name}")
    print("Classifying…\n")

    for idx, img_path in enumerate(sorted(all_images), 1):
        rel = img_path.relative_to(COLORS_ROOT)
        rel_parts = list(rel.parts[:-1])   # folder path segments (no filename)
        source_subfolder = " / ".join(rel_parts) if rel_parts else "(root)"

        try:
            # Check for forced specialty family first
            family = source_family(rel_parts)

            if family is None:
                # Pixel-based analysis
                r, g, b = dominant_foreground_colour(img_path)
                hex_val  = rgb_to_hex(r, g, b)
                h, s, v  = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
                hue      = round(h * 360, 1)
                sat      = round(s * 100, 1)
                bri      = round(v * 100, 1)
                family   = classify_colour(r, g, b)
            else:
                # Still extract colour info for the CSV even for specialty items
                r, g, b  = dominant_foreground_colour(img_path)
                hex_val  = rgb_to_hex(r, g, b)
                h, s, v  = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
                hue      = round(h * 360, 1)
                sat      = round(s * 100, 1)
                bri      = round(v * 100, 1)

            # Copy image to output family folder
            dest_dir  = OUTPUT_DIR / family
            dest_dir.mkdir(exist_ok=True)
            dest_file = dest_dir / img_path.name

            # If a file with the same name exists in the dest, prefix with source subfolder
            if dest_file.exists() and dest_file.resolve() != img_path.resolve():
                prefix    = rel_parts[-1].replace(" ", "_") + "__" if rel_parts else ""
                dest_file = dest_dir / (prefix + img_path.name)

            shutil.copy2(img_path, dest_file)

            records.append({
                "filename":       img_path.name,
                "dest_filename":  dest_file.name,
                "source_folder":  source_subfolder,
                "colour_family":  family,
                "hex":            hex_val,
                "hue_degrees":    hue,
                "saturation_pct": sat,
                "brightness_pct": bri,
            })
            family_counts[family] = family_counts.get(family, 0) + 1

            if idx % 50 == 0 or idx == total:
                print(f"  [{idx:>4}/{total}] processed…")

        except Exception as exc:
            errors.append(f"{img_path.name}: {exc}")
            print(f"  ⚠️  {img_path.name}: {exc}")

    # ── write CSV ──────────────────────────────────────────────────────────────
    csv_path = OUTPUT_DIR / "_ALL_gelitup_colours.csv"
    fieldnames = ["filename", "dest_filename", "source_folder", "colour_family",
                  "hex", "hue_degrees", "saturation_pct", "brightness_pct"]
    with csv_path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(records)

    # ── summary ────────────────────────────────────────────────────────────────
    print("\n" + "─" * 55)
    print(f"{'COLOUR FAMILY':<25} {'IMAGES':>7}")
    print("─" * 55)
    for family, count in sorted(family_counts.items()):
        print(f"  {family:<23} {count:>7}")
    print("─" * 55)
    print(f"  {'TOTAL':<23} {len(records):>7}")
    if errors:
        print(f"\n  ⚠️  {len(errors)} errors — see above")
    print(f"\n✅  CSV summary  → {csv_path}")
    print(f"📂  Output folder → {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
