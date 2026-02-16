# Builder Gel Catalog - Phase 1 Documentation

## Overview
Phase 1 implements the foundational data structure for the B2B Builder Gel ordering system. This includes the catalog data file, TypeScript types, and helper functions to access the catalog.

## Files Created

### 1. `data/catalog.builder-gel.json`
The catalog data file containing all builder gel products. Each entry includes:
- `groupCode`: Unique identifier for the product group (e.g., "UGI-LM")
- `productName`: Display name of the product (e.g., "GLOWING BUILDER GEL")
- `allowedPackSizes`: Array of available sizes (e.g., ["15g", "30g", "50g"])
- `moq`: Minimum Order Quantity per color (default: 25)
- `shades`: Array of available shade codes (e.g., ["01", "02", "03"])

### 2. `src/types/catalog.ts`
TypeScript type definitions for the catalog structure:
```typescript
interface CatalogEntry {
  groupCode: string;
  productName: string;
  allowedPackSizes: string[];
  moq: number;
  shades: string[];
}
```

### 3. `src/lib/catalog.ts`
Helper functions to load and access catalog data:
- `getBuilderGelCatalog()`: Returns complete catalog (with caching)
- `getCatalogEntry(groupCode)`: Returns specific product entry
- `clearCatalogCache()`: Clears the cache (for testing)

## Usage Example

```typescript
import { getCatalogEntry } from './lib/catalog';

async function displayProduct() {
  const product = await getCatalogEntry('UGI-LM');
  
  if (product) {
    console.log(product.productName); // "GLOWING BUILDER GEL"
    console.log(product.moq);         // 25
    console.log(product.shades);      // ["01", "02", "03", "04", "05"]
  }
}
```

## Current Catalog Products

1. **UGI-LM** - GLOWING BUILDER GEL
2. **3IN1-BUILDER** - 3-IN-1 BUILDER GEL
3. **3PHASE-BUILDER** - 3-PHASE BUILDER GEL
4. **BIAB-BUILDER** - BIAB BUILDER IN A BOTTLE
5. **FIBER-BUILDER** - PREMIUM FIBERGLASS BUILDER GEL
6. **THIXO-BUILDER** - THIXOTROPIC BUILDER GEL

## Next Phases

Phase 1 provides the foundation. Future phases will add:
- Phase 2: Cart state management (CartContext)
- Phase 3: OrderTable UI component
- Phase 4: CartDrawer side panel
- Phase 5: Checkout page
- Phase 6: Integration into product pages
- Phase 7: Testing and validation

## Testing

To verify the catalog loader works correctly:

```typescript
import { getBuilderGelCatalog, getCatalogEntry } from './lib/catalog';

// Load all entries
const catalog = await getBuilderGelCatalog();
console.log(`Found ${catalog.length} products`);

// Get specific product
const product = await getCatalogEntry('UGI-LM');
if (product) {
  console.log(`Product: ${product.productName}`);
  console.log(`MOQ: ${product.moq}`);
  console.log(`Available sizes: ${product.allowedPackSizes.join(', ')}`);
}
```
