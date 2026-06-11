import React from "react";
import { productCategories } from "../../data/productCategories";
import { getImage, productPlaceholder } from "../../config/imageMap";
import ProductCategoryCard3D from "./ProductCategoryCard3D";

type ProductCategoryGridProps = {
  group: string;
  title?: string;
  subtitle?: string;
  basePath?: string; // e.g. "/products/gel-polish"
};

const ProductCategoryGrid: React.FC<ProductCategoryGridProps> = ({
  group,
  title,
  subtitle,
  basePath,
}) => {
  const categories = productCategories.filter(
    (cat) => cat.group === group
  );

  const effectiveTitle = title ?? group;
  const effectiveSubtitle =
    subtitle ?? "Explore our curated ranges, ready for your private label.";
  const hrefBase = basePath ?? "/products";

  if (categories.length === 0) {
    return (
      <section className="w-full py-10">
        <div className="max-w-6xl mx-auto px-4">
          <header className="mb-4 text-center">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
              {effectiveTitle}
            </h2>
          </header>
          <div className="py-8 text-center text-sm text-neutral-500">
            No categories available in this group yet.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-10">
      <div className="max-w-6xl mx-auto px-4">
        <header className="mb-6 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            {effectiveTitle}
          </h2>
          {effectiveSubtitle && (
            <p className="mt-2 text-sm md:text-base text-neutral-500">
              {effectiveSubtitle}
            </p>
          )}
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            // Developer safeguard: warn about missing images in dev mode
            if (!category.imagePath && import.meta.env.DEV) {
              console.warn("Missing imagePath for category:", category);
            }
            
            return (
              <ProductCategoryCard3D
                key={category.id}
                title={category.displayName}
                subtitle="Click to view the full range."
                imageSrc={category.imagePath || getImage(category.key)}
                href={`${hrefBase}/${category.key}`}
                alt={category.displayName}
                fallbackSrc={productPlaceholder['default']}
                className="focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#A3005A]"
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductCategoryGrid;
