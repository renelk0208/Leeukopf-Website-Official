import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
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

type BaseRouteMode = "ALL" | "EXTRA_STRENGTH" | "CLASSIC" | "RUBBER";

function getBaseRouteMode(pathname: string): BaseRouteMode {
  const normalized = pathname.toLowerCase();
  if (normalized.includes("/classic-base")) return "CLASSIC";
  if (normalized.includes("/rubber-bases")) return "RUBBER";
  if (normalized.includes("/extra-strength-bases")) return "EXTRA_STRENGTH";
  return "ALL";
}

function getBasePageTitle(mode: BaseRouteMode): string {
  switch (mode) {
    case "CLASSIC":
      return "Classic Bases";
    case "RUBBER":
      return "Rubber Bases";
    case "EXTRA_STRENGTH":
      return "Extra Strength Bases";
    default:
      return "Bases";
  }
}

function sortProductsAlphabetically(products: CsvProduct[]): CsvProduct[] {
  return [...products].sort((a, b) => {
    const left = (a.product_name || a.code || "").trim();
    const right = (b.product_name || b.code || "").trim();
    return left.localeCompare(right, undefined, { sensitivity: "base", numeric: true });
  });
}

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

function isClassicBase(item: CsvProduct): boolean {
  const joined = `${item.category} ${item.subcategory} ${item.product_name} ${item.code}`.toLowerCase();
  return joined.includes("classic") && joined.includes("base");
}

function isRubberBase(item: CsvProduct): boolean {
  const joined = `${item.category} ${item.subcategory} ${item.product_name} ${item.code}`.toLowerCase();
  return joined.includes("rubber") && joined.includes("base");
}

function isAnyBase(item: CsvProduct): boolean {
  const joined = `${item.category} ${item.subcategory} ${item.product_name} ${item.code}`.toLowerCase();
  return joined.includes("base");
}

function matchesBaseRoute(item: CsvProduct, mode: BaseRouteMode): boolean {
  if (mode === "EXTRA_STRENGTH") return isExtraStrengthBase(item);
  if (mode === "CLASSIC") return isClassicBase(item);
  if (mode === "RUBBER") return isRubberBase(item);
  return isAnyBase(item);
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
  const normalizedCode = (product.code || "").trim();
  const normalizedCodeNoDash = normalizedCode.replace(/-/g, "_");
  const normalizedCodeDashed = normalizedCode.replace(/_/g, "-");

  const byCode = product.code
    ? [
      `/img/tops-bases/Extra Strength Base Coat/${product.code}.png`,
      `/img/tops-bases/Extra Strength Base Coat/${product.code}.jpg`,
      `/img/tops-bases/Extra Strength Base Coat/${product.code}.webp`,
      `/img/tops-bases/Extra Strength Base Coat/${normalizedCodeNoDash}.png`,
      `/img/tops-bases/Extra Strength Base Coat/${normalizedCodeDashed}.png`,
      `/img/products/tops-and-bases/base-coat-category-card-image.png`,
      `/img/products/tops-and-bases/Bases/${normalizedCode}.png`,
      `/img/products/tops-and-bases/Bases/${normalizedCodeNoDash}.png`,
      `/img/products/tops-and-bases/Bases/${normalizedCodeDashed}.png`,
      `/img/products/tops-and-bases/rubber-bases/${normalizedCode}.png`,
      `/img/products/tops-and-bases/rubber-bases/${normalizedCodeNoDash}.png`,
      `/img/products/tops-and-bases/rubber-bases/${normalizedCodeDashed}.png`,
    ]
    : [];

  return Array.from(new Set([explicitImage, ...byCode].filter(Boolean)));
}

const fallbackCategoryImage = "/img/products/tops-and-bases/base-coat-category-card-image.png";

export default function B2BExtraStrengthBasesPage() {
  const location = useLocation();
  const routeMode = getBaseRouteMode(location.pathname);
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
          setProducts(sortProductsAlphabetically(createFallbackProducts()));
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
          .filter((item) => item.active.toUpperCase() === "TRUE" && matchesBaseRoute(item, routeMode));

        const fallbackProducts = routeMode === "EXTRA_STRENGTH" ? createFallbackProducts() : [];
        setProducts(sortProductsAlphabetically(parsed.length > 0 ? parsed : fallbackProducts));
        setImageAttemptByCode({});
      })
      .catch(() => {
        const fallbackProducts = routeMode === "EXTRA_STRENGTH" ? createFallbackProducts() : [];
        setProducts(sortProductsAlphabetically(fallbackProducts));
      });
  }, [routeMode]);

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
        <h2 className="text-2xl font-bold text-grey-primary">{getBasePageTitle(routeMode)}</h2>
        <p className="mt-1 text-sm text-grey-secondary">
          Add base shades and quantities to your shared B2B inquiry cart.
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
              <div className="flex aspect-[4/3] w-full items-center justify-center bg-grey-100 p-2">
                <img
                  src={image}
                  alt={product.product_name || product.code || "Extra Strength Base"}
                  className="max-h-full max-w-full object-contain object-center"
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
              </div>
              <div className="space-y-3 p-4">
                <div>
                  <p className="text-xs font-semibold text-grey-secondary">{product.code || "BASE"}</p>
                  <h4 className="text-base font-semibold text-grey-primary">{product.product_name || "Extra Strength Base"}</h4>
                  <p className="mt-1 text-xs text-grey-secondary">{product.subcategory || "Base Coats"}</p>
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

      {products.length === 0 ? (
        <div className="rounded-lg border border-dashed border-grey-card p-4 text-sm text-grey-secondary">
          No active base rows found for this subcategory in products.csv.
        </div>
      ) : null}
    </div>
  );
}
