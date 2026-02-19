import type { Product } from '../types/order';
import { categories, resolveOrderCategoryKey } from '../config/categories';

/**
 * Parse a CSV line handling quoted values and commas within quotes
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  // Add last field
  result.push(current.trim());

  return result;
}

/**
 * Load and parse products from CSV data
 * Handles quoted values, commas inside quotes, and Windows line endings
 * Filters to active products only
 */
export async function loadProducts(): Promise<Product[]> {
  try {
    // Fetch the CSV file from public directory
    const response = await fetch('/products.csv');
    if (!response.ok) {
      throw new Error(`Failed to load products: ${response.statusText}`);
    }

    const csvText = await response.text();
    
    // Split by line endings (handle both Unix and Windows)
    const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== '');

    if (lines.length === 0) {
      return [];
    }

    // Parse header
    const header = parseCSVLine(lines[0]);
    
    // Find column indices
    const columnMap: Record<string, number> = {};
    header.forEach((col, index) => {
      columnMap[col.toLowerCase()] = index;
    });

    // Parse data rows
    const products: Product[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      
      // Skip if not enough columns
      if (values.length < header.length) {
        continue;
      }

      const product: Product = {
        category: values[columnMap['category']] || '',
        subcategory: values[columnMap['subcategory']] || '',
        product_name: values[columnMap['product_name']] || '',
        code: values[columnMap['code']] || '',
        size: values[columnMap['size']] || '',
        unit: values[columnMap['unit']] || '',
        price: values[columnMap['price']] || '0',
        moq: values[columnMap['moq']] || '1',
        image_url: values[columnMap['image_url']] || '',
        notes: values[columnMap['notes']] || '',
        active: values[columnMap['active']] || 'FALSE',
      };

      // Filter: only active products with non-empty code
      const isActive = product.active.toUpperCase() === 'TRUE';
      const hasCode = product.code.trim() !== '';
      const resolvedCategoryKey = resolveOrderCategoryKey(product.category);

      if (isActive && hasCode && resolvedCategoryKey) {
        products.push({
          ...product,
          category: categories[resolvedCategoryKey].label,
        });
      } else if (isActive && hasCode && import.meta.env.DEV && !resolvedCategoryKey) {
        console.warn(`[B2B] Excluding product with unmapped category: "${product.category}" (${product.code})`);
      }
    }

    return products;
  } catch (error) {
    console.error('Error loading products:', error);
    throw error;
  }
}

/**
 * Get unique categories from products
 */
export function getCategories(products: Product[]): string[] {
  const categories = new Set<string>();
  products.forEach(p => {
    if (p.category) {
      categories.add(p.category);
    }
  });
  return Array.from(categories).sort();
}

/**
 * Filter products by category
 */
export function filterByCategory(products: Product[], category: string): Product[] {
  if (!category || category === 'All') {
    return products;
  }
  return products.filter(p => p.category === category);
}

/**
 * Search products by name or code
 */
export function searchProducts(products: Product[], query: string): Product[] {
  if (!query || query.trim() === '') {
    return products;
  }

  const lowerQuery = query.toLowerCase().trim();
  return products.filter(p => 
    p.product_name.toLowerCase().includes(lowerQuery) ||
    p.code.toLowerCase().includes(lowerQuery)
  );
}
