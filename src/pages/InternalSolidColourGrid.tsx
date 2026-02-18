import { useEffect, useMemo, useState } from "react";

type Row = Record<string, string>;
type OrderLine = {
  sku: string;
  qty: number;
};
type ClientDetails = {
  companyName: string;
  vat: string;
  country: string;
  email: string;
};

export default function InternalSolidColourGrid() {
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [imgStatus, setImgStatus] = useState<Record<string, "OK" | "MISSING">>({});
  const [onlyMissing, setOnlyMissing] = useState(false);
  const [order, setOrder] = useState<Record<string, number>>({});
  const [client, setClient] = useState<ClientDetails>({
    companyName: "",
    vat: "",
    country: "",
    email: "",
  });

  useEffect(() => {
    fetch("/data/solid-colour/pilot-80.json")
      .then((r) => r.json())
      .then((data) => setRows(Array.isArray(data) ? data : []))
      .catch(() => setRows([]));
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("solidColourOrderPilot80");
    if (saved) {
      try {
        setOrder(JSON.parse(saved));
      } catch {
        setOrder({});
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("solidColourOrderPilot80", JSON.stringify(order));
  }, [order]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    let out = rows;

    if (query) {
      out = out.filter((r) => {
        const sku = (r["Internal_SKU"] || "").toLowerCase();
        const name = (r["Shade_Name"] || "").toLowerCase();
        const code = (r["Shade_Code"] || "").toLowerCase();
        return sku.includes(query) || name.includes(query) || code.includes(query);
      });
    }

    if (onlyMissing) {
      out = out.filter((r, idx) => {
        const sku = r["Internal_SKU"] || "";
        const key = sku || `row-${idx}`;
        return imgStatus[key] === "MISSING";
      });
    }

    return out;
  }, [rows, q, onlyMissing, imgStatus]);

  const selectedItems = Object.entries(order).filter(([_, qty]) => qty > 0);
  const totalUnits = selectedItems.reduce((sum, [_, qty]) => sum + qty, 0);

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

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={onlyMissing}
            onChange={(e) => setOnlyMissing(e.target.checked)}
          />
          Show missing only
        </label>
      </div>

      <div className="mb-6 rounded-xl border bg-white p-4 shadow-sm">
        <div className="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <input
            value={client.companyName}
            onChange={(e) => setClient((prev) => ({ ...prev, companyName: e.target.value }))}
            placeholder="Company name"
            className="rounded-xl border bg-white px-3 py-2 text-sm"
          />
          <input
            value={client.vat}
            onChange={(e) => setClient((prev) => ({ ...prev, vat: e.target.value }))}
            placeholder="VAT"
            className="rounded-xl border bg-white px-3 py-2 text-sm"
          />
          <input
            value={client.country}
            onChange={(e) => setClient((prev) => ({ ...prev, country: e.target.value }))}
            placeholder="Country"
            className="rounded-xl border bg-white px-3 py-2 text-sm"
          />
          <input
            type="email"
            value={client.email}
            onChange={(e) => setClient((prev) => ({ ...prev, email: e.target.value }))}
            placeholder="Contact email"
            className="rounded-xl border bg-white px-3 py-2 text-sm"
          />
        </div>

        <div className="text-sm font-semibold">
          Selected Shades: {selectedItems.length}
        </div>
        <div className="text-sm">
          Total Units: {totalUnits}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setOrder({})}
            className="rounded-xl border bg-white px-4 py-2 text-xs"
          >
            Clear
          </button>

          <button
            onClick={async () => {
              const text = selectedItems
                .map(([sku, qty]) => `${sku} x ${qty}`)
                .join("\n");
              await navigator.clipboard.writeText(text);
            }}
            className="rounded-xl border bg-white px-4 py-2 text-xs"
          >
            Copy list
          </button>

          <button
            onClick={() => {
              const exportData: OrderLine[] = selectedItems.map(([sku, qty]) => ({ sku, qty }));
              const payload = {
                client,
                lines: exportData,
              };

              const blob = new Blob([JSON.stringify(payload, null, 2)], {
                type: "application/json",
              });

              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `solid-colour-order-pilot80-${new Date().toISOString().slice(0, 10)}.json`;
              document.body.appendChild(a);
              a.click();
              a.remove();
              URL.revokeObjectURL(url);
            }}
            className="rounded-xl bg-black px-4 py-2 text-xs text-white"
          >
            Export Order
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {filtered.map((r, idx) => {
          const sku = r["Internal_SKU"] || "";
          const name = r["Shade_Name"] || "";
          const hex = r["Hex_Code"] || "";
          const img = r["Swatch_Image"] || "";
          const key = sku || `row-${idx}`;
          const status = imgStatus[key];
          return (
            <div key={key} className="rounded-2xl border bg-white p-3 shadow-sm">
              <div className="aspect-square overflow-hidden rounded-xl bg-neutral-50 relative">
                {img ? (
                  <>
                    <img
                      src={img}
                      alt={sku}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      onLoad={() =>
                        setImgStatus((prev) => (prev[key] === "OK" ? prev : { ...prev, [key]: "OK" }))
                      }
                      onError={() =>
                        setImgStatus((prev) =>
                          prev[key] === "MISSING" ? prev : { ...prev, [key]: "MISSING" }
                        )
                      }
                    />

                    {/* Status badge */}
                    <div className="absolute top-2 left-2 rounded-full border bg-white px-2 py-0.5 text-[10px] shadow-sm">
                      {status ?? "…"}
                    </div>
                  </>
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-neutral-500">
                    No image
                  </div>
                )}
              </div>

              <div className="mt-2">
                <div className="text-xs font-semibold">{sku}</div>
                <div className="text-[11px] text-neutral-600 line-clamp-2">{name}</div>
                <div className="text-[11px] text-neutral-600 mt-1">HEX: {hex || "—"}</div>

                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    placeholder="Qty"
                    value={order[sku] || ""}
                    onChange={(e) => {
                      const val = parseInt(e.target.value || "0", 10);
                      if (val === 0) {
                        setOrder((prev) => ({ ...prev, [sku]: 0 }));
                      } else if (val < 30) {
                        setOrder((prev) => ({ ...prev, [sku]: 30 }));
                      } else {
                        setOrder((prev) => ({ ...prev, [sku]: val }));
                      }
                    }}
                    className="w-16 rounded border px-2 py-1 text-xs"
                  />
                </div>
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
