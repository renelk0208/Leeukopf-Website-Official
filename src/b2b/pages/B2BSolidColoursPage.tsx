import { useCallback } from "react";
import InternalSolidColourGrid, { type InternalSolidColourSyncItem } from "../../pages/InternalSolidColourGrid";
import { useB2BCart } from "../store/B2BCartContext";

function toSolidOrderCode(code: string, internalSku?: string): string {
  const source = (internalSku || code || "").trim();
  const match = source.match(/^LC-GP-(\d+)$/i);
  if (match) {
    return "Solid Gel Polish";
  }
  return code;
}

export default function B2BSolidColoursPage() {
  const { items, addOrUpdateItem, removeItem } = useB2BCart();

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

  return <InternalSolidColourGrid onSelectionSync={handleSelectionSync} disableClientInfoLock />;
}
