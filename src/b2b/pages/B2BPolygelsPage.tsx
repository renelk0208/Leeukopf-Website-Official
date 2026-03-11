import { useEffect, useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";
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
  image_url: string;
  active: string;
};

function sortProductsAlphabetically(products: CsvProduct[]): CsvProduct[] {
  return [...products].sort((a, b) => {
    const left = (a.product_name || a.code || "").trim();
    const right = (b.product_name || b.code || "").trim();
    return left.localeCompare(right, undefined, { sensitivity: "base", numeric: true });
  });
}

type TubeColor = "BLACK" | "WHITE";
type TubeSize = "30G" | "60G";
type TubeLabel = "PRINTED" | "OWN_LABELS";

const POLYGEL_MOQ = 100;
const LIQUID_POLYGEL_MOQ = 25;

const tubeColorOptions: Array<{ value: TubeColor; label: string }> = [
  { value: "BLACK", label: "Black" },
  { value: "WHITE", label: "White" },
];

const tubeSizeOptions: Array<{ value: TubeSize; label: string }> = [
  { value: "30G", label: "30g" },
  { value: "60G", label: "60g" },
];

const tubeLabelOptions: Array<{ value: TubeLabel; label: string }> = [
  { value: "PRINTED", label: "Printed" },
  { value: "OWN_LABELS", label: "Own labels" },
];

const fallbackProductImage = "/img/placeholders/product-missing.svg";

const polygelCodeGroups: Array<{ prefix: string; count: number }> = [
  { prefix: "LC-ACY-PG-", count: 18 },
  { prefix: "LC-ACY_A-PG-", count: 26 },
  { prefix: "LC-ACY_BA-PG-", count: 22 },
  { prefix: "LC-ACY_H_SPG-", count: 24 },
];

function buildFallbackPolygelProducts(): CsvProduct[] {
  return polygelCodeGroups.flatMap(({ prefix, count }) =>
    Array.from({ length: count }, (_, index) => {
      const sequence = String(index + 1).padStart(2, "0");
      const code = `${prefix}${sequence}`;

      return {
        category: "Polygel",
        subcategory: "Polygel",
        product_name: `Polygel Shade ${code}`,
        code,
        image_url: `/img/polygel/${code}.webp`,
        active: "TRUE",
      } as CsvProduct;
    })
  );
}

const liquidPolygelCodeGroups: Array<{ prefix: string; count: number }> = [
  { prefix: "LC_UGL", count: 15 },
  { prefix: "LC_UGL-M", count: 24 },
  { prefix: "LC_UGL_LP_P", count: 62 },
];

const polygelImagePrefixes = ["/img/polygel/", "/img/b2b/Polygels/polygel/", "/img/b2b/polygels/polygel/"];
const liquidPolygelImagePrefixes = ["/img/liquid-polygel/", "/img/b2b/Polygels/liquid-polygel/", "/img/b2b/polygels/liquid-polygel/"];

function buildFallbackLiquidPolygelProducts(): CsvProduct[] {
  return liquidPolygelCodeGroups.flatMap(({ prefix, count }) =>
    Array.from({ length: count }, (_, index) => {
      const sequence = String(index + 1).padStart(2, "0");
      const code = `${prefix}${sequence}`;

      return {
        category: "Builder Gel",
        subcategory: "Liquid Polygel",
        product_name: `Liquid Polygel ${code}`,
        code,
        image_url: `/img/liquid-polygel/${code}.webp`,
        active: "TRUE",
      } as CsvProduct;
    })
  );
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

function getCategoryBlob(item: Pick<CsvProduct, "category" | "subcategory" | "product_name" | "code">): string {
  return `${item.category} ${item.subcategory} ${item.product_name} ${item.code}`.trim().toLowerCase();
}

function isPolygelCategory(item: Pick<CsvProduct, "category" | "subcategory" | "product_name" | "code">): boolean {
  const normalized = getCategoryBlob(item);
  return normalized.includes("polygel") || normalized.includes("acrygel") || normalized.includes("liquid polygel");
}

function normalizeImagePath(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

function getRouteScopedExplicitImage(value: string, isLiquidRoute: boolean): string {
  const normalized = normalizeImagePath(value);
  if (!normalized) return "";
  if (/^https?:\/\//i.test(normalized)) return "";

  if (isLiquidRoute) {
    return liquidPolygelImagePrefixes.some((p) => normalized.startsWith(p)) ? normalized : "";
  }

  return polygelImagePrefixes.some((p) => normalized.startsWith(p)) ? normalized : "";
}

function getImageCandidates(product: CsvProduct, isLiquidRoute: boolean): string[] {
  const explicitImage = getRouteScopedExplicitImage(product.image_url || "", isLiquidRoute);
  const byCode = product.code ? buildImageCandidatesFromCode(product.code, isLiquidRoute) : [];

  return Array.from(new Set([explicitImage, ...byCode].filter(Boolean)));
}

function buildImageCandidatesFromCode(code: string, isLiquidRoute: boolean): string[] {
  const normalized = (code || "").trim();
  if (!normalized) return [];

  const variants = new Set<string>();
  variants.add(normalized);
  variants.add(normalized.toUpperCase());
  variants.add(normalized.replace(/\s+/g, "-"));
  variants.add(normalized.replace(/\s+/g, "_"));
  variants.add(normalized.replace(/-/g, "_"));
  variants.add(normalized.replace(/_/g, "-"));

  const withTrailingDashRemoved = normalized.replace(/([A-Za-z])-(\d{2,3})$/, "$1$2");
  variants.add(withTrailingDashRemoved);
  variants.add(withTrailingDashRemoved.replace(/-/g, "_"));

  const withoutTrailingDash = normalized.replace(/([A-Za-z_])(\d{2,3})$/, "$1-$2");
  variants.add(withoutTrailingDash);
  variants.add(withoutTrailingDash.replace(/-/g, "_"));

  const extensions = ["webp", "jpg", "png"];
  const baseDirs = isLiquidRoute ? ["/img/liquid-polygel"] : ["/img/polygel"];
  const candidates: string[] = [];

  Array.from(variants)
    .filter(Boolean)
    .forEach((variant) => {
      baseDirs.forEach((baseDir) => {
        extensions.forEach((extension) => {
          candidates.push(`${baseDir}/${variant}.${extension}`);
        });
      });
    });

  return candidates;
}

function isLiquidPolygelRoute(pathname: string): boolean {
  return pathname.includes("/liquid-polygel");
}

function matchesRouteCategory(pathname: string, item: Pick<CsvProduct, "category" | "subcategory" | "product_name" | "code">): boolean {
  const blob = getCategoryBlob(item);
  if (pathname.includes("/liquid-polygel")) {
    return blob.includes("liquid polygel");
  }

  if (pathname.includes("/polygel")) {
    return blob.includes("polygel") && !blob.includes("liquid polygel");
  }

  return isPolygelCategory(item);
}

export default function B2BPolygelsPage() {
  const location = useLocation();
  const isLiquidRoute = isLiquidPolygelRoute(location.pathname.toLowerCase());
  const activeMoq = isLiquidRoute ? LIQUID_POLYGEL_MOQ : POLYGEL_MOQ;
  const { items, addOrUpdateItem, removeItem, buyerType, priceTier } = useB2BCart();
  const priceMap = useB2BPricing(priceTier);
  // Liquid polygel: bulk pricing is per kg; plain polygel: always per pcs (even for bulk buyers)
  const isBulkKg = buyerType === "bulk" && isLiquidRoute;
  const priceUnit = isBulkKg ? "kg" : "pcs";
  const polygelSubcategoryKey = isLiquidRoute ? "Liquid Polygel" : "Polygel";
  const pricePerUnit = lookupPrice(priceMap, polygelSubcategoryKey, priceUnit);
  const [products, setProducts] = useState<CsvProduct[]>([]);
  const [draftQty, setDraftQty] = useState<Record<string, string>>({});
  const [imageAttemptByCode, setImageAttemptByCode] = useState<Record<string, number>>({});
  const [tubeColor, setTubeColor] = useState<TubeColor>("BLACK");
  const [tubeSize, setTubeSize] = useState<TubeSize>("30G");
  const [tubeLabel, setTubeLabel] = useState<TubeLabel>("PRINTED");
  const [validationMessage, setValidationMessage] = useState<string>("");
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
              image_url: row[index.image_url] ?? "",
              active: row[index.active] ?? "FALSE",
            } as CsvProduct;
          })
          .filter(
            (item) =>
              item.active.toUpperCase() === "TRUE" &&
              isPolygelCategory(item) &&
              matchesRouteCategory(location.pathname.toLowerCase(), item)
          );

        const fallbackProducts = isLiquidRoute ? buildFallbackLiquidPolygelProducts() : buildFallbackPolygelProducts();
        setProducts(sortProductsAlphabetically(parsed.length ? parsed : fallbackProducts));
        setImageAttemptByCode({});
      })
      .catch(() => {
        const fallbackProducts = isLiquidRoute ? buildFallbackLiquidPolygelProducts() : buildFallbackPolygelProducts();
        setProducts(sortProductsAlphabetically(fallbackProducts));
      });
  }, [isLiquidRoute, location.pathname]);

  const existingQtyByCode = useMemo(() => {
    const map: Record<string, number> = {};
    items
      .filter((item) => item.category === "POLYGEL")
      .forEach((item) => {
        map[item.code] = item.quantity;
      });
    return map;
  }, [items]);

  const uniformItems = useMemo<B2BUniformShadeItem[]>(() => {
    return products.map((product, index) => {
      const indexedCandidates = getIndexedCandidates(
        imageIndexByCode,
        product.code,
        isLiquidRoute ? liquidPolygelImagePrefixes : polygelImagePrefixes
      );
      const imageCandidates = Array.from(new Set([...indexedCandidates, ...getImageCandidates(product, isLiquidRoute)]));
      const nextImageIndex = imageAttemptByCode[product.code] ?? 0;
      const fallbackImage = fallbackProductImage;
      const image = imageCandidates[nextImageIndex] ?? fallbackImage;
      const draftedQty = draftQty[product.code];
      const existingQty = existingQtyByCode[product.code] ?? 0;

      return {
        id: `${product.code}-${index}`,
        code: product.code,
        name: product.product_name || "Polygel shade",
        family: product.subcategory || (isLiquidRoute ? "Liquid Polygel" : "Polygel"),
        moq: activeMoq,
        quantityValue:
          draftedQty !== undefined && draftedQty.trim().length > 0
            ? draftedQty
            : String(existingQty > 0 ? existingQty : activeMoq),
        imageSrc: image,
        imageAlt: product.product_name || product.code,
        isSelected: (existingQtyByCode[product.code] ?? 0) > 0,
        isMissingImage: image === fallbackImage,
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

          if (target.src.endsWith(fallbackImage)) return;
          target.src = fallbackImage;
        },
      };
    });
  }, [activeMoq, draftQty, existingQtyByCode, imageAttemptByCode, imageIndexByCode, isLiquidRoute, products]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-grey-primary">Polygels</h2>
        <p className="mt-1 text-sm text-grey-secondary">
          {isLiquidRoute
            ? "Select liquid polygel shades and quantities. MOQ is 25 pieces per colour."
            : "Select tube format and quantities. MOQ is 100 pieces per colour."}
        </p>
      </div>

      {!isLiquidRoute && buyerType !== "finished_goods" && (
        <div className="rounded-md border border-grey-card bg-grey-50 p-3 text-sm text-grey-secondary">
          Bulk polygel is supplied as raw material — no tube configuration is required.
        </div>
      )}

      {!isLiquidRoute && buyerType === "finished_goods" && (
        <section className="rounded-lg border-2 border-orange-400 bg-white p-4 shadow-sm">
          <div className="-mx-4 -mt-4 mb-4 flex items-center gap-2 bg-orange-400 px-4 py-2.5">
            <AlertTriangle className="h-4 w-4 flex-shrink-0 text-white" />
            <span className="text-sm font-bold uppercase tracking-wide text-white">Action Required — Tube Configuration</span>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <label className="text-sm font-medium text-grey-primary">
              Tube colour
              <select
                value={tubeColor}
                onChange={(event) => setTubeColor(event.target.value as TubeColor)}
                className="mt-1 w-full rounded-md border border-grey-card px-3 py-2 text-grey-primary"
              >
                {tubeColorOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm font-medium text-grey-primary">
              Tube size
              <select
                value={tubeSize}
                onChange={(event) => setTubeSize(event.target.value as TubeSize)}
                className="mt-1 w-full rounded-md border border-grey-card px-3 py-2 text-grey-primary"
              >
                {tubeSizeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm font-medium text-grey-primary">
              Label option
              <select
                value={tubeLabel}
                onChange={(event) => setTubeLabel(event.target.value as TubeLabel)}
                className="mt-1 w-full rounded-md border border-grey-card px-3 py-2 text-grey-primary"
              >
                {tubeLabelOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>
      )}

      <B2BUniformShadeGrid
        title={isLiquidRoute ? "Liquid Polygels" : "Polygels"}
        description={
          isLiquidRoute
            ? ""
            : ""
        }
        items={uniformItems}
        validationMessage={validationMessage}
        buyerType={isLiquidRoute ? buyerType : "finished_goods"}
        pricePerUnit={pricePerUnit}
        priceUnit={priceUnit}
        onQuantityChange={(id, value) => {
          const item = uniformItems.find((entry) => entry.id === id);
          if (!item) return;
          setDraftQty((prev) => ({ ...prev, [item.code]: value }));
        }}
        onSave={(id) => {
          const match = products.find((product, index) => `${product.code}-${index}` === id);
          if (!match) return;

          const raw = (draftQty[match.code] ?? String(existingQtyByCode[match.code] ?? activeMoq)).trim();
          const qty = Number.parseInt(raw, 10);

          const isBulkKg = buyerType === "bulk" && isLiquidRoute;
          const effectiveMoq = isBulkKg ? 1 : activeMoq;

          if (!Number.isFinite(qty) || qty < effectiveMoq) {
            const moqLabel = isBulkKg ? "1 kg" : `${activeMoq} pieces`;
            setValidationMessage(
              `MOQ for ${isLiquidRoute ? "liquid polygel" : "polygel"} is ${moqLabel} per colour. Use Clear to remove.`
            );
            return;
          }

          setValidationMessage("");

          const item = uniformItems.find((entry) => entry.id === id);
          const meta = {
            image: item?.imageSrc || null,
            subcategory: match.subcategory,
            moq: effectiveMoq,
            ...(isLiquidRoute
              ? {}
              : {
                  tube_color: tubeColor,
                  tube_size: tubeSize,
                  label_option: tubeLabel,
                }),
          };

          addOrUpdateItem({
            category: "POLYGEL",
            code: match.code,
            name: match.product_name,
            quantity: qty,
            unitType: isBulkKg ? "KG" : "PCS",
            meta,
          });
        }}
        onClear={(id) => {
          const match = products.find((product, index) => `${product.code}-${index}` === id);
          if (!match) return;
          setValidationMessage("");
          removeItem("POLYGEL", match.code);
          setDraftQty((prev) => {
            const next = { ...prev };
            delete next[match.code];
            return next;
          });
        }}
      />
    </div>
  );
}
