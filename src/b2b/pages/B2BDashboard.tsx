import { Link, useLocation } from "react-router-dom";
import { b2bCategories } from "../config/categories";
import B2BCategoryImageFrame from "../components/B2BCategoryImageFrame";
import { useB2BCart } from "../store/B2BCartContext";

export default function B2BDashboard() {
  const { getTotals } = useB2BCart();
  const totals = getTotals();
  const location = useLocation();
  const orderSuccess = (location.state as { orderSuccess?: boolean; orderId?: string } | null);

  return (
    <div className="space-y-6">
      {orderSuccess?.orderSuccess ? (
        <section className="rounded-lg border border-green-200 bg-green-50 p-4">
          <h3 className="text-lg font-semibold text-green-800">Order received ✓</h3>
          {orderSuccess.orderId ? (
            <p className="mt-1 text-sm text-green-700">Reference: <strong>{orderSuccess.orderId}</strong></p>
          ) : null}
          <p className="mt-1 text-sm text-green-700">You will receive a confirmation email shortly. Our team will be in touch with your pro forma.</p>
        </section>
      ) : null}

      <section>
        <h2 className="text-2xl font-bold text-grey-primary">B2B Ordering Dashboard</h2>
        <p className="mt-1 text-sm text-grey-secondary">
          Build one inquiry across multiple categories. Your cart stays shared while you navigate.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {b2bCategories
          .filter((category) => category.enabled)
          .map((category) => (
            <Link
              key={category.key}
              to={category.routePath}
              className="overflow-hidden rounded-lg border border-grey-card transition-colors hover:border-primary-300 hover:bg-primary-50"
            >
              {category.imageSrc ? (
                <B2BCategoryImageFrame
                  src={category.imageSrc}
                  alt={category.imageAlt || category.label}
                  frameClassName="h-44"
                />
              ) : null}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-grey-primary">{category.label}</h3>
                <p className="mt-2 text-sm text-grey-secondary">Add items for {category.label.toLowerCase()}.</p>
              </div>
            </Link>
          ))}

        <Link
          to="/b2b/checkout"
          className="rounded-lg border border-primary bg-primary p-4 text-white transition-colors hover:bg-primary-600"
        >
          <h3 className="text-lg font-semibold">Checkout</h3>
          <p className="mt-2 text-sm text-primary-100">{totals.totalLines} lines / {totals.totalQty} total units</p>
        </Link>
      </section>
    </div>
  );
}
