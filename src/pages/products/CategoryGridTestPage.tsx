import PageTemplate from '../../components/PageTemplate';
import ProductCategoryGrid from '../../components/products/ProductCategoryGrid';

/**
 * Test page to demonstrate ProductCategoryGrid component usage
 * This shows how to use the generic grid for different product groups
 */
export default function CategoryGridTestPage() {
  return (
    <PageTemplate
      title="Product Category Grid - Test Page"
      subtitle="Testing the new generic ProductCategoryGrid component with different groups"
      breadcrumbs={[
        { label: 'Home', path: '/' },
        { label: 'Products', path: '/products' },
        { label: 'Category Grid Test' }
      ]}
    >
      {/* Gel Polish Group */}
      <ProductCategoryGrid
        group="Gel Polish"
        title="Gel Polish Collections"
        subtitle="From solids to glitters and pastels, discover our professional gel polish families."
        basePath="/products/gel-polish"
      />

      {/* Builder Gels Group */}
      <ProductCategoryGrid
        group="Builder Gels"
        title="Builder Gel Systems"
        subtitle="High-performance builder systems designed for strength, structure, and control."
        basePath="/products/builder-gels"
      />

      {/* Primers & Liquids Group */}
      <ProductCategoryGrid
        group="Primers & Liquids"
        title="Primers & Liquids"
        subtitle="Essential prep and support liquids for long-lasting, salon-grade results."
        basePath="/products/primers-and-liquids"
      />

      {/* Accessories Group */}
      <ProductCategoryGrid
        group="Accessories"
        title="Accessories & Nail Art"
        subtitle="Professional accessories and creative products for advanced services."
        basePath="/products/accessories"
      />
    </PageTemplate>
  );
}
