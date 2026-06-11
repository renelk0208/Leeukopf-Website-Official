"""
colour_formula.py
=================
Generates drop-based gel-polish mixing formulas using the Salon Labs S-code
base palette.

  Base colours  â†’  S1, S2, S4, S5, S7, S8, S9, S10, S11, S12, S14, S15, S19
  Target chart  â†’  1 200 reference HEX values (Leeukopf, used for colour only)
  Output codes  â†’  SL0001 â€“ SL1200  (no Leeukopf codes in output)

Usage:
    # Formula for a single HEX target
    python colour_formula.py "#FF6B6B"

    # Custom total drops and max bases to mix
    python colour_formula.py "#3A7BD5" --drops 20 --max-colours 4

    # Generate ALL 1 200 SL formulas as JSON + CSV
    python colour_formula.py --generate-all

    # Show the base palette
    python colour_formula.py --list-palette
"""

import argparse
import colorsys
import csv
import json
import math
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw
from scipy.optimize import nnls

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
BASE_DIR = Path(__file__).parent
CSV_PATH = BASE_DIR / "colour-data-0001-1200.csv"
OUTPUT_IMAGE = BASE_DIR / "formula_output.png"
ALL_FORMULAS_JSON = BASE_DIR / "sl_formulas.json"
ALL_FORMULAS_CSV  = BASE_DIR / "sl_formulas.csv"

# ---------------------------------------------------------------------------
# Salon Labs S-code base palette
# Source: salon_labs/lib/core/seed_data.dart
# These are the ONLY colours used in mixing formulas.
# ---------------------------------------------------------------------------
BASE_PALETTE = [
    {"code": "S1",  "name": "White",          "hex": "#E1E6E0"},
    {"code": "S8",  "name": "Black",          "hex": "#191A1B"},
    {"code": "S2",  "name": "Purple",         "hex": "#833FA5"},
    {"code": "S4",  "name": "Deep Burgundy",  "hex": "#3B1418"},
    {"code": "S5",  "name": "Orange Coral",   "hex": "#FF9651"},
    {"code": "S19", "name": "Navy Blue",      "hex": "#121E4F"},
    {"code": "S7",  "name": "Red",            "hex": "#94001F"},
    {"code": "S9",  "name": "Fuchsia",        "hex": "#DE357A"},
    {"code": "S10", "name": "Indigo Purple",  "hex": "#6C0064"},
    {"code": "S11", "name": "Green",          "hex": "#00593C"},
    {"code": "S12", "name": "Mustard Yellow", "hex": "#E18B00"},
    {"code": "S14", "name": "Yellow",         "hex": "#EB9C08"},
    {"code": "S15", "name": "Fire Orange",    "hex": "#F22900"},
]

# Pre-compute RGB tuples
for _b in BASE_PALETTE:
    h = _b["hex"].lstrip("#")
    _b["rgb"] = (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16))

# ---------------------------------------------------------------------------
# Colour helpers
# ---------------------------------------------------------------------------

def hex_to_rgb(hex_str: str) -> tuple[int, int, int]:
    h = hex_str.lstrip("#")
    return int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)


def rgb_to_hex(r: float, g: float, b: float) -> str:
    return f"#{int(round(r)):02X}{int(round(g)):02X}{int(round(b)):02X}"


def _rgb_to_lab(r: int, g: int, b: int) -> tuple[float, float, float]:
    """Convert sRGB (0-255) â†’ CIE L*a*b* (D65)."""
    def lin(c):
        c /= 255.0
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

    rl, gl, bl = lin(r), lin(g), lin(b)
    x = rl * 0.4124564 + gl * 0.3575761 + bl * 0.1804375
    y = rl * 0.2126729 + gl * 0.7151522 + bl * 0.0721750
    z = rl * 0.0193339 + gl * 0.1191920 + bl * 0.9503041
    x /= 0.95047
    y /= 1.00000
    z /= 1.08883

    def f(t):
        return t ** (1 / 3) if t > 0.008856 else 7.787 * t + 16 / 116

    fx, fy, fz = f(x), f(y), f(z)
    return 116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)


def colour_distance(rgb1, rgb2) -> float:
    """CIE76 Î”E* â€“ perceptual colour difference (0 = identical, ~2.3 just noticeable)."""
    L1, a1, b1 = _rgb_to_lab(*[int(v) for v in rgb1])
    L2, a2, b2 = _rgb_to_lab(*[int(v) for v in rgb2])
    return math.sqrt((L1 - L2) ** 2 + (a1 - a2) ** 2 + (b1 - b2) ** 2)


# ---------------------------------------------------------------------------
# Load target colour chart (1 200 reference HEX values, numbered 1â€“1200)
# The Leeukopf SKU codes are ONLY used internally to read the CSV;
# they never appear in any formula output.
# ---------------------------------------------------------------------------

def load_target_chart(csv_path: Path) -> list[dict]:
    """Return list of {number, hex, rgb} â€” nothing Leeukopf-branded."""
    targets = []
    with open(csv_path, newline="", encoding="utf-8") as f:
        for i, row in enumerate(csv.DictReader(f), start=1):
            hex_val = row.get("HEX", "").strip()
            if not hex_val or len(hex_val) != 7:
                continue
            try:
                rgb = hex_to_rgb(hex_val)
            except ValueError:
                continue
            targets.append({"number": i, "hex": hex_val, "rgb": rgb})
    return targets


# ---------------------------------------------------------------------------
# NNLS solver: find optimal S-code mixing weights
# ---------------------------------------------------------------------------

def solve_formula(
    target_hex: str,
    total_drops: int = 20,
    max_colours: int = 4,
) -> tuple[list[dict], str, float]:
    """
    Returns:
        formula   â€“ list of {code, name, hex, drops}
        mixed_hex â€“ HEX of the blended result
        delta_e   â€“ CIE76 perceptual error vs target
    """
    target_rgb = np.array(hex_to_rgb(target_hex), dtype=float)

    # A is N Ã— 3; nnls needs M (mÃ—n) and b (m,)
    # We want: A.T @ w â‰ˆ target  â†’  M = A.T (3Ã—N), b = target (3,)
    A = np.array([b["rgb"] for b in BASE_PALETTE], dtype=float)
    w, _ = nnls(A.T, target_rgb)

    w_sum = w.sum()
    if w_sum < 1e-9:
        dists = [colour_distance(target_rgb, b["rgb"]) for b in BASE_PALETTE]
        best = int(np.argmin(dists))
        w = np.zeros(len(BASE_PALETTE))
        w[best] = 1.0
        w_sum = 1.0

    w_norm = w / w_sum

    # Keep only top contributors
    top_idx = np.argsort(w_norm)[::-1][:max_colours]
    w_sparse = np.zeros_like(w_norm)
    w_sparse[top_idx] = w_norm[top_idx]
    w_sparse /= w_sparse.sum()

    drops_int = np.maximum(np.round(w_sparse * total_drops), 0).astype(int)
    used = [i for i in range(len(BASE_PALETTE)) if drops_int[i] > 0]

    blend = np.zeros(3)
    total_used = sum(int(drops_int[i]) for i in used)
    for i in used:
        blend += np.array(BASE_PALETTE[i]["rgb"]) * drops_int[i]
    blend /= max(total_used, 1)

    mixed_hex = rgb_to_hex(*blend)
    delta_e = colour_distance(target_rgb, blend)

    formula = [
        {
            "code":  BASE_PALETTE[i]["code"],
            "name":  BASE_PALETTE[i]["name"],
            "hex":   BASE_PALETTE[i]["hex"],
            "drops": int(drops_int[i]),
        }
        for i in used
    ]
    return formula, mixed_hex, delta_e


# ---------------------------------------------------------------------------
# Render a formula card PNG  —  round glossy gel-polish swatches
# ---------------------------------------------------------------------------

SWATCH_SIZE = 110   # diameter of each circle (px), rendered at 3× then downscaled
PAD = 20
TEXT_AREA = 52
SCALE = 3           # supersampling factor for smooth anti-aliased circles


def _parse_hex(hex_col: str) -> tuple[int, int, int]:
    h = hex_col.lstrip("#")
    return int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)


def _lighten(r: int, g: int, b: int, factor: float) -> tuple[int, int, int]:
    return (
        min(255, int(r + (255 - r) * factor)),
        min(255, int(g + (255 - g) * factor)),
        min(255, int(b + (255 - b) * factor)),
    )


def _darken(r: int, g: int, b: int, factor: float) -> tuple[int, int, int]:
    return (int(r * (1 - factor)), int(g * (1 - factor)), int(b * (1 - factor)))


def _draw_glossy_circle(canvas: Image.Image, cx: int, cy: int,
                        radius: int, hex_col: str):
    """
    Draw a round gel-polish swatch with a multi-layer gloss effect onto
    an RGBA canvas.  All drawing is done at SCALE× resolution on a
    temporary surface then composited back.
    """
    s = SCALE
    size = radius * 2
    tmp = Image.new("RGBA", (size * s, size * s), (0, 0, 0, 0))
    td = ImageDraw.Draw(tmp)

    r, g, b = _parse_hex(hex_col)

    # ── 1. Base circle ─────────────────────────────────────────────────
    td.ellipse([0, 0, size * s - 1, size * s - 1], fill=(r, g, b, 255))

    # ── 2. Subtle dark rim (depth) ─────────────────────────────────────
    rim_w = max(2, size * s // 18)
    dr, dg, db = _darken(r, g, b, 0.30)
    td.ellipse([0, 0, size * s - 1, size * s - 1],
               outline=(dr, dg, db, 200), width=rim_w)

    # ── 3. Large soft highlight (upper-left bloom) ─────────────────────
    hl_r = int(size * s * 0.38)
    hl_cx = int(size * s * 0.34)
    hl_cy = int(size * s * 0.30)
    highlight = Image.new("RGBA", (size * s, size * s), (0, 0, 0, 0))
    hd = ImageDraw.Draw(highlight)
    lr, lg, lb = _lighten(r, g, b, 0.55)
    hd.ellipse(
        [hl_cx - hl_r, hl_cy - hl_r, hl_cx + hl_r, hl_cy + hl_r],
        fill=(lr, lg, lb, 90),
    )
    # Clip highlight to base circle using a mask
    mask = Image.new("L", (size * s, size * s), 0)
    ImageDraw.Draw(mask).ellipse([0, 0, size * s - 1, size * s - 1], fill=255)
    tmp = Image.composite(
        Image.alpha_composite(tmp, highlight), tmp, mask
    )
    td = ImageDraw.Draw(tmp)

    # ── 4. Bright specular dot (tight glare spot) ──────────────────────
    sp_r = max(3, int(size * s * 0.11))
    sp_cx = int(size * s * 0.36)
    sp_cy = int(size * s * 0.26)
    td.ellipse(
        [sp_cx - sp_r, sp_cy - sp_r, sp_cx + sp_r, sp_cy + sp_r],
        fill=(255, 255, 255, 210),
    )

    # ── 5. Bottom inner glow (reflected light) ─────────────────────────
    gl_r = int(size * s * 0.22)
    gl_cx = int(size * s * 0.60)
    gl_cy = int(size * s * 0.76)
    lr2, lg2, lb2 = _lighten(r, g, b, 0.40)
    td.ellipse(
        [gl_cx - gl_r, gl_cy - gl_r, gl_cx + gl_r, gl_cy + gl_r],
        fill=(lr2, lg2, lb2, 60),
    )

    # ── Downsample to final size ───────────────────────────────────────
    circle = tmp.resize((size, size), Image.LANCZOS)

    # ── Composite onto main canvas ─────────────────────────────────────
    paste_x = cx - radius
    paste_y = cy - radius
    canvas.paste(circle, (paste_x, paste_y), circle)


def _draw_swatch_round(canvas: Image.Image, cx: int, cy: int,
                       hex_col: str, label_top: str, label_bot: str,
                       radius: int):
    """Draw a glossy circle swatch and two lines of text below it."""
    _draw_glossy_circle(canvas, cx, cy, radius, hex_col)

    # Determine text colour for visibility on the card background
    draw = ImageDraw.Draw(canvas)
    text_y = cy + radius + 6
    # Centred text (approximate with PIL default font width ~6px/char)
    for i, (text, col) in enumerate(
        [(label_top, "#222222"), (label_bot, "#777777")]
    ):
        tw = len(text) * 6
        draw.text((cx - tw // 2, text_y + i * 16), text, fill=col)


def render_formula_card(
    sl_code: str,
    target_hex: str,
    formula: list[dict],
    mixed_hex: str,
    delta_e: float,
    output_path: Path,
):
    radius = SWATCH_SIZE // 2
    n = len(formula)
    symbol_gap = 34        # width reserved for = + → symbols
    col_step = SWATCH_SIZE + PAD + symbol_gap

    # Total width: target + symbols + formula cols + arrow + result
    n_cols = 1 + n + 1     # target, formula bases, result
    n_symbols = n_cols - 1  # = + + ... + →
    img_w = PAD * 2 + n_cols * SWATCH_SIZE + n_symbols * (PAD + symbol_gap)
    img_h = PAD + 24 + SWATCH_SIZE + TEXT_AREA + PAD

    # Dark gradient background
    img = Image.new("RGBA", (img_w, img_h), (245, 243, 248, 255))
    # Subtle top-to-bottom gradient overlay
    for row in range(img_h):
        alpha = int(12 * (1 - row / img_h))
        for col_px in range(img_w):
            px = img.getpixel((col_px, row))
            img.putpixel((col_px, row), (px[0], px[1], px[2], 255))

    draw = ImageDraw.Draw(img)

    # Card title
    draw.text((PAD, 6), f"{sl_code}", fill="#1A1A2E")
    draw.text((PAD + len(sl_code) * 7 + 6, 6), f"target {target_hex}", fill="#888888")

    # Horizontal baseline for swatch centres
    cy = PAD + 24 + radius

    def _symbol(sym: str, x: int):
        draw.text((x + 2, cy - 10), sym, fill="#AAAAAA")

    x = PAD + radius  # centre of first swatch

    # Target swatch
    _draw_swatch_round(img, x, cy, target_hex, "Target", target_hex, radius)
    x += SWATCH_SIZE + PAD
    _symbol("=", x)
    x += symbol_gap

    # Formula base swatches
    for idx, item in enumerate(formula):
        x += radius
        _draw_swatch_round(
            img, x, cy, item["hex"],
            f"{item['drops']} drop{'s' if item['drops'] != 1 else ''}",
            item["code"],
            radius,
        )
        x += radius + PAD
        if idx < len(formula) - 1:
            _symbol("+", x)
            x += symbol_gap

    _symbol("\u2192", x)
    x += symbol_gap + radius

    # Result swatch
    _draw_swatch_round(img, x, cy, mixed_hex,
                       f"\u0394E \u2248 {delta_e:.1f}", mixed_hex, radius)

    # Convert and save
    img.convert("RGB").save(output_path, quality=95)
    print(f"Saved formula card \u2192 {output_path}")


# ---------------------------------------------------------------------------
# Pretty-print a single formula to terminal
# ---------------------------------------------------------------------------

def print_formula(sl_code: str, target_hex: str,
                  formula: list[dict], mixed_hex: str, delta_e: float):
    total = sum(f["drops"] for f in formula)
    print("\n" + "=" * 60)
    print(f"  {sl_code}  â†’  {target_hex}")
    print(f"  Mixed result : {mixed_hex}   Î”E â‰ˆ {delta_e:.1f}")
    print(f"  Total drops  : {total}")
    print("=" * 60)
    print(f"  {'Code':<6} {'Name':<18} {'HEX':>8}  {'Drops':>5}  Bar")
    print(f"  {'-'*6} {'-'*18} {'-'*8}  {'-'*5}  {'-'*20}")
    for f in formula:
        bar = "â–ˆ" * f["drops"]
        print(f"  {f['code']:<6} {f['name']:<18} {f['hex']:>8}  {f['drops']:>4}x  {bar}")
    print("=" * 60)


# ---------------------------------------------------------------------------
# Generate ALL 1 200 SL formulas
# ---------------------------------------------------------------------------

def generate_all(total_drops: int = 20, max_colours: int = 4):
    print(f"Loading target chart from {CSV_PATH} â€¦", end=" ", flush=True)
    targets = load_target_chart(CSV_PATH)
    print(f"{len(targets)} colours loaded.")

    results = []
    for t in targets:
        n = t["number"]
        sl_code = f"SL{n:04d}"
        formula, mixed_hex, delta_e = solve_formula(
            t["hex"], total_drops=total_drops, max_colours=max_colours
        )
        results.append({
            "sl_code":    sl_code,
            "target_hex": t["hex"],
            "mixed_hex":  mixed_hex,
            "delta_e":    round(delta_e, 2),
            "drops":      {f["code"]: f["drops"] for f in formula},
        })
        if n % 100 == 0:
            print(f"  â€¦ {n}/1200")

    # Write JSON
    with open(ALL_FORMULAS_JSON, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)
    print(f"\nSaved JSON  â†’ {ALL_FORMULAS_JSON}")

    # Write CSV
    s_codes = [b["code"] for b in BASE_PALETTE]
    with open(ALL_FORMULAS_CSV, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["SL_Code", "Target_HEX", "Mixed_HEX", "Delta_E"] + s_codes)
        for r in results:
            row = [r["sl_code"], r["target_hex"], r["mixed_hex"], r["delta_e"]]
            row += [r["drops"].get(c, 0) for c in s_codes]
            writer.writerow(row)
    print(f"Saved CSV   â†’ {ALL_FORMULAS_CSV}")


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="Salon Labs colour formula generator â€” uses S-code base palette only."
    )
    parser.add_argument("target", nargs="?",
                        help="Target HEX colour, e.g. #FF6B6B")
    parser.add_argument("--drops", type=int, default=20,
                        help="Total drops in the recipe (default 20)")
    parser.add_argument("--max-colours", type=int, default=4,
                        help="Max different S-codes to mix (default 4)")
    parser.add_argument("--list-palette", action="store_true",
                        help="Show the S-code base palette and exit")
    parser.add_argument("--generate-all", action="store_true",
                        help="Generate all 1 200 SL formulas to JSON + CSV")
    parser.add_argument("--no-image", action="store_true",
                        help="Skip saving the formula card PNG")
    args = parser.parse_args()

    if args.list_palette:
        print("\nSalon Labs base palette (S-codes):")
        print(f"  {'Code':<6} {'Name':<18} {'HEX':>8}")
        print(f"  {'-'*6} {'-'*18} {'-'*8}")
        for b in BASE_PALETTE:
            print(f"  {b['code']:<6} {b['name']:<18} {b['hex']:>8}")
        return

    if args.generate_all:
        generate_all(total_drops=args.drops, max_colours=args.max_colours)
        return

    if not args.target:
        parser.print_help()
        sys.exit(1)

    target_hex = args.target.strip().upper()
    if not target_hex.startswith("#") or len(target_hex) != 7:
        print(f"ERROR: expected a 7-char HEX like #FF6B6B, got: {target_hex}")
        sys.exit(1)

    formula, mixed_hex, delta_e = solve_formula(
        target_hex, total_drops=args.drops, max_colours=args.max_colours
    )
    print_formula("(custom)", target_hex, formula, mixed_hex, delta_e)

    if not args.no_image:
        render_formula_card("(custom)", target_hex, formula, mixed_hex, delta_e, OUTPUT_IMAGE)


if __name__ == "__main__":
    main()
