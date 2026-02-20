import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useB2BCart } from "../store/B2BCartContext";

type SolidColourRow = {
  Internal_SKU?: string;
  Shade_Code?: string;
  Shade_Name?: string;
  HEX?: string;
};

function normalizeHex(value: string | undefined): string {
  if (!value) return "";
  const raw = value.trim();
  if (!raw) return "";
  if (raw.startsWith("#")) return raw;
  return `#${raw}`;
}

export default function B2BSolidColoursPage() {
  const { items, addOrUpdateItem } = useB2BCart();
  const [rows, setRows] = useState<SolidColourRow[]>([]);
  const [search, setSearch] = useState("");
  const [draftQty, setDraftQty] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/data/solid-1200.json")
      .then((response) => response.json())
      .then((data: SolidColourRow[]) => {
        if (!Array.isArray(data)) {
          setRows([]);
          return;
        }
        setRows(data);
      })
      .catch(() => setRows([]));
  }, []);

  const existingQtyByCode = useMemo(() => {
    const map: Record<string, number> = {};
    items
      .filter((item) => item.category === "SOLID_GEL_POLISH")
      .forEach((item) => {
        map[item.code] = item.quantity;
      });
    return map;
  }, [items]);

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter((row) => {
      const sku = (row.Internal_SKU ?? "").toLowerCase();
      const code = (row.Shade_Code ?? "").toLowerCase();
      const name = (row.Shade_Name ?? "").toLowerCase();
      const hex = (row.HEX ?? "").toLowerCase();
      return sku.includes(query) || code.includes(query) || name.includes(query) || hex.includes(query);
    });
  }, [rows, search]);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Solid Colours</h2>
        <p className="mt-1 text-sm text-gray-600">Add solid shades to the shared B2B cart and continue to checkout.</p>
      </div>

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
        Add items here first, then set bottle packaging in Checkout before export/submit.
          <Link to="/b2b/checkout" className="ml-2 font-semibold underline">
            Open Checkout
          </Link>
      </div>

      <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search SKU / code / name / hex"
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
        />
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200">
        <div className="max-h-[68vh] overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">Swatch</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">Code</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">Name</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">Hex</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">Qty</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row, index) => {
                const code = row.Shade_Code || row.Internal_SKU || `ROW-${index + 1}`;
                const name = row.Shade_Name || row.Internal_SKU || "-";
                const sku = row.Internal_SKU || code;
                const hex = normalizeHex(row.HEX);
                const value = draftQty[code] ?? String(existingQtyByCode[code] ?? 0);

                return (
                  <tr key={`${code}-${index}`} className="border-t border-gray-100">
                    <td className="px-3 py-2">
                      <span
                        className="inline-block h-6 w-6 rounded border border-gray-300"
                        style={{ backgroundColor: hex || "#ffffff" }}
                        title={hex || "No HEX"}
                      />
                    </td>
                    <td className="px-3 py-2 font-mono">{code}</td>
                    <td className="px-3 py-2">{name}</td>
                    <td className="px-3 py-2 font-mono">{hex || "-"}</td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        min={0}
                        step={1}
                        value={value}
                        onChange={(event) => {
                          setDraftQty((prev) => ({
                            ...prev,
                            [code]: event.target.value,
                          }));
                        }}
                        className="w-24 rounded-md border border-gray-300 px-2 py-1 disabled:cursor-not-allowed disabled:bg-gray-100"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        onClick={() => {
                          const qty = Number.parseInt((draftQty[code] ?? String(existingQtyByCode[code] ?? "0")).trim(), 10);
                          addOrUpdateItem({
                            category: "SOLID_GEL_POLISH",
                            code,
                            internalSku: sku,
                            name,
                            quantity: Number.isFinite(qty) ? qty : 0,
                            unitType: "PCS",
                            meta: {
                              hex,
                            },
                          });
                        }}
                        className="rounded-md bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white"
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
