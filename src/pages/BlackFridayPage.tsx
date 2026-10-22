import { useEffect, useMemo, useRef, useState } from "react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import {
  BF_CATEGORIES,
  BF_COLOURS,
  BF_LEAD_TIME,
  BF_MIN_TOTAL_KG,
  BF_CURRENCY,
  BF_TERMS,
  bfIsColour,
  bfSwatchSrc,
  type BfCategory,
} from "../data/blackFridayOffer";
import { trackEvent } from "../lib/metaPixel";
import "../styles/black-friday.css";

const CART_KEY = "leeukopf-bf-2026-cart";
const MAX_KG_PER_COLOUR = 999;

type Cart = Record<string, number>;
type Filter = "all" | BfCategory;

const CATEGORY_KEYS = Object.keys(BF_CATEGORIES) as BfCategory[];

function loadCart(): Cart {
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Cart;
    const clean: Cart = {};
    for (const [code, kg] of Object.entries(parsed)) {
      if (bfIsColour(code) && Number.isInteger(kg) && kg > 0)
        clean[code] = Math.min(kg, MAX_KG_PER_COLOUR);
    }
    return clean;
  } catch {
    return {};
  }
}

function saveCart(cart: Cart) {
  try {
    window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch {
    /* storage unavailable — cart still works for this visit */
  }
}

const emptyForm = {
  companyName: "",
  contactName: "",
  email: "",
  phone: "",
  country: "",
  vat: "",
  invoiceAddress: "",
  invoiceCity: "",
  invoicePostalCode: "",
  sameAddress: true,
  shippingAddress: "",
  shippingCity: "",
  shippingPostalCode: "",
  notes: "",
  website: "", // honeypot
};

export default function BlackFridayPage() {
  const [cart, setCart] = useState<Cart>(() =>
    typeof window === "undefined" ? {} : loadCart(),
  );
  const [filter, setFilter] = useState<Filter>("all");
  const [form, setForm] = useState(emptyForm);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<{
    orderId: string;
    email: string;
  } | null>(null);
  // null = still checking; the on/off switch lives in Netlify (see netlify/functions/black-friday-order.ts)
  const [offerOpen, setOfferOpen] = useState<boolean | null>(null);
  const orderRef = useRef<HTMLElement>(null);
  const submitRef = useRef<HTMLDivElement>(null);
  const checkoutTracked = useRef(false);

  useEffect(() => {
    document.title =
      "Black Friday Offers — 1 kg Bulk Gel Polish | Leeukopf Laboratories";
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        "content",
        "Leeukopf Laboratories Black Friday: HEMA & TPO free gel polish in 1 kg bulk. Pick your colours, minimum 10 kg in total, lead time 5 to 8 working days.",
      );
  }, []);

  useEffect(() => saveCart(cart), [cart]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/black-friday-order", {
      headers: { Accept: "application/json" },
    })
      .then((r) => r.json())
      .then((d: { enabled?: boolean }) => {
        if (!cancelled) setOfferOpen(d.enabled !== false);
      })
      .catch(() => {
        // If the check fails, show the shop; the server still refuses orders when the offer is off.
        if (!cancelled) setOfferOpen(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const lines = useMemo(
    () =>
      BF_COLOURS.filter((c) => cart[c.code] > 0).map((c) => {
        const kg = cart[c.code];
        return { ...c, kg };
      }),
    [cart],
  );
  const groups = CATEGORY_KEYS.map((cat) => {
    const items = lines.filter((l) => l.category === cat);
    return {
      cat,
      items,
      kg: items.reduce((s, l) => s + l.kg, 0),
    };
  }).filter((g) => g.items.length > 0);

  const totalKg = lines.reduce((s, l) => s + l.kg, 0);
  const kgToGo = Math.max(0, BF_MIN_TOTAL_KG - totalKg);
  const meetsMin = totalKg >= BF_MIN_TOTAL_KG;

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: BF_COLOURS.length };
    for (const x of BF_COLOURS) c[x.category] = (c[x.category] ?? 0) + 1;
    return c;
  }, []);
  const visible =
    filter === "all"
      ? BF_COLOURS
      : BF_COLOURS.filter((c) => c.category === filter);

  function setKg(code: string, kg: number) {
    const next = Math.max(
      0,
      Math.min(MAX_KG_PER_COLOUR, Math.floor(Number.isFinite(kg) ? kg : 0)),
    );
    const prev = cart[code] ?? 0;
    setCart((c) => {
      const copy = { ...c };
      if (next === 0) delete copy[code];
      else copy[code] = next;
      return copy;
    });
    if (next > prev) {
      trackEvent("AddToCart", {
        content_ids: [code],
        content_type: "product",
        content_name: `Black Friday bulk ${code} 1kg`,
        num_items: next - prev,
      });
    }
    if (
      !checkoutTracked.current &&
      next > 0 &&
      totalKg - prev + next >= BF_MIN_TOTAL_KG
    ) {
      checkoutTracked.current = true;
      trackEvent("InitiateCheckout", {
        num_items: totalKg - prev + next,
        currency: BF_CURRENCY,
      });
    }
  }

  const update = <K extends keyof typeof emptyForm>(
    key: K,
    value: (typeof emptyForm)[K],
  ) => setForm((f) => ({ ...f, [key]: value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!lines.length) {
      setError("Choose at least one colour.");
      return;
    }
    if (!meetsMin) {
      setError(
        `The minimum order is ${BF_MIN_TOTAL_KG} kg in total across all colours — add ${kgToGo} kg more.`,
      );
      return;
    }
    if (!termsAccepted) {
      setError("Please read and accept the Black Friday terms.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/black-friday-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client: {
            companyName: form.companyName,
            contactName: form.contactName,
            email: form.email,
            phone: form.phone,
            country: form.country,
            vat: form.vat,
            invoiceAddress: form.invoiceAddress,
            invoiceCity: form.invoiceCity,
            invoicePostalCode: form.invoicePostalCode,
            sameAddress: form.sameAddress,
            shippingAddress: form.shippingAddress,
            shippingCity: form.shippingCity,
            shippingPostalCode: form.shippingPostalCode,
            notes: form.notes,
          },
          lines: lines.map((l) => ({ code: l.code, kg: l.kg })),
          website: form.website,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        success?: boolean;
        orderId?: string;
        message?: string;
        offerClosed?: boolean;
      };
      if (data.offerClosed) {
        setOfferOpen(false);
        return;
      }
      if (!res.ok || !data.success || !data.orderId) {
        throw new Error(
          data.message ||
            "Something went wrong sending your order. Please try again or email info@leeukopf.com.",
        );
      }
      trackEvent("Purchase", {
        content_ids: lines.map((l) => l.code),
        content_type: "product",
        num_items: totalKg,
      });
      setConfirmed({ orderId: data.orderId, email: form.email });
      setCart({});
      setForm(emptyForm);
      setTermsAccepted(false);
      orderRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bf">
      <Navigation />

      {/* Hero — PDF page 1 */}
      <header className="bf-hero">
        <img
          className="bf-hero__logo"
          src="/seasonal/black-friday/logo.png"
          alt="Leeukopf Laboratories — a proud Thermitek LTD partner brand"
          width={600}
          height={330}
        />
        <h1 className="bf-hero__title">BLACK FRIDAY</h1>
        <p className="bf-hero__offers">OFFERS</p>
        {offerOpen === false ? (
          <p className="bf-hero__sub">
            This year&apos;s Black Friday offer has ended. Thank you to everyone
            who ordered — for bulk and private-label enquiries, write to us at{" "}
            <a href="mailto:info@leeukopf.com" style={{ color: "#8891d0" }}>
              info@leeukopf.com
            </a>
            .
          </p>
        ) : (
          <>
            <p className="bf-hero__sub">
              Professional HEMA &amp; TPO free gel polish in 1 kg bulk, straight
              from the factory. Pick your colours, add as many kilos as you
              need, and we invoice you directly.
            </p>
            <button
              className="bf-btn bf-btn--blue"
              onClick={() =>
                orderRef.current?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Pick your colours
            </button>
          </>
        )}
      </header>

      {offerOpen !== false && (
        <>
          {/* Terms — PDF page 2 */}
          <section className="bf-terms" aria-labelledby="bf-terms-title">
            <div className="bf-terms__inner">
              <div>
                <h2 id="bf-terms-title" className="bf-terms__lead">
                  Lead time {BF_LEAD_TIME}.
                </h2>
                <p className="bf-terms__note">
                  Minimum order {BF_MIN_TOTAL_KG} kg in total — mix any colours
                  you like.
                  <br />
                  Each unit is a 1 kg bulk pack.
                  <br />
                  Terms &amp; conditions apply.
                </p>
              </div>
              <dl className="bf-facts">
                <div>
                  <dt>1 kg</dt>
                  <dd>every unit is a 1 kg bulk pack</dd>
                </div>
                <div>
                  <dt>{BF_MIN_TOTAL_KG} kg</dt>
                  <dd>minimum order in total — mix any colours</dd>
                </div>
                <div>
                  <dt>{BF_COLOURS.length}</dt>
                  <dd>colours, glitters, shimmers &amp; metallics</dd>
                </div>
              </dl>
            </div>
          </section>

          {/* Order builder — Studio One layout */}
          <section
            className="bf-shop"
            ref={orderRef}
            aria-labelledby="bf-shop-title"
          >
            <div className="bf-shop__inner">
              {confirmed ? (
                <div className="bf-done">
                  <p className="bf-eyebrow">Black Friday</p>
                  <h2 className="bf-shop__title">Order received!</h2>
                  <p>
                    Thank you — your order <strong>{confirmed.orderId}</strong>{" "}
                    has been sent to our team, and a confirmation is on its way
                    to <strong>{confirmed.email}</strong>.
                  </p>
                  <p>
                    Our accounts team will email you the invoice. Payment is by
                    bank transfer (TT), and the lead time is {BF_LEAD_TIME}.
                  </p>
                  <button
                    className="bf-btn bf-btn--dark"
                    onClick={() => setConfirmed(null)}
                  >
                    Place another order
                  </button>
                </div>
              ) : (
                <>
                  <header className="bf-shop__head">
                    <p className="bf-eyebrow">Black Friday</p>
                    <h2 id="bf-shop-title" className="bf-shop__title">
                      Pick your <span>colours</span>
                    </h2>
                    <p className="bf-shop__hint">
                      Every unit is 1 kg — add as many kilos of each colour as
                      you like.
                    </p>
                    <p className="bf-shop__min">
                      Minimum order {BF_MIN_TOTAL_KG} kg in total — any mix of colours
                    </p>
                  </header>

                  <div className="bf-how">
                    <div>
                      <p>Step 1</p>
                      <span>Choose your colours in 1 kg units</span>
                    </div>
                    <div>
                      <p>Step 2</p>
                      <span>Send your order — confirmation by email</span>
                    </div>
                    <div>
                      <p>Step 3</p>
                      <span>Receive our invoice and pay by bank transfer</span>
                    </div>
                  </div>

                  <form className="bf-cols" onSubmit={submit}>
                    {/* Left column: details */}
                    <div className="bf-col-details">
                      <h3 className="bf-step">1. Your details</h3>
                      <div className="bf-form">
                        <Field
                          label="Company / salon name"
                          value={form.companyName}
                          onChange={(v) => update("companyName", v)}
                          required
                          autoComplete="organization"
                        />
                        <Field
                          label="Contact name"
                          value={form.contactName}
                          onChange={(v) => update("contactName", v)}
                          required
                          autoComplete="name"
                        />
                        <Field
                          label="Email"
                          type="email"
                          value={form.email}
                          onChange={(v) => update("email", v)}
                          required
                          autoComplete="email"
                        />
                        <Field
                          label="Phone"
                          type="tel"
                          value={form.phone}
                          onChange={(v) => update("phone", v)}
                          required
                          autoComplete="tel"
                        />
                        <Field
                          label="Country"
                          value={form.country}
                          onChange={(v) => update("country", v)}
                          required
                          autoComplete="country-name"
                        />
                        <Field
                          label="VAT number (optional)"
                          value={form.vat}
                          onChange={(v) => update("vat", v)}
                        />
                        <Field
                          full
                          label="Invoice address"
                          value={form.invoiceAddress}
                          onChange={(v) => update("invoiceAddress", v)}
                          required
                          autoComplete="street-address"
                        />
                        <Field
                          label="City"
                          value={form.invoiceCity}
                          onChange={(v) => update("invoiceCity", v)}
                          required
                          autoComplete="address-level2"
                        />
                        <Field
                          label="Postal code"
                          value={form.invoicePostalCode}
                          onChange={(v) => update("invoicePostalCode", v)}
                          required
                          autoComplete="postal-code"
                        />

                        <label className="bf-check is-full">
                          <input
                            type="checkbox"
                            checked={form.sameAddress}
                            onChange={(e) =>
                              update("sameAddress", e.target.checked)
                            }
                          />
                          Ship to the invoice address
                        </label>

                        {!form.sameAddress && (
                          <>
                            <Field
                              id="bf-ship-address"
                              full
                              label="Shipping address"
                              value={form.shippingAddress}
                              onChange={(v) => update("shippingAddress", v)}
                              required
                            />
                            <Field
                              id="bf-ship-city"
                              label="City"
                              value={form.shippingCity}
                              onChange={(v) => update("shippingCity", v)}
                              required
                            />
                            <Field
                              id="bf-ship-postal"
                              label="Postal code"
                              value={form.shippingPostalCode}
                              onChange={(v) => update("shippingPostalCode", v)}
                              required
                            />
                          </>
                        )}

                        <div className="bf-field is-full">
                          <label htmlFor="bf-notes">Notes (optional)</label>
                          <textarea
                            id="bf-notes"
                            rows={3}
                            value={form.notes}
                            onChange={(e) => update("notes", e.target.value)}
                          />
                        </div>

                        <div className="bf-hp" aria-hidden="true">
                          <label htmlFor="bf-website">Website</label>
                          <input
                            id="bf-website"
                            tabIndex={-1}
                            autoComplete="off"
                            value={form.website}
                            onChange={(e) => update("website", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right column: colours + cart */}
                    <div className="bf-col-order">
                      {groups.length > 0 && (
                        <div className="bf-sofar">
                          <p className="bf-sofar__title">Your order so far</p>
                          {groups.map((g) => (
                            <div key={g.cat} className="bf-sofar__group">
                              <div className="bf-sofar__row">
                                <span>{BF_CATEGORIES[g.cat].label}</span>
                                <span>
                                  {g.kg} kg
                                </span>
                              </div>
                              <div className="bf-sofar__chips">
                                {g.items.map((it) => (
                                  <button
                                    type="button"
                                    key={it.code}
                                    className="bf-chip"
                                    title={`${it.code} — ${it.kg} kg (click to remove 1 kg)`}
                                    onClick={() => setKg(it.code, it.kg - 1)}
                                  >
                                    <img
                                      src={bfSwatchSrc(it.code)}
                                      alt={`Colour ${it.code}`}
                                    />
                                    <span className="bf-chip__qty">
                                      {it.kg}
                                    </span>
                                    <span className="bf-chip__code">
                                      {it.code}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <h3 className="bf-step">2. Choose your colours</h3>
                      <p className="bf-note">
                        Each unit is 1 kg. On-screen colours are a guide.
                      </p>

                      <div
                        className="bf-tabs"
                        role="group"
                        aria-label="Filter by category"
                      >
                        {(["all", ...CATEGORY_KEYS] as Filter[]).map((f) => (
                          <button
                            type="button"
                            key={f}
                            className="bf-tab"
                            aria-pressed={filter === f}
                            onClick={() => setFilter(f)}
                          >
                            {f === "all" ? "All" : BF_CATEGORIES[f].label}
                            <small>{counts[f]}</small>
                          </button>
                        ))}
                      </div>

                      <div className="bf-grid">
                        {visible.map((c) => {
                          const kg = cart[c.code] ?? 0;
                          return (
                            <div
                              key={c.code}
                              className={`bf-card${kg > 0 ? " is-selected" : ""}`}
                            >
                              <img
                                className="bf-card__img"
                                src={bfSwatchSrc(c.code)}
                                alt={`Gel polish colour ${c.code}`}
                                loading="lazy"
                                width={320}
                                height={320}
                              />
                              <p className="bf-card__code">{c.code}</p>
                              <p className="bf-card__meta">{BF_CATEGORIES[c.category].label}</p>
                              <Stepper
                                code={c.code}
                                kg={kg}
                                onChange={(v) => setKg(c.code, v)}
                              />
                            </div>
                          );
                        })}
                      </div>

                      <div className="bf-checkout" ref={submitRef}>
                        <div className="bf-total-row">
                          <span>Colours chosen</span>
                          <span>{lines.length}</span>
                        </div>
                        <div className="bf-total-row is-grand">
                          <span>Total</span>
                          <span>
                            {totalKg} kg / {BF_MIN_TOTAL_KG} kg minimum
                          </span>
                        </div>
                        <div className="bf-progress" aria-hidden="true">
                          <span
                            style={{
                              width: `${Math.min(100, (totalKg / BF_MIN_TOTAL_KG) * 100)}%`,
                            }}
                          />
                        </div>
                        <p className={`bf-min${meetsMin ? " is-met" : ""}`}>
                          {meetsMin
                            ? `Minimum of ${BF_MIN_TOTAL_KG} kg in total reached ✓`
                            : `Add ${kgToGo} kg more (any colours) to reach ${BF_MIN_TOTAL_KG} kg in total`}
                        </p>
                        <p className="bf-note">
                          Prices, VAT and shipping are confirmed on your invoice.
                        </p>

                        <div className="bf-tc">
                          <p className="bf-tc__title">
                            Black Friday — Terms &amp; Conditions
                          </p>
                          <ol>
                            {BF_TERMS.map((t) => (
                              <li key={t}>{t}</li>
                            ))}
                          </ol>
                        </div>

                        <label className="bf-check">
                          <input
                            type="checkbox"
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                          />
                          I have read and agree to the Black Friday Terms &amp;
                          Conditions above.
                        </label>

                        {error && (
                          <div className="bf-error" role="alert">
                            {error}
                          </div>
                        )}

                        <button
                          className="bf-btn bf-btn--blue bf-submit"
                          type="submit"
                          disabled={submitting || !termsAccepted}
                        >
                          {submitting ? "Sending order…" : "Place order"}
                        </button>
                        <p className="bf-note bf-center">
                          You won't be charged now — we'll email you an invoice
                          to pay by bank transfer.
                        </p>
                      </div>
                    </div>
                  </form>
                </>
              )}
            </div>
          </section>
        </>
      )}

      {/* Footer band — PDF page 4 */}
      <footer className="bf-footband">
        <div className="bf-footband__pattern">
          <img
            src="/seasonal/black-friday/logo.png"
            alt="Leeukopf Laboratories"
            width={600}
            height={330}
            loading="lazy"
          />
        </div>
        <div className="bf-footband__mail">
          <a href="mailto:info@leeukopf.com">INFO@LEEUKOPF.COM</a>
        </div>
        <div className="bf-footband__badges">
          <img
            src="/seasonal/black-friday/badges.png"
            alt="Cruelty Free International · HEMA & TPO free"
            width={814}
            height={238}
          />
        </div>
      </footer>

      <Footer />

      {/* Mobile order bar — the details form comes first on small screens */}
      {offerOpen !== false && !confirmed && totalKg > 0 && (
        <div className="bf-bar" role="region" aria-label="Order summary">
          <div className="bf-bar__inner">
            <div className="bf-bar__stats">
              <div className="bf-bar__line">
                <strong>{totalKg} kg</strong>
                <strong>{lines.length} colour{lines.length === 1 ? "" : "s"}</strong>
              </div>
              <div className="bf-bar__msg">
                {meetsMin
                  ? `${BF_MIN_TOTAL_KG} kg total reached ✓`
                  : `${kgToGo} kg more to reach ${BF_MIN_TOTAL_KG} kg in total`}
              </div>
            </div>
            <button
              type="button"
              className="bf-btn bf-btn--blue"
              onClick={() =>
                submitRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                })
              }
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Stepper({
  code,
  kg,
  onChange,
}: {
  code: string;
  kg: number;
  onChange: (kg: number) => void;
}) {
  return (
    <div className={`bf-stepper${kg > 0 ? " is-on" : ""}`}>
      <button
        type="button"
        aria-label={`Remove 1 kg of ${code}`}
        disabled={kg <= 0}
        onClick={() => onChange(kg - 1)}
      >
        −
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={0}
        max={MAX_KG_PER_COLOUR}
        value={kg}
        aria-label={`Kilos of ${code}`}
        onChange={(e) => onChange(parseInt(e.target.value, 10) || 0)}
      />
      <span>kg</span>
      <button
        type="button"
        aria-label={`Add 1 kg of ${code}`}
        onClick={() => onChange(kg + 1)}
      >
        +
      </button>
    </div>
  );
}

function Field(props: {
  id?: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
  full?: boolean;
  autoComplete?: string;
}) {
  const id =
    props.id ?? `bf-${props.label.toLowerCase().replace(/[^a-z]+/g, "-")}`;
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
