import React from "react";
import { productCategories } from "../../data/productCategories";

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
              <a
                key={category.id}
                href={`${hrefBase}/${category.key}`}
                className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#A3005A] rounded-2xl"
              >
                <article className="h-full flex flex-col rounded-2xl bg-white/90 shadow-sm border border-neutral-100 overflow-hidden transition-transform transition-shadow duration-200 ease-out group-hover:-translate-y-1 group-hover:shadow-lg">
                  <div className="relative w-full aspect-square overflow-hidden bg-neutral-100">
                    <img
                      src={category.imagePath}
                      alt={category.displayName}
                      loading="lazy"
                      className="w-full h-full object-cover fade-in-image group-hover:scale-[1.03] transition-transform duration-300 ease-out"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.src = "/img/placeholders/category-placeholder.jpg";
                        target.alt = `${category.displayName} (image coming soon)`;
                      }}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/5 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>

                  <div className="px-4 pt-4 pb-5 flex flex-col flex-1 items-center text-center">
                    <h3 className="text-base md:text-lg font-semibold tracking-tight">
                      {category.displayName}
                    </h3>
                    <p className="mt-1 text-xs md:text-sm text-neutral-500">
                      Click to view the full range.
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium tracking-wide text-[#A3005A] group-hover:underline">
                      Explore category
                      <span aria-hidden="true">›</span>
                    </span>
                  </div>
                </article>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductCategoryGrid;
