import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { BottlePackaging, CartItem, CartUnitType } from '../b2b/types';

type ClientRegistrationRecord = {
  company: string | null;
  contact: string | null;
  email: string | null;
  phone: string | null;
  country: string | null;
  vat_eori: string | null;
  billing_address: string | null;
  shipping_address: string | null;
  created_at: string;
};

type SolidOrderRecord = {
  id: string;
  order_id: string;
  order_date: string;
  created_at: string;
  company_name: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_number: string | null;
  vat: string | null;
  country: string | null;
  packaging_bottle_size: string | null;
  packaging_bottle_color: string | null;
  packaging_brush_type: string | null;
  packaging_system: string | null;
  lines: unknown;
  line_count: number;
  total_qty: number;
};

type ProfileView = {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  country: string;
  vat: string;
  billingAddress: string;
  shippingAddress: string;
};

type SavedCartState = {
  items: CartItem[];
  bottlePackaging: BottlePackaging | null;
};

type ApprovedClientRecord = {
  email: string;
};

const B2B_CART_STORAGE_KEY = 'leeukopf_b2b_cart_v1';

function toCartUnitType(value: unknown): CartUnitType {
  return value === 'KG' ? 'KG' : 'PCS';
}

function toCartItems(lines: unknown): CartItem[] {
  if (!Array.isArray(lines)) return [];

  return lines
    .map((line): CartItem | null => {
      if (!line || typeof line !== 'object') return null;

      const row = line as Record<string, unknown>;
      const code =
        (typeof row.code === 'string' && row.code) ||
        (typeof row.internalSku === 'string' && row.internalSku) ||
        (typeof row.sku === 'string' && row.sku) ||
        '';

      const rawQuantity =
        typeof row.quantity === 'number'
          ? row.quantity
          : typeof row.qty === 'number'
          ? row.qty
          : Number(row.quantity ?? row.qty ?? 0);

      const quantity = Number.isFinite(rawQuantity) ? Math.max(0, Math.floor(rawQuantity)) : 0;
      if (!code || quantity <= 0) return null;

      return {
        category: 'SOLID_GEL_POLISH',
        code,
        internalSku:
          typeof row.internalSku === 'string'
            ? row.internalSku
            : typeof row.sku === 'string'
            ? row.sku
            : undefined,
        name:
          typeof row.name === 'string'
            ? row.name
            : typeof row.productName === 'string'
            ? row.productName
            : undefined,
        quantity,
        unitType: toCartUnitType(row.unitType),
      };
    })
    .filter((item): item is CartItem => item !== null);
}

function parseBottlePackaging(order: SolidOrderRecord): BottlePackaging | null {
  const size = order.packaging_bottle_size;
  const color = order.packaging_bottle_color;
  const brush = order.packaging_brush_type;
  const branding = order.packaging_system;

  if ((size !== '10ML' && size !== '15ML') || (color !== 'BLACK' && color !== 'WHITE')) {
    return null;
  }

  if ((brush !== 'OVAL' && brush !== 'FLAT') || (branding !== 'PRE_PRINTED' && branding !== 'LABELS')) {
    return null;
  }

  return {
    size,
    color,
    brush,
    branding,
  };
}

function saveB2BCart(items: CartItem[], bottlePackaging: BottlePackaging | null) {
  if (typeof window === 'undefined') return;
  const payload: SavedCartState = { items, bottlePackaging };
  window.localStorage.setItem(B2B_CART_STORAGE_KEY, JSON.stringify(payload));
}

export default function ClientPortalDashboardPage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<ProfileView | null>(null);
  const [orders, setOrders] = useState<SolidOrderRecord[]>([]);
  const [accessDenied, setAccessDenied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reorderingOrderId, setReorderingOrderId] = useState<string | null>(null);

  const email = user?.email ?? '';

  const loadPortalData = useCallback(async () => {
    if (!email) return;

    setLoading(true);
    setError('');
    setAccessDenied(false);

    try {
      const approvedResult = await supabase
        .from('approved_clients')
        .select('email')
        .ilike('email', email)
        .maybeSingle();

      if (approvedResult.error) throw approvedResult.error;

      const approvedClient = approvedResult.data as ApprovedClientRecord | null;
      if (!approvedClient) {
        setAccessDenied(true);
        setProfile(null);
        setOrders([]);
        return;
      }

      const [registrationResult, ordersResult] = await Promise.all([
        supabase
          .from('client_registrations')
          .select('company, contact, email, phone, country, vat_eori, billing_address, shipping_address, created_at')
          .ilike('email', email)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from('solid_colour_orders')
          .select(
            'id, order_id, order_date, created_at, company_name, contact_name, contact_email, contact_number, vat, country, packaging_bottle_size, packaging_bottle_color, packaging_brush_type, packaging_system, lines, line_count, total_qty'
          )
          .ilike('contact_email', email)
          .order('created_at', { ascending: false })
          .limit(20),
      ]);

      if (registrationResult.error) throw registrationResult.error;
      if (ordersResult.error) throw ordersResult.error;

      const latestRegistration = registrationResult.data as ClientRegistrationRecord | null;
      const orderRows = (ordersResult.data ?? []) as SolidOrderRecord[];
      const latestOrder = orderRows[0] ?? null;

      setOrders(orderRows);
      setProfile({
        companyName: latestRegistration?.company ?? latestOrder?.company_name ?? '-',
        contactName: latestRegistration?.contact ?? latestOrder?.contact_name ?? '-',
        email: latestRegistration?.email ?? latestOrder?.contact_email ?? email,
        phone: latestRegistration?.phone ?? latestOrder?.contact_number ?? '-',
        country: latestRegistration?.country ?? latestOrder?.country ?? '-',
        vat: latestRegistration?.vat_eori ?? latestOrder?.vat ?? '-',
        billingAddress: latestRegistration?.billing_address ?? '-',
        shippingAddress: latestRegistration?.shipping_address ?? '-',
      });
    } catch (loadError: unknown) {
      if (loadError instanceof Error && loadError.message) {
        setError(loadError.message);
      } else {
        setError('Unable to load portal data.');
      }
    } finally {
      setLoading(false);
    }
  }, [email]);

  useEffect(() => {
    void loadPortalData();
  }, [loadPortalData]);

  const onReorder = (order: SolidOrderRecord) => {
    const mappedItems = toCartItems(order.lines);
    if (!mappedItems.length) {
      alert('No valid order lines found for this order.');
      return;
    }

    setReorderingOrderId(order.order_id);
    saveB2BCart(mappedItems, parseBottlePackaging(order));
    navigate('/b2b/checkout');
  };

  const hasOrders = useMemo(() => orders.length > 0, [orders.length]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="rounded-2xl border border-grey-card bg-white p-5 shadow-sm sm:p-6">
          <h1 className="text-3xl font-bold text-grey-primary">Leeukopf Client Portal</h1>
          <p className="mt-1 text-sm text-grey-secondary">Your saved profile details and previous orders.</p>
        </section>

        <section className="rounded-2xl border border-grey-card bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-grey-primary">Account</h2>
              <p className="text-sm text-grey-secondary">Signed in as {email || '-'}</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => navigate('/products')}
                className="rounded-md border border-grey-card px-3 py-2 text-sm font-semibold text-grey-primary hover:bg-grey-card/30"
              >
                Open products website
              </button>
              <button
                type="button"
                onClick={async () => {
                  await signOut();
                  navigate('/portal/login');
                }}
                className="rounded-md border border-primary-200 px-3 py-2 text-sm font-semibold text-primary hover:bg-primary-50"
              >
                Sign out
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-grey-card bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-2">
            <h3 className="text-lg font-semibold text-grey-primary">Saved client details</h3>
            <button
              type="button"
              onClick={() => void loadPortalData()}
              className="rounded-md border border-grey-card px-3 py-1.5 text-xs font-semibold text-grey-primary hover:bg-grey-card/30"
            >
              Refresh
            </button>
          </div>

          {loading ? <p className="text-sm text-grey-secondary">Loading...</p> : null}
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          {accessDenied ? (
            <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              Your login is not approved for portal access yet. Please contact Leeukopf support.
            </div>
          ) : null}

          {profile && !loading && !accessDenied ? (
            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <div><span className="font-semibold text-grey-primary">Company:</span> <span className="text-grey-secondary">{profile.companyName}</span></div>
              <div><span className="font-semibold text-grey-primary">Contact:</span> <span className="text-grey-secondary">{profile.contactName}</span></div>
              <div><span className="font-semibold text-grey-primary">Email:</span> <span className="text-grey-secondary">{profile.email}</span></div>
              <div><span className="font-semibold text-grey-primary">Phone:</span> <span className="text-grey-secondary">{profile.phone}</span></div>
              <div><span className="font-semibold text-grey-primary">Country:</span> <span className="text-grey-secondary">{profile.country}</span></div>
              <div><span className="font-semibold text-grey-primary">VAT/EORI:</span> <span className="text-grey-secondary">{profile.vat}</span></div>
              <div><span className="font-semibold text-grey-primary">Billing:</span> <span className="text-grey-secondary">{profile.billingAddress}</span></div>
              <div><span className="font-semibold text-grey-primary">Shipping:</span> <span className="text-grey-secondary">{profile.shippingAddress}</span></div>
            </div>
          ) : null}
        </section>

        <section className="rounded-2xl border border-grey-card bg-white p-5 shadow-sm sm:p-6">
          <h3 className="text-lg font-semibold text-grey-primary">Order history</h3>
          <p className="mt-1 text-sm text-grey-secondary">Use reorder to load a previous order directly into B2B checkout.</p>

          {!loading && !hasOrders && !accessDenied ? (
            <p className="mt-4 text-sm text-grey-secondary">No orders found for this email yet.</p>
          ) : null}

          {hasOrders && !accessDenied ? (
            <div className="mt-4 space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="rounded-lg border border-grey-card p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="text-sm text-grey-secondary">
                      <div className="text-base font-semibold text-grey-primary">Order {order.order_id}</div>
                      <div>Date: {order.order_date}</div>
                      <div>Lines: {order.line_count} • Qty: {order.total_qty}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onReorder(order)}
                      disabled={reorderingOrderId === order.order_id}
                      className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {reorderingOrderId === order.order_id ? 'Loading...' : 'Reorder'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
