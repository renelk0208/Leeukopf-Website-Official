import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useB2BCart } from "../store/B2BCartContext";

type CsvProduct = {
  category: string;
  subcategory: string;
  product_name: string;
  code: string;
  size: string;
  unit: string;
  moq: string;
  active: string;
};

function sortProductsAlphabetically(products: CsvProduct[]): CsvProduct[] {
  return [...products].sort((a, b) => {
    const left = (a.product_name || a.code || "").trim();
    const right = (b.product_name || b.code || "").trim();
    return left.localeCompare(right, undefined, { sensitivity: "base", numeric: true });
  });
}

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

type BuilderRouteMode = "ALL" | "ACRYLICS" | "THREE_IN_ONE" | "FIBREGLASS" | "BIAB";

function getBuilderRouteMode(pathname: string): BuilderRouteMode {
  const normalized = pathname.toLowerCase();
  if (normalized.includes("/acrylics")) return "ACRYLICS";
  if (normalized.includes("/3-in-1-builder-gels")) return "THREE_IN_ONE";
  if (normalized.includes("/3-in-1-fibreglass-gel")) return "FIBREGLASS";
  if (normalized.includes("/biab")) return "BIAB";
  return "ALL";
}

function getBuilderPageTitle(mode: BuilderRouteMode): string {
  switch (mode) {
    case "ACRYLICS":
      return "Builder Gels · Acrylics";
    case "THREE_IN_ONE":
      return "Builder Gels · 3-in-1 Builder Gels";
    case "FIBREGLASS":
      return "Builder Gels · 3-in-1 Fibreglass Gel";
    case "BIAB":
      return "Builder Gels · BIAB";
    default:
      return "Builder Gels";
  }
}

function getBuilderSearchBlob(item: Pick<CsvProduct, "category" | "subcategory" | "product_name" | "code">): string {
  return `${item.category} ${item.subcategory} ${item.product_name} ${item.code}`.toLowerCase();
}

function isBuilderGelByRoute(item: CsvProduct, mode: BuilderRouteMode): boolean {
  const blob = getBuilderSearchBlob(item);
  if (!blob.includes("builder") && !blob.includes("biab") && !blob.includes("fiberglass") && !blob.includes("fibreglass") && !blob.includes("acrylic")) {
    return false;
  }

  if (mode === "ALL") return item.category.toLowerCase() === "builder gel";
  if (mode === "ACRYLICS") return blob.includes("acrylic");
  if (mode === "THREE_IN_ONE") return blob.includes("3-in-1") || blob.includes("3 in 1");
  if (mode === "FIBREGLASS") return blob.includes("fiberglass") || blob.includes("fibreglass") || blob.includes("fiber glass");
  if (mode === "BIAB") return blob.includes("biab") || blob.includes("builder in a bottle");

  return false;
}

export default function B2BBuilderGelsPage() {
  const location = useLocation();
  const routeMode = getBuilderRouteMode(location.pathname);
  const { items, addOrUpdateItem } = useB2BCart();
  const [products, setProducts] = useState<CsvProduct[]>([]);
  const [draftQty, setDraftQty] = useState<Record<string, string>>({});

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
              subcategory: row[index.subcategory] ?? "",
              product_name: row[index.product_name] ?? "",
              code: row[index.code] ?? "",
              size: row[index.size] ?? "",
              unit: row[index.unit] ?? "",
              moq: row[index.moq] ?? "",
              active: row[index.active] ?? "FALSE",
            } as CsvProduct;
          })
          .filter((item) => item.active.toUpperCase() === "TRUE" && isBuilderGelByRoute(item, routeMode));

        setProducts(sortProductsAlphabetically(parsed));
      })
      .catch(() => setProducts([]));
  }, [routeMode]);

  const existingQtyByCode = useMemo(() => {
    const map: Record<string, number> = {};
    items
      .filter((item) => item.category === "BUILDER_GEL")
      .forEach((item) => {
        map[item.code] = item.quantity;
      });
    return map;
  }, [items]);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-grey-primary">{getBuilderPageTitle(routeMode)}</h2>
        <p className="mt-1 text-sm text-grey-secondary">Add builder gel products to the same shared B2B inquiry cart.</p>
      </div>

      <div className="rounded-lg border border-primary-200 bg-primary-50 p-3 text-sm text-primary-700">
        Add items here first, then set bottle packaging in Checkout before export/submit.
          <Link to="/b2b/checkout" className="ml-2 font-semibold underline">
            Open Checkout
          </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-grey-card">
        <div className="max-h-[68vh] overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-primary-50">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-grey-primary">Code</th>
                <th className="px-3 py-2 text-left font-semibold text-grey-primary">Subcategory</th>
                <th className="px-3 py-2 text-left font-semibold text-grey-primary">Product</th>
                <th className="px-3 py-2 text-left font-semibold text-grey-primary">Size</th>
                <th className="px-3 py-2 text-left font-semibold text-grey-primary">MOQ</th>
                <th className="px-3 py-2 text-left font-semibold text-grey-primary">Qty</th>
                <th className="px-3 py-2 text-left font-semibold text-grey-primary">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const value = draftQty[product.code] ?? String(existingQtyByCode[product.code] ?? product.moq ?? "");
                return (
                  <tr key={product.code} className="border-t border-grey-card/60">
                    <td className="px-3 py-2 font-mono">{product.code}</td>
                    <td className="px-3 py-2">{product.subcategory || "Builder Gel"}</td>
                    <td className="px-3 py-2">{product.product_name}</td>
                    <td className="px-3 py-2">{product.size} {product.unit}</td>
                    <td className="px-3 py-2">{product.moq}</td>
                    <td className="px-3 py-2">
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
                        className="w-24 rounded-md border border-grey-card px-2 py-1 text-grey-primary"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        onClick={() => {
                          const qty = Number.parseInt((draftQty[product.code] ?? String(existingQtyByCode[product.code] ?? "0")).trim(), 10);
                          addOrUpdateItem({
                            category: "BUILDER_GEL",
                            code: product.code,
                            name: product.product_name,
                            quantity: Number.isFinite(qty) ? qty : 0,
                            unitType: "PCS",
                            meta: {
                              size: product.size,
                              unit: product.unit,
                            },
                          });
                        }}
                        className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-600"
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

      {products.length === 0 ? (
        <div className="rounded-lg border border-dashed border-grey-card p-4 text-sm text-grey-secondary">
          No active builder gel rows found for this subcategory in products.csv.
        </div>
      ) : null}
    </div>
  );
}
