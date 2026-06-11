import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { getIndexedCandidates, loadB2BImageIndex, type B2BImageIndex } from "../data/b2bImageIndex";
import B2BUniformShadeGrid, { type B2BUniformShadeItem } from "../components/B2BUniformShadeGrid";
import { useB2BCart } from "../store/B2BCartContext";
import { useB2BPricing, lookupPrice } from "../hooks/useB2BPricing";
import type { B2BCategory } from "../types";

interface B2BSimpleProductPageProps {
  /** Value of the `category` column in products.csv, e.g. "Liquids", "Nail Art", "Accessories" */
  csvCategory: string;
  /** Cart category key for this page */
  b2bCategory: B2BCategory;
  /** Title shown when browsing all products in this category */
  pageTitle: string;
  /** Default MOQ when not specified in the CSV (default: 1) */
  defaultMoq?: number;
  /** Image path prefixes used to resolve product images via the index */
  imagePrefixes?: string[];
}

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

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    if (char === '"') {
      if (inQuotes && nextChar === '"') { current += '"'; i++; }
      else { inQuotes = !inQuotes; }
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

function sortAlpha(products: CsvProduct[]): CsvProduct[] {
  return [...products].sort((a, b) => {
    const l = (a.product_name || a.code || "").trim();
    const r = (b.product_name || b.code || "").trim();
    return l.localeCompare(r, undefined, { sensitivity: "base", numeric: true });
  });
}

/** Derive the subcategory slug from the URL path (the last non-empty segment after the base). */
function getSubcategorySlug(pathname: string): string | null {
  const parts = pathname.replace(/\/$/, "").split("/").filter(Boolean);
  const last = parts[parts.length - 1] ?? "";
  // If the last segment is the category base route itself (no sub-route), return null
  // The base routes are always single words; sub-routes are more specific
  return last.length > 0 && parts.length > 2 ? last : null;
}

export default function B2BSimpleProductPage({
  csvCategory,
  b2bCategory,
  pageTitle,
  defaultMoq = 1,
  imagePrefixes = [],
}: B2BSimpleProductPageProps) {
  const location = useLocation();
  const subcategorySlug = getSubcategorySlug(location.pathname);

  const { items, addOrUpdateItem, removeItem, buyerType, priceTier } = useB2BCart();
  const priceMap = useB2BPricing(priceTier);
  const priceUnit = buyerType === "bulk" ? "kg" : "pcs";
  const pricePerUnit = subcategorySlug
    ? lookupPrice(priceMap, subcategorySlug, priceUnit)
    : lookupPrice(priceMap, csvCategory, priceUnit);

  const [products, setProducts] = useState<CsvProduct[]>([]);
  const [draftQty, setDraftQty] = useState<Record<string, string>>({});
  const [validationMessage, setValidationMessage] = useState("");
  const [imageAttemptByCode, setImageAttemptByCode] = useState<Record<string, number>>({});
  const [imageIndexByCode, setImageIndexByCode] = useState<B2BImageIndex>({});

  useEffect(() => {
    loadB2BImageIndex()
      .then((index) => setImageIndexByCode(index))
      .catch(() => setImageIndexByCode({}));
  }, []);

  useEffect(() => {
    fetch("/products.csv")
      .then((r) => r.text())
      .then((csv) => {
        const lines = csv.split(/\r?\n/).filter((l) => l.trim().length > 0);
        if (!lines.length) { setProducts([]); return; }

        const header = parseCSVLine(lines[0]);
        const idx = Object.fromEntries(header.map((v, i) => [v.toLowerCase(), i]));

        const parsed = lines.slice(1).map((line) => {
          const row = parseCSVLine(line);
          return {
            category: row[idx.category] ?? "",
            subcategory: row[idx.subcategory] ?? "",
            product_name: row[idx.product_name] ?? "",
            code: row[idx.code] ?? "",
            moq: row[idx.moq] ?? "",
            image_url: row[idx.image_url] ?? "",
            active: row[idx.active] ?? "FALSE",
          } as CsvProduct;
        }).filter((item) => {
          if (item.active.toUpperCase() !== "TRUE") return false;
          if (item.category.toLowerCase() !== csvCategory.toLowerCase()) return false;
          if (!subcategorySlug) return true;
          // Match subcategory by converting the CSV subcategory to a slug
          const subSlug = item.subcategory.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
          return subSlug === subcategorySlug || subSlug.startsWith(subcategorySlug) || subcategorySlug.startsWith(subSlug);
        });

        setProducts(sortAlpha(parsed));
        setImageAttemptByCode({});
      })
      .catch(() => setProducts([]));
  }, [csvCategory, subcategorySlug]);

  const existingQtyByCode = useMemo(() => {
    const map: Record<string, number> = {};
    items
      .filter((item) => item.category === b2bCategory)
      .forEach((item) => { map[item.code] = item.quantity; });
    return map;
  }, [items, b2bCategory]);

  const uniformItems = useMemo<B2BUniformShadeItem[]>(() => {
    return products.map((product, i) => {
      const indexedCandidates = getIndexedCandidates(imageIndexByCode, product.code, imagePrefixes);
      const csvImage = product.image_url?.trim().startsWith("/") ? product.image_url.trim() : "";
      const imageCandidates = Array.from(new Set([csvImage, ...indexedCandidates].filter(Boolean)));

      const nextAttempt = imageAttemptByCode[product.code] ?? 0;
      const image = imageCandidates[nextAttempt] ?? fallbackProductImage;

      const pcsMoq = parseInt(product.moq, 10);
      const resolvedMoq = Number.isFinite(pcsMoq) && pcsMoq > 0 ? pcsMoq : defaultMoq;
      const moq = buyerType === "bulk" ? 1 : resolvedMoq;

      return {
        id: `${product.code}-${i}`,
        code: product.code,
        name: product.product_name || product.code || "Product",
        family: product.subcategory || csvCategory,
        moq,
        quantityValue: draftQty[product.code] !== undefined
          ? draftQty[product.code]
          : String(existingQtyByCode[product.code] > 0 ? existingQtyByCode[product.code] : moq),
        imageSrc: image,
        imageAlt: product.product_name || product.code || csvCategory,
        isSelected: (existingQtyByCode[product.code] ?? 0) > 0,
        isMissingImage: false,
        onImageError: (event) => {
          const target = event.currentTarget;
          const currentAttempt = imageAttemptByCode[product.code] ?? 0;
          if (currentAttempt < imageCandidates.length - 1) {
            setImageAttemptByCode((prev) => ({ ...prev, [product.code]: currentAttempt + 1 }));
            return;
          }
          if (!target.src.endsWith(fallbackProductImage)) {
            target.src = fallbackProductImage;
          }
        },
      };
    });
  }, [products, draftQty, existingQtyByCode, imageAttemptByCode, imageIndexByCode, imagePrefixes, buyerType, defaultMoq, csvCategory]);

  const title = subcategorySlug
    ? `${pageTitle} · ${subcategorySlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}`
    : pageTitle;

  return (
    <B2BUniformShadeGrid
      title={title}
      description=""
      items={uniformItems}
      validationMessage={validationMessage}
      buyerType={buyerType}
      pricePerUnit={pricePerUnit}
      priceUnit={priceUnit}
      onQuantityChange={(id, value) => {
        const item = uniformItems.find((e) => e.id === id);
        if (!item) return;
        setDraftQty((prev) => ({ ...prev, [item.code]: value }));
      }}
      onSave={(id) => {
        const match = products.find((p, i) => `${p.code}-${i}` === id);
        if (!match) return;

        const displayed = uniformItems.find((e) => e.id === id)?.quantityValue ?? "0";
        const raw = (draftQty[match.code] ?? displayed).trim();
        const qty = parseInt(raw, 10);

        const pcsMoq = parseInt(match.moq, 10);
        const resolvedMoq = Number.isFinite(pcsMoq) && pcsMoq > 0 ? pcsMoq : defaultMoq;
        const effectiveMoq = buyerType === "bulk" ? 1 : resolvedMoq;

        if (!Number.isFinite(qty) || qty < 0) {
          setValidationMessage(`Please enter a valid quantity for ${match.product_name || match.code}.`);
          return;
        }
        if (qty > 0 && qty < effectiveMoq) {
          const moqLabel = buyerType === "bulk" ? "1 kg" : `${effectiveMoq} pieces`;
          setValidationMessage(`MOQ for ${match.product_name || match.code} is ${moqLabel}.`);
          return;
        }

        setValidationMessage("");
        const item = uniformItems.find((e) => e.id === id);
        addOrUpdateItem({
          category: b2bCategory,
          code: match.code,
          name: match.product_name,
          quantity: qty,
          unitType: buyerType === "bulk" ? "KG" : "PCS",
          meta: { image: item?.imageSrc ?? null, subcategory: match.subcategory },
        });
      }}
      onClear={(id) => {
        const match = products.find((p, i) => `${p.code}-${i}` === id);
        if (!match) return;
        setValidationMessage("");
        removeItem(b2bCategory, match.code);
        setDraftQty((prev) => ({ ...prev, [match.code]: "" }));
      }}
    />
  );
}
