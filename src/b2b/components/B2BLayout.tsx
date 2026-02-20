import type { ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import { b2bCategories } from "../config/categories";
import { useB2BCart } from "../store/B2BCartContext";

type B2BLayoutProps = {
  children: ReactNode;
};

export default function B2BLayout({ children }: B2BLayoutProps) {
  const { getTotals } = useB2BCart();
  const totals = getTotals();

  const navItems = [
    { label: "Dashboard", path: "/b2b" },
    ...b2bCategories
      .filter((category) => category.enabled)
      .map((category) => ({ label: category.label, path: category.routePath })),
    { label: "Checkout", path: "/b2b/checkout" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">B2B Portal</h1>
            <p className="text-sm text-gray-600">{totals.totalLines} items / {totals.totalQty} total units</p>
          </div>
          <Link
            to="/b2b/checkout"
            className="inline-flex items-center rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Checkout ({totals.totalLines})
          </Link>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-screen-2xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="h-fit rounded-xl border border-gray-200 bg-white p-3 lg:sticky lg:top-24">
          <nav className="space-y-1" aria-label="B2B portal navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/b2b"}
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100"
                  }`
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

        <main className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
