import { useEffect, useMemo, useState } from "react";
import { useB2BCart } from "../store/B2BCartContext";
import type { BottleBranding, BottleColor, BottleSize, BrushType, CartItem } from "../types";
import { getB2BCategoryLabel } from "../config/categories";

const bottleSizes: Array<{ value: BottleSize; label: string }> = [
  { value: "10ML", label: "10ml" },
  { value: "15ML", label: "15ml" },
];

const bottleColors: Array<{ value: BottleColor; label: string }> = [
  { value: "BLACK", label: "Black" },
  { value: "WHITE", label: "White" },
];

const brushTypes: Array<{ value: BrushType; label: string }> = [
  { value: "OVAL", label: "Oval" },
  { value: "FLAT", label: "Flat" },
];

const brandings: Array<{ value: BottleBranding; label: string }> = [
  { value: "PRE_PRINTED", label: "Pre-printed" },
  { value: "LABELS", label: "Labels" },
];

function toCsvValue(input: string | number | undefined): string {
  if (input === undefined) return "";
  const value = String(input);
  if (value.includes(",") || value.includes("\"") || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function mapPackagingCsv(value: string): string {
  return value.toLowerCase().replace(/_/g, "-");
}

function downloadCsv(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.setAttribute("download", filename);
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export default function B2BCheckoutPage() {
  const {
    items,
    bottlePackaging,
    setBottlePackaging,
    clearBottlePackaging,
    clearCart,
    removeItem,
    setQuantity,
    getTotals,
    getFilledUnitsTotal,
    getBottleUnitsRequired,
    isPrePrintedMinOk,
  } = useB2BCart();

  const [packagingDraft, setPackagingDraft] = useState<{
    size: BottleSize | "";
    color: BottleColor | "";
    brush: BrushType | "";
    branding: BottleBranding | "";
  }>({
    size: "",
    color: "",
    brush: "",
    branding: "",
  });

  useEffect(() => {
    if (bottlePackaging) {
      setPackagingDraft(bottlePackaging);
      return;
    }
    setPackagingDraft({
      size: "",
      color: "",
      brush: "",
      branding: "",
    });
  }, [bottlePackaging]);

  const groupedItems = useMemo(() => {
    const groups = new Map<string, CartItem[]>();
    items.forEach((item) => {
      const key = item.category;
      const current = groups.get(key) ?? [];
      current.push(item);
      groups.set(key, current);
    });
    return Array.from(groups.entries());
  }, [items]);

  const totals = getTotals();
  const filledUnitsTotal = getFilledUnitsTotal();
  const bottleUnitsRequired = getBottleUnitsRequired();
  const prePrintedMinOk = isPrePrintedMinOk();
  const hasQuantityError = items.some((item) => item.quantity <= 0);
  const isPackagingSelected = bottlePackaging !== null;

  const canProceed = isPackagingSelected && !hasQuantityError && prePrintedMinOk;

  const exportCsv = () => {
    if (!bottlePackaging || !canProceed) return;

    const header = [
      "category",
      "code",
      "internal_sku",
      "name",
      "quantity",
      "unit_type",
      "bottle_size",
      "bottle_color",
      "brush_type",
      "branding",
    ];

    const rows = items.map((item) => [
      getB2BCategoryLabel(item.category),
      item.code,
      item.internalSku ?? "",
      item.name ?? "",
      item.quantity,
      item.unitType ?? "PCS",
      mapPackagingCsv(bottlePackaging.size),
      mapPackagingCsv(bottlePackaging.color),
      mapPackagingCsv(bottlePackaging.brush),
      mapPackagingCsv(bottlePackaging.branding),
    ]);

    const csv = [header, ...rows].map((row) => row.map((cell) => toCsvValue(cell)).join(",")).join("\n");
    const stamp = new Date().toISOString().slice(0, 10);
    downloadCsv(csv, `b2b-cart-${stamp}.csv`);
  };

  const submit = () => {
    if (!bottlePackaging || !canProceed) return;
    const payload = {
      items,
      bottlePackaging,
      totals,
      filledUnitsTotal,
      bottleUnitsRequired,
      submittedAt: new Date().toISOString(),
      source: "B2B Portal Checkout",
    };
    console.log("[B2B Submit Payload]", payload);
    alert("Thank you for your order, our Admin Office will be in touch with you shortly for your pro forma.");
    clearCart();
  };

  const setPackagingField = <K extends keyof typeof packagingDraft>(key: K, value: (typeof packagingDraft)[K]) => {
    const nextDraft = {
      ...packagingDraft,
      [key]: value,
    };

    setPackagingDraft(nextDraft);

    if (nextDraft.size && nextDraft.color && nextDraft.brush && nextDraft.branding) {
      setBottlePackaging({
        size: nextDraft.size,
        color: nextDraft.color,
        brush: nextDraft.brush,
        branding: nextDraft.branding,
      });
      return;
    }

    clearBottlePackaging();
  };

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-bold text-grey-primary">Checkout</h2>
        <p className="mt-1 text-sm text-grey-secondary">Review all categories, set packaging, export CSV, and submit inquiry.</p>
      </section>

      <section className="rounded-lg border border-grey-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-grey-primary">Bottle Packaging (Required)</h3>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-grey-primary">Size</label>
            <select
              value={packagingDraft.size}
              onChange={(event) => {
                const value = event.target.value as BottleSize;
                if (!value) return;
                setPackagingField("size", value);
              }}
              className="w-full rounded-md border border-grey-card px-3 py-2 text-grey-primary"
            >
              <option value="">Select size</option>
              {bottleSizes.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-grey-primary">Color</label>
            <select
              value={packagingDraft.color}
              onChange={(event) => {
                const value = event.target.value as BottleColor;
                if (!value) return;
                setPackagingField("color", value);
              }}
              className="w-full rounded-md border border-grey-card px-3 py-2 text-grey-primary"
            >
              <option value="">Select color</option>
              {bottleColors.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-grey-primary">Brush</label>
            <select
              value={packagingDraft.brush}
              onChange={(event) => {
                const value = event.target.value as BrushType;
                if (!value) return;
                setPackagingField("brush", value);
              }}
              className="w-full rounded-md border border-grey-card px-3 py-2 text-grey-primary"
            >
              <option value="">Select brush</option>
              {brushTypes.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-grey-primary">Branding</label>
            <select
              value={packagingDraft.branding}
              onChange={(event) => {
                const value = event.target.value as BottleBranding;
                if (!value) return;
                setPackagingField("branding", value);
              }}
              className="w-full rounded-md border border-grey-card px-3 py-2 text-grey-primary"
            >
              <option value="">Select branding</option>
              {brandings.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-3 rounded-md border border-grey-card bg-primary-50 p-3 text-sm text-grey-primary">
          <div>Filled units: {filledUnitsTotal}</div>
          <div>Bottles required: {bottleUnitsRequired}</div>
        </div>

        {bottlePackaging?.branding === "PRE_PRINTED" && !prePrintedMinOk ? (
          <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            Pre-printed bottles require a minimum of 5000 bottles. Add more units or switch to Labels.
          </div>
        ) : null}
      </section>

      <section className="rounded-lg border border-grey-card p-4">
        <h3 className="text-lg font-semibold text-grey-primary">Cart Items</h3>
        {!items.length ? (
          <p className="mt-2 text-sm text-grey-secondary">Your cart is empty.</p>
        ) : (
          <div className="mt-4 space-y-5">
            {groupedItems.map(([category, categoryItems]) => (
              <div key={category}>
                <h4 className="text-sm font-semibold uppercase tracking-wide text-grey-secondary">{getB2BCategoryLabel(category as CartItem["category"])}</h4>
                <div className="mt-2 overflow-hidden rounded-md border border-grey-card">
                  <table className="w-full text-sm">
                    <thead className="bg-primary-50">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold text-grey-primary">Code</th>
                        <th className="px-3 py-2 text-left font-semibold text-grey-primary">Name</th>
                        <th className="px-3 py-2 text-left font-semibold text-grey-primary">Qty</th>
                        <th className="px-3 py-2 text-left font-semibold text-grey-primary">Unit</th>
                        <th className="px-3 py-2 text-left font-semibold text-grey-primary">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categoryItems.map((item) => (
                        <tr key={`${item.category}-${item.code}`} className="border-t border-grey-card/60">
                          <td className="px-3 py-2 font-mono">{item.code}</td>
                          <td className="px-3 py-2">{item.name ?? "-"}</td>
                          <td className="px-3 py-2">
                            <input
                              type="number"
                              min={0}
                              step={1}
                              value={item.quantity}
                              onChange={(event) => {
                                const qty = Number.parseInt(event.target.value, 10);
                                setQuantity(item.category, item.code, Number.isFinite(qty) ? qty : 0);
                              }}
                              className="w-24 rounded-md border border-grey-card px-2 py-1 text-grey-primary"
                            />
                          </td>
                          <td className="px-3 py-2">{item.unitType ?? "PCS"}</td>
                          <td className="px-3 py-2">
                            <button
                              type="button"
                              onClick={() => removeItem(item.category, item.code)}
                              className="rounded-md border border-primary-200 px-2 py-1 text-xs font-semibold text-primary"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {!isPackagingSelected ? (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          Select bottle packaging to enable export and submit.
        </div>
      ) : null}

      {hasQuantityError ? (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          Quantities must be greater than zero for all lines.
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={!canProceed || items.length === 0}
          onClick={exportCsv}
          className="rounded-md border border-primary px-4 py-2 text-sm font-semibold text-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          Export CSV
        </button>
        <button
          type="button"
          disabled={!canProceed || items.length === 0}
          onClick={submit}
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-primary-200"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
