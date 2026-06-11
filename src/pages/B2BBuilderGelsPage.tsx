import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";

type FormState = {
  companyName: string;
  vatNumber: string;

  invoiceAddress: string;
  invoicePostalCode: string;
  invoiceCity: string;
  invoiceRegion: string;
  invoiceCountry: string;

  shippingAddress: string;
  shippingPostalCode: string;
  shippingCity: string;
  shippingRegion: string;
  shippingCountry: string;

  contactPerson: string;
  contactEmail: string;
  contactNumber: string;

  orderDate: string;
  signatureName: string;
  notes: string;
};

const inputClass =
  "w-full rounded-md border border-black/20 bg-white px-3 py-2 outline-none focus:border-black/50";
const labelClass = "text-sm font-semibold";
const sectionClass = "rounded-xl border border-black/10 bg-white p-5";

export default function B2BCheckoutPage() {
  const navigate = useNavigate();
  const { state, clearCart } = useCart();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const items = state.items;

  const totals = useMemo(() => {
    const totalItems = items.length;
    const totalUnits = items.reduce((sum, it) => sum + (Number(it.qty) || 0), 0);
    return { totalItems, totalUnits };
  }, [items]);

  const [form, setForm] = useState<FormState>({
    companyName: "",
    vatNumber: "",
    invoiceAddress: "",
    invoicePostalCode: "",
    invoiceCity: "",
    invoiceRegion: "",
    invoiceCountry: "",
    shippingAddress: "",
    shippingPostalCode: "",
    shippingCity: "",
    shippingRegion: "",
    shippingCountry: "",
    contactPerson: "",
    contactEmail: "",
    contactNumber: "",
    orderDate: new Date().toISOString().slice(0, 10),
    signatureName: "",
    notes: "",
  });

  // Pre-fill form from client_registrations profile
  useEffect(() => {
    const email = user?.email?.trim().toLowerCase();
    if (!email) return;
    let active = true;
    supabase
      .from("client_registrations")
      .select("company, contact, email, phone, country, vat_eori, billing_address, shipping_address")
      .ilike("email", email)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (!active || !data) return;
        setForm((prev) => ({
          ...prev,
          companyName: prev.companyName || data.company || "",
          vatNumber: prev.vatNumber || data.vat_eori || "",
          contactPerson: prev.contactPerson || data.contact || "",
          contactEmail: prev.contactEmail || data.email || email,
          contactNumber: prev.contactNumber || data.phone || "",
          invoiceAddress: prev.invoiceAddress || data.billing_address || "",
          invoiceCountry: prev.invoiceCountry || data.country || "",
          shippingAddress: prev.shippingAddress || data.shipping_address || data.billing_address || "",
          shippingCountry: prev.shippingCountry || data.country || "",
          signatureName: prev.signatureName || data.contact || "",
        }));
      });
    return () => { active = false; };
  }, [user?.email]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): string | null {
    if (items.length === 0) return "Your cart is empty. Add items first.";

    if (!form.companyName.trim()) return "Company Name is required.";
    if (!form.vatNumber.trim()) return "VAT Number is required.";
    if (!form.contactPerson.trim()) return "Contact Person is required.";
    if (!form.contactEmail.trim()) return "Contact Email is required.";

    if (!form.invoiceAddress.trim()) return "Invoice Address is required.";
    if (!form.invoicePostalCode.trim()) return "Invoice Postal Code is required.";
    if (!form.invoiceCity.trim()) return "Invoice City is required.";
    if (!form.invoiceCountry.trim()) return "Invoice Country is required.";

    if (!form.shippingAddress.trim()) return "Shipping Address is required.";
    if (!form.shippingPostalCode.trim()) return "Shipping Postal Code is required.";
    if (!form.shippingCity.trim()) return "Shipping City is required.";
    if (!form.shippingCountry.trim()) return "Shipping Country is required.";

    if (!form.signatureName.trim()) return "Signature (Name) is required.";

    return null;
  }

  async function submitOrder() {
    const error = validate();
    if (error) {
      alert(error);
      return;
    }

    const payload = {
      customer: form,
      order: {
        items,
        totals,
      },
      createdAt: new Date().toISOString(),
      source: "B2B Builder Gels Checkout",
    };

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/submit-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result?.success) {
        throw new Error(result?.error || 'Failed to submit order');
      }

      alert(`Order submitted successfully. Reference: ${result.order_id}`);
      clearCart();
      navigate('/products');
    } catch (submitError) {
      console.error('B2B order submit failed:', submitError);
      alert('Order submission failed. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold">B2B Checkout</h1>
          <p className="text-black/70">
            Complete your company and delivery details, then submit the order.
          </p>
        </div>

        <button
          className="rounded-lg border border-black/20 bg-white px-4 py-2 font-semibold hover:bg-black/5"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
        {/* LEFT: FORM */}
        <div className="space-y-6">
          <div className={sectionClass}>
            <h2 className="text-xl font-extrabold mb-4">Client Information</h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <div className={labelClass}>Company Name *</div>
                <input
                  className={inputClass}
                  value={form.companyName}
                  onChange={(e) => update("companyName", e.target.value)}
                />
              </div>

              <div>
                <div className={labelClass}>VAT Number *</div>
                <input
                  className={inputClass}
                  value={form.vatNumber}
                  onChange={(e) => update("vatNumber", e.target.value)}
                />
              </div>

              <div>
                <div className={labelClass}>Contact Person *</div>
                <input
                  className={inputClass}
                  value={form.contactPerson}
                  onChange={(e) => update("contactPerson", e.target.value)}
                />
              </div>

              <div>
                <div className={labelClass}>Contact Email *</div>
                <input
                  className={inputClass}
                  value={form.contactEmail}
                  onChange={(e) => update("contactEmail", e.target.value)}
                />
              </div>

              <div>
                <div className={labelClass}>Contact Number</div>
                <input
                  className={inputClass}
                  value={form.contactNumber}
                  onChange={(e) => update("contactNumber", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className={sectionClass}>
            <h2 className="text-xl font-extrabold mb-4">Invoice Address</h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <div className={labelClass}>Invoice Address *</div>
                <input
                  className={inputClass}
                  value={form.invoiceAddress}
                  onChange={(e) => update("invoiceAddress", e.target.value)}
                />
              </div>

              <div>
                <div className={labelClass}>Postal Code *</div>
                <input
                  className={inputClass}
                  value={form.invoicePostalCode}
                  onChange={(e) => update("invoicePostalCode", e.target.value)}
                />
              </div>

              <div>
                <div className={labelClass}>City *</div>
                <input
                  className={inputClass}
                  value={form.invoiceCity}
                  onChange={(e) => update("invoiceCity", e.target.value)}
                />
              </div>

              <div>
                <div className={labelClass}>Region</div>
                <input
                  className={inputClass}
                  value={form.invoiceRegion}
                  onChange={(e) => update("invoiceRegion", e.target.value)}
                />
              </div>

              <div>
                <div className={labelClass}>Country *</div>
                <input
                  className={inputClass}
                  value={form.invoiceCountry}
                  onChange={(e) => update("invoiceCountry", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className={sectionClass}>
            <h2 className="text-xl font-extrabold mb-4">Shipping Address</h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <div className={labelClass}>Shipping Address *</div>
                <input
                  className={inputClass}
                  value={form.shippingAddress}
                  onChange={(e) => update("shippingAddress", e.target.value)}
                />
              </div>

              <div>
                <div className={labelClass}>Postal Code *</div>
                <input
                  className={inputClass}
                  value={form.shippingPostalCode}
                  onChange={(e) => update("shippingPostalCode", e.target.value)}
                />
              </div>

              <div>
                <div className={labelClass}>City *</div>
                <input
                  className={inputClass}
                  value={form.shippingCity}
                  onChange={(e) => update("shippingCity", e.target.value)}
                />
              </div>

              <div>
                <div className={labelClass}>Region</div>
                <input
                  className={inputClass}
                  value={form.shippingRegion}
                  onChange={(e) => update("shippingRegion", e.target.value)}
                />
              </div>

              <div>
                <div className={labelClass}>Country *</div>
                <input
                  className={inputClass}
                  value={form.shippingCountry}
                  onChange={(e) => update("shippingCountry", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className={sectionClass}>
            <h2 className="text-xl font-extrabold mb-4">Order Confirmation</h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <div className={labelClass}>Date of Order *</div>
                <input
                  type="date"
                  className={inputClass}
                  value={form.orderDate}
                  onChange={(e) => update("orderDate", e.target.value)}
                />
              </div>

              <div>
                <div className={labelClass}>Signature (Name) *</div>
                <input
                  className={inputClass}
                  value={form.signatureName}
                  onChange={(e) => update("signatureName", e.target.value)}
                  placeholder="Type your full name"
                />
              </div>

              <div className="md:col-span-2">
                <div className={labelClass}>Notes (optional)</div>
                <textarea
                  className={inputClass}
                  value={form.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                className="rounded-lg bg-black px-5 py-3 font-extrabold text-white hover:opacity-90"
                onClick={submitOrder}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Order'}
              </button>

              <button
                className="rounded-lg border border-black/20 bg-white px-5 py-3 font-bold hover:bg-black/5"
                onClick={clearCart}
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: ORDER SUMMARY */}
        <div className="space-y-6">
          <div className={sectionClass}>
            <h2 className="text-xl font-extrabold mb-2">Order Summary</h2>
            <div className="text-sm text-black/70 mb-4">
              Items: <b>{totals.totalItems}</b> • Total Units: <b>{totals.totalUnits}</b>
            </div>

            {items.length === 0 ? (
              <div className="rounded-lg border border-black/10 bg-black/5 p-4">
                Your cart is empty.
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((it, idx) => (
                  <div
                    key={it.key ?? `${it.groupCode}-${it.shadeCode}-${it.packSize}-${idx}`}
                    className="rounded-lg border border-black/10 bg-white p-3"
                  >
                    <div className="font-extrabold">{it.productName}</div>
                    <div className="text-sm text-black/70">
                      {it.groupCode} • Shade {it.shadeCode} • {it.packSize}
                    </div>
                    <div className="mt-1 text-sm">
                      Qty: <b>{it.qty}</b> (MOQ {it.moq})
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={sectionClass}>
            <h3 className="font-extrabold mb-2">Tip</h3>
            <p className="text-sm text-black/70">
              Next phase can send this order to a Google Sheet, email, or a secure Netlify Function.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
