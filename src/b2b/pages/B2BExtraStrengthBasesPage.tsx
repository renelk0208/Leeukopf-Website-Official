import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { getIndexedCandidates, loadB2BImageIndex, type B2BImageIndex } from "../data/b2bImageIndex";
import B2BUniformShadeGrid, { type B2BUniformShadeItem } from "../components/B2BUniformShadeGrid";
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

type BaseRouteMode = "ALL" | "EXTRA_STRENGTH" | "CLASSIC" | "RUBBER" | "TOP_COAT";

function getBaseRouteMode(pathname: string): BaseRouteMode {
  const normalized = pathname.toLowerCase();
  if (normalized.includes("/top-coat")) return "TOP_COAT";
  if (normalized.includes("/classic-base")) return "CLASSIC";
  if (normalized.includes("/rubber-bases")) return "RUBBER";
  if (normalized.includes("/extra-strength-bases")) return "EXTRA_STRENGTH";
  return "ALL";
}

function getBasePageTitle(mode: BaseRouteMode): string {
  switch (mode) {
    case "TOP_COAT":
      return "Top Coat";
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
const baseImagePrefixes = ["/img/tops-bases/", "/img/products/tops-and-bases/"];

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

function getCategoryScopedExplicitImage(value: string): string {
  const normalized = normalizeImagePath(value);
  if (!normalized) return "";
  if (/^https?:\/\//i.test(normalized)) return "";

  if (normalized.startsWith("/img/tops-bases/")) return normalized;
  if (normalized.startsWith("/img/products/tops-and-bases/")) return normalized;
  return "";
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

function isTopCoat(item: CsvProduct): boolean {
  const joined = `${item.category} ${item.subcategory} ${item.product_name} ${item.code}`.toLowerCase();
  return joined.includes("top") && joined.includes("coat");
}

function matchesBaseRoute(item: CsvProduct, mode: BaseRouteMode): boolean {
  if (mode === "TOP_COAT") return isTopCoat(item);
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
  const explicitImage = getCategoryScopedExplicitImage(product.image_url);
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

const fallbackProductImage = "/img/placeholders/product-missing.svg";

export default function B2BExtraStrengthBasesPage() {
  const location = useLocation();
  const routeMode = getBaseRouteMode(location.pathname);
  const { items, addOrUpdateItem, removeItem } = useB2BCart();
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

  const uniformItems = useMemo<B2BUniformShadeItem[]>(() => {
    return products.map((product, index) => {
      const indexedCandidates = getIndexedCandidates(imageIndexByCode, product.code, baseImagePrefixes);
      const imageCandidates = Array.from(new Set([...indexedCandidates, ...getImageCandidates(product)]));
      const nextImageIndex = imageAttemptByCode[product.code] ?? 0;
      const image = imageCandidates[nextImageIndex] ?? fallbackProductImage;
      const moq = toNumber(product.moq, 1);

      return {
        id: `${product.code}-${index}`,
        code: product.code,
        name: product.product_name || "Base shade",
        family: product.subcategory || "Base Coats",
        moq,
        quantityValue: draftQty[product.code] ?? String(existingQtyByCode[product.code] ?? ""),
        imageSrc: image,
        imageAlt: product.product_name || product.code || "Base",
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
    <B2BUniformShadeGrid
      title={getBasePageTitle(routeMode)}
      description=""
      items={uniformItems}
      validationMessage={validationMessage}
      onQuantityChange={(id, value) => {
        const item = uniformItems.find((entry) => entry.id === id);
        if (!item) return;
        setDraftQty((prev) => ({ ...prev, [item.code]: value }));
      }}
      onSave={(id) => {
        const match = products.find((product, index) => `${product.code}-${index}` === id);
        if (!match) return;

        const raw = (draftQty[match.code] ?? String(existingQtyByCode[match.code] ?? "0")).trim();
        const qty = Number.parseInt(raw, 10);
        const moq = toNumber(match.moq, 1);

        if (!Number.isFinite(qty) || qty < 0) {
          setValidationMessage(`Please enter a valid quantity for ${match.product_name || match.code}.`);
          return;
        }

        if (qty > 0 && qty < moq) {
          setValidationMessage(`MOQ for ${match.product_name || match.code} is ${moq} pieces.`);
          return;
        }

        setValidationMessage("");

        const item = uniformItems.find((entry) => entry.id === id);
        addOrUpdateItem({
          category: "BASE",
          code: match.code,
          name: match.product_name,
          quantity: qty,
          unitType: "PCS",
          meta: {
            image: item?.imageSrc || null,
            subcategory: match.subcategory,
          },
        });
      }}
      onClear={(id) => {
        const match = products.find((product, index) => `${product.code}-${index}` === id);
        if (!match) return;
        setValidationMessage("");
        removeItem("BASE", match.code);
        setDraftQty((prev) => ({ ...prev, [match.code]: "" }));
      }}
    />
  );
}
