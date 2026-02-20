import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useB2BCart } from "../store/B2BCartContext";

type CsvProduct = {
  category: string;
  product_name: string;
  code: string;
  size: string;
  unit: string;
  moq: string;
  active: string;
};

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

export default function B2BBuilderGelsPage() {
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
              product_name: row[index.product_name] ?? "",
              code: row[index.code] ?? "",
              size: row[index.size] ?? "",
              unit: row[index.unit] ?? "",
              moq: row[index.moq] ?? "",
              active: row[index.active] ?? "FALSE",
            } as CsvProduct;
          })
          .filter((item) => item.active.toUpperCase() === "TRUE" && item.category.toLowerCase() === "builder gel");

        setProducts(parsed);
      })
      .catch(() => setProducts([]));
  }, []);

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
        <h2 className="text-2xl font-bold text-grey-primary">Builder Gels</h2>
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
    </div>
  );
}
