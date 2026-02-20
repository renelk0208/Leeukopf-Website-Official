import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { categories } from "../config/categories";

type Row = Record<string, string>;
type OrderFormat = "finished_units" | "bulk";
type BulkContainer = "1kg_flask" | "5kg_bucket";
type OrderLine = {
  code: string;
  name: string;
  qty: number;
  unit: "pcs" | "kg";
};
type ClientDetails = {
  companyName: string;
  contactName: string;
  contactNumber: string;
  invoiceAddress: string;
  invoiceRegion: string;
  invoicePostalCode: string;
  shippingAddress: string;
  shippingRegion: string;
  shippingPostalCode: string;
  sameAddress: boolean;
  vat: string;
  country: string;
  email: string;
};
type BottlePackaging = {
  size: string;
  color: string;
  brushShape: string;
  brushType?: string;
};

type JarPackaging = {
  size: string;
  color: string;
};

type PackagingPayload = {
  mode: "standard" | "custom";
  system: "bottle" | "jar";
  bottle: BottlePackaging | null;
  jar: JarPackaging | null;
  customDescription: string;
  notes: string;
};

const BOTTLE_SIZE_OPTIONS = ["10ml", "15ml"];
const BOTTLE_COLOR_OPTIONS = ["white", "black"];
const BRUSH_SHAPE_OPTIONS = ["oval", "flat"];
const BRUSH_TYPE_OPTIONS = ["standard", "thin"];
const JAR_SIZE_OPTIONS = ["10ml", "15ml"];
const JAR_COLOR_OPTIONS = ["white", "black"];
const solidColourConfig = categories.solidColour;
const ALLOWED_UNITS = solidColourConfig.allowedUnits;
const ALLOWED_PACKAGING = solidColourConfig.allowedPackaging;
const ENABLE_BRUSH_TYPE = solidColourConfig.hasGlobalBrush;
const SHOW_JAR_SIZE_SELECTOR = solidColourConfig.hasJarSizeSelector;
const ALLOWS_PCS_UNIT = ALLOWED_UNITS.includes("pcs");
const ALLOWS_KG_UNIT = ALLOWED_UNITS.includes("kg");
const ALLOWS_BUCKET_PACKAGING = ALLOWED_PACKAGING.includes("bucket");
const SELECTED_SHADES_STORAGE_KEY = "lk_selected_solid_shades";
const SELECTED_SHADES_ORDER_STORAGE_KEY = "lk_selected_solid_shades_order";
const SELECTED_SHADES_QTY_STORAGE_KEY = "lk_selected_solid_shades_qty";
const ENABLE_VIRTUAL_GRID = false;
const QUANTITY_MOQ = 30;
const QUANTITY_STEP = 5;
const ESTIMATED_BLOCK_SIZE = 300;
const FAMILY_ORDER = [
  "Reds",
  "Oranges",
  "Yellows",
  "Greens",
  "Teals",
  "Blues",
  "Purples",
  "Pinks",
  "Browns",
  "Nudes/Beiges",
  "Whites",
  "Blacks",
  "Greys",
  "Other",
] as const;
const PANEL_FAMILY_ORDER = [
  "Nudes/Beiges",
  "Pinks",
  "Reds",
  "Oranges",
  "Yellows",
  "Greens",
  "Teals",
  "Blues",
  "Purples",
  "Browns",
  "Greys",
  "Whites",
  "Blacks",
  "Other",
] as const;
const BALANCE_PREFERRED_FAMILIES = ["Nudes/Beiges", "Reds", "Greens", "Blues", "Whites", "Blacks"] as const;

const toDisplayLabel = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

type SelectedShade = {
  id: string;
  code: string;
  image: string;
  hasImage: boolean;
  family: string;
};

type SelectedSortMode = "family" | "code" | "recent";

type SelectedFamilyGroup = {
  family: string;
  shades: SelectedShade[];
};

type BalanceInsight = {
  topFamilies: Array<{ family: string; percentage: number }>;
  hint: string | null;
};

type GridShadeItem = {
  rowId: string;
  sku: string;
  code: string;
  hex: string;
  image: string;
  hasImage: boolean;
  currentView: "nail" | "card";
  isSelected: boolean;
  qtyValue: number | "";
};

type GridFilter = "all" | "selected" | "unselected";

type ShadeTileProps = {
  rowId: string;
  sku: string;
  code: string;
  hex: string;
  image: string;
  hasImage: boolean;
  currentView: "nail" | "card";
  isSelected: boolean;
  qtyValue: number | "";
  qtyUnit: "pcs" | "kg";
  onToggleSelected: (id: string) => void;
  onToggleView: (id: string, hasImage: boolean) => void;
  onSetImageStatus: (id: string, status: "OK" | "MISSING") => void;
  onSetQty: (sku: string, value: string) => void;
};

type SelectedPanelProps = {
  selectedCount: number;
  countsByFamily: Array<[string, number]>;
  selectedShades: SelectedShade[];
  groupedSelectedShades: SelectedFamilyGroup[];
  sortMode: SelectedSortMode;
  onSortModeChange: (mode: SelectedSortMode) => void;
  balanceInsight: BalanceInsight;
  gridFilter: GridFilter;
  onGridFilterChange: (filter: GridFilter) => void;
  showQuantities: boolean;
  onToggleQuantities: () => void;
  quantities: Record<string, number>;
  totalSelectedUnits: number;
  estimatedBlocks: number;
  onQuantityInput: (id: string, value: string) => void;
  onQuantityIncrement: (id: string) => void;
  onQuantityDecrement: (id: string) => void;
  onRemoveShade: (id: string) => void;
  onClearAll: () => void;
  onCopyCodes: () => void;
  onDownloadCsv: () => void;
  copyFeedback: boolean;
  onSetImageStatus: (id: string, status: "OK" | "MISSING") => void;
  className?: string;
};

type MobileDrawerProps = {
  open: boolean;
  onClose: () => void;
  panelProps: SelectedPanelProps;
};

type ShadeGridProps = {
  items: GridShadeItem[];
  qtyUnit: "pcs" | "kg";
  onToggleSelected: (id: string) => void;
  onToggleView: (id: string, hasImage: boolean) => void;
  onSetImageStatus: (id: string, status: "OK" | "MISSING") => void;
  onSetQty: (sku: string, value: string) => void;
};

const normalizeHex = (value: string): string | null => {
  const raw = value.trim();
  if (!raw) return null;
  const hex = raw.startsWith("#") ? raw.slice(1) : raw;
  if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(hex)) return null;
  if (hex.length === 3) {
    const expanded = hex
      .split("")
      .map((char) => char + char)
      .join("");
    return `#${expanded.toUpperCase()}`;
  }
  return `#${hex.toUpperCase()}`;
};

const hexToHsl = (hex: string): { h: number; s: number; l: number } | null => {
  const normalized = normalizeHex(hex);
  if (!normalized) return null;

  const r = parseInt(normalized.slice(1, 3), 16) / 255;
  const g = parseInt(normalized.slice(3, 5), 16) / 255;
  const b = parseInt(normalized.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  if (delta !== 0) {
    if (max === r) h = ((g - b) / delta) % 6;
    else if (max === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h *= 60;
    if (h < 0) h += 360;
  }

  return {
    h,
    s: s * 100,
    l: l * 100,
  };
};

const classifyFamilyFromHex = (hex: string): string => {
  const hsl = hexToHsl(hex);
  if (!hsl) return "Other";

  const { h, s, l } = hsl;

  if (l >= 92 && s <= 12) return "Whites";
  if (l <= 12 && s <= 20) return "Blacks";
  if (s <= 12) return "Greys";

  if (h >= 20 && h < 45 && l < 45) return "Browns";
  if ((h >= 15 && h < 50 && s < 35 && l >= 45) || (h >= 10 && h < 40 && s < 45 && l >= 70)) {
    return "Nudes/Beiges";
  }

  if (h < 15 || h >= 345) return "Reds";
  if (h < 45) return "Oranges";
  if (h < 70) return "Yellows";
  if (h < 165) return "Greens";
  if (h < 195) return "Teals";
  if (h < 255) return "Blues";
  if (h < 290) return "Purples";
  if (h < 345) return "Pinks";

  return "Other";
};

const FAMILY_FIELDS = ["family", "Family", "Colour_Family", "Color_Family", "colour_family", "color_family"];

const getRowId = (row: Row, idx: number): string => row["Internal_SKU"] || row["Shade_Code"] || `row-${idx}`;

const getRowCode = (row: Row, fallbackId: string): string => row["Shade_Code"] || row["Internal_SKU"] || fallbackId;

const getRowHex = (row: Row): string => row["Hex_Code"] || row["HEX"] || "";

const getRowImage = (row: Row, id: string): string => row["Swatch_Image"] || `/img/solid-colour/${id}.webp`;

const getRowFamily = (row: Row): string => {
  const familyField = FAMILY_FIELDS.map((key) => row[key]).find((value) => Boolean(value?.trim()));
  if (familyField) return familyField.trim();
  return classifyFamilyFromHex(getRowHex(row));
};

function normalizeQuantity(value: number): number {
  if (Number.isNaN(value)) return QUANTITY_MOQ;
  const rounded = Math.round(value / QUANTITY_STEP) * QUANTITY_STEP;
  return Math.max(QUANTITY_MOQ, rounded);
}

const codeSort = (left: string, right: string): number =>
  left.localeCompare(right, undefined, { numeric: true, sensitivity: "base" });

const panelFamilyOrderIndex = (family: string): number => {
  const idx = PANEL_FAMILY_ORDER.indexOf(family as (typeof PANEL_FAMILY_ORDER)[number]);
  return idx === -1 ? Number.MAX_SAFE_INTEGER : idx;
};

const ShadeTile = memo(function ShadeTile({
  rowId,
  sku,
  code,
  hex,
  image,
  hasImage,
  currentView,
  isSelected,
  qtyValue,
  qtyUnit,
  onToggleSelected,
  onToggleView,
  onSetImageStatus,
  onSetQty,
}: ShadeTileProps) {
  const showImage = hasImage && currentView === "nail";
  const showCard = !hasImage || currentView === "card";

  const handleToggleSelected = useCallback(() => {
    onToggleSelected(rowId);
  }, [onToggleSelected, rowId]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggleSelected(rowId);
    }
  }, [onToggleSelected, rowId]);

  const handleToggleViewClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onToggleView(rowId, hasImage);
  }, [onToggleView, rowId, hasImage]);

  const handleImageLoad = useCallback(() => {
    onSetImageStatus(rowId, "OK");
  }, [onSetImageStatus, rowId]);

  const handleImageError = useCallback(() => {
    onSetImageStatus(rowId, "MISSING");
  }, [onSetImageStatus, rowId]);

  const stopPropagation = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
  }, []);

  const handleQtyChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onSetQty(sku, e.target.value);
  }, [onSetQty, sku]);

  return (
    <div
      className={`cursor-pointer rounded-2xl border bg-white p-3 shadow-sm transition ${
        isSelected ? "border-black ring-2 ring-black/10" : "border-neutral-200"
      }`}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      aria-label={`${isSelected ? "Deselect" : "Select"} ${code}`}
      onClick={handleToggleSelected}
      onKeyDown={handleKeyDown}
    >
      <div
        className="relative aspect-square w-full overflow-hidden rounded-xl bg-neutral-50"
        role="img"
        aria-label={`${code} ${showImage ? "nail view" : "card view"}`}
      >
        {showImage ? (
          <>
            <img
              src={image}
              alt={code}
              className="h-full w-full object-cover"
              loading="lazy"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
            <div className="absolute bottom-2 right-2 rounded-full border bg-white px-2 py-0.5 text-[10px] shadow-sm">
              View card
            </div>
          </>
        ) : showCard && hex ? (
          <>
            <div className="h-full w-full" style={{ backgroundColor: hex }} />
            {hasImage && (
              <div className="absolute bottom-2 right-2 rounded-full border bg-white px-2 py-0.5 text-[10px] shadow-sm">
                View nail
              </div>
            )}
          </>
        ) : (
          <div className="flex h-full items-center justify-center px-2 text-center text-xs text-neutral-500">{code}</div>
        )}

        {isSelected && (
          <div className="absolute left-2 top-2 rounded-full border bg-black px-2 py-0.5 text-[10px] text-white shadow-sm">
            Selected
          </div>
        )}
      </div>

      <div className="mt-2">
        <div className="text-xs font-semibold">{code}</div>
        {sku && sku !== code && <div className="text-[11px] text-neutral-500">{sku}</div>}

        <button
          type="button"
          disabled={!hasImage}
          aria-pressed={currentView === "card"}
          aria-label={
            hasImage
              ? `${currentView === "nail" ? "Show card view" : "Show nail view"} for ${code}`
              : `No alternate view available for ${code}`
          }
          onClick={handleToggleViewClick}
          className="mt-2 rounded-md border px-2 py-1 text-[11px] text-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {!hasImage ? "No alternate view" : currentView === "nail" ? "Show card" : "Show nail"}
        </button>

        <div className="mt-3 flex items-center gap-2" onClick={stopPropagation}>
          <input
            type="number"
            min={0}
            placeholder={qtyUnit === "kg" ? "KG" : "Qty"}
            value={qtyValue}
            onClick={stopPropagation}
            onChange={handleQtyChange}
            className="w-16 rounded border px-2 py-1 text-xs"
          />
        </div>
      </div>
    </div>
  );
});

type SelectedSwatchItemProps = {
  shade: SelectedShade;
  quantity: number;
  showQuantities: boolean;
  onRemoveShade: (id: string) => void;
  onSetImageStatus: (id: string, status: "OK" | "MISSING") => void;
  onQuantityInput: (id: string, value: string) => void;
  onQuantityIncrement: (id: string) => void;
  onQuantityDecrement: (id: string) => void;
};

const SelectedSwatchItem = memo(function SelectedSwatchItem({
  shade,
  quantity,
  showQuantities,
  onRemoveShade,
  onSetImageStatus,
  onQuantityInput,
  onQuantityIncrement,
  onQuantityDecrement,
}: SelectedSwatchItemProps) {
  const handleRemove = useCallback(() => onRemoveShade(shade.id), [onRemoveShade, shade.id]);
  const handleLoad = useCallback(() => onSetImageStatus(shade.id, "OK"), [onSetImageStatus, shade.id]);
  const handleError = useCallback(() => onSetImageStatus(shade.id, "MISSING"), [onSetImageStatus, shade.id]);
  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onQuantityInput(shade.id, e.target.value),
    [onQuantityInput, shade.id]
  );
  const handleInc = useCallback(() => onQuantityIncrement(shade.id), [onQuantityIncrement, shade.id]);
  const handleDec = useCallback(() => onQuantityDecrement(shade.id), [onQuantityDecrement, shade.id]);

  return (
    <div className="relative rounded-lg border bg-neutral-50 p-1">
      <button
        type="button"
        onClick={handleRemove}
        className="absolute right-1 top-1 z-10 h-5 w-5 rounded-full border bg-white text-[10px] leading-none"
        aria-label={`Remove ${shade.code}`}
      >
        ×
      </button>

      <div className="aspect-square overflow-hidden rounded-md bg-neutral-100">
        {shade.hasImage ? (
          <img
            src={shade.image}
            alt={shade.code}
            className="h-full w-full object-cover"
            loading="lazy"
            onLoad={handleLoad}
            onError={handleError}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center px-1 text-center text-[10px] font-medium text-neutral-600">
            {shade.code}
          </div>
        )}
      </div>

      <div className="mt-1 truncate text-[10px] font-medium text-neutral-700">{shade.code}</div>

      {showQuantities && (
        <div className="mt-1 flex items-center justify-center gap-1">
          <button type="button" onClick={handleDec} className="h-5 w-5 rounded border text-[10px]">-</button>
          <input
            type="number"
            min={QUANTITY_MOQ}
            step={QUANTITY_STEP}
            value={quantity}
            onChange={handleInput}
            className="w-11 rounded border px-1 py-0.5 text-center text-[10px]"
          />
          <button type="button" onClick={handleInc} className="h-5 w-5 rounded border text-[10px]">+</button>
        </div>
      )}
    </div>
  );
});

function ShadeGrid({ items, qtyUnit, onToggleSelected, onToggleView, onSetImageStatus, onSetQty }: ShadeGridProps) {
  if (ENABLE_VIRTUAL_GRID) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {items.map((item) => (
          <ShadeTile
            key={item.rowId}
            rowId={item.rowId}
            sku={item.sku}
            code={item.code}
            hex={item.hex}
            image={item.image}
            hasImage={item.hasImage}
            currentView={item.currentView}
            isSelected={item.isSelected}
            qtyValue={item.qtyValue}
            qtyUnit={qtyUnit}
            onToggleSelected={onToggleSelected}
            onToggleView={onToggleView}
            onSetImageStatus={onSetImageStatus}
            onSetQty={onSetQty}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {items.map((item) => (
        <ShadeTile
          key={item.rowId}
          rowId={item.rowId}
          sku={item.sku}
          code={item.code}
          hex={item.hex}
          image={item.image}
          hasImage={item.hasImage}
          currentView={item.currentView}
          isSelected={item.isSelected}
          qtyValue={item.qtyValue}
          qtyUnit={qtyUnit}
          onToggleSelected={onToggleSelected}
          onToggleView={onToggleView}
          onSetImageStatus={onSetImageStatus}
          onSetQty={onSetQty}
        />
      ))}
    </div>
  );
}

function SelectedPanel({
  selectedCount,
  countsByFamily,
  selectedShades,
  groupedSelectedShades,
  sortMode,
  onSortModeChange,
  balanceInsight,
  gridFilter,
  onGridFilterChange,
  showQuantities,
  onToggleQuantities,
  quantities,
  totalSelectedUnits,
  estimatedBlocks,
  onQuantityInput,
  onQuantityIncrement,
  onQuantityDecrement,
  onRemoveShade,
  onClearAll,
  onCopyCodes,
  onDownloadCsv,
  copyFeedback,
  onSetImageStatus,
  className,
}: SelectedPanelProps) {
  const renderSwatch = useCallback(
    (shade: SelectedShade) => (
      <SelectedSwatchItem
        key={shade.id}
        shade={shade}
        quantity={quantities[shade.id] ?? QUANTITY_MOQ}
        showQuantities={showQuantities}
        onRemoveShade={onRemoveShade}
        onSetImageStatus={onSetImageStatus}
        onQuantityInput={onQuantityInput}
        onQuantityIncrement={onQuantityIncrement}
        onQuantityDecrement={onQuantityDecrement}
      />
    ),
    [onQuantityDecrement, onQuantityIncrement, onQuantityInput, onRemoveShade, onSetImageStatus, quantities, showQuantities]
  );

  return (
    <div className={`rounded-2xl border bg-white p-4 shadow-sm ${className ?? ""}`}>
      <div className="text-base font-semibold">My Colour Chart</div>
      <div className="mt-1 text-sm text-neutral-600">Selected: {selectedCount}</div>

      <div className="mt-3 rounded-xl border bg-neutral-50 p-3">
        <div className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Balance</div>
        {balanceInsight.topFamilies.length ? (
          <div className="mt-2 flex flex-wrap gap-2">
            {balanceInsight.topFamilies.map((entry) => (
              <span key={entry.family} className="rounded-full border bg-white px-2 py-1 text-[11px] text-neutral-700">
                {entry.family} {entry.percentage}%
              </span>
            ))}
          </div>
        ) : (
          <div className="mt-2 text-xs text-neutral-500">No balance data yet.</div>
        )}
        {balanceInsight.hint && <div className="mt-2 text-xs text-neutral-700">{balanceInsight.hint}</div>}
      </div>

      <div className="mt-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Family counts</div>
        {countsByFamily.length ? (
          <div className="mt-2 flex flex-wrap gap-2">
            {countsByFamily.map(([family, count]) => (
              <span key={family} className="rounded-full border bg-neutral-50 px-2 py-1 text-[11px] text-neutral-700">
                {family}: {count}
              </span>
            ))}
          </div>
        ) : (
          <div className="mt-2 text-xs text-neutral-500">No shades selected yet.</div>
        )}
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Selected swatches</div>
          <button
            type="button"
            onClick={onClearAll}
            disabled={selectedCount === 0}
            className="rounded-md border px-2 py-1 text-[11px] text-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Clear all
          </button>
        </div>

        <div className="mb-2">
          <div className="mb-1 text-[11px] text-neutral-500">Sort</div>
          <div className="inline-flex rounded-full border bg-neutral-50 p-1">
            <button
              type="button"
              onClick={() => onSortModeChange("family")}
              className={`rounded-full px-2 py-1 text-[11px] ${sortMode === "family" ? "bg-black text-white" : "text-neutral-700"}`}
            >
              By Family
            </button>
            <button
              type="button"
              onClick={() => onSortModeChange("code")}
              className={`rounded-full px-2 py-1 text-[11px] ${sortMode === "code" ? "bg-black text-white" : "text-neutral-700"}`}
            >
              By Code
            </button>
            <button
              type="button"
              onClick={() => onSortModeChange("recent")}
              className={`rounded-full px-2 py-1 text-[11px] ${sortMode === "recent" ? "bg-black text-white" : "text-neutral-700"}`}
            >
              Recently Added
            </button>
          </div>
        </div>

        <div className="mb-2 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onGridFilterChange(gridFilter === "selected" ? "all" : "selected")}
            className={`rounded-full border px-2 py-1 text-[11px] transition ${
              gridFilter === "selected" ? "bg-black text-white" : "bg-neutral-50 text-neutral-700"
            }`}
          >
            Show selected only
          </button>
          <button
            type="button"
            onClick={() => onGridFilterChange(gridFilter === "unselected" ? "all" : "unselected")}
            className={`rounded-full border px-2 py-1 text-[11px] transition ${
              gridFilter === "unselected" ? "bg-black text-white" : "bg-neutral-50 text-neutral-700"
            }`}
          >
            Show unselected only
          </button>
        </div>

        <div className="mb-3 flex gap-2">
          <button
            type="button"
            onClick={onCopyCodes}
            disabled={selectedCount === 0}
            className="rounded-md border px-2 py-1 text-[11px] text-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {copyFeedback ? "Copied ✓" : "Copy Codes"}
          </button>
          <button
            type="button"
            onClick={onDownloadCsv}
            disabled={selectedCount === 0}
            className="rounded-md border px-2 py-1 text-[11px] text-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Download CSV
          </button>
        </div>

        <div className="mb-3 rounded-lg border bg-neutral-50 px-2 py-2">
          <div className="flex items-center justify-between">
            <div className="text-xs font-medium text-neutral-700">Add quantities</div>
            <button
              type="button"
              onClick={onToggleQuantities}
              className={`rounded-full border px-2 py-0.5 text-[11px] ${showQuantities ? "bg-black text-white" : "bg-white text-neutral-700"}`}
            >
              {showQuantities ? "On" : "Off"}
            </button>
          </div>
          <div className="mt-1 text-[11px] text-neutral-600">Total units: {totalSelectedUnits}</div>
          <div className="text-[11px] text-neutral-600">Estimated production blocks: {estimatedBlocks}</div>
        </div>

        {selectedShades.length ? (
          sortMode === "family" ? (
            <div className="space-y-3">
              {groupedSelectedShades.map((group) => (
                <div key={group.family}>
                  <div className="mb-1 text-[11px] font-medium text-neutral-700">{group.family} ({group.shades.length})</div>
                  <div className="grid grid-cols-3 gap-2">{group.shades.map(renderSwatch)}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">{selectedShades.map(renderSwatch)}</div>
          )
        ) : (
          <div className="rounded-lg border border-dashed p-3 text-xs text-neutral-500">
            Tap shades in the grid to build your chart.
          </div>
        )}
      </div>
    </div>
  );
}

function MobileDrawer({ open, onClose, panelProps }: MobileDrawerProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/40 lg:hidden" onClick={onClose}>
      <div
        className="max-h-[85vh] w-full overflow-y-auto rounded-t-2xl border bg-white p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-semibold">My Colour Chart</div>
          <button type="button" onClick={onClose} className="rounded-md border px-2 py-1 text-xs">
            Close
          </button>
        </div>
        <SelectedPanel {...panelProps} className="border-0 p-0 shadow-none" />
      </div>
    </div>
  );
}

export default function InternalSolidColourGrid() {
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [imgStatus, setImgStatus] = useState<Record<string, "OK" | "MISSING">>({});
  const [tileView, setTileView] = useState<Record<string, "nail" | "card">>({});
  const [onlyMissing, setOnlyMissing] = useState(false);
  const [order, setOrder] = useState<Record<string, number>>({});
  const [client, setClient] = useState<ClientDetails>({
    companyName: "",
    contactName: "",
    contactNumber: "",
    invoiceAddress: "",
    invoiceRegion: "",
    invoicePostalCode: "",
    shippingAddress: "",
    shippingRegion: "",
    shippingPostalCode: "",
    sameAddress: false,
    vat: "",
    country: "",
    email: "",
  });
  const [packaging, setPackaging] = useState<PackagingPayload>({
    mode: "standard",
    system: "bottle",
    bottle: {
      size: "",
      color: "",
      brushShape: "",
      brushType: "",
    },
    jar: {
      size: "",
      color: "",
    },
    customDescription: "",
    notes: "",
  });
  const [packagingError, setPackagingError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showThankYouPopup, setShowThankYouPopup] = useState(false);
  const [orderFormat, setOrderFormat] = useState<OrderFormat>("finished_units");
  const [bulkContainer, setBulkContainer] = useState<BulkContainer | "">("");
  const [isBulkContainerAuto, setIsBulkContainerAuto] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedOrder, setSelectedOrder] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [sortMode, setSortMode] = useState<SelectedSortMode>("family");
  const [showQuantities, setShowQuantities] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [gridFilter, setGridFilter] = useState<GridFilter>("all");
  const [copyFeedback, setCopyFeedback] = useState(false);
  const copyFeedbackTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    fetch("/data/solid-1200.json")
      .then((res) => res.json())
      .then((data: unknown) => setRows(Array.isArray(data) ? (data as Row[]) : []))
      .catch(() => setRows([]));
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("solidColourOrder1200");
    if (saved) {
      try {
        setOrder(JSON.parse(saved));
      } catch {
        setOrder({});
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("solidColourOrder1200", JSON.stringify(order));
  }, [order]);

  useEffect(() => {
    const raw = localStorage.getItem(SELECTED_SHADES_STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const ids = parsed.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
        setSelectedIds(new Set(ids));
      }
    } catch {
      setSelectedIds(new Set());
    }
  }, []);

  useEffect(() => {
    const raw = localStorage.getItem(SELECTED_SHADES_ORDER_STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const safe = parsed.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
        setSelectedOrder(safe);
      }
    } catch {
      setSelectedOrder([]);
    }
  }, []);

  useEffect(() => {
    const raw = localStorage.getItem(SELECTED_SHADES_QTY_STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed: unknown = JSON.parse(raw);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        const safe: Record<string, number> = {};
        Object.entries(parsed).forEach(([key, value]) => {
          if (typeof value === "number") safe[key] = normalizeQuantity(value);
        });
        setQuantities(safe);
      }
    } catch {
      setQuantities({});
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(SELECTED_SHADES_STORAGE_KEY, JSON.stringify(Array.from(selectedIds)));
  }, [selectedIds]);

  useEffect(() => {
    localStorage.setItem(SELECTED_SHADES_ORDER_STORAGE_KEY, JSON.stringify(selectedOrder));
  }, [selectedOrder]);

  useEffect(() => {
    localStorage.setItem(SELECTED_SHADES_QTY_STORAGE_KEY, JSON.stringify(quantities));
  }, [quantities]);

  useEffect(() => {
    return () => {
      if (copyFeedbackTimeoutRef.current !== null) {
        window.clearTimeout(copyFeedbackTimeoutRef.current);
      }
    };
  }, []);

  const setImageStatus = useCallback((id: string, status: "OK" | "MISSING") => {
    setImgStatus((prev) => (prev[id] === status ? prev : { ...prev, [id]: status }));
  }, []);

  const toggleSelected = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      const exists = next.has(id);

      if (exists) next.delete(id);
      else next.add(id);

      setSelectedOrder((prevOrder) => {
        if (exists) return prevOrder.filter((entry) => entry !== id);
        return [id, ...prevOrder.filter((entry) => entry !== id)];
      });

      setQuantities((prevQty) => {
        if (exists) {
          if (!(id in prevQty)) return prevQty;
          const { [id]: _removed, ...rest } = prevQty;
          return rest;
        }
        if (id in prevQty) return prevQty;
        return { ...prevQty, [id]: QUANTITY_MOQ };
      });

      return next;
    });
  }, []);

  const removeSelected = useCallback((id: string) => {
    setSelectedIds((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });

    setSelectedOrder((prev) => prev.filter((entry) => entry !== id));
    setQuantities((prev) => {
      if (!(id in prev)) return prev;
      const { [id]: _removed, ...rest } = prev;
      return rest;
    });
  }, []);

  const clearSelected = useCallback(() => {
    setSelectedIds(new Set());
    setSelectedOrder([]);
    setQuantities({});
  }, []);

  const setQuantityInput = useCallback((id: string, value: string) => {
    const numeric = parseInt(value || String(QUANTITY_MOQ), 10);
    setQuantities((prev) => ({ ...prev, [id]: normalizeQuantity(numeric) }));
  }, []);

  const incrementQuantity = useCallback((id: string) => {
    setQuantities((prev) => {
      const current = prev[id] ?? QUANTITY_MOQ;
      return { ...prev, [id]: normalizeQuantity(current + QUANTITY_STEP) };
    });
  }, []);

  const decrementQuantity = useCallback((id: string) => {
    setQuantities((prev) => {
      const current = prev[id] ?? QUANTITY_MOQ;
      return { ...prev, [id]: normalizeQuantity(current - QUANTITY_STEP) };
    });
  }, []);

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
        const key = getRowId(r, idx);
        return imgStatus[key] === "MISSING";
      });
    }

    return out;
  }, [rows, q, onlyMissing, imgStatus]);

  const rowById = useMemo(() => {
    const map = new Map<string, Row>();
    rows.forEach((row, idx) => {
      map.set(getRowId(row, idx), row);
    });
    return map;
  }, [rows]);

  useEffect(() => {
    const selectedArray = Array.from(selectedIds);
    const selectedSet = new Set(selectedArray);

    setSelectedOrder((prev) => {
      const kept = prev.filter((id) => selectedSet.has(id));
      const missing = selectedArray.filter((id) => !kept.includes(id));
      if (missing.length === 0 && kept.length === prev.length) return prev;
      return [...kept, ...missing];
    });

    setQuantities((prev) => {
      const next: Record<string, number> = {};
      let changed = false;

      selectedArray.forEach((id) => {
        if (typeof prev[id] === "number") next[id] = normalizeQuantity(prev[id]);
        else {
          next[id] = QUANTITY_MOQ;
          changed = true;
        }
      });

      const prevKeys = Object.keys(prev);
      if (!changed && prevKeys.length !== Object.keys(next).length) changed = true;
      if (!changed) {
        for (const key of prevKeys) {
          if (!(key in next) || next[key] !== prev[key]) {
            changed = true;
            break;
          }
        }
      }

      return changed ? next : prev;
    });
  }, [selectedIds]);

  const selectedShades = useMemo<SelectedShade[]>(() => {
    const out: SelectedShade[] = [];
    selectedIds.forEach((id) => {
      const row = rowById.get(id);
      if (!row) return;
      const image = getRowImage(row, id);
      out.push({
        id,
        code: getRowCode(row, id),
        image,
        hasImage: Boolean(image) && imgStatus[id] !== "MISSING",
        family: getRowFamily(row),
      });
    });

    return out;
  }, [selectedIds, rowById, imgStatus]);

  const selectedByCode = useMemo(() => [...selectedShades].sort((a, b) => codeSort(a.code, b.code)), [selectedShades]);

  const selectedOrderIndex = useMemo(() => {
    const index = new Map<string, number>();
    selectedOrder.forEach((id, pos) => index.set(id, pos));
    return index;
  }, [selectedOrder]);

  const selectedByRecent = useMemo(
    () =>
      [...selectedShades].sort((a, b) => {
        const left = selectedOrderIndex.get(a.id) ?? Number.MAX_SAFE_INTEGER;
        const right = selectedOrderIndex.get(b.id) ?? Number.MAX_SAFE_INTEGER;
        if (left !== right) return left - right;
        return codeSort(a.code, b.code);
      }),
    [selectedShades, selectedOrderIndex]
  );

  const groupedSelectedShades = useMemo<SelectedFamilyGroup[]>(() => {
    const groups = new Map<string, SelectedShade[]>();
    selectedByCode.forEach((shade) => {
      const arr = groups.get(shade.family) || [];
      arr.push(shade);
      groups.set(shade.family, arr);
    });

    return Array.from(groups.entries())
      .sort((a, b) => {
        const familyOrder = panelFamilyOrderIndex(a[0]) - panelFamilyOrderIndex(b[0]);
        if (familyOrder !== 0) return familyOrder;
        return a[0].localeCompare(b[0]);
      })
      .map(([family, shades]) => ({ family, shades }));
  }, [selectedByCode]);

  const displaySelectedShades = useMemo(() => {
    if (sortMode === "recent") return selectedByRecent;
    return selectedByCode;
  }, [selectedByCode, selectedByRecent, sortMode]);

  const countsByFamily = useMemo<Array<[string, number]>>(() => {
    const counts = new Map<string, number>();
    selectedShades.forEach((shade) => {
      counts.set(shade.family, (counts.get(shade.family) || 0) + 1);
    });

    return Array.from(counts.entries()).sort((a, b) => {
      const indexA = FAMILY_ORDER.indexOf(a[0] as (typeof FAMILY_ORDER)[number]);
      const indexB = FAMILY_ORDER.indexOf(b[0] as (typeof FAMILY_ORDER)[number]);
      const safeA = indexA === -1 ? Number.MAX_SAFE_INTEGER : indexA;
      const safeB = indexB === -1 ? Number.MAX_SAFE_INTEGER : indexB;
      if (safeA !== safeB) return safeA - safeB;
      return a[0].localeCompare(b[0]);
    });
  }, [selectedShades]);

  const balanceInsight = useMemo<BalanceInsight>(() => {
    if (!selectedShades.length) return { topFamilies: [], hint: null };

    const total = selectedShades.length;
    const familyCounts = new Map<string, number>();
    selectedShades.forEach((shade) => {
      familyCounts.set(shade.family, (familyCounts.get(shade.family) || 0) + 1);
    });

    const ranked = Array.from(familyCounts.entries()).sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1];
      return panelFamilyOrderIndex(a[0]) - panelFamilyOrderIndex(b[0]);
    });

    const topFamilies = ranked.slice(0, 6).map(([family, count]) => ({
      family,
      percentage: Math.round((count / total) * 100),
    }));

    const dominant = ranked[0];
    const preferredSuggestion = [...BALANCE_PREFERRED_FAMILIES]
      .map((family) => ({ family, count: familyCounts.get(family) || 0 }))
      .sort((a, b) => {
        if (a.count !== b.count) return a.count - b.count;
        return panelFamilyOrderIndex(a.family) - panelFamilyOrderIndex(b.family);
      })
      .slice(0, 2)
      .map((item) => item.family);

    let hint: string | null = null;
    if (dominant && dominant[1] / total > 0.45) {
      hint = `Mostly ${dominant[0]}. Add contrast with ${preferredSuggestion.join(" and ")}.`;
    } else if (total < 10) {
      hint = "Early build. Add 2–3 anchors: nudes + 1 deep tone.";
    } else if (!familyCounts.has("Nudes/Beiges") && total >= 12) {
      hint = "Consider adding 2–4 nudes/beiges for wearable balance.";
    } else if ((!familyCounts.has("Whites") || !familyCounts.has("Blacks")) && total >= 12) {
      hint = "Consider 1–2 whites/blacks for line-work + contrast.";
    }

    return { topFamilies, hint };
  }, [selectedShades]);

  const totalSelectedUnits = useMemo(
    () => selectedShades.reduce((sum, shade) => sum + (quantities[shade.id] ?? QUANTITY_MOQ), 0),
    [quantities, selectedShades]
  );

  const estimatedBlocks = useMemo(() => Math.ceil(totalSelectedUnits / ESTIMATED_BLOCK_SIZE), [totalSelectedUnits]);

  const selectedCount = selectedShades.length;

  const filteredShades = useMemo(() => {
    if (gridFilter === "all") return filtered;
    const selectedOnly = gridFilter === "selected";
    return filtered.filter((row, idx) => selectedIds.has(getRowId(row, idx)) === selectedOnly);
  }, [filtered, gridFilter, selectedIds]);

  const gridItems = useMemo<GridShadeItem[]>(
    () =>
      filteredShades.map((row, idx) => {
        const rowId = getRowId(row, idx);
        const sku = row["Internal_SKU"] || "";
        const image = getRowImage(row, rowId);
        return {
          rowId,
          sku,
          code: getRowCode(row, rowId),
          hex: getRowHex(row),
          image,
          hasImage: Boolean(image) && imgStatus[rowId] !== "MISSING",
          currentView: tileView[rowId] || "nail",
          isSelected: selectedIds.has(rowId),
          qtyValue: order[sku] || "",
        };
      }),
    [filteredShades, imgStatus, order, selectedIds, tileView]
  );

  const setOrderQty = useCallback((sku: string, value: string) => {
    const minQty = orderFormat === "bulk" ? 1 : 30;
    const parsed = parseInt(value || "0", 10);

    setOrder((prev) => {
      if (parsed === 0) return { ...prev, [sku]: 0 };
      if (parsed < minQty) return { ...prev, [sku]: minQty };
      return { ...prev, [sku]: parsed };
    });
  }, [orderFormat]);

  const toggleTileView = useCallback((id: string, hasImage: boolean) => {
    if (!hasImage) return;
    setTileView((prev) => ({
      ...prev,
      [id]: (prev[id] || "nail") === "nail" ? "card" : "nail",
    }));
  }, []);

  const changeGridFilter = useCallback((filter: GridFilter) => {
    setGridFilter(filter);
  }, []);

  const changeSortMode = useCallback((mode: SelectedSortMode) => {
    setSortMode(mode);
  }, []);

  const toggleQuantities = useCallback(() => {
    setShowQuantities((prev) => !prev);
  }, []);

  const handleCopyCodes = useCallback(async () => {
    if (!displaySelectedShades.length) return;
    const text = displaySelectedShades.map((shade) => shade.code).join(", ");
    await navigator.clipboard.writeText(text);
    setCopyFeedback(true);

    if (copyFeedbackTimeoutRef.current !== null) {
      window.clearTimeout(copyFeedbackTimeoutRef.current);
    }
    copyFeedbackTimeoutRef.current = window.setTimeout(() => {
      setCopyFeedback(false);
      copyFeedbackTimeoutRef.current = null;
    }, 1600);
  }, [displaySelectedShades]);

  const handleDownloadCsv = useCallback(() => {
    if (!displaySelectedShades.length) return;

    const escapeCell = (value: string) => `"${value.replace(/"/g, '""')}"`;
    const lines = [
      "code,family",
      ...displaySelectedShades.map((shade) => `${escapeCell(shade.code)},${escapeCell(shade.family)}`),
    ];
    const csv = lines.join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "leeukopf-selected-shades.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }, [displaySelectedShades]);

  const selectedItems = Object.entries(order).filter(([skuKey, qty]) => Boolean(skuKey) && qty > 0);
  const qtyUnit: "pcs" | "kg" = orderFormat === "bulk"
    ? (ALLOWS_KG_UNIT ? "kg" : "pcs")
    : (ALLOWS_PCS_UNIT ? "pcs" : "kg");
  const bulkRequiresBucket = orderFormat === "bulk" && selectedItems.some(([, qty]) => qty >= 5);
  const totalUnits = selectedItems.reduce((sum, [skuKey, qty]) => (skuKey ? sum + qty : sum), 0);

  useEffect(() => {
    if ((!ALLOWS_KG_UNIT || !ALLOWS_BUCKET_PACKAGING) && orderFormat === "bulk") {
      setOrderFormat("finished_units");
      setBulkContainer("");
      setIsBulkContainerAuto(false);
    }
  }, [orderFormat]);

  useEffect(() => {
    if (!SHOW_JAR_SIZE_SELECTOR && packaging.system !== "bottle") {
      setPackaging((prev) => ({ ...prev, system: "bottle" }));
    }
  }, [packaging.system]);

  useEffect(() => {
    if (orderFormat !== "bulk") {
      setIsBulkContainerAuto(false);
      return;
    }

    if (bulkRequiresBucket && (bulkContainer === "" || isBulkContainerAuto) && bulkContainer !== "5kg_bucket") {
      setBulkContainer("5kg_bucket");
      setIsBulkContainerAuto(true);
      return;
    }

    if (!bulkRequiresBucket && isBulkContainerAuto && bulkContainer === "5kg_bucket") {
      setBulkContainer("");
      setIsBulkContainerAuto(false);
    }
  }, [bulkRequiresBucket, bulkContainer, isBulkContainerAuto, orderFormat]);

  const handleSubmitOrder = async () => {
    const exportData: OrderLine[] = selectedItems.map(([sku, qty]) => {
      const row = rows.find((item) => (item["Internal_SKU"] || "") === sku);
      return {
        code: row?.["Shade_Code"] || sku,
        name: row?.["Shade_Name"] || sku,
        qty,
        unit: qtyUnit,
      };
    });
    const token = import.meta.env.VITE_SOLID_COLOUR_ORDER_TOKEN || "";

    const missingClientFields: string[] = [];
    if (!client.companyName.trim()) missingClientFields.push("Company Name or Client Name");
    if (!client.invoiceAddress.trim()) missingClientFields.push("Invoice Address");
    if (!client.invoiceRegion.trim()) missingClientFields.push("Invoice Region");
    if (!client.country.trim()) missingClientFields.push("Country");
    if (!client.invoicePostalCode.trim()) missingClientFields.push("Invoice Postal Code");
    if (!client.email.trim()) missingClientFields.push("Email");
    if (!client.contactNumber.trim()) missingClientFields.push("Contact Number");
    if (!client.contactName.trim()) missingClientFields.push("Contact Name");

    if (!client.sameAddress) {
      if (!client.shippingAddress.trim()) missingClientFields.push("Shipping Address");
      if (!client.shippingRegion.trim()) missingClientFields.push("Shipping Region");
      if (!client.shippingPostalCode.trim()) missingClientFields.push("Shipping Postal Code");
    }

    if (missingClientFields.length > 0 || exportData.length === 0) {
      const details = missingClientFields.length > 0
        ? ` Missing: ${missingClientFields.join(", ")}.`
        : "";
      setSubmitMessage({
        type: "error",
        text: `Please complete all required client fields and add at least one shade before exporting.${details}`,
      });
      return;
    }

    if (orderFormat === "bulk") {
      if (!bulkContainer) {
        const message = "Please choose a bulk packing type: 1kg Flasks or 5kg Buckets.";
        setPackagingError(message);
        setSubmitMessage({ type: "error", text: message });
        return;
      }
      setPackagingError(null);
    } else {
      if (packaging.mode === "standard") {
        if (packaging.system === "bottle") {
          const missing: string[] = [];
          if (!packaging.bottle?.size) missing.push("Bottle size");
          if (!packaging.bottle?.color) missing.push("Bottle color");
          if (!packaging.bottle?.brushShape) missing.push("Brush shape");
          if (ENABLE_BRUSH_TYPE && !packaging.bottle?.brushType) missing.push("Brush type");

          if (missing.length > 0) {
            const message = `Missing packaging fields: ${missing.join(", ")}.`;
            setPackagingError(message);
            setSubmitMessage({ type: "error", text: message });
            return;
          }
        } else {
          const missing: string[] = [];
          if (!packaging.jar?.size) missing.push("Jar size");
          if (!packaging.jar?.color) missing.push("Jar color");

          if (missing.length > 0) {
            const message = `Missing packaging fields: ${missing.join(", ")}.`;
            setPackagingError(message);
            setSubmitMessage({ type: "error", text: message });
            return;
          }
        }
      } else {
        const description = packaging.customDescription.trim();
        if (description.length < 20) {
          const message = "Packaging details (required) must be at least 20 characters for custom packaging.";
          setPackagingError(message);
          setSubmitMessage({ type: "error", text: message });
          return;
        }
      }

      setPackagingError(null);
    }

    if (!token) {
      setSubmitMessage({
        type: "error",
        text: "Missing VITE_SOLID_COLOUR_ORDER_TOKEN in environment.",
      });
      return;
    }

    const shippingAddress = client.sameAddress ? client.invoiceAddress : client.shippingAddress;
    const shippingRegion = client.sameAddress ? client.invoiceRegion : client.shippingRegion;
    const shippingPostalCode = client.sameAddress ? client.invoicePostalCode : client.shippingPostalCode;

    const payload = {
      orderFormat,
      qtyUnit,
      bulkContainer: orderFormat === "bulk" ? bulkContainer : undefined,
      client: {
        companyName: client.companyName,
        contactName: client.contactName,
        contactNumber: client.contactNumber,
        invoiceAddress: client.invoiceAddress,
        invoiceRegion: client.invoiceRegion,
        invoicePostalCode: client.invoicePostalCode,
        shippingAddress,
        shippingRegion,
        shippingPostalCode,
        sameAddress: client.sameAddress,
        vat: client.vat,
        country: client.country,
        contactEmail: client.email,
      },
      lines: exportData,
      packaging: {
        mode: orderFormat === "bulk" ? "custom" : packaging.mode,
        system: orderFormat === "bulk" ? "bulk" : packaging.system,
        bottle: packaging.bottle,
        jar: packaging.jar,
        customDescription: packaging.customDescription,
        notes: packaging.notes,
      },
    };

    try {
      setIsSubmitting(true);
      setSubmitMessage(null);

      const response = await fetch("/.netlify/functions/solid-colour-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const orderId = response.headers.get("x-order-id") || response.headers.get("X-Order-Id") || "request";
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Leeukopf-Solid-Colour-Order-${orderId}.pdf`;
        a.click();
        URL.revokeObjectURL(url);

        setSubmitMessage({
          type: "success",
          text: `Order ${orderId} submitted successfully. Confirmation email sent.`,
        });
        setShowThankYouPopup(true);
        return;
      }

      const responseText = await response.text();
      let data: { message?: string } = {};
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch {
        data = { message: responseText || undefined };
      }

      setSubmitMessage({
        type: "error",
        text: data?.message || "Failed to submit order. PDF was not downloaded.",
      });
    } catch {
      setSubmitMessage({
        type: "error",
        text: "Network error while submitting order. PDF was not downloaded.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const panelProps: SelectedPanelProps = {
    selectedCount,
    countsByFamily,
    selectedShades: displaySelectedShades,
    groupedSelectedShades,
    sortMode,
    onSortModeChange: changeSortMode,
    balanceInsight,
    gridFilter,
    onGridFilterChange: changeGridFilter,
    showQuantities,
    onToggleQuantities: toggleQuantities,
    quantities,
    totalSelectedUnits,
    estimatedBlocks,
    onQuantityInput: setQuantityInput,
    onQuantityIncrement: incrementQuantity,
    onQuantityDecrement: decrementQuantity,
    onRemoveShade: removeSelected,
    onClearAll: clearSelected,
    onCopyCodes: handleCopyCodes,
    onDownloadCsv: handleDownloadCsv,
    copyFeedback,
    onSetImageStatus: setImageStatus,
  };

  return (
    <div className="mx-auto max-w-6xl p-6">
      {showThankYouPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl border bg-white p-5 shadow-xl">
            <div className="text-base font-semibold">Leeukopf Laboratories</div>
            <p className="mt-2 text-sm text-neutral-700">
              Leeukopf Laboratories thanks you for your request, our dedicated team will be in contact with you soon!
            </p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowThankYouPopup(false)}
                className="rounded-xl bg-black px-4 py-2 text-xs text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Internal Solid Colour Grid (1200)</h1>
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
        <div className="mb-2 text-xs text-neutral-600">Fields marked with <span className="text-red-600">*</span> are required.</div>
        <div className="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <label className="text-xs font-medium text-neutral-600">Company Name or Client Name <span className="text-red-600">*</span>
            <input
              value={client.companyName}
              onChange={(e) => setClient((prev) => ({ ...prev, companyName: e.target.value }))}
              placeholder="Company Name or Client Name"
              className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm"
            />
          </label>
          <label className="text-xs font-medium text-neutral-600">Contact Name <span className="text-red-600">*</span>
            <input
              value={client.contactName}
              onChange={(e) => setClient((prev) => ({ ...prev, contactName: e.target.value }))}
              placeholder="Contact Name"
              className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm"
            />
          </label>
          <label className="text-xs font-medium text-neutral-600">Contact Number <span className="text-red-600">*</span>
            <input
              value={client.contactNumber}
              onChange={(e) => setClient((prev) => ({ ...prev, contactNumber: e.target.value }))}
              placeholder="Contact Number"
              className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm"
            />
          </label>
          <label className="text-xs font-medium text-neutral-600">Invoice Address <span className="text-red-600">*</span>
            <input
              value={client.invoiceAddress}
              onChange={(e) => {
                const value = e.target.value;
                setClient((prev) => ({
                  ...prev,
                  invoiceAddress: value,
                  shippingAddress: prev.sameAddress ? value : prev.shippingAddress,
                }));
              }}
              placeholder="Invoice Address"
              className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm"
            />
          </label>
          <label className="text-xs font-medium text-neutral-600">Invoice Region <span className="text-red-600">*</span>
            <input
              value={client.invoiceRegion}
              onChange={(e) => {
                const value = e.target.value;
                setClient((prev) => ({
                  ...prev,
                  invoiceRegion: value,
                  shippingRegion: prev.sameAddress ? value : prev.shippingRegion,
                }));
              }}
              placeholder="Invoice Region"
              className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm"
            />
          </label>
          <label className="text-xs font-medium text-neutral-600">Invoice Postal Code <span className="text-red-600">*</span>
            <input
              value={client.invoicePostalCode}
              onChange={(e) => {
                const value = e.target.value;
                setClient((prev) => ({
                  ...prev,
                  invoicePostalCode: value,
                  shippingPostalCode: prev.sameAddress ? value : prev.shippingPostalCode,
                }));
              }}
              placeholder="Invoice Postal Code"
              className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm"
            />
          </label>
          <label className="flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-sm sm:col-span-2">
            <input
              type="checkbox"
              checked={client.sameAddress}
              onChange={(e) => {
                const checked = e.target.checked;
                setClient((prev) => ({
                  ...prev,
                  sameAddress: checked,
                  shippingAddress: checked ? prev.invoiceAddress : prev.shippingAddress,
                  shippingRegion: checked ? prev.invoiceRegion : prev.shippingRegion,
                  shippingPostalCode: checked ? prev.invoicePostalCode : prev.shippingPostalCode,
                }));
              }}
            />
            Same Address (copy Invoice Address to Shipping Address)
          </label>
          {!client.sameAddress && (
            <>
              <label className="text-xs font-medium text-neutral-600">Shipping Address <span className="text-red-600">*</span>
                <input
                  value={client.shippingAddress}
                  onChange={(e) => setClient((prev) => ({ ...prev, shippingAddress: e.target.value }))}
                  placeholder="Shipping Address"
                  className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm"
                />
              </label>
              <label className="text-xs font-medium text-neutral-600">Shipping Region <span className="text-red-600">*</span>
                <input
                  value={client.shippingRegion}
                  onChange={(e) => setClient((prev) => ({ ...prev, shippingRegion: e.target.value }))}
                  placeholder="Shipping Region"
                  className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm"
                />
              </label>
              <label className="text-xs font-medium text-neutral-600">Shipping Postal Code <span className="text-red-600">*</span>
                <input
                  value={client.shippingPostalCode}
                  onChange={(e) => setClient((prev) => ({ ...prev, shippingPostalCode: e.target.value }))}
                  placeholder="Shipping Postal Code"
                  className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm"
                />
              </label>
            </>
          )}
          <label className="text-xs font-medium text-neutral-600">VAT (optional)
            <input
              value={client.vat}
              onChange={(e) => setClient((prev) => ({ ...prev, vat: e.target.value }))}
              placeholder="VAT (optional)"
              className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm"
            />
          </label>
          <label className="text-xs font-medium text-neutral-600">Country <span className="text-red-600">*</span>
            <input
              value={client.country}
              onChange={(e) => setClient((prev) => ({ ...prev, country: e.target.value }))}
              placeholder="Country"
              className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm"
            />
          </label>
          <label className="text-xs font-medium text-neutral-600">Contact Email <span className="text-red-600">*</span>
            <input
              type="email"
              value={client.email}
              onChange={(e) => setClient((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="Contact Email"
              className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm"
            />
          </label>
        </div>

        <div className="rounded-xl border bg-neutral-50 p-3">
          <div className="text-sm font-semibold">Order format <span className="text-red-600">*</span></div>
          <div className="mt-2 grid gap-2 text-sm">
            <label className="flex items-start gap-2">
              <input
                type="radio"
                name="order-format"
                value="finished_units"
                checked={orderFormat === "finished_units"}
                onChange={() => setOrderFormat("finished_units")}
              />
              <span>Finished units (we bottle it)</span>
            </label>
            {ALLOWS_KG_UNIT && ALLOWS_BUCKET_PACKAGING && (
              <label className="flex items-start gap-2">
                <input
                  type="radio"
                  name="order-format"
                  value="bulk"
                  checked={orderFormat === "bulk"}
                  onChange={() => setOrderFormat("bulk")}
                />
                <span>Bulk (you fill your own bottles)</span>
              </label>
            )}
          </div>

          {orderFormat === "bulk" && (
            <div className="mt-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-700">
              Bulk selected: MOQ per shade is 1kg.
            </div>
          )}

          {orderFormat === "bulk" ? (
            <>
              <div className="mt-3 border-t pt-3 text-sm font-semibold">Bulk Packing <span className="text-red-600">*</span></div>
              <div className="mt-2 grid gap-2 text-sm">
                <label className="flex items-start gap-2">
                  <input
                    type="radio"
                    name="bulk-container"
                    value="1kg_flask"
                    checked={bulkContainer === "1kg_flask"}
                    onChange={() => {
                      setBulkContainer("1kg_flask");
                      setIsBulkContainerAuto(false);
                      setPackagingError(null);
                    }}
                  />
                  <span>1kg Flasks</span>
                </label>
                <label className="flex items-start gap-2">
                  <input
                    type="radio"
                    name="bulk-container"
                    value="5kg_bucket"
                    checked={bulkContainer === "5kg_bucket"}
                    onChange={() => {
                      setBulkContainer("5kg_bucket");
                      setIsBulkContainerAuto(false);
                      setPackagingError(null);
                    }}
                  />
                  <span>5kg Buckets</span>
                </label>
              </div>
              {bulkRequiresBucket && (
                <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                  5kg or more selected: 5kg Buckets has been auto-selected as a suggestion (you can still change it).
                </div>
              )}
            </>
          ) : (
            <>
              <div className="mt-3 border-t pt-3 text-sm font-semibold">Packaging <span className="text-red-600">*</span></div>
              <div className="mt-2 grid gap-2 text-sm">
                <label className="flex items-start gap-2">
                  <input
                    type="radio"
                    name="packaging-mode"
                    value="standard"
                    checked={packaging.mode === "standard"}
                    onChange={() => {
                      setPackaging((prev) => ({ ...prev, mode: "standard" }));
                      setPackagingError(null);
                    }}
                  />
                  <span>Use Leeukopf standard bottles & brushes</span>
                </label>
                <label className="flex items-start gap-2">
                  <input
                    type="radio"
                    name="packaging-mode"
                    value="custom"
                    checked={packaging.mode === "custom"}
                    onChange={() => {
                      setPackaging((prev) => ({ ...prev, mode: "custom" }));
                      setPackagingError(null);
                    }}
                  />
                  <span>I have my own packaging / I want something different</span>
                </label>
              </div>

              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <label className="text-xs font-medium text-neutral-600">System</label>
                <div className="flex items-center gap-4 sm:col-span-1">
                  <label className="flex items-center gap-1 text-sm">
                    <input
                      type="radio"
                      name="packaging-system"
                      value="bottle"
                      checked={packaging.system === "bottle"}
                      onChange={() => {
                        setPackaging((prev) => ({ ...prev, system: "bottle" }));
                        setPackagingError(null);
                      }}
                    />
                    Bottle
                  </label>
                  {SHOW_JAR_SIZE_SELECTOR && (
                    <label className="flex items-center gap-1 text-sm">
                      <input
                        type="radio"
                        name="packaging-system"
                        value="jar"
                        checked={packaging.system === "jar"}
                        onChange={() => {
                          setPackaging((prev) => ({ ...prev, system: "jar" }));
                          setPackagingError(null);
                        }}
                      />
                      Jar
                    </label>
                  )}
                </div>
              </div>

              {packaging.mode === "standard" ? (
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {!SHOW_JAR_SIZE_SELECTOR || packaging.system === "bottle" ? (
                    <>
                      <label className="text-xs font-medium text-neutral-600">
                        Bottle Size <span className="text-red-600">*</span>
                        <select
                          value={packaging.bottle?.size || ""}
                          onChange={(e) => {
                            setPackaging((prev) => ({
                              ...prev,
                              bottle: {
                                ...(prev.bottle || { color: "", brushShape: "", brushType: "" }),
                                size: e.target.value,
                              },
                            }));
                            setPackagingError(null);
                          }}
                          className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm"
                        >
                          <option value="">Select…</option>
                          {BOTTLE_SIZE_OPTIONS.map((option) => (
                            <option key={option} value={option}>{toDisplayLabel(option)}</option>
                          ))}
                        </select>
                      </label>

                      <label className="text-xs font-medium text-neutral-600">
                        Bottle Color <span className="text-red-600">*</span>
                        <select
                          value={packaging.bottle?.color || ""}
                          onChange={(e) => {
                            setPackaging((prev) => ({
                              ...prev,
                              bottle: {
                                ...(prev.bottle || { size: "", brushShape: "", brushType: "" }),
                                color: e.target.value,
                              },
                            }));
                            setPackagingError(null);
                          }}
                          className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm"
                        >
                          <option value="">Select…</option>
                          {BOTTLE_COLOR_OPTIONS.map((option) => (
                            <option key={option} value={option}>{toDisplayLabel(option)}</option>
                          ))}
                        </select>
                      </label>

                      <label className="text-xs font-medium text-neutral-600">
                        Brush Shape <span className="text-red-600">*</span>
                        <select
                          value={packaging.bottle?.brushShape || ""}
                          onChange={(e) => {
                            setPackaging((prev) => ({
                              ...prev,
                              bottle: {
                                ...(prev.bottle || { size: "", color: "", brushType: "" }),
                                brushShape: e.target.value,
                              },
                            }));
                            setPackagingError(null);
                          }}
                          className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm"
                        >
                          <option value="">Select…</option>
                          {BRUSH_SHAPE_OPTIONS.map((option) => (
                            <option key={option} value={option}>{toDisplayLabel(option)}</option>
                          ))}
                        </select>
                      </label>

                      {ENABLE_BRUSH_TYPE && (
                        <label className="text-xs font-medium text-neutral-600">
                          Brush Type <span className="text-red-600">*</span>
                          <select
                            value={packaging.bottle?.brushType || ""}
                            onChange={(e) => {
                              setPackaging((prev) => ({
                                ...prev,
                                bottle: {
                                  ...(prev.bottle || { size: "", color: "", brushShape: "" }),
                                  brushType: e.target.value,
                                },
                              }));
                              setPackagingError(null);
                            }}
                            className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm"
                          >
                            <option value="">Select…</option>
                            {BRUSH_TYPE_OPTIONS.map((option) => (
                              <option key={option} value={option}>{toDisplayLabel(option)}</option>
                            ))}
                          </select>
                        </label>
                      )}
                    </>
                  ) : (
                    <>
                      <label className="text-xs font-medium text-neutral-600">
                        Jar Size <span className="text-red-600">*</span>
                        <select
                          value={packaging.jar?.size || ""}
                          onChange={(e) => {
                            setPackaging((prev) => ({
                              ...prev,
                              jar: {
                                ...(prev.jar || { color: "" }),
                                size: e.target.value,
                              },
                            }));
                            setPackagingError(null);
                          }}
                          className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm"
                        >
                          <option value="">Select…</option>
                          {JAR_SIZE_OPTIONS.map((option) => (
                            <option key={option} value={option}>{toDisplayLabel(option)}</option>
                          ))}
                        </select>
                      </label>

                      <label className="text-xs font-medium text-neutral-600">
                        Jar Color <span className="text-red-600">*</span>
                        <select
                          value={packaging.jar?.color || ""}
                          onChange={(e) => {
                            setPackaging((prev) => ({
                              ...prev,
                              jar: {
                                ...(prev.jar || { size: "" }),
                                color: e.target.value,
                              },
                            }));
                            setPackagingError(null);
                          }}
                          className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm"
                        >
                          <option value="">Select…</option>
                          {JAR_COLOR_OPTIONS.map((option) => (
                            <option key={option} value={option}>{toDisplayLabel(option)}</option>
                          ))}
                        </select>
                      </label>
                    </>
                  )}
                </div>
              ) : (
                <div className="mt-3">
                  <label className="mb-1 block text-sm font-medium">Packaging details (required) <span className="text-red-600">*</span></label>
                  <textarea
                    value={packaging.customDescription}
                    onChange={(e) => {
                      setPackaging((prev) => ({ ...prev, customDescription: e.target.value }));
                      setPackagingError(null);
                    }}
                    rows={4}
                    placeholder="Describe your custom packaging requirements"
                    className="w-full rounded-xl border bg-white px-3 py-2 text-sm"
                  />
                </div>
              )}

              <div className="mt-3">
                <textarea
                  value={packaging.notes}
                  onChange={(e) => {
                    setPackaging((prev) => ({ ...prev, notes: e.target.value }));
                    setPackagingError(null);
                  }}
                  rows={2}
                  placeholder="Packaging notes (optional)"
                  className="w-full rounded-xl border bg-white px-3 py-2 text-sm"
                />
              </div>
            </>
          )}

          {packagingError && (
            <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {packagingError}
            </div>
          )}
        </div>

        <div className="text-sm font-semibold">
          Selected Shades: {selectedItems.length}
        </div>
        <div className="text-sm">
          {qtyUnit === "kg" ? "Total KG" : "Total Units"}: {totalUnits}
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
                .map(([sku, qty]) => `${sku} x ${qty}${qtyUnit === "kg" ? "kg" : " pcs"}`)
                .join("\n");
              await navigator.clipboard.writeText(text);
            }}
            className="rounded-xl border bg-white px-4 py-2 text-xs"
          >
            Copy list
          </button>

          <button
            onClick={handleSubmitOrder}
            disabled={isSubmitting}
            className="rounded-xl bg-black px-4 py-2 text-xs text-white"
          >
            {isSubmitting ? "Submitting..." : "Submit Order"}
          </button>
        </div>

        {submitMessage && (
          <div
            className={`mt-3 rounded-xl border px-3 py-2 text-xs ${
              submitMessage.type === "success"
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {submitMessage.text}
          </div>
        )}
      </div>

      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-6">
        <div>
          <ShadeGrid
            items={gridItems}
            qtyUnit={qtyUnit}
            onToggleSelected={toggleSelected}
            onToggleView={toggleTileView}
            onSetImageStatus={setImageStatus}
            onSetQty={setOrderQty}
          />

          {!filteredShades.length && (
            <div className="mt-8 rounded-xl border bg-white p-6 text-sm text-neutral-600">
              No results. Check that <code className="font-mono">solid-1200.json</code> exists in{" "}
              <code className="font-mono">public/data/</code>.
            </div>
          )}

          <div className="h-20 lg:hidden" />
        </div>

        <aside className="hidden lg:block">
          <SelectedPanel {...panelProps} className="sticky top-6" />
        </aside>
      </div>

      <button
        type="button"
        className="fixed bottom-4 left-4 right-4 z-40 rounded-xl border bg-white px-4 py-3 text-left shadow-lg lg:hidden"
        onClick={() => setIsMobileDrawerOpen(true)}
      >
        <span className="text-sm font-semibold">My Colour Chart ({selectedCount})</span>
      </button>

      <MobileDrawer
        open={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        panelProps={panelProps}
      />
    </div>
  );
}
