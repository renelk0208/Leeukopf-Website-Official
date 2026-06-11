# Builder Gel Catalog - Phase 1 Documentation

## Overview
Phase 1 implements the foundational data structure for the B2B Builder Gel ordering system. This includes the catalog data file, TypeScript types, and helper functions to access the catalog with **case-insensitive lookup**.

## Files Created

### 1. `data/catalog.builder-gel.json`
The catalog data file containing builder gel products. Each entry includes:
- `groupCode`: Unique identifier for the product group (e.g., "UGI-LM")
- `productName`: Display name of the product (e.g., "GLOWING BUILDER GEL")
- `allowedPackSizes`: Array of available sizes (e.g., ["15g","30g","50g"])
- `moq`: Minimum Order Quantity per color (25)
- `shades`: Array of available shade codes (e.g., ["01","02","03","04"])

**Current Products:**
1. **UGI-LM** - GLOWING BUILDER GEL (4 shades: 01, 02, 03, 04)
2. **UGI** - ICE BUILDER GEL (3 shades: 01, 02, 03)
3. **Y2-UGI-PR** - PEARLESCENT BUILDER GEL (2 shades: 01, 02)

**Important:** groupCode does NOT include the prefix "3-in-1-builder-gels-". It matches only what comes after that prefix in filenames.  
Example: "3-in-1-builder-gels-UGI-LM.jpg" → groupCode: "UGI-LM"

### 2. `src/types/catalog.ts`
TypeScript type definitions for the catalog structure:
```typescript
export interface CatalogEntry {
  groupCode: string;
  productName: string;
  allowedPackSizes: string[];
  moq: number;
  shades: string[];
}

export type BuilderGelCatalog = CatalogEntry[];
```

### 3. `src/lib/catalog.ts`
Helper functions to load and access catalog data:
- `getBuilderGelCatalog()`: Returns complete catalog (with caching)
- `getCatalogEntry(groupCode)`: Returns specific product entry (**case-insensitive**)
- `clearCatalogCache()`: Clears the cache (for testing)

## Usage Example

```typescript
import { getCatalogEntry } from './lib/catalog';

async function displayProduct() {
  // Case-insensitive lookup - all these work:
  const product1 = await getCatalogEntry('UGI-LM');
  const product2 = await getCatalogEntry('ugi-lm');
  const product3 = await getCatalogEntry('Ugi-Lm');
  
  if (product1) {
    console.log(product1.productName); // "GLOWING BUILDER GEL"
    console.log(product1.moq);         // 25
    console.log(product1.shades);      // ["01", "02", "03", "04"]
  }
}
```

## Case-Insensitive Search

The `getCatalogEntry` function performs case-insensitive matching. All of these return the same product:

```typescript
getCatalogEntry('UGI-LM')    // ✓ Exact match
getCatalogEntry('ugi-lm')    // ✓ Lowercase
getCatalogEntry('Ugi-Lm')    // ✓ Mixed case
getCatalogEntry('UGI')       // ✓ Different product
getCatalogEntry('y2-ugi-pr') // ✓ With digits and hyphens
```

## Scope

This implementation is **Phase 1 only**. The following are intentionally NOT included:
- ❌ Cart management (CartContext)
- ❌ UI components (OrderTable, CartDrawer)
- ❌ Checkout page
- ❌ Form validation
- ❌ Order submission

These will be implemented in subsequent phases.

## Verification

All requirements have been met and tested:
- ✅ Catalog JSON with exact 3 products as specified
- ✅ TypeScript types exported with all required fields
- ✅ Loader functions: `getBuilderGelCatalog()` and `getCatalogEntry()`
- ✅ Case-insensitive search working correctly
- ✅ groupCode follows correct pattern (no prefix)
- ✅ No UI components created (Phase 1 only)
- ✅ Build passes successfully

## Testing

To verify the catalog loader works correctly:

```typescript
import { getBuilderGelCatalog, getCatalogEntry } from './lib/catalog';

// Test 1: Load all entries
const catalog = await getBuilderGelCatalog();
console.log(`Found ${catalog.length} products`); // 3

// Test 2: Get specific product (case-insensitive)
const product = await getCatalogEntry('ugi-lm');
if (product) {
  console.log(`Product: ${product.productName}`);
  console.log(`MOQ: ${product.moq}`);
  console.log(`Available sizes: ${product.allowedPackSizes.join(', ')}`);
}

// Test 3: Case variations
const test1 = await getCatalogEntry('UGI-LM');    // ✓ Works
const test2 = await getCatalogEntry('ugi');       // ✓ Works
const test3 = await getCatalogEntry('Y2-ugi-PR'); // ✓ Works
```

## Next Phases (Future Work)

When ready, the following phases can be implemented:
- Phase 2: Cart Context & State Management
- Phase 3: OrderTable Component
- Phase 4: CartDrawer Component
- Phase 5: Checkout Page
- Phase 6: Integration & Routing
- Phase 7: Testing & Validation
