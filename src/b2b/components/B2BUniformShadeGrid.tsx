import { useMemo, useState, useEffect, type SyntheticEvent } from "react";
import { X } from "lucide-react";
import type { BuyerType } from "../types";

export type B2BUniformShadeItem = {
  id: string;
  code: string;
  name: string;
  family: string;
  moq: number;
  quantityValue: string;
  imageSrc: string;
  imageAlt: string;
  isSelected: boolean;
  isMissingImage?: boolean;
  onImageError?: (event: SyntheticEvent<HTMLImageElement, Event>) => void;
};

type B2BUniformShadeGridProps = {
  title: string;
  description?: string;
  items: B2BUniformShadeItem[];
  validationMessage?: string;
  buyerType?: BuyerType | null;
  /** Per-unit price for this subcategory (null = new client / not yet priced). */
  pricePerUnit?: number | null;
  /** Unit label that goes with pricePerUnit (default: "pcs"). */
  priceUnit?: "pcs" | "kg";
  onQuantityChange: (id: string, value: string) => void;
  onSave: (id: string) => void;
  onClear: (id: string) => void;
};

export default function B2BUniformShadeGrid({
  title,
  description,
  items,
  validationMessage,
  buyerType,
  pricePerUnit,
  priceUnit = "pcs",
  onQuantityChange,
  onSave,
  onClear,
}: B2BUniformShadeGridProps) {
  const isBulk = buyerType === "bulk";
  const [search, setSearch] = useState("");
  const [hiddenItemIds, setHiddenItemIds] = useState<Record<string, true>>({});
  const [lightboxItem, setLightboxItem] = useState<{ src: string; alt: string; code: string } | null>(null);

  useEffect(() => {
    if (!lightboxItem) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setLightboxItem(null); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [lightboxItem]);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    return items.filter((item) => {
      if (item.isMissingImage) return false;
      if (hiddenItemIds[item.id]) return false;
      if (!query) return true;
      return `${item.code} ${item.name} ${item.family}`.toLowerCase().includes(query);
    });
  }, [hiddenItemIds, items, search]);

  const selectedItems = useMemo(() => items.filter((item) => item.isSelected), [items]);

  const countsByFamily = useMemo(() => {
    const map = new Map<string, number>();
    selectedItems.forEach((item) => {
      map.set(item.family, (map.get(item.family) ?? 0) + 1);
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [selectedItems]);

  const totalUnits = useMemo(
    () => selectedItems.reduce((sum, item) => sum + (Number.parseInt(item.quantityValue || "0", 10) || 0), 0),
    [selectedItems]
  );

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-grey-primary">{title}</h2>
        {description ? <p className="mt-1 text-sm text-grey-secondary">{description}</p> : null}
      </div>

      {validationMessage ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {validationMessage}
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <section className="space-y-4">
          <div className="flex flex-col gap-3 rounded-xl border border-grey-card bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by SKU / code / name..."
              className="w-full rounded-lg border border-grey-card px-3 py-2 text-sm text-grey-primary sm:max-w-md"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
            {filteredItems.map((item) => (
              <article key={item.id} className="rounded-2xl border border-grey-card bg-white p-3">
                {(() => {
                  const normalizedCode = item.code.trim().toLowerCase();
                  const normalizedName = item.name.trim().toLowerCase();
                  const normalizedFamily = item.family.trim().toLowerCase();

                  const showName = normalizedName.length > 0 && normalizedName !== normalizedCode;
                  const showFamily = normalizedFamily.length > 0 && normalizedFamily !== normalizedCode && normalizedFamily !== normalizedName;

                  return (
                    <>
                      <button
                        type="button"
                        aria-label={`Enlarge image for ${item.code}`}
                        onClick={() => setLightboxItem({ src: item.imageSrc, alt: item.imageAlt, code: item.code })}
                        className="group relative flex h-40 w-full cursor-zoom-in items-center justify-center rounded-xl bg-grey-100 p-2 hover:bg-grey-200 transition-colors"
                      >
                        <img
                          src={item.imageSrc}
                          alt={item.imageAlt}
                          className="max-h-full max-w-full object-contain transition-transform duration-200 group-hover:scale-105"
                          onError={(event) => {
                            item.onImageError?.(event);
                            if (!event.currentTarget.src.endsWith("/img/placeholders/product-missing.svg")) return;
                            setHiddenItemIds((prev) => {
                              if (prev[item.id]) return prev;
                              return {
                                ...prev,
                                [item.id]: true,
                              };
                            });
                          }}
                        />
                        <span className="pointer-events-none absolute right-2 top-2 rounded-full bg-black/30 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                        </span>
                      </button>

                      <div className="mt-3 space-y-2">
                        <p className="text-sm font-semibold leading-tight text-grey-primary break-words [overflow-wrap:anywhere]">{item.code}</p>
                        {showName ? <p className="text-xs leading-tight text-grey-secondary break-words [overflow-wrap:anywhere]">{item.name}</p> : null}
                        {showFamily ? <p className="text-xs leading-tight text-grey-secondary break-words [overflow-wrap:anywhere]">{item.family}</p> : null}
                        <p className="text-xs text-grey-secondary">
                          {`MOQ: ${item.moq} ${priceUnit === "kg" ? "kg" : "pcs"}`}
                        </p>
                        {pricePerUnit != null ? (
                          <p className="text-xs font-semibold text-primary-700">
                            €{pricePerUnit.toFixed(2)}
                            <span className="font-normal text-grey-secondary"> / {priceUnit === "kg" ? "kg" : "pc"}</span>
                          </p>
                        ) : null}

                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min={item.moq}
                            step={1}
                            value={item.quantityValue}
                            onChange={(event) => onQuantityChange(item.id, event.target.value)}
                            placeholder={priceUnit === "kg" ? `Min ${item.moq} kg` : `Min ${item.moq}`}
                            className="w-full rounded-md border border-grey-card px-2 py-1.5 text-sm text-grey-primary"
                          />
                          {isBulk && (
                            <span className="shrink-0 text-xs font-medium text-grey-secondary">kg</span>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => onSave(item.id)}
                            className="flex-1 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-600"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => onClear(item.id)}
                            className="rounded-md border border-grey-card px-3 py-1.5 text-xs font-semibold text-grey-primary hover:bg-grey-100"
                          >
                            Clear
                          </button>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </article>
            ))}
          </div>

          {filteredItems.length === 0 ? (
            <div className="rounded-lg border border-dashed border-grey-card p-4 text-sm text-grey-secondary">
              No shades found for this category/subcategory.
            </div>
          ) : null}
        </section>

        <aside className="h-fit rounded-2xl border border-grey-card bg-white p-4 xl:sticky xl:top-24">
          <h3 className="text-3xl font-semibold text-grey-primary">My Colour Chart</h3>
          <p className="mt-1 text-sm text-grey-secondary">Selected: {selectedItems.length}</p>

          <div className="mt-4 rounded-xl border border-primary-100 bg-primary-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-grey-secondary">Family Counts</p>
            {countsByFamily.length ? (
              <ul className="mt-2 space-y-1 text-sm text-grey-primary">
                {countsByFamily.map(([family, count]) => (
                  <li key={family} className="flex items-center justify-between">
                    <span>{family}</span>
                    <span className="font-semibold">{count}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-grey-secondary">No shades selected yet.</p>
            )}
          </div>

          <div className="mt-4 rounded-xl border border-grey-card bg-grey-50 p-3">
            <p className="text-sm font-semibold text-grey-primary">Total units: {totalUnits}</p>
            {pricePerUnit != null && totalUnits > 0 ? (
              <p className="mt-1 text-sm text-grey-secondary">
                Subtotal:{" "}
                <span className="font-semibold text-grey-primary">
                  €{(totalUnits * pricePerUnit).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </p>
            ) : null}
          </div>

          <div className="mt-4 space-y-2">
            {selectedItems.slice(0, 12).map((item) => (
              <div key={item.id} className="rounded-md border border-grey-card bg-white px-2 py-1.5 text-xs text-grey-primary">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate font-semibold">{item.code}</span>
                  <span>{item.quantityValue || "0"}</span>
                </div>
              </div>
            ))}
            {selectedItems.length > 12 ? (
              <p className="text-xs text-grey-secondary">+ {selectedItems.length - 12} more selected shades</p>
            ) : null}
          </div>
        </aside>
      </div>
      {lightboxItem ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Enlarged image: ${lightboxItem.code}`}
          className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-black/90"
          onClick={() => setLightboxItem(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxItem(null)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label="Close"
          >
            <X size={22} />
          </button>
          <div className="flex max-h-[85vh] max-w-[85vw] flex-col items-center gap-3" onClick={(e) => e.stopPropagation()}>
            <img
              src={lightboxItem.src}
              alt={lightboxItem.alt}
              className="max-h-[78vh] max-w-full rounded-xl object-contain shadow-2xl"
            />
            <p className="text-sm font-semibold text-white/90">{lightboxItem.code}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
