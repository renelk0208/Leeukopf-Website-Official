import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";

// NOTE: For this page to show orders, Supabase needs the following RLS policy on b2b_orders:
// CREATE POLICY "clients can view own orders" ON b2b_orders
//   FOR SELECT USING (contact_email = auth.email());

type OrderItem = {
  code: string;
  product_name: string;
  size: string;
  quantity: number;
};

type B2BOrder = {
  order_id: string;
  order_date: string;
  company_name: string;
  line_count: number;
  total_qty: number;
  status: string;
  items: OrderItem[];
};

function formatDate(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function B2BOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<B2BOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.email) return;

    setLoading(true);
    setError(null);

    supabase
      .from("b2b_orders")
      .select("order_id, order_date, company_name, line_count, total_qty, status, items")
      .eq("contact_email", user.email)
      .order("order_date", { ascending: false })
      .then(({ data, error: queryError }) => {
        if (queryError) {
          setError("Could not load orders. Please try again later.");
        } else {
          setOrders((data as B2BOrder[]) ?? []);
        }
        setLoading(false);
      });
  }, [user?.email]);

  if (loading) {
    return <p className="text-sm text-grey-secondary">Loading orders…</p>;
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
    );
  }

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-bold text-grey-primary">My Orders</h2>
        <p className="mt-1 text-sm text-grey-secondary">Your submitted B2B inquiries.</p>
      </section>

      {orders.length === 0 ? (
        <p className="text-sm text-grey-secondary">No orders found.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.order_id} className="rounded-lg border border-grey-card">
              <button
                type="button"
                className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-primary-50"
                onClick={() => setExpanded(expanded === order.order_id ? null : order.order_id)}
              >
                <div>
                  <p className="font-mono text-sm font-semibold text-grey-primary">{order.order_id}</p>
                  <p className="mt-0.5 text-xs text-grey-secondary">
                    {formatDate(order.order_date)} &middot; {order.line_count ?? order.items?.length ?? 0} lines &middot; {order.total_qty} units
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium capitalize text-primary">
                    {order.status}
                  </span>
                  <span className="text-grey-secondary">{expanded === order.order_id ? "▲" : "▼"}</span>
                </div>
              </button>

              {expanded === order.order_id && order.items?.length > 0 ? (
                <div className="border-t border-grey-card px-4 py-3">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-grey-secondary">
                        <th className="pb-2 font-medium">Code</th>
                        <th className="pb-2 font-medium">Product</th>
                        <th className="pb-2 font-medium">Size</th>
                        <th className="pb-2 text-right font-medium">Qty</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-grey-card">
                      {order.items.map((item, i) => (
                        <tr key={i}>
                          <td className="py-1.5 pr-4 font-mono text-xs text-grey-secondary">{item.code}</td>
                          <td className="py-1.5 pr-4 text-grey-primary">{item.product_name}</td>
                          <td className="py-1.5 pr-4 text-grey-secondary">{item.size || "—"}</td>
                          <td className="py-1.5 text-right text-grey-primary">{item.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
