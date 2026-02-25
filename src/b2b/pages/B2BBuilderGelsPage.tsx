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
  image_url: string;
  active: string;
};

type BuilderGelManifestItem = {
  category?: string;
  subcategory?: string;
  product_name?: string;
  code?: string;
  size?: string;
  unit?: string;
  moq?: string;
  image_url?: string;
  active?: string;
};

const fallbackProductImage = "/img/placeholders/category-placeholder.jpg";

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

function normalizeProductRecord(input: Partial<CsvProduct>): CsvProduct {
  return {
    category: input.category ?? "",
    subcategory: input.subcategory ?? "",
    product_name: input.product_name ?? "",
    code: input.code ?? "",
    size: input.size ?? "",
    unit: input.unit ?? "",
    moq: input.moq ?? "1",
    image_url: input.image_url ?? "",
    active: input.active ?? "TRUE",
  };
}

function normalizeImagePath(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

function getImageCandidates(product: CsvProduct): string[] {
  const explicitImage = normalizeImagePath(product.image_url || "");
  const normalizedCode = (product.code || "").trim();
  const normalizedCodeNoDash = normalizedCode.replace(/-/g, "_");
  const normalizedCodeDashed = normalizedCode.replace(/_/g, "-");

  const byCode = normalizedCode
    ? [
      `/img/builder-gels/${normalizedCode}.webp`,
      `/img/builder-gels/${normalizedCode}.jpg`,
      `/img/builder-gels/${normalizedCode}.png`,
      `/img/builder-gels/${normalizedCodeNoDash}.webp`,
      `/img/builder-gels/${normalizedCodeNoDash}.jpg`,
      `/img/builder-gels/${normalizedCodeNoDash}.png`,
      `/img/builder-gels/${normalizedCodeDashed}.webp`,
      `/img/builder-gels/${normalizedCodeDashed}.jpg`,
      `/img/builder-gels/${normalizedCodeDashed}.png`,
      `/img/products/builder-systems/Builder Gels/${normalizedCode}.webp`,
      `/img/products/builder-systems/Builder Gels/${normalizedCode}.jpg`,
      `/img/products/builder-systems/Builder Gels/${normalizedCode}.png`,
      `/img/products/builder-systems/Builder Gels/${normalizedCodeNoDash}.webp`,
      `/img/products/builder-systems/Builder Gels/${normalizedCodeNoDash}.jpg`,
      `/img/products/builder-systems/Builder Gels/${normalizedCodeNoDash}.png`,
      `/img/products/builder-systems/Builder Gels/${normalizedCodeDashed}.webp`,
      `/img/products/builder-systems/Builder Gels/${normalizedCodeDashed}.jpg`,
      `/img/products/builder-systems/Builder Gels/${normalizedCodeDashed}.png`,
    ]
    : [];

  return Array.from(new Set([explicitImage, ...byCode].filter(Boolean)));
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
  const [imageAttemptByCode, setImageAttemptByCode] = useState<Record<string, number>>({});

  useEffect(() => {
    Promise.all([
      fetch("/products.csv").then((response) => response.text()),
      fetch("/data/builder-gels-manifest.json")
        .then((response) => (response.ok ? response.json() : []))
        .catch(() => [] as BuilderGelManifestItem[]),
    ])
      .then(([csv, manifestRows]) => {
        const lines = csv.split(/\r?\n/).filter((line) => line.trim().length > 0);
        if (!lines.length) {
          const fromManifest = (Array.isArray(manifestRows) ? manifestRows : [])
            .map((item) => normalizeProductRecord(item))
            .filter((item) => item.active.toUpperCase() === "TRUE" && isBuilderGelByRoute(item, routeMode));

          setProducts(sortProductsAlphabetically(fromManifest));
          return;
        }

        const header = parseCSVLine(lines[0]);
        const index = Object.fromEntries(header.map((value, columnIndex) => [value.toLowerCase(), columnIndex]));

        const parsedCsv = lines
          .slice(1)
          .map((line) => {
            const row = parseCSVLine(line);
            return normalizeProductRecord({
              category: row[index.category] ?? "",
              subcategory: row[index.subcategory] ?? "",
              product_name: row[index.product_name] ?? "",
              code: row[index.code] ?? "",
              size: row[index.size] ?? "",
              unit: row[index.unit] ?? "",
              moq: row[index.moq] ?? "",
              image_url: row[index.image_url] ?? "",
              active: row[index.active] ?? "FALSE",
            });
          })
          .filter((item) => item.active.toUpperCase() === "TRUE" && isBuilderGelByRoute(item, routeMode));

        const parsedManifest = (Array.isArray(manifestRows) ? manifestRows : [])
          .map((item) => normalizeProductRecord(item))
          .filter((item) => item.active.toUpperCase() === "TRUE" && isBuilderGelByRoute(item, routeMode));

        const mergedByCode = new Map<string, CsvProduct>();
        parsedCsv.forEach((item) => mergedByCode.set(item.code, item));
        parsedManifest.forEach((item) => {
          if (!item.code || mergedByCode.has(item.code)) return;
          mergedByCode.set(item.code, item);
        });

        setProducts(sortProductsAlphabetically(Array.from(mergedByCode.values())));
        setImageAttemptByCode({});
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
      const imageCandidates = getImageCandidates(product);
      const nextImageIndex = imageAttemptByCode[product.code] ?? 0;
      const image = imageCandidates[nextImageIndex] ?? fallbackProductImage;
      const quantityValue = draftQty[product.code] ?? String(existingQtyByCode[product.code] ?? "");
      return {
        id: `${product.code}-${index}`,
        code: product.code,
        name: product.product_name,
        family: product.subcategory || "Builder Gel",
        moq: Number.parseInt(product.moq || "1", 10) || 1,
        quantityValue,
        imageSrc: image,
        imageAlt: product.product_name || product.code,
        isSelected: (existingQtyByCode[product.code] ?? 0) > 0,
        isMissingImage: image === fallbackProductImage,
        onImageError: (event) => {
          const target = event.currentTarget;
          const currentIndex = imageAttemptByCode[product.code] ?? 0;
          if (currentIndex < imageCandidates.length - 1) {
            setImageAttemptByCode((prev) => ({
              ...prev,
              [product.code]: currentIndex + 1,
            }));
            return;
          }

          if (target.src.endsWith(fallbackProductImage)) return;
          target.src = fallbackProductImage;
        },
      };
    });
  }, [draftQty, existingQtyByCode, imageAttemptByCode, products]);

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
              image: uniformItems.find((entry) => entry.id === id)?.imageSrc || null,
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
