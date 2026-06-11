import { Link, useLocation } from "react-router-dom";
import { b2bCategories } from "../config/categories";
import { useB2BCart } from "../store/B2BCartContext";

export default function B2BDashboard() {
  const { getTotals } = useB2BCart();
  const totals = getTotals();
  const location = useLocation();
  const orderSuccess = (location.state as { orderSuccess?: boolean; orderId?: string } | null);

  const enabledCategories = b2bCategories.filter((cat) => cat.enabled && (cat.navChildren?.length ?? 0) > 0);

  return (
    <div className="space-y-10">
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
                  className="group block overflow-hidden rounded-2xl shadow-md transition-shadow hover:shadow-lg"
                  style={{ perspective: '800px' }}
                >
                  <div className="relative overflow-hidden rounded-2xl" style={{ transformStyle: 'preserve-3d' }}>
                    {/* Image or colour swatch */}
                    {child.swatchColour ? (
                      <div
                        className="h-48 w-full transition-transform duration-300 group-hover:scale-105"
                        style={{ backgroundColor: child.swatchColour }}
                      />
                    ) : imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={child.imageAlt ?? child.label}
                        width={400}
                        height={192}
                        className="h-48 w-full object-cover block transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="h-48 w-full bg-grey-card" />
                    )}

                    {/* Gradient darkening on hover */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-2xl" />

                    {/* Frosted glass label overlaid at the bottom */}
                    <div className="absolute bottom-3 left-3 right-3 rounded-md bg-white/85 px-3 py-2 shadow-sm backdrop-blur-sm">
                      <p className="text-sm font-semibold text-slate-900 leading-tight">{child.label}</p>
                    </div>
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
