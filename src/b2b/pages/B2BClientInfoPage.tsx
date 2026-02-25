import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";

type ClientRegistrationPrefill = {
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

type DisplayField = {
  label: string;
  value: string;
};

const EMPTY_VALUE = "—";

function formatDate(value?: string): string {
  if (!value) return EMPTY_VALUE;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString();
}

export default function B2BClientInfoPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [registration, setRegistration] = useState<ClientRegistrationPrefill | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      const email = user?.email?.trim().toLowerCase();
      if (!email) {
        if (active) {
          setRegistration(null);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      setError("");

      const { data, error: queryError } = await supabase
        .from("client_registrations")
        .select("company, contact, email, phone, country, vat_eori, billing_address, shipping_address, created_at")
        .ilike("email", email)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!active) return;

      if (queryError) {
        setError("Unable to load client profile details at the moment.");
        setRegistration(null);
        setLoading(false);
        return;
      }

      setRegistration((data as ClientRegistrationPrefill | null) ?? null);
      setLoading(false);
    };

    void load();
    return () => {
      active = false;
    };
  }, [user?.email]);

  const fields = useMemo<DisplayField[]>(() => {
    if (!registration) return [];

    return [
      { label: "Company Name", value: registration.company ?? EMPTY_VALUE },
      { label: "Contact Name", value: registration.contact ?? EMPTY_VALUE },
      { label: "Contact Email", value: registration.email ?? EMPTY_VALUE },
      { label: "Contact Number", value: registration.phone ?? EMPTY_VALUE },
      { label: "Country", value: registration.country ?? EMPTY_VALUE },
      { label: "VAT / EORI", value: registration.vat_eori ?? EMPTY_VALUE },
      { label: "Billing Address", value: registration.billing_address ?? EMPTY_VALUE },
      { label: "Shipping Address", value: registration.shipping_address ?? EMPTY_VALUE },
      { label: "Submitted", value: formatDate(registration.created_at) },
    ];
  }, [registration]);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-grey-primary">Client Information</h2>
        <p className="mt-1 text-sm text-grey-secondary">
          This page shows client profile details imported from the website registration submission.
        </p>
      </div>

      {loading ? (
        <div className="rounded-lg border border-grey-card bg-white p-4 text-sm text-grey-secondary">
          Loading client profile…
        </div>
      ) : null}

      {!loading && error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {!loading && !error && !registration ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          No client registration details were found for this portal account yet.
        </div>
      ) : null}

      {!loading && !error && registration ? (
        <section className="rounded-xl border border-grey-card bg-white p-4 sm:p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            {fields.map((field) => (
              <div key={field.label} className="rounded-lg border border-grey-card bg-grey-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-grey-secondary">{field.label}</p>
                <p className="mt-1 text-sm text-grey-primary break-words [overflow-wrap:anywhere]">{field.value || EMPTY_VALUE}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
