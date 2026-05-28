import { Link, useLocation } from "react-router-dom";
import { b2bCategories } from "../config/categories";
import B2BCategoryImageFrame from "../components/B2BCategoryImageFrame";
import { useB2BCart } from "../store/B2BCartContext";

export default function B2BDashboard() {
  const { getTotals } = useB2BCart();
  const totals = getTotals();
  const location = useLocation();
  const orderSuccess = (location.state as { orderSuccess?: boolean; orderId?: string } | null);

  const enabledCategories = b2bCategories.filter((cat) => cat.enabled && (cat.navChildren?.length ?? 0) > 0);

  return (
    <div className="space-y-8">
      {orderSuccess?.orderSuccess && (
        <section className="rounded-lg border border-green-200 bg-green-50 p-4">
          <h3 className="text-lg font-semibold text-green-800">Order received ✓</h3>
          {orderSuccess.orderId && (
            <p className="mt-1 text-sm text-green-700">Reference: <strong>{orderSuccess.orderId}</strong></p>
          )}
          <p className="mt-1 text-sm text-green-700">You will receive a confirmation email shortly. Our team will be in touch with your pro forma.</p>
        </section>
      )}

      {/* Utility links */}
      <section className="grid gap-3 sm:grid-cols-3">
        <Link
          to="/b2b/client-info"
          className="flex items-center gap-3 rounded-lg border border-grey-card bg-grey-offWhite p-4 transition-colors hover:border-primary-300 hover:bg-primary-50"
        >
          <span className="text-xl">👤</span>
          <div>
            <p className="text-sm font-semibold text-grey-primary">Client Info</p>
            <p className="text-xs text-grey-secondary">Your account details</p>
          </div>
        </Link>
        <Link
          to="/b2b/orders"
          className="flex items-center gap-3 rounded-lg border border-grey-card bg-grey-offWhite p-4 transition-colors hover:border-primary-300 hover:bg-primary-50"
        >
          <span className="text-xl">📋</span>
          <div>
            <p className="text-sm font-semibold text-grey-primary">My Orders</p>
            <p className="text-xs text-grey-secondary">View past orders</p>
          </div>
        </Link>
        <Link
          to="/b2b/checkout"
          className="flex items-center gap-3 rounded-lg border border-primary bg-primary p-4 text-white transition-colors hover:bg-primary-600"
        >
          <span className="text-xl">🛒</span>
          <div>
            <p className="text-sm font-semibold">Checkout</p>
            <p className="text-xs text-primary-100">{totals.totalLines} lines / {totals.totalQty} units</p>
          </div>
        </Link>
      </section>

      {/* Product category sections */}
      {enabledCategories.map((category) => (
        <section key={category.key}>
          <h2 className="mb-4 border-b border-grey-card pb-2 text-xl font-bold text-grey-primary">{category.label}</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {category.navChildren!.map((child) => {
              const imgSrc = child.imageSrc ?? category.imageSrc;
              return (
                <Link
                  key={child.routePath}
                  to={child.routePath}
                  className="overflow-hidden rounded-lg border border-grey-card transition-all hover:border-primary-300 hover:shadow-md"
                >
                  {child.swatchColour ? (
                    <div
                      className="h-36 w-full"
                      style={{ backgroundColor: child.swatchColour }}
                    />
                  ) : imgSrc ? (
                    <B2BCategoryImageFrame
                      src={imgSrc}
                      alt={child.imageAlt ?? child.label}
                      frameClassName="h-36"
                    />
                  ) : null}
                  <div className="p-3">
                    <p className="text-sm font-semibold text-grey-primary">{child.label}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
