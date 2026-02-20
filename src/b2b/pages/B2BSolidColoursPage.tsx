import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useB2BCart } from "../store/B2BCartContext";

type SolidRow = {
  Internal_SKU?: string;
  HEX?: string;
};

type SolidShade = {
  internalSku: string;
  code: string;
  swatchHex: string;
};

function toShadeCode(internalSku: string): string {
  const match = internalSku.match(/(\d+)$/);
  if (!match) return internalSku;
  return match[1].slice(-4).padStart(4, "0");
}

export default function B2BSolidColoursPage() {
  const { items, bottlePackaging, addOrUpdateItem } = useB2BCart();
  const [rows, setRows] = useState<SolidRow[]>([]);
  const [query, setQuery] = useState("");
  const [draftQty, setDraftQty] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/data/solid-1200.json")
      .then((response) => response.json())
      .then((data: unknown) => {
        setRows(Array.isArray(data) ? (data as SolidRow[]) : []);
      })
      .catch(() => setRows([]));
  }, []);

  const shades = useMemo<SolidShade[]>(() => {
    return rows
      .map((row) => {
        const internalSku = String(row.Internal_SKU ?? "").trim();
        const swatchHex = String(row.HEX ?? "").trim() || "#f3f4f6";
        if (!internalSku) return null;

        return {
          internalSku,
          code: toShadeCode(internalSku),
          swatchHex,
        };
      })
      .filter((item): item is SolidShade => Boolean(item));
  }, [rows]);

  const existingQtyByCode = useMemo(() => {
    const map: Record<string, number> = {};
    items
      .filter((item) => item.category === "SOLID_GEL_POLISH")
      .forEach((item) => {
        map[item.code] = item.quantity;
      });
    return map;
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return shades;
    return shades.filter((shade) => shade.code.toLowerCase().includes(q) || shade.internalSku.toLowerCase().includes(q));
  }, [query, shades]);

  const quantitiesLocked = bottlePackaging === null;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Solid Colours</h2>
        <p className="mt-1 text-sm text-gray-600">Add gel polish shades to your shared B2B cart.</p>
      </div>

      {quantitiesLocked ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          Select bottle packaging in Checkout to enable quantities.
          <Link to="/b2b/checkout" className="ml-2 font-semibold underline">
            Open Checkout
          </Link>
        </div>
      ) : (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          Packaging selected: {bottlePackaging.size}, {bottlePackaging.color.toLowerCase()}, {bottlePackaging.brush.toLowerCase()},{" "}
          {bottlePackaging.branding === "PRE_PRINTED" ? "pre-printed" : "labels"}.
        </div>
      )}

      <div className="flex items-center gap-3">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by shade code or SKU"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200">
        <div className="max-h-[68vh] overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">Swatch</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">Code</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">Internal SKU</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">Quantity</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 1200).map((shade) => {
                const value = draftQty[shade.code] ?? String(existingQtyByCode[shade.code] ?? "");
                return (
                  <tr key={shade.internalSku} className="border-t border-gray-100">
                    <td className="px-3 py-2">
                      <div className="h-6 w-6 rounded border" style={{ backgroundColor: shade.swatchHex }} />
                    </td>
                    <td className="px-3 py-2 font-mono">{shade.code}</td>
                    <td className="px-3 py-2 font-mono text-xs text-gray-600">{shade.internalSku}</td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        min={0}
                        step={1}
                        disabled={quantitiesLocked}
                        value={value}
                        onChange={(event) => {
                          setDraftQty((prev) => ({
                            ...prev,
                            [shade.code]: event.target.value,
                          }));
                        }}
                        className="w-24 rounded-md border border-gray-300 px-2 py-1 disabled:cursor-not-allowed disabled:bg-gray-100"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        disabled={quantitiesLocked}
                        onClick={() => {
                          const qty = Number.parseInt((draftQty[shade.code] ?? String(existingQtyByCode[shade.code] ?? "0")).trim(), 10);
                          addOrUpdateItem({
                            category: "SOLID_GEL_POLISH",
                            code: shade.code,
                            internalSku: shade.internalSku,
                            quantity: Number.isFinite(qty) ? qty : 0,
                            unitType: "PCS",
                            swatchImage: undefined,
                          });
                        }}
                        className="rounded-md bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-400"
                      >
                        Save
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
