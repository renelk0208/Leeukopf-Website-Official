import { useState } from "react";
import { BF_COUNTRIES, bfIsEu } from "../../data/bfCountries";

export interface ViesResult {
  status: "valid" | "invalid" | "unavailable" | "not_eu";
  name: string | null;
  address: string | null;
  checkedAt: string;
}

export interface SavedContact {
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postalCode: string;
  country: string;
  vatNumber: string;
  vies: ViesResult;
}

export interface SavedBasket {
  token: string;
  status: "open" | "ordered";
  orderId: string | null;
  contact: SavedContact;
  lines: Array<{ code: string; kg: number }>;
  totalKg: number;
  totalEur: number;
}

const empty = {
  firstName: "",
  lastName: "",
  companyName: "",
  email: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  postalCode: "",
  country: "",
  vatNumber: "",
  website: "", // honeypot
};

type FormState = typeof empty;

export function viesText(v: ViesResult) {
  switch (v.status) {
    case "valid":
      return `✓ Valid in VIES${v.name ? ` — ${v.name}` : ""}`;
    case "invalid":
      return "✗ Not valid in VIES — please check the number.";
    case "unavailable":
      return "VIES is not answering right now — you can still register and we will check it ourselves.";
    default:
      return "";
  }
}

/** Full registration form. Saves the registration together with the current basket. */
export function BfRegistration({
  lines,
  onRegistered,
}: {
  lines: Array<{ code: string; kg: number }>;
  onRegistered: (b: SavedBasket) => void;
}) {
  const [form, setForm] = useState<FormState>(empty);
  const [vies, setVies] = useState<ViesResult | null>(null);
  const [checking, setChecking] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResend, setShowResend] = useState(false);
  const [resendEmail, setResendEmail] = useState("");
  const [resendDone, setResendDone] = useState(false);

  const eu = bfIsEu(form.country);
  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (k === "vatNumber" || k === "country") setVies(null);
  };

  async function checkVat() {
    if (!form.vatNumber.trim() || !eu) return;
    setChecking(true);
    try {
      const r = await fetch("/api/black-friday-basket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "vies", country: form.country, vatNumber: form.vatNumber }),
      });
      const d = (await r.json()) as { vies?: ViesResult };
      if (d.vies) {
        setVies(d.vies);
        if (d.vies.status === "valid" && d.vies.name && !form.companyName) {
          setForm((f) => ({ ...f, companyName: d.vies!.name! }));
        }
      }
    } catch {
      setVies({ status: "unavailable", name: null, address: null, checkedAt: "" });
    } finally {
      setChecking(false);
    }
  }

  async function register(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const { website, ...contact } = form;
      const r = await fetch("/api/black-friday-basket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "register", contact, lines, website }),
      });
      const d = (await r.json().catch(() => ({}))) as {
        success?: boolean;
        basket?: SavedBasket | null;
        message?: string;
        field?: string;
      };
      if (d.field === "vatNumber") setVies({ status: "invalid", name: null, address: null, checkedAt: "" });
      if (!r.ok || !d.success || !d.basket) {
        throw new Error(d.message || "We could not save your registration. Please try again.");
      }
      onRegistered(d.basket);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function resend(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/black-friday-basket", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "resend", email: resendEmail }),
    }).catch(() => undefined);
    setResendDone(true);
  }

  return (
    <div className="bf-reg" id="bf-register">
      <h3 className="bf-step">2. Register to save your basket</h3>
      <p className="bf-note">
        Register once with your business details. Your basket is saved, so you can come back and finish your order any
        time — we also email you a link to it.
      </p>

      <form className="bf-form" onSubmit={register}>
        <Input label="Name" value={form.firstName} onChange={(v) => set("firstName", v)} required autoComplete="given-name" />
        <Input label="Surname" value={form.lastName} onChange={(v) => set("lastName", v)} required autoComplete="family-name" />
        <Input full label="Company / salon name" value={form.companyName} onChange={(v) => set("companyName", v)} autoComplete="organization" />
        <Input label="Email" type="email" value={form.email} onChange={(v) => set("email", v)} required autoComplete="email" />
        <Input label="Contact number" type="tel" value={form.phone} onChange={(v) => set("phone", v)} required autoComplete="tel" />
        <Input full label="Address line 1" value={form.addressLine1} onChange={(v) => set("addressLine1", v)} required autoComplete="address-line1" />
        <Input full label="Address line 2" value={form.addressLine2} onChange={(v) => set("addressLine2", v)} autoComplete="address-line2" />
        <Input label="City" value={form.city} onChange={(v) => set("city", v)} required autoComplete="address-level2" />
        <Input label="Postal code" value={form.postalCode} onChange={(v) => set("postalCode", v)} required autoComplete="postal-code" />

        <div className="bf-field is-full">
          <label htmlFor="bf-reg-country">Country *</label>
          <select
            id="bf-reg-country"
            value={form.country}
            required
            autoComplete="country-name"
            onChange={(e) => set("country", e.target.value)}
          >
            <option value="">Choose your country</option>
            {BF_COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="bf-field is-full">
          <label htmlFor="bf-reg-vat">
            VAT number{eu ? " *" : " (optional)"}
          </label>
          <div className="bf-vat">
            <input
              id="bf-reg-vat"
              value={form.vatNumber}
              required={eu}
              placeholder={eu ? "e.g. BG123456789" : ""}
              onChange={(e) => set("vatNumber", e.target.value)}
              onBlur={checkVat}
            />
            {eu && (
              <button type="button" className="bf-btn bf-btn--dark" onClick={checkVat} disabled={checking || !form.vatNumber.trim()}>
                {checking ? "Checking…" : "Check VIES"}
              </button>
            )}
          </div>
          {eu && !vies && <p className="bf-note bf-vat__hint">EU businesses: we check your VAT number in the EU VIES system.</p>}
          {vies && vies.status !== "not_eu" && (
            <p className={`bf-vies is-${vies.status}`} role="status">
              {viesText(vies)}
            </p>
          )}
        </div>

        <div className="bf-hp" aria-hidden="true">
          <label htmlFor="bf-reg-website">Website</label>
          <input id="bf-reg-website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => set("website", e.target.value)} />
        </div>

        {error && (
          <div className="bf-error is-full" role="alert">
            {error}
          </div>
        )}

        <button className="bf-btn bf-btn--blue is-full" type="submit" disabled={saving || vies?.status === "invalid"}>
          {saving ? "Saving…" : "Register & save my basket"}
        </button>
      </form>

      <div className="bf-reg__returning">
        {!showResend ? (
          <button type="button" className="bf-link" onClick={() => setShowResend(true)}>
            Already registered? Email me the link to my basket
          </button>
        ) : resendDone ? (
          <p className="bf-note">If that email is registered, a link to your basket is on its way.</p>
        ) : (
          <form className="bf-resend" onSubmit={resend}>
            <input
              type="email"
              required
              placeholder="Your email"
              aria-label="Your email"
              value={resendEmail}
              onChange={(e) => setResendEmail(e.target.value)}
            />
            <button className="bf-btn bf-btn--dark" type="submit">
              Send link
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

/** Shown instead of the form once the customer is registered. */
export function BfRegisteredCard({ basket, onSignOut }: { basket: SavedBasket; onSignOut: () => void }) {
  const c = basket.contact;
  return (
    <div className="bf-reg bf-regcard">
      <h3 className="bf-step">2. Your details</h3>
      <p className="bf-regcard__saved">✓ Registered — your basket is saved</p>
      <dl>
        <dt>Name</dt>
        <dd>
          {c.firstName} {c.lastName}
          {c.companyName ? ` · ${c.companyName}` : ""}
        </dd>
        <dt>Email</dt>
        <dd>{c.email}</dd>
        <dt>Contact number</dt>
        <dd>{c.phone}</dd>
        <dt>Address</dt>
        <dd>
          {c.addressLine1}
          {c.addressLine2 ? `, ${c.addressLine2}` : ""}
          <br />
          {c.postalCode} {c.city}, {c.country}
        </dd>
        {c.vatNumber && (
          <>
            <dt>VAT</dt>
            <dd>
              {c.vatNumber}
              {c.vies.status !== "not_eu" && <span className={`bf-vies is-${c.vies.status}`}> {viesText(c.vies)}</span>}
            </dd>
          </>
        )}
      </dl>
      <button type="button" className="bf-link" onClick={onSignOut}>
        Not you? Register with different details
      </button>
    </div>
  );
}

function Input(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
  full?: boolean;
  autoComplete?: string;
}) {
  const id = `bf-reg-${props.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <div className={`bf-field${props.full ? " is-full" : ""}`}>
      <label htmlFor={id}>
        {props.label}
        {props.required ? " *" : ""}
      </label>
      <input
        id={id}
        type={props.type ?? "text"}
        value={props.value}
        required={props.required}
        autoComplete={props.autoComplete}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
}
