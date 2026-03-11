import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";

type ClientRegistration = {
  id?: string;
  company: string;
  contact: string;
  email: string;
  phone: string;
  country: string;
  vat_eori: string;
  billing_address: string;
  shipping_address: string;
  created_at?: string;
};

const EMPTY: Omit<ClientRegistration, "email"> = {
  company: "",
  contact: "",
  phone: "",
  country: "",
  vat_eori: "",
  billing_address: "",
  shipping_address: "",
};

type Field = {
  key: keyof ClientRegistration;
  label: string;
  multiline?: boolean;
};

const FIELDS: Field[] = [
  { key: "company", label: "Company Name" },
  { key: "contact", label: "Contact Name" },
  { key: "email", label: "Contact Email" },
  { key: "phone", label: "Contact Number" },
  { key: "country", label: "Country" },
  { key: "vat_eori", label: "VAT / EORI" },
  { key: "billing_address", label: "Billing Address", multiline: true },
  { key: "shipping_address", label: "Shipping Address", multiline: true },
];

export default function B2BClientInfoPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [existingId, setExistingId] = useState<string | null>(null);
  const [form, setForm] = useState<ClientRegistration>({ ...EMPTY, email: user?.email ?? "" });

  useEffect(() => {
    let active = true;

    const load = async () => {
      const email = user?.email?.trim().toLowerCase();
      if (!email) {
        if (active) setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      const { data, error: queryError } = await supabase
        .from("client_registrations")
        .select("id, company, contact, email, phone, country, vat_eori, billing_address, shipping_address, created_at")
        .ilike("email", email)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!active) return;

      if (queryError) {
        setError("Unable to load client profile details at the moment.");
        setLoading(false);
        return;
      }

      if (data) {
        setExistingId(data.id ?? null);
        setForm({
          id: data.id,
          company: data.company ?? "",
          contact: data.contact ?? "",
          email: data.email ?? email,
          phone: data.phone ?? "",
          country: data.country ?? "",
          vat_eori: data.vat_eori ?? "",
          billing_address: data.billing_address ?? "",
          shipping_address: data.shipping_address ?? "",
          created_at: data.created_at,
        });
      } else {
        setForm({ ...EMPTY, email });
      }

      setLoading(false);
    };

    void load();
    return () => { active = false; };
  }, [user?.email]);

  const handleChange = (key: keyof ClientRegistration, value: string) => {
    setSaveSuccess(false);
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    const email = user?.email?.trim().toLowerCase();
    if (!email) return;

    setSaving(true);
    setError("");
    setSaveSuccess(false);

    const payload = {
      company: form.company.trim(),
      contact: form.contact.trim(),
      email,
      phone: form.phone.trim(),
      country: form.country.trim(),
      vat_eori: form.vat_eori.trim(),
      billing_address: form.billing_address.trim(),
      shipping_address: form.shipping_address.trim(),
    };

    let queryError;

    if (existingId) {
      const { error } = await supabase
        .from("client_registrations")
        .update(payload)
        .eq("id", existingId);
      queryError = error;
    } else {
      const { data, error } = await supabase
        .from("client_registrations")
        .insert(payload)
        .select("id")
        .single();
      queryError = error;
      if (!error && data?.id) setExistingId(data.id);
    }

    setSaving(false);

    if (queryError) {
      setError("Failed to save changes. Please try again.");
    } else {
      setSaveSuccess(true);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-grey-primary">Client Information</h2>
        <p className="mt-1 text-sm text-grey-secondary">
          Update your company and contact details below. These are used on your orders.
        </p>
      </div>

      {loading ? (
        <div className="rounded-lg border border-grey-card bg-white p-4 text-sm text-grey-secondary">
          Loading client profile…
        </div>
      ) : (
        <section className="rounded-xl border border-grey-card bg-white p-4 sm:p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            {FIELDS.map((field) => (
              <div key={field.key} className={field.multiline ? "sm:col-span-2" : ""}>
                <label
                  htmlFor={`client-${field.key}`}
                  className="block text-xs font-semibold uppercase tracking-wide text-grey-secondary"
                >
                  {field.label}
                </label>
                {field.multiline ? (
                  <textarea
                    id={`client-${field.key}`}
                    rows={3}
                    value={form[field.key] as string}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    disabled={field.key === "email"}
                    className="mt-1 w-full rounded-md border border-grey-card px-3 py-2 text-sm text-grey-primary disabled:bg-grey-50 disabled:text-grey-secondary"
                  />
                ) : (
                  <input
                    id={`client-${field.key}`}
                    type="text"
                    value={form[field.key] as string}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    disabled={field.key === "email"}
                    className="mt-1 w-full rounded-md border border-grey-card px-3 py-2 text-sm text-grey-primary disabled:bg-grey-50 disabled:text-grey-secondary"
                  />
                )}
              </div>
            ))}
          </div>

          {error ? (
            <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          ) : null}

          {saveSuccess ? (
            <p className="mt-4 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
              Changes saved successfully.
            </p>
          ) : null}

          <div className="mt-5 flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-600 disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

