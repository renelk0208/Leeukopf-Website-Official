import { useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  const location = useLocation();
  const totals = getTotals();
  const [showChangeBuyerModal, setShowChangeBuyerModal] = useState(false);

  const isDashboard = location.pathname === "/b2b" || location.pathname === "/b2b/";

  const handleLogout = async () => {
    clearCart();
    clearBuyerType();
    await signOut();
    navigate("/portal/login");
  };

  const buyerLabel = buyerType === "finished_goods" ? "Finished Goods" : buyerType === "bulk" ? "Bulk" : null;

  return (
    <div className="min-h-screen bg-grey-offWhite">
      <header className="sticky top-0 z-30 border-b border-grey-card bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <Link to="/b2b" className="hover:opacity-75 transition-opacity">
              <h1 className="text-2xl font-bold text-grey-primary">B2B Portal</h1>
            </Link>
            <p className="text-sm text-grey-secondary">{totals.totalLines} items / {totals.totalQty} total units</p>
          </div>
          <div className="flex items-center gap-3">
            {!isAdminStaff && buyerLabel && (
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
            {!isAdminStaff && (
              <Link
                to="/b2b/checkout"
                className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600"
              >
                Checkout ({totals.totalLines})
              </Link>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="hidden sm:inline-flex items-center rounded-md border border-grey-card px-3 py-2 text-sm font-medium text-grey-secondary hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              Log out
            </button>
          </div>
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

      <div className="mx-auto w-full max-w-screen-2xl px-4 py-6 sm:px-6">
        {!isDashboard && (
          <div className="mb-4">
            <Link
              to="/b2b"
              className="inline-flex items-center gap-1.5 rounded-md border border-grey-card bg-white px-3 py-1.5 text-sm font-medium text-grey-secondary hover:border-primary-300 hover:text-primary transition-colors"
            >
              ← All Categories
            </Link>
          </div>
        )}
        <main className="rounded-xl border border-grey-card bg-white p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
