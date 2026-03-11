import type { ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import { b2bCategories } from "../config/categories";
import { useB2BCart } from "../store/B2BCartContext";

type B2BLayoutProps = {
  children: ReactNode;
};

export default function B2BLayout({ children }: B2BLayoutProps) {
  const { getTotals, buyerType, setBuyerType } = useB2BCart();
  const totals = getTotals();

  const buyerLabel = buyerType === "finished_goods" ? "Finished Goods" : buyerType === "bulk" ? "Bulk" : null;

  type NavEntry = { type: "link"; label: string; path: string; isSubcategory?: boolean };

  // Build category nav entries preserving the order defined in b2bCategories
  const categoryEntries: NavEntry[] = [];

  b2bCategories
    .filter((category) => category.enabled)
    .forEach((category) => {
      if (category.navChildren?.length) {
        category.navChildren.forEach((child) => {
          categoryEntries.push({
            type: "link",
            label: child.label,
            path: child.routePath,
            isSubcategory: true,
          });
        });
        return;
      }
      categoryEntries.push({
        type: "link",
        label: category.label,
        path: category.routePath,
      });
    });

  const navItems: NavEntry[] = [
    { type: "link", label: "Dashboard", path: "/b2b" },
    { type: "link", label: "Client Info", path: "/b2b/client-info" },
    { type: "link", label: "My Orders", path: "/b2b/orders" },
    ...categoryEntries,
    { type: "link", label: "Checkout", path: "/b2b/checkout" },
  ];

  return (
    <div className="min-h-screen bg-grey-offWhite">
      <header className="sticky top-0 z-30 border-b border-grey-card bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <h1 className="text-2xl font-bold text-grey-primary">B2B Portal</h1>
            <p className="text-sm text-grey-secondary">{totals.totalLines} items / {totals.totalQty} total units</p>
          </div>
          <div className="flex items-center gap-3">
            {buyerLabel && (
              <div className="hidden items-center gap-2 sm:flex">
                <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700">
                  {buyerLabel}
                </span>
                <button
                  onClick={() => {
                    const next = buyerType === "finished_goods" ? "bulk" : "finished_goods";
                    setBuyerType(next);
                  }}
                  className="text-xs text-grey-secondary underline hover:text-primary"
                >
                  Change
                </button>
              </div>
            )}
            <Link
              to="/b2b/checkout"
              className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600"
            >
              Checkout ({totals.totalLines})
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-screen-2xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="h-fit rounded-xl border border-grey-card bg-white p-3 lg:sticky lg:top-24">
          <nav className="space-y-1" aria-label="B2B portal navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/b2b"}
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    item.isSubcategory ? "ml-3" : ""
                  } ${isActive ? "bg-primary text-white" : "text-grey-primary hover:bg-primary-50"}`
                }
              >
                  <span>{item.label}</span>
                  {item.path === "/b2b/checkout" && totals.totalLines > 0 ? (
                    <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-white">
                      {totals.totalLines}
                    </span>
                  ) : null}
                </NavLink>
            ))}
          </nav>
        </aside>

        <main className="rounded-xl border border-grey-card bg-white p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
