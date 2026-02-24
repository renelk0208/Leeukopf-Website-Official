import { useEffect, useMemo, useState } from "react";
import { useB2BCart } from "../store/B2BCartContext";

type CsvProduct = {
  category: string;
  subcategory: string;
  product_name: string;
  code: string;
  moq: string;
  image_url: string;
  active: string;
};

const FALLBACK_COUNT = 95;

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

function normalizeImagePath(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

function toNumber(value: string, fallbackValue: number): number {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 0) return fallbackValue;
  return parsed;
}

function isExtraStrengthBase(item: CsvProduct): boolean {
  const joined = `${item.category} ${item.subcategory} ${item.product_name} ${item.code}`.toLowerCase();
  return joined.includes("extra strength") && joined.includes("base");
}

function createFallbackProducts(): CsvProduct[] {
  return Array.from({ length: FALLBACK_COUNT }, (_, index) => {
    const id = index + 1;
    const twoDigits = String(id).padStart(2, "0");
    const code = `LC-Extra_Strength_Base${twoDigits}`;
    return {
      category: "Top & Base",
      subcategory: "Extra Strength Base",
      product_name: `Extra Strength Base ${id}`,
      code,
      moq: "1",
      image_url: `/img/tops-bases/Extra Strength Base Coat/${code}.png`,
      active: "TRUE",
    };
  });
}

function getImageCandidates(product: CsvProduct): string[] {
  const explicitImage = normalizeImagePath(product.image_url);
  const byCode = product.code
    ? [
      `/img/tops-bases/Extra Strength Base Coat/${product.code}.png`,
      `/img/tops-bases/Extra Strength Base Coat/${product.code}.webp`,
      `/img/tops-bases/Extra Strength Base Coat/${product.code}.jpg`,
    ]
    : [];

  return Array.from(new Set([explicitImage, ...byCode].filter(Boolean)));
}

const fallbackCategoryImage = "/img/products/tops-and-bases/base-coat-category-card-image.png";

export default function B2BExtraStrengthBasesPage() {
  const { items, addOrUpdateItem, removeItem } = useB2BCart();
  const [products, setProducts] = useState<CsvProduct[]>([]);
  const [draftQty, setDraftQty] = useState<Record<string, string>>({});
  const [validationMessage, setValidationMessage] = useState<string>("");
  const [imageAttemptByCode, setImageAttemptByCode] = useState<Record<string, number>>({});

  useEffect(() => {
    fetch("/products.csv")
      .then((response) => response.text())
      .then((csv) => {
        const lines = csv.split(/\r?\n/).filter((line) => line.trim().length > 0);
        if (!lines.length) {
          setProducts(createFallbackProducts());
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
              subcategory: row[index.subcategory] ?? "",
              product_name: row[index.product_name] ?? "",
              code: row[index.code] ?? "",
              moq: row[index.moq] ?? "",
              image_url: row[index.image_url] ?? "",
              active: row[index.active] ?? "FALSE",
            } as CsvProduct;
          })
          .filter((item) => item.active.toUpperCase() === "TRUE" && isExtraStrengthBase(item));

        setProducts(parsed.length > 0 ? parsed : createFallbackProducts());
        setImageAttemptByCode({});
      })
      .catch(() => {
        setProducts(createFallbackProducts());
      });
  }, []);

  const existingQtyByCode = useMemo(() => {
    const map: Record<string, number> = {};
    items
      .filter((item) => item.category === "BASE")
      .forEach((item) => {
        map[item.code] = item.quantity;
      });
    return map;
  }, [items]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-grey-primary">Extra Strength Bases</h2>
        <p className="mt-1 text-sm text-grey-secondary">
          Add extra strength base shades and quantities to your shared B2B inquiry cart.
        </p>
      </div>

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
          const image = imageCandidates[nextImageIndex] ?? fallbackCategoryImage;
          const moq = toNumber(product.moq, 1);

          return (
            <article key={`${product.code}-${index}`} className="overflow-hidden rounded-lg border border-grey-card bg-white">
              <img
                src={image}
                alt={product.product_name || product.code || "Extra Strength Base"}
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

                  if (target.src.endsWith(fallbackCategoryImage)) return;
                  target.src = fallbackCategoryImage;
                }}
              />
              <div className="space-y-3 p-4">
                <div>
                  <p className="text-xs font-semibold text-grey-secondary">{product.code || "BASE"}</p>
                  <h4 className="text-base font-semibold text-grey-primary">{product.product_name || "Extra Strength Base"}</h4>
                  <p className="mt-1 text-xs text-grey-secondary">MOQ: {moq} pcs</p>
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

                      if (qty > 0 && qty < moq) {
                        setValidationMessage(`MOQ for ${product.product_name || product.code} is ${moq} pieces.`);
                        return;
                      }

                      setValidationMessage("");

                      addOrUpdateItem({
                        category: "BASE",
                        code: product.code,
                        name: product.product_name,
                        quantity: qty,
                        unitType: "PCS",
                        meta: {
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
                      removeItem("BASE", product.code);
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
    </div>
  );
}
