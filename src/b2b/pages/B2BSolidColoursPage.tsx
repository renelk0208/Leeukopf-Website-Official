import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import InternalSolidColourGrid, { type InternalSolidColourSyncItem } from "../../pages/InternalSolidColourGrid";
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

const fallbackProductImage = "/img/placeholders/product-missing.svg";

const routeKeywords: Record<string, string[]> = {
  "cat-eye": ["cat eye", "cat-eye", "cateye"],
  "french-collection": ["french"],
  glitters: ["glitter"],
  platinum: ["platinum"],
  "cream-collection": ["cream"],
};

const solidImagePrefixes = [
  "/img/solid-colour/",
  "/img/products/gel_polishes/",
  "/img/b2b/solid-colours/",
  "/img/b2b/french-colours/",
  "/img/b2b/glitters/",
  "/img/b2b/cat eyes/",
  "/img/b2b/cat-eyes/",
  "/img/b2b/platinum/",
  "/img/b2b/solid cream/",
  "/img/b2b/solid-cream/",
];

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
  if (normalized.startsWith("/img/products/gel_polishes/")) return normalized;
  if (normalized.startsWith("/img/solid-colour/")) return normalized;
  if (normalized.startsWith("/img/b2b/solid-colours/")) return normalized;
  if (normalized.startsWith("/img/b2b/french-colours/")) return normalized;
  if (normalized.startsWith("/img/b2b/glitters/")) return normalized;
  if (normalized.startsWith("/img/b2b/cat eyes/") || normalized.startsWith("/img/b2b/cat-eyes/")) return normalized;
  if (normalized.startsWith("/img/b2b/platinum/")) return normalized;
  if (normalized.startsWith("/img/b2b/solid cream/") || normalized.startsWith("/img/b2b/solid-cream/")) return normalized;
  return "";
}

function sortProductsAlphabetically(products: CsvProduct[]): CsvProduct[] {
  return [...products].sort((a, b) => {
    const left = (a.product_name || a.code || "").trim();
    const right = (b.product_name || b.code || "").trim();
    return left.localeCompare(right, undefined, { sensitivity: "base", numeric: true });
  });
}

function isGelPolishLike(product: CsvProduct): boolean {
  const blob = `${product.category} ${product.subcategory}`.toLowerCase();
  return blob.includes("gel polish") || blob.includes("gel_polish") || blob.includes("colour") || blob.includes("color");
}

function matchesColourSubcategoryRoute(product: CsvProduct, routeKey: string): boolean {
  const keywords = routeKeywords[routeKey] ?? [];
  if (!keywords.length) return false;

  const blob = `${product.category} ${product.subcategory} ${product.product_name} ${product.code}`.toLowerCase();
  return keywords.some((keyword) => blob.includes(keyword));
}

function getImageCandidates(product: CsvProduct): string[] {
  const explicit = getCategoryScopedExplicitImage(product.image_url || "");
  const code = (product.code || "").trim();
  const noDash = code.replace(/-/g, "_");
  const dashed = code.replace(/_/g, "-");

  const byCode = code
    ? [
      `/img/products/gel_polishes/${code}.webp`,
      `/img/products/gel_polishes/${code}.jpg`,
      `/img/products/gel_polishes/${code}.png`,
      `/img/products/gel_polishes/${noDash}.webp`,
      `/img/products/gel_polishes/${noDash}.jpg`,
      `/img/products/gel_polishes/${noDash}.png`,
      `/img/products/gel_polishes/${dashed}.webp`,
      `/img/products/gel_polishes/${dashed}.jpg`,
      `/img/products/gel_polishes/${dashed}.png`,
      `/img/solid-colour/${code}.webp`,
      `/img/solid-colour/${code}.jpg`,
      `/img/solid-colour/${code}.png`,
      `/img/solid-colour/${noDash}.webp`,
      `/img/solid-colour/${noDash}.jpg`,
      `/img/solid-colour/${noDash}.png`,
      `/img/solid-colour/${dashed}.webp`,
      `/img/solid-colour/${dashed}.jpg`,
      `/img/solid-colour/${dashed}.png`,
    ]
    : [];

  return Array.from(new Set([explicit, ...byCode].filter(Boolean)));
}

function toRouteLabel(routeKey: string): string {
  return routeKey
    .split("-")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function toSolidOrderCode(code: string, internalSku?: string): string {
  const normalizedInternalSku = (internalSku || "").trim();
  if (normalizedInternalSku) {
    return normalizedInternalSku;
  }

  return (code || "").trim();
}

export default function B2BSolidColoursPage() {
  const location = useLocation();
  const { items, addOrUpdateItem, removeItem } = useB2BCart();
  const [products, setProducts] = useState<CsvProduct[]>([]);
  const [draftQty, setDraftQty] = useState<Record<string, string>>({});
  const [validationMessage, setValidationMessage] = useState<string>("");
  const [imageAttemptByCode, setImageAttemptByCode] = useState<Record<string, number>>({});
  const [imageIndexByCode, setImageIndexByCode] = useState<B2BImageIndex>({});

  const normalizedPath = location.pathname.toLowerCase();
  const routeSuffix = normalizedPath.replace("/b2b/solid-colours", "").replace(/^\/+/, "");
  const isSolidColoursRoute = routeSuffix.length === 0 || routeSuffix === "solid-colours";
  const isKnownColourSubcategoryRoute = Boolean(routeKeywords[routeSuffix]);

  const subcategoryLabel = routeSuffix
    .split("/")
    .filter(Boolean)
    .join(" ")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase()) || "This subcategory";

  useEffect(() => {
    loadB2BImageIndex()
      .then((index) => setImageIndexByCode(index))
      .catch(() => setImageIndexByCode({}));
  }, []);

  useEffect(() => {
    if (isSolidColoursRoute || !isKnownColourSubcategoryRoute) {
      setProducts([]);
      return;
    }

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
              moq: row[index.moq] ?? "1",
              image_url: row[index.image_url] ?? "",
              active: row[index.active] ?? "FALSE",
            } as CsvProduct;
          })
          .filter(
            (item) =>
              item.active.toUpperCase() === "TRUE" &&
              isGelPolishLike(item) &&
              matchesColourSubcategoryRoute(item, routeSuffix)
          );

        setProducts(sortProductsAlphabetically(parsed));
        setImageAttemptByCode({});
      })
      .catch(() => setProducts([]));
  }, [isKnownColourSubcategoryRoute, isSolidColoursRoute, routeSuffix]);

  const handleSelectionSync = useCallback((selectedItems: InternalSolidColourSyncItem[]) => {
    const normalizedSelectedItems = selectedItems.map((item) => {
      const mappedCode = toSolidOrderCode(item.code, item.internalSku);
      return {
        ...item,
        code: mappedCode,
      };
    });

    const existingSolidItems = items.filter((item) => item.category === "SOLID_GEL_POLISH");
    const existingByCode = new Map(existingSolidItems.map((item) => [item.code, item]));
    const selectedCodes = new Set(normalizedSelectedItems.map((item) => item.code));

    existingSolidItems.forEach((item) => {
      if (!selectedCodes.has(item.code)) {
        removeItem("SOLID_GEL_POLISH", item.code);
      }
    });

    normalizedSelectedItems.forEach((item) => {
      const quantity = Number.isFinite(item.quantity) ? Math.max(0, Math.floor(item.quantity)) : 0;
      const nextName = item.name?.trim() ? item.name : item.code;
      const nextInternalSku = item.internalSku || item.code;
      const existing = existingByCode.get(item.code);
      const existingHex = typeof existing?.meta?.hex === "string" ? existing.meta.hex : undefined;

      const hasChanged =
        !existing ||
        existing.quantity !== quantity ||
        existing.name !== nextName ||
        existing.internalSku !== nextInternalSku ||
        existing.unitType !== "PCS" ||
        existingHex !== item.hex;

      if (!hasChanged) return;

      addOrUpdateItem({
        category: "SOLID_GEL_POLISH",
        code: item.code,
        internalSku: nextInternalSku,
        name: nextName,
        quantity,
        unitType: "PCS",
        meta: {
          hex: item.hex || null,
        },
      });
    });
  }, [addOrUpdateItem, items, removeItem]);

  const existingQtyByCode = useMemo(() => {
    const map: Record<string, number> = {};
    items
      .filter((item) => item.category === "SOLID_GEL_POLISH")
      .forEach((item) => {
        map[item.code] = item.quantity;
      });
    return map;
  }, [items]);

  const uniformItems = useMemo<B2BUniformShadeItem[]>(() => {
    return products.map((product, index) => {
      const indexedCandidates = getIndexedCandidates(imageIndexByCode, product.code, solidImagePrefixes);
      const imageCandidates = Array.from(new Set([...indexedCandidates, ...getImageCandidates(product)]));
      const nextImageIndex = imageAttemptByCode[product.code] ?? 0;
      const image = imageCandidates[nextImageIndex] ?? fallbackProductImage;
      const moq = Number.parseInt(product.moq || "1", 10) || 1;

      return {
        id: `${product.code}-${index}`,
        code: product.code,
        name: product.product_name || product.code,
        family: product.subcategory || toRouteLabel(routeSuffix),
        moq,
        quantityValue: draftQty[product.code] ?? String(existingQtyByCode[product.code] ?? ""),
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
  }, [draftQty, existingQtyByCode, imageAttemptByCode, imageIndexByCode, products, routeSuffix]);

  if (!isSolidColoursRoute) {
    if (isKnownColourSubcategoryRoute) {
      return (
        <B2BUniformShadeGrid
          title={toRouteLabel(routeSuffix)}
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
            const moq = Number.parseInt(match.moq || "1", 10) || 1;

            if (!Number.isFinite(qty) || qty < 0) {
              setValidationMessage(`Please enter a valid quantity for ${match.product_name || match.code}.`);
              return;
            }

            if (qty > 0 && qty < moq) {
              setValidationMessage(`MOQ for ${match.product_name || match.code} is ${moq} pieces.`);
              return;
            }

            setValidationMessage("");

            addOrUpdateItem({
              category: "SOLID_GEL_POLISH",
              code: match.code,
              name: match.product_name,
              quantity: qty,
              unitType: "PCS",
              meta: {
                subcategory: match.subcategory,
                image: uniformItems.find((entry) => entry.id === id)?.imageSrc || null,
              },
            });
          }}
          onClear={(id) => {
            const match = products.find((product, index) => `${product.code}-${index}` === id);
            if (!match) return;
            setValidationMessage("");
            removeItem("SOLID_GEL_POLISH", match.code);
            setDraftQty((prev) => ({ ...prev, [match.code]: "" }));
          }}
        />
      );
    }

    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-grey-primary">{subcategoryLabel}</h2>
          <p className="mt-1 text-sm text-grey-secondary">
            Solid colours are only available under the Solid Colours subcategory.
          </p>
        </div>

        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          This subcategory is configured, but solid-colour shades are intentionally hidden here.
        </div>
      </div>
    );
  }

  return <InternalSolidColourGrid onSelectionSync={handleSelectionSync} disableClientInfoLock viewMode="shades-only" />;
}
