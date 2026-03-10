"""
select_tier1.py
Selects 120 well-distributed Tier 1 formulas from sl_formulas.json
and writes tier1_120_formulas.json ready for app seeding.
"""
import json
import random
from pathlib import Path

BASE_DIR = Path(__file__).parent

with open(BASE_DIR / "sl_formulas.json") as f:
    data = json.load(f)


def hex_to_hsl(h):
    h = h.lstrip("#")
    r, g, b = int(h[0:2], 16) / 255, int(h[2:4], 16) / 255, int(h[4:6], 16) / 255
    mx, mn = max(r, g, b), min(r, g, b)
    l = (mx + mn) / 2
    if mx == mn:
        return 0, 0, l * 100
    d = mx - mn
    s = d / (2 - mx - mn) if l > 0.5 else d / (mx + mn)
    if mx == r:
        hue = (g - b) / d + (6 if g < b else 0)
    elif mx == g:
        hue = (b - r) / d + 2
    else:
        hue = (r - g) / d + 4
    return hue * 60, s * 100, l * 100


def family(hex_str):
    h, s, l = hex_to_hsl(hex_str)
    if l >= 88:
        return "White/Sheer"
    if l <= 15:
        return "Black/Deep"
    if s < 15:
        return "Grey/Neutral"
    if h < 15 or h >= 345:
        return "Red"
    if h < 35:
        return "Orange"
    if h < 65:
        return "Yellow"
    if h < 150:
        return "Green"
    if h < 195:
        return "Teal"
    if h < 255:
        return "Blue"
    if h < 285:
        return "Purple"
    if h < 345:
        return "Pink"
    return "Other"


for d in data:
    d["family"] = family(d["target_hex"])
    d["hsl"] = hex_to_hsl(d["target_hex"])

# Allocation: 120 colours, nail-tech relevant ratios
ALLOC = {
    "Red":          22,
    "Pink":         20,
    "Orange":       11,
    "Yellow":        6,
    "Green":         8,
    "Teal":          7,
    "Blue":         14,
    "Purple":        9,
    "Grey/Neutral":  9,
    "White/Sheer":   2,
    "Black/Deep":    2,
}
assert sum(ALLOC.values()) == 110
ALLOC["Red"] += 5
ALLOC["Pink"] += 5
assert sum(ALLOC.values()) == 120

random.seed(42)
selected = []
for fam, n in ALLOC.items():
    pool = [d for d in data if d["family"] == fam]
    pool.sort(key=lambda d: (d["hsl"][0], d["hsl"][2]))
    if len(pool) <= n:
        chosen = pool
    else:
        step = len(pool) / n
        chosen = [pool[int(i * step)] for i in range(n)]
    selected.extend(chosen)

# Sort: family order, then lightness
fam_order = list(ALLOC.keys())
selected.sort(key=lambda d: (fam_order.index(d["family"]), d["hsl"][2]))

# Name generator
name_counters = {}


def make_name(fam, hsl):
    _, _, l = hsl
    light = "Light " if l > 65 else ("Deep " if l < 35 else "")
    prefix = light + fam.split("/")[0]
    name_counters[prefix] = name_counters.get(prefix, 0) + 1
    return f"{prefix} {name_counters[prefix]:02d}"


result = []
for i, d in enumerate(selected, 1):
    result.append({
        "id":           f"f{i:03d}",
        "sl_code":      d["sl_code"],
        "name":         make_name(d["family"], d["hsl"]),
        "tier":         1,
        "colour_family": d["family"],
        "hex":          d["target_hex"],
        "mixed_hex":    d["mixed_hex"],
        "delta_e":      d["delta_e"],
        "drops":        d["drops"],
        "sort_order":   i,
    })

out_path = BASE_DIR / "tier1_120_formulas.json"
with open(out_path, "w") as f:
    json.dump(result, f, indent=2)

print(f"Saved {len(result)} formulas to {out_path}")
print()
print(f"{'ID':<6} {'SL':<8} {'HEX':<9} {'Family':<14} {'Name':<26} Drops")
print("-" * 80)
for r in result:
    drops_str = "+".join(f"{v}{k}" for k, v in r["drops"].items())
    print(f"{r['id']:<6} {r['sl_code']:<8} {r['hex']:<9} {r['colour_family']:<14} {r['name']:<26} {drops_str}")
