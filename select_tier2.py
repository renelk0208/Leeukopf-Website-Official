"""
select_tier2.py
Selects 240 Tier 2 formulas from sl_formulas.json, excluding any SL codes
already used in tier1_120_formulas.json. Writes tier2_240_formulas.json.
"""
import json
import random
from pathlib import Path

BASE_DIR = Path(__file__).parent

with open(BASE_DIR / "sl_formulas.json") as f:
    all_data = json.load(f)

with open(BASE_DIR / "tier1_120_formulas.json") as f:
    tier1 = json.load(f)

# Exclude SL codes already claimed by Tier 1
tier1_sl_codes = {e["sl_code"] for e in tier1}
data = [d for d in all_data if d["sl_code"] not in tier1_sl_codes]
print(f"Pool after excluding Tier 1: {len(data)} formulas")


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

# Tier 2 allocation: 220 formulas.
# Goes deeper into every family, especially the commercially important ones.
# White/Sheer and Black/Deep are capped at what the pool actually contains.
ALLOC = {
    "Red":          39,
    "Pink":         36,
    "Orange":       23,
    "Yellow":       13,
    "Green":        17,
    "Teal":         13,
    "Blue":         26,
    "Purple":       19,
    "Grey/Neutral": 17,
    "White/Sheer":  11,
    "Black/Deep":    6,
}
assert sum(ALLOC.values()) == 220, sum(ALLOC.values())

random.seed(43)  # Different seed from Tier 1 (seed=42) for varied sampling
selected = []
for fam, n in ALLOC.items():
    pool = [d for d in data if d["family"] == fam]
    pool.sort(key=lambda d: (d["hsl"][0], d["hsl"][2]))
    if len(pool) <= n:
        chosen = pool
        print(f"  {fam}: wanted {n}, pool only has {len(pool)} — taking all")
    else:
        # Evenly space across the sorted pool (different spacing than Tier 1
        # because the pool no longer contains the Tier 1 entries)
        step = len(pool) / n
        chosen = [pool[int(i * step)] for i in range(n)]
    selected.extend(chosen)

# Sort: family order then lightness
fam_order = list(ALLOC.keys())
selected.sort(key=lambda d: (fam_order.index(d["family"]), d["hsl"][2]))

# Name generator — IDs continue from f121
name_counters = {}


def make_name(fam, hsl):
    _, _, l = hsl
    light = "Light " if l > 65 else ("Deep " if l < 35 else "")
    prefix = light + fam.split("/")[0]
    name_counters[prefix] = name_counters.get(prefix, 0) + 1
    return f"{prefix} {name_counters[prefix]:02d}"


result = []
for i, d in enumerate(selected, 121):   # IDs start at f121
    result.append({
        "id":            f"f{i:03d}",
        "sl_code":       d["sl_code"],
        "name":          make_name(d["family"], d["hsl"]),
        "tier":          2,
        "colour_family": d["family"],
        "hex":           d["target_hex"],
        "mixed_hex":     d["mixed_hex"],
        "delta_e":       d["delta_e"],
        "drops":         d["drops"],
        "sort_order":    i,
    })

out_path = BASE_DIR / "tier2_220_formulas.json"
with open(out_path, "w") as f:
    json.dump(result, f, indent=2)

print(f"\nSaved {len(result)} Tier 2 formulas to {out_path}")
print()
print(f"{'ID':<6} {'SL':<8} {'HEX':<9} {'Family':<14} {'Name':<30} Drops")
print("-" * 88)
for r in result:
    drops_str = "+".join(f"{v}{k}" for k, v in r["drops"].items())
    print(f"{r['id']:<6} {r['sl_code']:<8} {r['hex']:<9} {r['colour_family']:<14} {r['name']:<30} {drops_str}")
