"""
sort_colours_by_family.py
--------------------------
Reads all gel-polish products from public/products.csv and merges HEX / hue
data from colour-data-0001-1200.csv, then sorts every colour into a named
colour-family folder under output/colour_families/.

Run from the repo root:
    python scripts/sort_colours_by_family.py

Output:
    output/colour_families/
        Red.csv
        Pink.csv
        Purple.csv
        Blue.csv
        Green.csv
        Yellow.csv
        Orange.csv
        Brown_Nude.csv
        White_Clear.csv
        Black.csv
        Grey_Neutral.csv
        Glitter_Special.csv
        Unclassified.csv
        _ALL_colours.csv          <- complete merged file
"""

import csv
import os
import re
from pathlib import Path

# ── paths ──────────────────────────────────────────────────────────────────────
REPO_ROOT   = Path(__file__).resolve().parent.parent
PRODUCTS_CSV = REPO_ROOT / "public" / "products.csv"
COLOUR_DATA  = REPO_ROOT / "colour-data-0001-1200.csv"
OUTPUT_DIR   = REPO_ROOT / "output" / "colour_families"

# ── colour-family hue ranges  (degrees, 0-360) ────────────────────────────────
# A colour is achromatic when Saturation < ACHROMATIC_SAT_THRESHOLD
ACHROMATIC_SAT_THRESHOLD = 12.0

HUE_FAMILIES = [
    # (name,       hue_start, hue_end)   — ranges are inclusive, wrap-around handled
    ("Red",        345, 360),
    ("Red",          0,  12),
    ("Orange",      12,  35),
    ("Yellow",      35,  65),
    ("Green",       65, 165),
    ("Blue",       165, 255),
    ("Purple",     255, 310),
    ("Pink",       310, 345),
]

# Subcategories that are always "special" regardless of hue
SPECIAL_SUBCATEGORIES = {
    "glitter", "glitters",
    "chrome", "chrome powder",
    "holographic",
    "pigment", "pigments",
    "shimmer",
    "aurora", "duochrome",
    "flakies", "flakie",
}

# Subcategories that fall through to normal hue classification
GEL_POLISH_SUBCATEGORIES = {
    "classic colors", "classic colours",
    "cat eye", "cat eyes",
    "gel polish", "cream", "cream collection", "solid",
    "sheer", "jelly", "neon",
    "metallic", "glitter gel",   # glitter gel gets hue-classified like any other
    "colour builder gel",
}

# Fallback: name-keyword → family (for items with no HEX data)
NAME_KEYWORDS = {
    "red":    "Red",
    "scarlet":"Red",
    "cherry": "Red",
    "ruby":   "Red",
    "orange": "Orange",
    "coral":  "Orange",
    "peach":  "Orange",
    "yellow": "Yellow",
    "gold":   "Yellow",
    "lemon":  "Yellow",
    "green":  "Green",
    "olive":  "Green",
    "mint":   "Green",
    "teal":   "Green",
    "sage":   "Green",
    "blue":   "Blue",
    "navy":   "Blue",
    "sky":    "Blue",
    "aqua":   "Blue",
    "turquoise": "Blue",
    "purple": "Purple",
    "violet": "Purple",
    "plum":   "Purple",
    "lavender":"Purple",
    "lilac":  "Purple",
    "magenta":"Pink",
    "pink":   "Pink",
    "rose":   "Pink",
    "blush":  "Pink",
    "fuchsia":"Pink",
    "nude":   "Brown_Nude",
    "beige":  "Brown_Nude",
    "brown":  "Brown_Nude",
    "caramel":"Brown_Nude",
    "tan":    "Brown_Nude",
    "taupe":  "Brown_Nude",
    "mocha":  "Brown_Nude",
    "white":  "White_Clear",
    "cream":  "White_Clear",
    "clear":  "White_Clear",
    "sheer":  "White_Clear",
    "milk":   "White_Clear",
    "ivory":  "White_Clear",
    "black":  "Black",
    "onyx":   "Black",
    "ebony":  "Black",
    "dark":   "Black",
    "grey":   "Grey_Neutral",
    "gray":   "Grey_Neutral",
    "silver": "Grey_Neutral",
    "charcoal":"Grey_Neutral",
    "glitter":"Glitter_Special",
    "holographic":"Glitter_Special",
    "chrome": "Glitter_Special",
    "shimmer":"Glitter_Special",
    "aurora": "Glitter_Special",
    "duochrome":"Glitter_Special",
    "flak":   "Glitter_Special",
}


# ── helpers ────────────────────────────────────────────────────────────────────

def classify_by_hue(hue: float, saturation: float, brightness: float) -> str:
    """Map HSB values to a colour family name."""
    # Very dark → Black
    if brightness < 15:
        return "Black"
    # Very light + low saturation → White/Clear
    if brightness > 85 and saturation < ACHROMATIC_SAT_THRESHOLD:
        return "White_Clear"
    # Achromatic (no real colour) → Grey/Neutral or Brown/Nude by brightness
    if saturation < ACHROMATIC_SAT_THRESHOLD:
        if brightness > 70:
            return "White_Clear"
        if brightness < 30:
            return "Black"
        return "Grey_Neutral"

    # Warm low-sat mid-bright → nudey/brown
    if saturation < 25 and 20 <= brightness <= 75 and (hue <= 40 or hue >= 340):
        return "Brown_Nude"

    # Hue-based classification
    for family, start, end in HUE_FAMILIES:
        if start <= end:
            if start <= hue <= end:
                return family
        else:  # wraps around 360
            if hue >= start or hue <= end:
                return family

    return "Unclassified"


def classify_by_name(name: str, subcategory: str) -> str:
    """Fallback: guess family from product name and subcategory keywords."""
    sub_lower = subcategory.strip().lower()
    for special in SPECIAL_SUBCATEGORIES:
        if special in sub_lower:
            return "Glitter_Special"

    name_lower = name.strip().lower()
    for keyword, family in NAME_KEYWORDS.items():
        if keyword in name_lower:
            return family

    return "Unclassified"


def read_colour_data() -> dict:
    """Return {Internal_SKU: {hex, hue, sat, bri}} from the colour-data CSV."""
    data = {}
    if not COLOUR_DATA.exists():
        print(f"  ⚠️  colour data file not found: {COLOUR_DATA}")
        return data
    with COLOUR_DATA.open(newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            sku = row.get("Internal_SKU", "").strip()
            if sku:
                try:
                    data[sku] = {
                        "hex":        row.get("HEX", "").strip(),
                        "hue":        float(row.get("Hue_Degrees", 0) or 0),
                        "saturation": float(row.get("Saturation_Value", 0) or 0),
                        "brightness": float(row.get("Brightness_Value", 0) or 0),
                    }
                except ValueError:
                    pass
    return data


def read_products() -> list[dict]:
    """Return all active gel-polish rows from products.csv."""
    rows = []
    if not PRODUCTS_CSV.exists():
        raise FileNotFoundError(f"products.csv not found at {PRODUCTS_CSV}")
    with PRODUCTS_CSV.open(newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            cat = row.get("category", "").strip().lower()
            active = row.get("active", "TRUE").strip().upper()
            if active != "TRUE":
                continue
            # Include all gel-polish rows regardless of subcategory
            if cat in ("gel polish", "gel_polish"):
                rows.append(row)
    return rows


def get_lc_sku_from_code(code: str) -> str | None:
    """Try to match a product code to an LC-GP-XXXX style SKU."""
    # Direct LC sku
    if re.match(r"LC-GP-\d+", code, re.IGNORECASE):
        return code.upper()
    # Try extracting a 4-digit number and forming LC-GP-XXXX
    m = re.search(r"(\d{4})", code)
    if m:
        return f"LC-GP-{m.group(1)}"
    return None


# ── main ───────────────────────────────────────────────────────────────────────

def main():
    print("Reading colour data…")
    colour_lookup = read_colour_data()
    print(f"  {len(colour_lookup)} HEX entries loaded.")

    print("Reading products…")
    products = read_products()
    print(f"  {len(products)} active gel-polish products found.")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    families: dict[str, list[dict]] = {}
    enriched_all = []

    for row in products:
        code        = row.get("code", "").strip()
        name        = row.get("product_name", "").strip()
        subcategory = row.get("subcategory", "").strip()

        # Try to find HEX data
        hex_val = ""
        hue = sat = bri = ""
        family = None

        # 1. Direct code match
        sku_key = code.upper() if code else ""
        colour_entry = colour_lookup.get(sku_key)

        # 2. Try derived LC-GP key
        if not colour_entry:
            derived = get_lc_sku_from_code(code)
            if derived:
                colour_entry = colour_lookup.get(derived.upper())

        if colour_entry:
            hex_val = colour_entry["hex"]
            hue     = colour_entry["hue"]
            sat     = colour_entry["saturation"]
            bri     = colour_entry["brightness"]
            # Glitter subcategory overrides hue classification
            sub_lower = subcategory.lower()
            is_special = any(s in sub_lower for s in SPECIAL_SUBCATEGORIES)
            if is_special:
                family = "Glitter_Special"
            else:
                family = classify_by_hue(float(hue), float(sat), float(bri))
        else:
            family = classify_by_name(name, subcategory)

        enriched = {
            **row,
            "hex":            hex_val,
            "hue_degrees":    hue,
            "saturation":     sat,
            "brightness":     bri,
            "colour_family":  family,
        }
        enriched_all.append(enriched)
        families.setdefault(family, []).append(enriched)

    # ── write individual family files ──────────────────────────────────────────
    fieldnames = list(enriched_all[0].keys()) if enriched_all else []

    for family_name, rows in sorted(families.items()):
        out_path = OUTPUT_DIR / f"{family_name}.csv"
        with out_path.open("w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(rows)
        print(f"  ✅  {family_name:25s} → {len(rows):4d} colours  ({out_path.name})")

    # ── write combined file ────────────────────────────────────────────────────
    all_path = OUTPUT_DIR / "_ALL_colours.csv"
    with all_path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(enriched_all)

    print(f"\n✅  Complete merged file → {all_path}")
    print(f"✅  {len(enriched_all)} total colours sorted into {len(families)} families.")
    print(f"📂  Output folder: {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
