import { useEffect, useMemo, useState } from "react";

type Row = Record<string, string>;

export default function InternalSolidColourGrid() {
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    fetch("/data/solid-colour/pilot-80.json")
      .then((r) => r.json())
      .then((data) => setRows(Array.isArray(data) ? data : []))
      .catch(() => setRows([]));
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return rows;

    return rows.filter((r) => {
      const sku = (r["Internal_SKU"] || "").toLowerCase();
      const name = (r["Shade_Name"] || "").toLowerCase();
      const code = (r["Shade_Code"] || "").toLowerCase();
      return sku.includes(query) || name.includes(query) || code.includes(query);
    });
  }, [rows, q]);

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Internal Solid Colour Grid (Pilot 80)</h1>
          <p className="text-sm text-neutral-600">Not linked anywhere — internal testing only.</p>
        </div>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by SKU / code / name…"
          className="w-full rounded-xl border bg-white px-4 py-2 text-sm shadow-sm sm:w-80"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {filtered.map((r, idx) => {
          const sku = r["Internal_SKU"] || "";
          const name = r["Shade_Name"] || "";
          const img = r["Swatch_Image"] || "";
          return (
            <div key={`${sku}-${idx}`} className="rounded-2xl border bg-white p-3 shadow-sm">
              <div className="aspect-square overflow-hidden rounded-xl bg-neutral-50">
                {img ? (
                  <img
                    src={img}
                    alt={sku}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-neutral-500">
                    No image
                  </div>
                )}
              </div>

              <div className="mt-2">
                <div className="text-xs font-semibold">{sku}</div>
                <div className="text-[11px] text-neutral-600 line-clamp-2">{name}</div>
              </div>
            </div>
          );
        })}
      </div>

      {!filtered.length && (
        <div className="mt-8 rounded-xl border bg-white p-6 text-sm text-neutral-600">
          No results. Check that <code className="font-mono">pilot-80.json</code> exists in{" "}
          <code className="font-mono">public/data/solid-colour/</code>.
        </div>
      )}
    </div>
  );
}
