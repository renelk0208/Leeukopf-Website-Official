import { useMemo, useState, type SyntheticEvent } from "react";

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
  description: string;
  items: B2BUniformShadeItem[];
  validationMessage?: string;
  onQuantityChange: (id: string, value: string) => void;
  onSave: (id: string) => void;
  onClear: (id: string) => void;
};

export default function B2BUniformShadeGrid({
  title,
  description,
  items,
  validationMessage,
  onQuantityChange,
  onSave,
  onClear,
}: B2BUniformShadeGridProps) {
  const [search, setSearch] = useState("");
  const [hiddenItemIds, setHiddenItemIds] = useState<Record<string, true>>({});

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
        <p className="mt-1 text-sm text-grey-secondary">{description}</p>
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
                      <div className="flex h-40 items-center justify-center rounded-xl bg-grey-100 p-2">
                        <img
                          src={item.imageSrc}
                          alt={item.imageAlt}
                          className="max-h-full max-w-full object-contain"
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
                      </div>

                      <div className="mt-3 space-y-2">
                        <p className="text-sm font-semibold leading-tight text-grey-primary break-words [overflow-wrap:anywhere]">{item.code}</p>
                        {showName ? <p className="text-xs leading-tight text-grey-secondary break-words [overflow-wrap:anywhere]">{item.name}</p> : null}
                        {showFamily ? <p className="text-xs leading-tight text-grey-secondary break-words [overflow-wrap:anywhere]">{item.family}</p> : null}
                        <p className="text-xs text-grey-secondary">MOQ: {item.moq}</p>

                        <input
                          type="number"
                          min={0}
                          step={1}
                          value={item.quantityValue}
                          onChange={(event) => onQuantityChange(item.id, event.target.value)}
                          placeholder="Qty"
                          className="w-full rounded-md border border-grey-card px-2 py-1.5 text-sm text-grey-primary"
                        />

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
    </div>
  );
}
