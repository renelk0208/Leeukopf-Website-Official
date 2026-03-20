import { useState, type ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { b2bCategories } from "../config/categories";
import { useB2BCart } from "../store/B2BCartContext";
import { useAuth } from "../../contexts/AuthContext";

type B2BLayoutProps = {
  children: ReactNode;
  isAdminStaff?: boolean;
};

export default function B2BLayout({ children, isAdminStaff = false }: B2BLayoutProps) {
  const { getTotals, buyerType, clearBuyerType, clearCart } = useB2BCart();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const totals = getTotals();
  const [showChangeBuyerModal, setShowChangeBuyerModal] = useState(false);

  const handleLogout = async () => {
    clearCart();
    clearBuyerType();
    await signOut();
    navigate("/portal/login");
  };

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

  const navItems: NavEntry[] = isAdminStaff
    ? categoryEntries
    : [
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
          {!isAdminStaff && (
          <div className="flex items-center gap-3">
            {buyerLabel && (
              <div className="hidden items-center gap-2 sm:flex">
                <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700">
                  {buyerLabel}
                </span>
                <button
                  type="button"
                  onClick={() => setShowChangeBuyerModal(true)}
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
          )}
        </div>
      </header>

      {showChangeBuyerModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="change-buyer-dialog-title"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h2 id="change-buyer-dialog-title" className="text-lg font-bold text-grey-primary">
              Change Buyer Type?
            </h2>
            <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              <strong>Warning:</strong> Changing your buyer type will clear your entire cart and reset all selections.
              MOQ rules will change — Bulk orders are by the <strong>kilogram</strong>, Finished Goods orders are by the <strong>piece</strong>.
            </div>
            <p className="mt-3 text-sm text-grey-secondary">
              Are you sure you want to switch? You will need to re-add all items under the new buyer type.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowChangeBuyerModal(false)}
                className="rounded-md border border-grey-card px-4 py-2 text-sm font-semibold text-grey-primary hover:bg-grey-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  clearCart();
                  clearBuyerType();
                  setShowChangeBuyerModal(false);
                }}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                Yes, clear cart &amp; change
              </button>
            </div>
          </div>
        </div>
      )}

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
            <div className="mt-2 border-t border-grey-card pt-2">
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-grey-secondary hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                Log out
              </button>
            </div>
          </nav>
        </aside>

        <main className="rounded-xl border border-grey-card bg-white p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
