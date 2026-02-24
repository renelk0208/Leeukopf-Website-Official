import { useEffect, useMemo, useState } from "react";
import { useB2BCart } from "../store/B2BCartContext";

type CsvProduct = {
  category: string;
  product_name: string;
  code: string;
  image_url: string;
  active: string;
};

type TubeColor = "BLACK" | "WHITE";
type TubeSize = "30G" | "60G";
type TubeLabel = "PRINTED" | "OWN_LABELS";

const POLYGEL_MOQ = 100;

const tubeColorOptions: Array<{ value: TubeColor; label: string }> = [
  { value: "BLACK", label: "Black" },
  { value: "WHITE", label: "White" },
];

const tubeSizeOptions: Array<{ value: TubeSize; label: string }> = [
  { value: "30G", label: "30g" },
  { value: "60G", label: "60g" },
];

const tubeLabelOptions: Array<{ value: TubeLabel; label: string }> = [
  { value: "PRINTED", label: "Printed" },
  { value: "OWN_LABELS", label: "Own labels" },
];

const fallbackPolygelImage = "/img/products/liquid polygel/liquid-polygel-category-card-image.png";

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

function isPolygelCategory(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  return normalized.includes("polygel") || normalized.includes("acrygel") || normalized.includes("liquid polygel");
}

function normalizeImagePath(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

function getImageCandidates(product: CsvProduct): string[] {
  const explicitImage = normalizeImagePath(product.image_url || "");
  const byCode = product.code
    ? [`/img/polygel/${product.code}.webp`, `/img/polygel/${product.code}.jpg`, `/img/polygel/${product.code}.png`]
    : [];

  return Array.from(new Set([explicitImage, ...byCode].filter(Boolean)));
}

export default function B2BPolygelsPage() {
  const { items, addOrUpdateItem, removeItem } = useB2BCart();
  const [products, setProducts] = useState<CsvProduct[]>([]);
  const [draftQty, setDraftQty] = useState<Record<string, string>>({});
  const [imageAttemptByCode, setImageAttemptByCode] = useState<Record<string, number>>({});
  const [tubeColor, setTubeColor] = useState<TubeColor>("BLACK");
  const [tubeSize, setTubeSize] = useState<TubeSize>("30G");
  const [tubeLabel, setTubeLabel] = useState<TubeLabel>("PRINTED");
  const [validationMessage, setValidationMessage] = useState<string>("");

  useEffect(() => {
    fetch("/products.csv")
      .then((response) => response.text())
      .then((csv) => {
        const lines = csv.split(/\r?\n/).filter((line) => line.trim().length > 0);
        if (!lines.length) {
          setProducts([]);
          return;
        }

        const header = parseCSVLine(lines[0]);
        const index = Object.fromEntries(header.map((value, columnIndex) => [value.toLowerCase(), columnIndex]));

        const parsed = lines
          .slice(1)
          .map((line) => {
            const row = parseCSVLine(line);
            return {
              category: row[index.category] ?? "",
              product_name: row[index.product_name] ?? "",
              code: row[index.code] ?? "",
              image_url: row[index.image_url] ?? "",
              active: row[index.active] ?? "FALSE",
            } as CsvProduct;
          })
          .filter((item) => item.active.toUpperCase() === "TRUE" && isPolygelCategory(item.category));

        setProducts(parsed);
        setImageAttemptByCode({});
      })
      .catch(() => setProducts([]));
  }, []);

  const existingQtyByCode = useMemo(() => {
    const map: Record<string, number> = {};
    items
      .filter((item) => item.category === "POLYGEL")
      .forEach((item) => {
        map[item.code] = item.quantity;
      });
    return map;
  }, [items]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-grey-primary">Polygels</h2>
        <p className="mt-1 text-sm text-grey-secondary">
          Select tube format and quantities. MOQ is 100 pieces per colour.
        </p>
      </div>

      <section className="rounded-lg border border-grey-card bg-white p-4">
        <h3 className="text-lg font-semibold text-grey-primary">Tube Configuration</h3>
        <div className="mt-3 grid gap-4 md:grid-cols-3">
          <label className="text-sm font-medium text-grey-primary">
            Tube colour
            <select
              value={tubeColor}
              onChange={(event) => setTubeColor(event.target.value as TubeColor)}
              className="mt-1 w-full rounded-md border border-grey-card px-3 py-2 text-grey-primary"
            >
              {tubeColorOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm font-medium text-grey-primary">
            Tube size
            <select
              value={tubeSize}
              onChange={(event) => setTubeSize(event.target.value as TubeSize)}
              className="mt-1 w-full rounded-md border border-grey-card px-3 py-2 text-grey-primary"
            >
              {tubeSizeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm font-medium text-grey-primary">
            Label option
            <select
              value={tubeLabel}
              onChange={(event) => setTubeLabel(event.target.value as TubeLabel)}
              className="mt-1 w-full rounded-md border border-grey-card px-3 py-2 text-grey-primary"
            >
              {tubeLabelOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {validationMessage ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {validationMessage}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product, index) => {
          const value = draftQty[product.code] ?? String(existingQtyByCode[product.code] ?? "");
          const imageCandidates = getImageCandidates(product);
          const nextImageIndex = imageAttemptByCode[product.code] ?? 0;
          const image = imageCandidates[nextImageIndex] ?? fallbackPolygelImage;

          return (
            <article key={`${product.code}-${index}`} className="overflow-hidden rounded-lg border border-grey-card bg-white">
              <img
                src={image}
                alt={product.product_name}
                className="h-44 w-full object-cover"
                onError={(event) => {
                  const target = event.currentTarget;
                  const currentIndex = imageAttemptByCode[product.code] ?? 0;
                  if (currentIndex < imageCandidates.length - 1) {
                    setImageAttemptByCode((prev) => ({
                      ...prev,
                      [product.code]: currentIndex + 1,
                    }));
                    return;
                  }

                  if (target.src.endsWith(fallbackPolygelImage)) return;
                  target.src = fallbackPolygelImage;
                }}
              />
              <div className="space-y-3 p-4">
                <div>
                  <p className="text-xs font-semibold text-grey-secondary">{product.code || "POLYGEL"}</p>
                  <h4 className="text-base font-semibold text-grey-primary">{product.product_name || "Polygel shade"}</h4>
                  <p className="mt-1 text-xs text-grey-secondary">MOQ: {POLYGEL_MOQ} pcs per colour</p>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-grey-primary">Quantity (pcs)</label>
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={value}
                    onChange={(event) => {
                      setDraftQty((prev) => ({
                        ...prev,
                        [product.code]: event.target.value,
                      }));
                    }}
                    className="w-full rounded-md border border-grey-card px-2 py-1.5 text-grey-primary"
                    placeholder="0"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const raw = (draftQty[product.code] ?? String(existingQtyByCode[product.code] ?? "0")).trim();
                      const qty = Number.parseInt(raw, 10);

                      if (!Number.isFinite(qty) || qty < 0) {
                        setValidationMessage(`Please enter a valid quantity for ${product.product_name || product.code}.`);
                        return;
                      }

                      if (qty > 0 && qty < POLYGEL_MOQ) {
                        setValidationMessage(`MOQ for polygel is ${POLYGEL_MOQ} pieces per colour.`);
                        return;
                      }

                      setValidationMessage("");

                      addOrUpdateItem({
                        category: "POLYGEL",
                        code: product.code,
                        name: product.product_name,
                        quantity: qty,
                        unitType: "PCS",
                        meta: {
                          tube_color: tubeColor,
                          tube_size: tubeSize,
                          label_option: tubeLabel,
                          image,
                        },
                      });
                    }}
                    className="flex-1 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-600"
                  >
                    Save
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setValidationMessage("");
                      removeItem("POLYGEL", product.code);
                      setDraftQty((prev) => ({ ...prev, [product.code]: "" }));
                    }}
                    className="rounded-md border border-grey-card px-3 py-1.5 text-xs font-semibold text-grey-primary hover:bg-grey-100"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {products.length === 0 ? (
        <div className="rounded-lg border border-dashed border-grey-card p-4 text-sm text-grey-secondary">
          No active polygel rows found in products.csv.
        </div>
      ) : null}
    </div>
  );
}
