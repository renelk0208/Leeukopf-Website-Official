import { useEffect, useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { getIndexedCandidates, loadB2BImageIndex, type B2BImageIndex } from "../data/b2bImageIndex";
import B2BUniformShadeGrid, { type B2BUniformShadeItem } from "../components/B2BUniformShadeGrid";
import { useB2BCart } from "../store/B2BCartContext";
import { useB2BPricing, lookupPrice } from "../hooks/useB2BPricing";

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

const fallbackProductImage = "/img/placeholders/product-missing.svg";
const BUILDER_GEL_MIN_MOQ = 25;

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

function getCategoryScopedExplicitImage(value: string): string {
  const normalized = normalizeImagePath(value);
  if (!normalized) return "";
  if (/^https?:\/\//i.test(normalized)) return "";
  return normalized.startsWith("/img/builder-gels/") || normalized.startsWith("/img/brush-on-builder/") ||
    normalized.startsWith("/img/b2b/builder-gels/") || normalized.startsWith("/img/b2b/brush-on-builder/")
    ? normalized
    : "";
}

function getImageCandidates(product: CsvProduct): string[] {
  const explicitImage = getCategoryScopedExplicitImage(product.image_url || "");
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
      `/img/brush-on-builder/${normalizedCode}.webp`,
      `/img/brush-on-builder/${normalizedCode}.jpg`,
      `/img/brush-on-builder/${normalizedCode}.png`,
      `/img/brush-on-builder/${normalizedCodeNoDash}.webp`,
      `/img/brush-on-builder/${normalizedCodeNoDash}.jpg`,
      `/img/brush-on-builder/${normalizedCodeNoDash}.png`,
      `/img/brush-on-builder/${normalizedCodeDashed}.webp`,
      `/img/brush-on-builder/${normalizedCodeDashed}.jpg`,
      `/img/brush-on-builder/${normalizedCodeDashed}.png`,
    ]
    : [];

  return Array.from(new Set([explicitImage, ...byCode].filter(Boolean)));
}

const builderImagePrefixes = [
  "/img/builder-gels/",
  "/img/brush-on-builder/",
  "/img/b2b/builder-gels/",
  "/img/b2b/brush-on-builder/",
];

type BuilderRouteMode = "ALL" | "ACRYLICS" | "THREE_IN_ONE" | "FIBREGLASS" | "BIAB" | "COLOUR_BUILDER" | "MASTER_BUILDER" | "NO_HEAT" | "THIXOTROPIC";

function getBuilderRouteMode(pathname: string): BuilderRouteMode {
  const normalized = pathname.toLowerCase();
  if (normalized.includes("/acrylics")) return "ACRYLICS";
  if (normalized.includes("/3-in-1-builder-gels")) return "THREE_IN_ONE";
  if (normalized.includes("/3-in-1-fibreglass-gel")) return "FIBREGLASS";
  if (normalized.includes("/biab")) return "BIAB";
  if (normalized.includes("/colour-builder-gel")) return "COLOUR_BUILDER";
  if (normalized.includes("/master-builder-gels")) return "MASTER_BUILDER";
  if (normalized.includes("/no-heat-builder")) return "NO_HEAT";
  if (normalized.includes("/thixotropic-gel")) return "THIXOTROPIC";
  return "ALL";
}

function getBuilderPageTitle(mode: BuilderRouteMode): string {
  switch (mode) {
    case "ACRYLICS": return "Builder Gels · Acrylics";
    case "THREE_IN_ONE": return "Builder Gels · 3-in-1 Builder Gels";
    case "FIBREGLASS": return "Builder Gels · 3-in-1 Fibreglass Gel";
    case "BIAB": return "Builder Gels · BIAB";
    case "COLOUR_BUILDER": return "Builder Gels · Colour Builder Gel";
    case "MASTER_BUILDER": return "Builder Gels · Master Builder Gels";
    case "NO_HEAT": return "Builder Gels · No Heat Builder";
    case "THIXOTROPIC": return "Builder Gels · Thixotropic Gel";
    default: return "Builder Gels";
  }
}

function getBuilderSearchBlob(item: Pick<CsvProduct, "category" | "subcategory" | "product_name" | "code">): string {
  return `${item.category} ${item.subcategory} ${item.product_name} ${item.code}`.toLowerCase();
}

function isBuilderGelByRoute(item: CsvProduct, mode: BuilderRouteMode): boolean {
  const blob = getBuilderSearchBlob(item);
  if (!blob.includes("builder") && !blob.includes("biab") && !blob.includes("fiberglass") && !blob.includes("fibreglass") && !blob.includes("acrylic") && !blob.includes("thixotropic")) {
    return false;
  }

  if (mode === "ALL") return item.category.toLowerCase() === "builder gel";
  if (mode === "ACRYLICS") return blob.includes("acrylic");
  if (mode === "THREE_IN_ONE") return item.subcategory?.toLowerCase() === "3-in-1";
  if (mode === "FIBREGLASS") return blob.includes("fiberglass") || blob.includes("fibreglass") || blob.includes("fiber glass");
  if (mode === "BIAB") return blob.includes("biab") || blob.includes("builder in a bottle");
  if (mode === "COLOUR_BUILDER") return item.subcategory?.toLowerCase() === "colour builder gel";
  if (mode === "MASTER_BUILDER") return item.subcategory?.toLowerCase() === "master builder gels";
  if (mode === "NO_HEAT") return item.subcategory?.toLowerCase() === "no heat builder";
  if (mode === "THIXOTROPIC") return item.subcategory?.toLowerCase() === "thixotropic gel";

  return false;
}

export default function B2BBuilderGelsPage() {
  const location = useLocation();
  const routeMode = getBuilderRouteMode(location.pathname);
  const { items, addOrUpdateItem, removeItem, buyerType, priceTier } = useB2BCart();
  const priceMap = useB2BPricing(priceTier);
  const priceUnit = buyerType === "bulk" ? "kg" : "pcs";
  // BIAB has its own price entry; all other builder gel modes share "Builder Gel"
  const builderSubcategoryKey = routeMode === "BIAB" ? "BIAB" : "Builder Gel";
  const pricePerUnit = lookupPrice(priceMap, builderSubcategoryKey, priceUnit);
  const [products, setProducts] = useState<CsvProduct[]>([]);
  const [draftQty, setDraftQty] = useState<Record<string, string>>({});
  const [validationMessage, setValidationMessage] = useState<string>("");
  const [imageAttemptByCode, setImageAttemptByCode] = useState<Record<string, number>>({});
  const [imageIndexByCode, setImageIndexByCode] = useState<B2BImageIndex>({});

  useEffect(() => {
    loadB2BImageIndex()
      .then((index) => setImageIndexByCode(index))
      .catch(() => setImageIndexByCode({}));
  }, []);

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
          if (!item.code) return;

          const existing = mergedByCode.get(item.code);
          if (!existing) {
            mergedByCode.set(item.code, item);
            return;
          }

          const manifestImage = getCategoryScopedExplicitImage(item.image_url || "");
          const existingImage = getCategoryScopedExplicitImage(existing.image_url || "");

          mergedByCode.set(item.code, {
            ...existing,
            category: existing.category || item.category,
            subcategory: item.subcategory || existing.subcategory,
            product_name: existing.product_name || item.product_name,
            image_url: manifestImage || existingImage || existing.image_url || item.image_url,
          });
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
      const indexedCandidates = getIndexedCandidates(imageIndexByCode, product.code, builderImagePrefixes);
      const imageCandidates = Array.from(new Set([...indexedCandidates, ...getImageCandidates(product)]));
      const nextImageIndex = imageAttemptByCode[product.code] ?? 0;
      const image = imageCandidates[nextImageIndex] ?? fallbackProductImage;
      const quantityValue = draftQty[product.code] ?? String(existingQtyByCode[product.code] ?? "");
      return {
        id: `${product.code}-${index}`,
        code: product.code,
        name: product.product_name,
        family: product.subcategory || "Builder Gel",
        moq: Math.max(Number.parseInt(product.moq || "1", 10) || 1, BUILDER_GEL_MIN_MOQ),
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
  }, [draftQty, existingQtyByCode, imageAttemptByCode, imageIndexByCode, products]);

  return (
    <div className="space-y-4">
      {buyerType === "finished_goods" && (
        <div className="rounded-lg border-2 border-orange-400 p-4 shadow-sm">
          <div className="-mx-4 -mt-4 mb-3 flex items-center gap-2 bg-orange-400 px-4 py-2.5">
            <AlertTriangle className="h-4 w-4 flex-shrink-0 text-white" />
            <span className="text-sm font-bold uppercase tracking-wide text-white">Jar Configuration Required at Checkout</span>
          </div>
          <p className="text-sm text-grey-secondary">Builder gels are filled into <span className="font-semibold">jars (30g or 40g)</span>. Set your jar size, colour, and branding in{" "}<Link to="/b2b/checkout" className="font-semibold underline">Checkout</Link>{" "}before submitting your order.</p>
        </div>
      )}

      <B2BUniformShadeGrid
        title={getBuilderPageTitle(routeMode)}
        description=""
        items={uniformItems}
        validationMessage={validationMessage}
        buyerType={buyerType}
        pricePerUnit={pricePerUnit}
        priceUnit={priceUnit}
        onQuantityChange={(id, value) => {
          const product = uniformItems.find((entry) => entry.id === id);
          if (!product) return;
          setDraftQty((prev) => ({ ...prev, [product.code]: value }));
        }}
        onSave={(id) => {
          const product = products.find((_, index) => `${products[index].code}-${index}` === id);
          if (!product) return;

          const displayed = uniformItems.find((entry) => entry.id === id)?.quantityValue ?? "0";
          const raw = (draftQty[product.code] ?? displayed).trim();
          const qty = Number.parseInt(raw, 10);
          const pcsMoq = Math.max(Number.parseInt(product.moq || "1", 10) || 1, BUILDER_GEL_MIN_MOQ);
          const effectiveMoq = buyerType === "bulk" ? 1 : pcsMoq;

          if (!Number.isFinite(qty) || qty < 0) {
            setValidationMessage(`Please enter a valid quantity for ${product.product_name || product.code}.`);
            return;
          }

          if (qty > 0 && qty < effectiveMoq) {
            const moqLabel = buyerType === "bulk" ? "1 kg" : `${effectiveMoq} pieces`;
            setValidationMessage(`MOQ for ${product.product_name || product.code} is ${moqLabel}.`);
            return;
          }

          setValidationMessage("");

          addOrUpdateItem({
            category: "BUILDER_GEL",
            code: product.code,
            name: product.product_name,
            quantity: qty,
            unitType: buyerType === "bulk" ? "KG" : "PCS",
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
