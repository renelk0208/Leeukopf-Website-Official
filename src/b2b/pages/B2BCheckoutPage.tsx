import { useEffect, useMemo, useState } from "react";
import { useB2BCart } from "../store/B2BCartContext";
import type { BottleBranding, BottleColor, BottleSize, BrushType, CartItem, JarPackaging, JarSize } from "../types";
import { getB2BCategoryLabel } from "../config/categories";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";

type PortalProfile = {
  company: string | null;
  contact: string | null;
  email: string | null;
  phone: string | null;
  country: string | null;
  vat_eori: string | null;
  billing_address: string | null;
  shipping_address: string | null;
};

const bottleSizes: Array<{ value: BottleSize; label: string }> = [
  { value: "10ML", label: "10ml" },
  { value: "15ML", label: "15ml" },
  { value: "OTHER", label: "Other (discuss with us)" },
];

const bottleColors: Array<{ value: BottleColor; label: string }> = [
  { value: "BLACK", label: "Black" },
  { value: "WHITE", label: "White" },
  { value: "OTHER", label: "Other (discuss with us)" },
];

const brushTypes: Array<{ value: BrushType; label: string }> = [
  { value: "OVAL", label: "Oval" },
  { value: "FLAT", label: "Flat" },
];

const brandings: Array<{ value: BottleBranding; label: string }> = [
  { value: "PRE_PRINTED", label: "Pre-printed" },
  { value: "LABELS", label: "Labels" },
];

const jarSizes: Array<{ value: JarSize; label: string }> = [
  { value: "30G", label: "30g" },
  { value: "40G", label: "40g" },
  { value: "OTHER", label: "Other (discuss with us)" },
];

const jarColors: Array<{ value: BottleColor; label: string }> = [
  { value: "WHITE", label: "White" },
  { value: "BLACK", label: "Black" },
  { value: "OTHER", label: "Other (discuss with us)" },
];
function toCsvValue(input: string | number | undefined): string {
  if (input === undefined) return "";
  const value = String(input);
  if (value.includes(",") || value.includes("\"") || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function mapPackagingCsv(value: string): string {
  return value.toLowerCase().replace(/_/g, "-");
}

function getMetaString(item: CartItem, key: string): string {
  const value = item.meta?.[key];
  return typeof value === "string" ? value : "";
}

function downloadCsv(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.setAttribute("download", filename);
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

function clearSolidColourSelectionCache() {
  if (typeof window === "undefined") return;

  const keys = [
    "lk_selected_solid_shades",
    "lk_selected_solid_shades_order",
    "lk_selected_solid_shades_qty",
    "solidColourOrder1200",
  ];

  keys.forEach((key) => {
    window.localStorage.removeItem(key);
  });
}

export default function B2BCheckoutPage() {
  const { user } = useAuth();
  const {
    items,
    bottlePackaging,
    jarPackaging,
    setBottlePackaging,
    clearBottlePackaging,
    setJarPackaging,
    clearJarPackaging,
    clearCart,
    removeItem,
    setQuantity,
    getTotals,
    getFilledUnitsTotal,
    getBottleUnitsRequired,
    isPrePrintedMinOk,
  } = useB2BCart();

  const [packagingDraft, setPackagingDraft] = useState<{
    size: BottleSize | "";
    color: BottleColor | "";
    brush: BrushType | "";
    branding: BottleBranding | "";
  }>({
    size: "",
    color: "",
    brush: "",
    branding: "",
  });

  const [jarDraft, setJarDraft] = useState<{
    size: JarSize | "";
    color: BottleColor | "";
    branding: BottleBranding | "";
  }>({
    size: "",
    color: "",
    branding: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [profile, setProfile] = useState<PortalProfile | null>(null);

  useEffect(() => {
    if (bottlePackaging) {
      setPackagingDraft(bottlePackaging);
      return;
    }
    setPackagingDraft({
      size: "",
      color: "",
      brush: "",
      branding: "",
    });
  }, [bottlePackaging]);

  useEffect(() => {
    if (jarPackaging) {
      setJarDraft(jarPackaging);
      return;
    }
    setJarDraft({ size: "", color: "", branding: "" });
  }, [jarPackaging]);

  useEffect(() => {
    const email = user?.email?.trim().toLowerCase();
    if (!email) return;

    let isActive = true;

    const loadProfile = async () => {
      const { data, error } = await supabase
        .from("client_registrations")
        .select("company, contact, email, phone, country, vat_eori, billing_address, shipping_address")
        .ilike("email", email)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!isActive) return;
      if (error) {
        console.error("Failed to load checkout profile:", error);
        return;
      }

      setProfile((data as PortalProfile | null) ?? null);
    };

    void loadProfile();

    return () => {
      isActive = false;
    };
  }, [user?.email]);

  const groupedItems = useMemo(() => {
    const groups = new Map<string, CartItem[]>();
    items.forEach((item) => {
      const key = item.category;
      const current = groups.get(key) ?? [];
      current.push(item);
      groups.set(key, current);
    });
    return Array.from(groups.entries());
  }, [items]);

  const totals = getTotals();
  const filledUnitsTotal = getFilledUnitsTotal();
  const bottleUnitsRequired = getBottleUnitsRequired();
  const prePrintedMinOk = isPrePrintedMinOk();
  const hasQuantityError = items.some((item) => item.quantity <= 0);
  const hasBuilderGelItems = items.some((item) => item.category === "BUILDER_GEL");
  const hasBottleItems = items.some((item) => item.category !== "BUILDER_GEL" && item.category !== "POLYGEL");
  const requiresBottlePackaging = hasBottleItems;
  const requiresJarPackaging = hasBuilderGelItems;
  const isPackagingSelected =
    (!requiresBottlePackaging || bottlePackaging !== null) &&
    (!requiresJarPackaging || jarPackaging !== null);

  const canProceed = isPackagingSelected && !hasQuantityError && prePrintedMinOk;

  const exportCsv = () => {
    if (!canProceed) return;

    const header = [
      "category",
      "code",
      "internal_sku",
      "name",
      "quantity",
      "unit_type",
      "bottle_size",
      "bottle_color",
      "brush_type",
      "branding",
      "jar_size",
      "jar_colour",
      "jar_branding",
      "tube_size",
      "tube_color",
      "label_option",
    ];

    const rows = items.map((item) => {
      const isJar = item.category === "BUILDER_GEL";
      const isPolygel = item.category === "POLYGEL";
      return [
        getB2BCategoryLabel(item.category),
        item.code,
        item.internalSku ?? "",
        item.name ?? "",
        item.quantity,
        item.unitType ?? "PCS",
        // bottle columns
        !isJar && !isPolygel && bottlePackaging ? mapPackagingCsv(bottlePackaging.size) : "",
        !isJar && !isPolygel && bottlePackaging ? mapPackagingCsv(bottlePackaging.color) : "",
        !isJar && !isPolygel && bottlePackaging ? mapPackagingCsv(bottlePackaging.brush) : "",
        !isJar && !isPolygel && bottlePackaging ? mapPackagingCsv(bottlePackaging.branding) : "",
        // jar columns
        isJar && jarPackaging ? mapPackagingCsv(jarPackaging.size) : "",
        isJar && jarPackaging ? mapPackagingCsv(jarPackaging.color) : "",
        isJar && jarPackaging ? mapPackagingCsv(jarPackaging.branding) : "",
        // polygel columns
        isPolygel ? mapPackagingCsv(getMetaString(item, "tube_size")) : "",
        isPolygel ? mapPackagingCsv(getMetaString(item, "tube_color")) : "",
        isPolygel ? mapPackagingCsv(getMetaString(item, "label_option")) : "",
      ];
    });

    const csv = [header, ...rows].map((row) => row.map((cell) => toCsvValue(cell)).join(",")).join("\n");
    const stamp = new Date().toISOString().slice(0, 10);
    downloadCsv(csv, `b2b-cart-${stamp}.csv`);
  };

  const submit = async () => {
    if (!canProceed) return;

    const customerEmail = profile?.email?.trim() || user?.email?.trim() || "";
    const companyName = profile?.company?.trim() || "";
    const contactName = profile?.contact?.trim() || "";

    if (!customerEmail || !companyName) {
      setSubmitMessage({
        type: "error",
        text: "Missing client profile details. Please complete client registration or contact support.",
      });
      return;
    }

    const polygelNotes = items
      .filter((item) => item.category === "POLYGEL")
      .map((item) => {
        const tubeSize = getMetaString(item, "tube_size") || "";
        const tubeColor = getMetaString(item, "tube_color") || "";
        const labelOption = getMetaString(item, "label_option") || "";
        return `${item.code}: size ${tubeSize || "-"}, color ${tubeColor || "-"}, label ${labelOption || "-"}`;
      });

    const payload = {
      customer: {
        companyName,
        vatNumber: profile?.vat_eori || "",
        invoiceAddress: profile?.billing_address || "",
        invoicePostalCode: "",
        invoiceCity: "",
        invoiceRegion: "",
        invoiceCountry: profile?.country || "",
        shippingAddress: profile?.shipping_address || profile?.billing_address || "",
        shippingPostalCode: "",
        shippingCity: "",
        shippingRegion: "",
        shippingCountry: profile?.country || "",
        contactPerson: contactName,
        contactEmail: customerEmail,
        contactNumber: profile?.phone || "",
        orderDate: new Date().toISOString().slice(0, 10),
        signatureName: contactName || companyName,
        notes: [
          bottlePackaging
            ? `Portal bottle packaging preference: Size ${bottlePackaging.size}, Color ${bottlePackaging.color}, Brush ${bottlePackaging.brush}, Branding ${bottlePackaging.branding}`
            : "",
          jarPackaging
            ? `Builder gel jar packaging preference: Size ${jarPackaging.size}, Colour ${jarPackaging.color}, Branding ${jarPackaging.branding}`
            : "",
          polygelNotes.length > 0 ? `Polygel tube selections: ${polygelNotes.join(" | ")}` : "",
        ].filter(Boolean).join("\n"),
      },
      order: {
        items: items.map((item) => ({
          groupCode: item.category,
          shadeCode: item.internalSku || item.code,
          packSize: item.category === "POLYGEL" ? (getMetaString(item, "tube_size") || "") : item.category === "BUILDER_GEL" ? (jarPackaging?.size || "") : (bottlePackaging?.size || ""),
          qty: item.quantity,
          moq: 0,
          productName: item.name || item.code,
        })),
        totals: {
          totalItems: totals.totalLines,
          totalUnits: totals.totalQty,
        },
      },
      createdAt: new Date().toISOString(),
      source: "B2B Portal Checkout",
    };

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const response = await fetch("/api/submit-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json().catch(() => ({}))) as {
        success?: boolean;
        order_id?: string;
        message?: string;
        email_sent?: boolean;
        error?: string;
      };

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to submit order.");
      }

      setSubmitMessage({
        type: data.email_sent === false ? "error" : "success",
        text: `${data.message || 'Order submitted successfully'}${data.order_id ? ` Reference: ${data.order_id}` : ''}`,
      });
      clearCart();
      clearSolidColourSelectionCache();
    } catch (error) {
      setSubmitMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to submit order.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const setPackagingField = <K extends keyof typeof packagingDraft>(key: K, value: (typeof packagingDraft)[K]) => {
    const nextDraft = {
      ...packagingDraft,
      [key]: value,
    };

    setPackagingDraft(nextDraft);

    if (nextDraft.size && nextDraft.color && nextDraft.brush && nextDraft.branding) {
      setBottlePackaging({
        size: nextDraft.size,
        color: nextDraft.color,
        brush: nextDraft.brush,
        branding: nextDraft.branding,
      });
      return;
    }

    clearBottlePackaging();
  };

  const setJarField = <K extends keyof typeof jarDraft>(key: K, value: (typeof jarDraft)[K]) => {
    const nextDraft = { ...jarDraft, [key]: value };
    setJarDraft(nextDraft);
    if (nextDraft.size && nextDraft.color && nextDraft.branding) {
      setJarPackaging(nextDraft as JarPackaging);
      return;
    }
    clearJarPackaging();
  };
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-bold text-grey-primary">Checkout</h2>
        <p className="mt-1 text-sm text-grey-secondary">Review all categories, set packaging, export CSV, and submit inquiry.</p>
      </section>

      {requiresBottlePackaging ? (
        <section className="rounded-lg border border-grey-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-grey-primary">Bottle Packaging (Required)</h3>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-grey-primary">Size</label>
              <select
                value={packagingDraft.size}
                onChange={(event) => {
                  const value = event.target.value as BottleSize;
                  if (!value) return;
                  setPackagingField("size", value);
                }}
                className="w-full rounded-md border border-grey-card px-3 py-2 text-grey-primary"
              >
                <option value="">Select size</option>
                {bottleSizes.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-grey-primary">Color</label>
              <select
                value={packagingDraft.color}
                onChange={(event) => {
                  const value = event.target.value as BottleColor;
                  if (!value) return;
                  setPackagingField("color", value);
                }}
                className="w-full rounded-md border border-grey-card px-3 py-2 text-grey-primary"
              >
                <option value="">Select color</option>
                {bottleColors.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-grey-primary">Brush</label>
              <select
                value={packagingDraft.brush}
                onChange={(event) => {
                  const value = event.target.value as BrushType;
                  if (!value) return;
                  setPackagingField("brush", value);
                }}
                className="w-full rounded-md border border-grey-card px-3 py-2 text-grey-primary"
              >
                <option value="">Select brush</option>
                {brushTypes.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-grey-primary">Branding</label>
              <select
                value={packagingDraft.branding}
                onChange={(event) => {
                  const value = event.target.value as BottleBranding;
                  if (!value) return;
                  setPackagingField("branding", value);
                }}
                className="w-full rounded-md border border-grey-card px-3 py-2 text-grey-primary"
              >
                <option value="">Select branding</option>
                {brandings.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-3 rounded-md border border-grey-card bg-primary-50 p-3 text-sm text-grey-primary">
            <div>Filled units: {filledUnitsTotal}</div>
            <div>Bottles required: {bottleUnitsRequired}</div>
          </div>

          {bottlePackaging?.branding === "PRE_PRINTED" && !prePrintedMinOk ? (
            <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              Pre-printed bottles require a minimum of 5000 bottles. Add more units or switch to Labels.
            </div>
          ) : null}
        </section>
      ) : null}

      {requiresJarPackaging ? (
        <section className="rounded-lg border border-grey-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-grey-primary">Jar Packaging — Builder Gels (Required)</h3>
          </div>
          <p className="mb-3 text-sm text-grey-secondary">Builder gels are filled into jars. Select your preferred jar size and colour.</p>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-grey-primary">Jar Size</label>
              <select
                value={jarDraft.size}
                onChange={(event) => {
                  const value = event.target.value as JarSize;
                  if (!value) return;
                  setJarField("size", value);
                }}
                className="w-full rounded-md border border-grey-card px-3 py-2 text-grey-primary"
              >
                <option value="">Select jar size</option>
                {jarSizes.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-grey-primary">Jar Colour</label>
              <select
                value={jarDraft.color}
                onChange={(event) => {
                  const value = event.target.value as BottleColor;
                  if (!value) return;
                  setJarField("color", value);
                }}
                className="w-full rounded-md border border-grey-card px-3 py-2 text-grey-primary"
              >
                <option value="">Select jar colour</option>
                {jarColors.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-grey-primary">Branding</label>
              <select
                value={jarDraft.branding}
                onChange={(event) => {
                  const value = event.target.value as BottleBranding;
                  if (!value) return;
                  setJarField("branding", value);
                }}
                className="w-full rounded-md border border-grey-card px-3 py-2 text-grey-primary"
              >
                <option value="">Select branding</option>
                {brandings.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>
      ) : null}

      <section className="rounded-lg border border-grey-card p-4">
        <h3 className="text-lg font-semibold text-grey-primary">Cart Items</h3>
        {!items.length ? (
          <p className="mt-2 text-sm text-grey-secondary">Your cart is empty.</p>
        ) : (
          <div className="mt-4 space-y-5">
            {groupedItems.map(([category, categoryItems]) => (
              <div key={category}>
                <h4 className="text-sm font-semibold uppercase tracking-wide text-grey-secondary">{getB2BCategoryLabel(category as CartItem["category"])}</h4>
                <div className="mt-2 overflow-hidden rounded-md border border-grey-card">
                  <table className="w-full text-sm">
                    <thead className="bg-primary-50">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold text-grey-primary">Colour</th>
                        <th className="px-3 py-2 text-left font-semibold text-grey-primary">Code</th>
                        <th className="px-3 py-2 text-left font-semibold text-grey-primary">Name</th>
                        <th className="px-3 py-2 text-left font-semibold text-grey-primary">Qty</th>
                        <th className="px-3 py-2 text-left font-semibold text-grey-primary">Unit</th>
                        <th className="px-3 py-2 text-left font-semibold text-grey-primary">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categoryItems.map((item) => (
                        <tr key={`${item.category}-${item.code}`} className="border-t border-grey-card/60">
                          <td className="px-3 py-2">
                            <div className="h-10 w-10 overflow-hidden rounded border border-grey-card bg-grey-background">
                              {getMetaString(item, "image") ? (
                                <img
                                  src={getMetaString(item, "image")}
                                  alt={item.name ?? item.code}
                                  className="h-full w-full object-cover"
                                />
                              ) : null}
                            </div>
                          </td>
                          <td className="px-3 py-2 font-mono">{item.code}</td>
                          <td className="px-3 py-2">{item.name ?? "-"}</td>
                          <td className="px-3 py-2">
                            <input
                              type="number"
                              min={0}
                              step={1}
                              value={item.quantity}
                              onChange={(event) => {
                                const qty = Number.parseInt(event.target.value, 10);
                                setQuantity(item.category, item.code, Number.isFinite(qty) ? qty : 0);
                              }}
                              className="w-24 rounded-md border border-grey-card px-2 py-1 text-grey-primary"
                            />
                          </td>
                          <td className="px-3 py-2">{item.unitType ?? "PCS"}</td>
                          <td className="px-3 py-2">
                            <button
                              type="button"
                              onClick={() => removeItem(item.category, item.code)}
                              className="rounded-md border border-primary-200 px-2 py-1 text-xs font-semibold text-primary"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {!isPackagingSelected ? (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          Select bottle packaging to enable export and submit.
        </div>
      ) : null}
      {hasQuantityError ? (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          Quantities must be greater than zero for all lines.
        </div>
      ) : null}

      {submitMessage ? (
        <div
          className={`rounded-md p-3 text-sm ${
            submitMessage.type === "success"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {submitMessage.text}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={!canProceed || items.length === 0}
          onClick={exportCsv}
          className="rounded-md border border-primary px-4 py-2 text-sm font-semibold text-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          Export CSV
        </button>
        <button
          type="button"
          disabled={!canProceed || items.length === 0 || isSubmitting}
          onClick={submit}
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-primary-200"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
}
