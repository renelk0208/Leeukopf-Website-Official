import { Link } from "react-router-dom";
import { b2bCategories } from "../config/categories";
import { useB2BCart } from "../store/B2BCartContext";

export default function B2BDashboard() {
  const { getTotals } = useB2BCart();
  const totals = getTotals();

  return (
    <div className="space-y-6">
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
              className="rounded-lg border border-grey-card p-4 transition-colors hover:border-primary-300 hover:bg-primary-50"
            >
              <h3 className="text-lg font-semibold text-grey-primary">{category.label}</h3>
              <p className="mt-2 text-sm text-grey-secondary">Add items for {category.label.toLowerCase()}.</p>
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
