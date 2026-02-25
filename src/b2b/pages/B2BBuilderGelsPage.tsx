import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import B2BUniformShadeGrid, { type B2BUniformShadeItem } from "../components/B2BUniformShadeGrid";
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
  const { items, addOrUpdateItem, removeItem } = useB2BCart();
  const [products, setProducts] = useState<CsvProduct[]>([]);
  const [draftQty, setDraftQty] = useState<Record<string, string>>({});
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

  const uniformItems = useMemo<B2BUniformShadeItem[]>(() => {
    return products.map((product, index) => {
      const quantityValue = draftQty[product.code] ?? String(existingQtyByCode[product.code] ?? "");
      return {
        id: `${product.code}-${index}`,
        code: product.code,
        name: product.product_name,
        family: product.subcategory || "Builder Gel",
        moq: Number.parseInt(product.moq || "1", 10) || 1,
        quantityValue,
        imageSrc: "/img/products/builder-systems/Builder Gels/builder_gels_category_2.jpg",
        imageAlt: product.product_name || product.code,
        isSelected: (existingQtyByCode[product.code] ?? 0) > 0,
      };
    });
  }, [draftQty, existingQtyByCode, products]);

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-primary-200 bg-primary-50 p-3 text-sm text-primary-700">
        Add items here first, then set bottle packaging in Checkout before export/submit.
        <Link to="/b2b/checkout" className="ml-2 font-semibold underline">
          Open Checkout
        </Link>
      </div>

      <B2BUniformShadeGrid
        title={getBuilderPageTitle(routeMode)}
        description="Uniform product layout with shared colour chart panel."
        items={uniformItems}
        validationMessage={validationMessage}
        onQuantityChange={(id, value) => {
          const product = uniformItems.find((entry) => entry.id === id);
          if (!product) return;
          setDraftQty((prev) => ({ ...prev, [product.code]: value }));
        }}
        onSave={(id) => {
          const product = products.find((_, index) => `${products[index].code}-${index}` === id);
          if (!product) return;

          const raw = (draftQty[product.code] ?? String(existingQtyByCode[product.code] ?? "0")).trim();
          const qty = Number.parseInt(raw, 10);
          const moq = Number.parseInt(product.moq || "1", 10) || 1;

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
            category: "BUILDER_GEL",
            code: product.code,
            name: product.product_name,
            quantity: qty,
            unitType: "PCS",
            meta: {
              size: product.size,
              unit: product.unit,
              subcategory: product.subcategory,
            },
          });
        }}
        onClear={(id) => {
          const product = products.find((_, index) => `${products[index].code}-${index}` === id);
          if (!product) return;
          setValidationMessage("");
          removeItem("BUILDER_GEL", product.code);
          setDraftQty((prev) => ({ ...prev, [product.code]: "" }));
        }}
      />
    </div>
  );
}
