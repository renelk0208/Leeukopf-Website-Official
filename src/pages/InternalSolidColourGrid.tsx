import { useEffect, useMemo, useState } from "react";

type Row = Record<string, string>;
type OrderLine = {
  code: string;
  name: string;
  qty: number;
};
type ClientDetails = {
  companyName: string;
  contactName: string;
  contactNumber: string;
  invoiceAddress: string;
  invoiceRegion: string;
  invoicePostalCode: string;
  shippingAddress: string;
  shippingRegion: string;
  shippingPostalCode: string;
  sameAddress: boolean;
  vat: string;
  country: string;
  email: string;
};
type BottlePackaging = {
  size: string;
  color: string;
  brushShape: string;
  brushType?: string;
};

type JarPackaging = {
  size: string;
  color: string;
};

type PackagingPayload = {
  mode: "standard" | "custom";
  system: "bottle" | "jar";
  bottle: BottlePackaging | null;
  jar: JarPackaging | null;
  customDescription: string;
  notes: string;
};

const BOTTLE_SIZE_OPTIONS = ["10ml", "15ml"];
const BOTTLE_COLOR_OPTIONS = ["white", "black"];
const BRUSH_SHAPE_OPTIONS = ["oval", "flat"];
const BRUSH_TYPE_OPTIONS = ["standard", "thin"];
const JAR_SIZE_OPTIONS = ["10ml", "15ml"];
const JAR_COLOR_OPTIONS = ["white", "black"];
const ENABLE_BRUSH_TYPE = true;

const toDisplayLabel = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

export default function InternalSolidColourGrid() {
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [imgStatus, setImgStatus] = useState<Record<string, "OK" | "MISSING">>({});
  const [onlyMissing, setOnlyMissing] = useState(false);
  const [order, setOrder] = useState<Record<string, number>>({});
  const [client, setClient] = useState<ClientDetails>({
    companyName: "",
    contactName: "",
    contactNumber: "",
    invoiceAddress: "",
    invoiceRegion: "",
    invoicePostalCode: "",
    shippingAddress: "",
    shippingRegion: "",
    shippingPostalCode: "",
    sameAddress: true,
    vat: "",
    country: "",
    email: "",
  });
  const [packaging, setPackaging] = useState<PackagingPayload>({
    mode: "standard",
    system: "bottle",
    bottle: {
      size: "",
      color: "",
      brushShape: "",
      brushType: "",
    },
    jar: {
      size: "",
      color: "",
    },
    customDescription: "",
    notes: "",
  });
  const [packagingError, setPackagingError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/data/solid-colour/pilot-80.json")
      .then((r) => r.json())
      .then((data) => setRows(Array.isArray(data) ? data : []))
      .catch(() => setRows([]));
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("solidColourOrderPilot80");
    if (saved) {
      try {
        setOrder(JSON.parse(saved));
      } catch {
        setOrder({});
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("solidColourOrderPilot80", JSON.stringify(order));
  }, [order]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    let out = rows;

    if (query) {
      out = out.filter((r) => {
        const sku = (r["Internal_SKU"] || "").toLowerCase();
        const name = (r["Shade_Name"] || "").toLowerCase();
        const code = (r["Shade_Code"] || "").toLowerCase();
        return sku.includes(query) || name.includes(query) || code.includes(query);
      });
    }

    if (onlyMissing) {
      out = out.filter((r, idx) => {
        const sku = r["Internal_SKU"] || "";
        const key = sku || `row-${idx}`;
        return imgStatus[key] === "MISSING";
      });
    }

    return out;
  }, [rows, q, onlyMissing, imgStatus]);

  const selectedItems = Object.entries(order).filter(([skuKey, qty]) => Boolean(skuKey) && qty > 0);
  const totalUnits = selectedItems.reduce((sum, [skuKey, qty]) => (skuKey ? sum + qty : sum), 0);

  const handleSubmitOrder = async () => {
    const exportData: OrderLine[] = selectedItems.map(([sku, qty]) => {
      const row = rows.find((item) => (item["Internal_SKU"] || "") === sku);
      return {
        code: row?.["Shade_Code"] || sku,
        name: row?.["Shade_Name"] || sku,
        qty,
      };
    });
    const token = import.meta.env.VITE_SOLID_COLOUR_ORDER_TOKEN || "";

    const missingClientFields: string[] = [];
    if (!client.companyName.trim()) missingClientFields.push("Company Name or Client Name");
    if (!client.invoiceAddress.trim()) missingClientFields.push("Invoice Address");
    if (!client.invoiceRegion.trim()) missingClientFields.push("Invoice Region");
    if (!client.country.trim()) missingClientFields.push("Country");
    if (!client.invoicePostalCode.trim()) missingClientFields.push("Invoice Postal Code");
    if (!client.email.trim()) missingClientFields.push("Email");
    if (!client.contactNumber.trim()) missingClientFields.push("Contact Number");
    if (!client.contactName.trim()) missingClientFields.push("Contact Name");

    if (!client.sameAddress) {
      if (!client.shippingAddress.trim()) missingClientFields.push("Shipping Address");
      if (!client.shippingRegion.trim()) missingClientFields.push("Shipping Region");
      if (!client.shippingPostalCode.trim()) missingClientFields.push("Shipping Postal Code");
    }

    if (missingClientFields.length > 0 || exportData.length === 0) {
      const details = missingClientFields.length > 0
        ? ` Missing: ${missingClientFields.join(", ")}.`
        : "";
      setSubmitMessage({
        type: "error",
        text: `Please complete all required client fields and add at least one shade before exporting.${details}`,
      });
      return;
    }

    if (packaging.mode === "standard") {
      if (packaging.system === "bottle") {
        const missing: string[] = [];
        if (!packaging.bottle?.size) missing.push("Bottle size");
        if (!packaging.bottle?.color) missing.push("Bottle color");
        if (!packaging.bottle?.brushShape) missing.push("Brush shape");
        if (ENABLE_BRUSH_TYPE && !packaging.bottle?.brushType) missing.push("Brush type");

        if (missing.length > 0) {
          const message = `Missing packaging fields: ${missing.join(", ")}.`;
          setPackagingError(message);
          setSubmitMessage({ type: "error", text: message });
          return;
        }
      } else {
        const missing: string[] = [];
        if (!packaging.jar?.size) missing.push("Jar size");
        if (!packaging.jar?.color) missing.push("Jar color");

        if (missing.length > 0) {
          const message = `Missing packaging fields: ${missing.join(", ")}.`;
          setPackagingError(message);
          setSubmitMessage({ type: "error", text: message });
          return;
        }
      }
    } else {
      const description = packaging.customDescription.trim();
      if (description.length < 20) {
        const message = "Packaging details (required) must be at least 20 characters for custom packaging.";
        setPackagingError(message);
        setSubmitMessage({ type: "error", text: message });
        return;
      }
    }

    setPackagingError(null);

    if (!token) {
      setSubmitMessage({
        type: "error",
        text: "Missing VITE_SOLID_COLOUR_ORDER_TOKEN in environment.",
      });
      return;
    }

    const shippingAddress = client.sameAddress ? client.invoiceAddress : client.shippingAddress;
    const shippingRegion = client.sameAddress ? client.invoiceRegion : client.shippingRegion;
    const shippingPostalCode = client.sameAddress ? client.invoicePostalCode : client.shippingPostalCode;

    const payload = {
      client: {
        companyName: client.companyName,
        contactName: client.contactName,
        contactNumber: client.contactNumber,
        invoiceAddress: client.invoiceAddress,
        invoiceRegion: client.invoiceRegion,
        invoicePostalCode: client.invoicePostalCode,
        shippingAddress,
        shippingRegion,
        shippingPostalCode,
        sameAddress: client.sameAddress,
        vat: client.vat,
        country: client.country,
        contactEmail: client.email,
      },
      lines: exportData,
      packaging: {
        mode: packaging.mode,
        system: packaging.system,
        bottle: packaging.bottle,
        jar: packaging.jar,
        customDescription: packaging.customDescription,
        notes: packaging.notes,
      },
    };

    try {
      setIsSubmitting(true);
      setSubmitMessage(null);

      const response = await fetch("/.netlify/functions/solid-colour-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const orderId = response.headers.get("x-order-id") || response.headers.get("X-Order-Id") || "request";
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Leeukopf-Solid-Colour-Order-${orderId}.pdf`;
        a.click();
        URL.revokeObjectURL(url);

        setSubmitMessage({
          type: "success",
          text: `Order ${orderId} submitted successfully. Confirmation email sent.`,
        });
        return;
      }

      const responseText = await response.text();
      let data: { message?: string } = {};
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch {
        data = { message: responseText || undefined };
      }

      setSubmitMessage({
        type: "error",
        text: data?.message || "Failed to submit order. PDF was not downloaded.",
      });
    } catch {
      setSubmitMessage({
        type: "error",
        text: "Network error while submitting order. PDF was not downloaded.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Internal Solid Colour Grid (Pilot 80)</h1>
          <p className="text-sm text-neutral-600">Not linked anywhere — internal testing only.</p>
        </div>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by SKU / code / name…"
          className="w-full rounded-xl border bg-white px-4 py-2 text-sm shadow-sm sm:w-80"
        />

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={onlyMissing}
            onChange={(e) => setOnlyMissing(e.target.checked)}
          />
          Show missing only
        </label>
      </div>

      <div className="mb-6 rounded-xl border bg-white p-4 shadow-sm">
        <div className="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <input
            value={client.companyName}
            onChange={(e) => setClient((prev) => ({ ...prev, companyName: e.target.value }))}
            placeholder="Company Name or Client Name"
            className="rounded-xl border bg-white px-3 py-2 text-sm"
          />
          <input
            value={client.contactName}
            onChange={(e) => setClient((prev) => ({ ...prev, contactName: e.target.value }))}
            placeholder="Contact Name"
            className="rounded-xl border bg-white px-3 py-2 text-sm"
          />
          <input
            value={client.contactNumber}
            onChange={(e) => setClient((prev) => ({ ...prev, contactNumber: e.target.value }))}
            placeholder="Contact Number"
            className="rounded-xl border bg-white px-3 py-2 text-sm"
          />
          <input
            value={client.invoiceAddress}
            onChange={(e) => {
              const value = e.target.value;
              setClient((prev) => ({
                ...prev,
                invoiceAddress: value,
                shippingAddress: prev.sameAddress ? value : prev.shippingAddress,
              }));
            }}
            placeholder="Invoice Address"
            className="rounded-xl border bg-white px-3 py-2 text-sm"
          />
          <input
            value={client.invoiceRegion}
            onChange={(e) => {
              const value = e.target.value;
              setClient((prev) => ({
                ...prev,
                invoiceRegion: value,
                shippingRegion: prev.sameAddress ? value : prev.shippingRegion,
              }));
            }}
            placeholder="Invoice Region"
            className="rounded-xl border bg-white px-3 py-2 text-sm"
          />
          <input
            value={client.invoicePostalCode}
            onChange={(e) => {
              const value = e.target.value;
              setClient((prev) => ({
                ...prev,
                invoicePostalCode: value,
                shippingPostalCode: prev.sameAddress ? value : prev.shippingPostalCode,
              }));
            }}
            placeholder="Invoice Postal Code"
            className="rounded-xl border bg-white px-3 py-2 text-sm"
          />
          <label className="flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-sm sm:col-span-2">
            <input
              type="checkbox"
              checked={client.sameAddress}
              onChange={(e) => {
                const checked = e.target.checked;
                setClient((prev) => ({
                  ...prev,
                  sameAddress: checked,
                  shippingAddress: checked ? prev.invoiceAddress : prev.shippingAddress,
                  shippingRegion: checked ? prev.invoiceRegion : prev.shippingRegion,
                  shippingPostalCode: checked ? prev.invoicePostalCode : prev.shippingPostalCode,
                }));
              }}
            />
            Same Address (copy Invoice Address to Shipping Address)
          </label>
          {!client.sameAddress && (
            <>
              <input
                value={client.shippingAddress}
                onChange={(e) => setClient((prev) => ({ ...prev, shippingAddress: e.target.value }))}
                placeholder="Shipping Address"
                className="rounded-xl border bg-white px-3 py-2 text-sm"
              />
              <input
                value={client.shippingRegion}
                onChange={(e) => setClient((prev) => ({ ...prev, shippingRegion: e.target.value }))}
                placeholder="Shipping Region"
                className="rounded-xl border bg-white px-3 py-2 text-sm"
              />
              <input
                value={client.shippingPostalCode}
                onChange={(e) => setClient((prev) => ({ ...prev, shippingPostalCode: e.target.value }))}
                placeholder="Shipping Postal Code"
                className="rounded-xl border bg-white px-3 py-2 text-sm"
              />
            </>
          )}
          <input
            value={client.vat}
            onChange={(e) => setClient((prev) => ({ ...prev, vat: e.target.value }))}
            placeholder="VAT (optional)"
            className="rounded-xl border bg-white px-3 py-2 text-sm"
          />
          <input
            value={client.country}
            onChange={(e) => setClient((prev) => ({ ...prev, country: e.target.value }))}
            placeholder="Country"
            className="rounded-xl border bg-white px-3 py-2 text-sm"
          />
          <input
            type="email"
            value={client.email}
            onChange={(e) => setClient((prev) => ({ ...prev, email: e.target.value }))}
            placeholder="Contact email"
            className="rounded-xl border bg-white px-3 py-2 text-sm"
          />
        </div>

        <div className="rounded-xl border bg-neutral-50 p-3">
          <div className="text-sm font-semibold">Packaging</div>
          <div className="mt-2 grid gap-2 text-sm">
            <label className="flex items-start gap-2">
              <input
                type="radio"
                name="packaging-mode"
                value="standard"
                checked={packaging.mode === "standard"}
                onChange={() => {
                  setPackaging((prev) => ({ ...prev, mode: "standard" }));
                  setPackagingError(null);
                }}
              />
              <span>Use Leeukopf standard bottles & brushes</span>
            </label>
            <label className="flex items-start gap-2">
              <input
                type="radio"
                name="packaging-mode"
                value="custom"
                checked={packaging.mode === "custom"}
                onChange={() => {
                  setPackaging((prev) => ({ ...prev, mode: "custom" }));
                  setPackagingError(null);
                }}
              />
              <span>I have my own packaging / I want something different</span>
            </label>
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <label className="text-xs font-medium text-neutral-600">System</label>
            <div className="flex items-center gap-4 sm:col-span-1">
              <label className="flex items-center gap-1 text-sm">
                <input
                  type="radio"
                  name="packaging-system"
                  value="bottle"
                  checked={packaging.system === "bottle"}
                  onChange={() => {
                    setPackaging((prev) => ({ ...prev, system: "bottle" }));
                    setPackagingError(null);
                  }}
                />
                Bottle
              </label>
              <label className="flex items-center gap-1 text-sm">
                <input
                  type="radio"
                  name="packaging-system"
                  value="jar"
                  checked={packaging.system === "jar"}
                  onChange={() => {
                    setPackaging((prev) => ({ ...prev, system: "jar" }));
                    setPackagingError(null);
                  }}
                />
                Jar
              </label>
            </div>
          </div>

          {packaging.mode === "standard" ? (
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {packaging.system === "bottle" ? (
                <>
                  <label className="text-xs font-medium text-neutral-600">
                    Bottle Size
                    <select
                      value={packaging.bottle?.size || ""}
                      onChange={(e) => {
                        setPackaging((prev) => ({
                          ...prev,
                          bottle: {
                            ...(prev.bottle || { color: "", brushShape: "", brushType: "" }),
                            size: e.target.value,
                          },
                        }));
                        setPackagingError(null);
                      }}
                      className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm"
                    >
                      <option value="">Select…</option>
                      {BOTTLE_SIZE_OPTIONS.map((option) => (
                        <option key={option} value={option}>{toDisplayLabel(option)}</option>
                      ))}
                    </select>
                  </label>

                  <label className="text-xs font-medium text-neutral-600">
                    Bottle Color
                    <select
                      value={packaging.bottle?.color || ""}
                      onChange={(e) => {
                        setPackaging((prev) => ({
                          ...prev,
                          bottle: {
                            ...(prev.bottle || { size: "", brushShape: "", brushType: "" }),
                            color: e.target.value,
                          },
                        }));
                        setPackagingError(null);
                      }}
                      className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm"
                    >
                      <option value="">Select…</option>
                      {BOTTLE_COLOR_OPTIONS.map((option) => (
                        <option key={option} value={option}>{toDisplayLabel(option)}</option>
                      ))}
                    </select>
                  </label>

                  <label className="text-xs font-medium text-neutral-600">
                    Brush Shape
                    <select
                      value={packaging.bottle?.brushShape || ""}
                      onChange={(e) => {
                        setPackaging((prev) => ({
                          ...prev,
                          bottle: {
                            ...(prev.bottle || { size: "", color: "", brushType: "" }),
                            brushShape: e.target.value,
                          },
                        }));
                        setPackagingError(null);
                      }}
                      className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm"
                    >
                      <option value="">Select…</option>
                      {BRUSH_SHAPE_OPTIONS.map((option) => (
                        <option key={option} value={option}>{toDisplayLabel(option)}</option>
                      ))}
                    </select>
                  </label>

                  {ENABLE_BRUSH_TYPE && (
                    <label className="text-xs font-medium text-neutral-600">
                      Brush Type
                      <select
                        value={packaging.bottle?.brushType || ""}
                        onChange={(e) => {
                          setPackaging((prev) => ({
                            ...prev,
                            bottle: {
                              ...(prev.bottle || { size: "", color: "", brushShape: "" }),
                              brushType: e.target.value,
                            },
                          }));
                          setPackagingError(null);
                        }}
                        className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm"
                      >
                        <option value="">Select…</option>
                        {BRUSH_TYPE_OPTIONS.map((option) => (
                          <option key={option} value={option}>{toDisplayLabel(option)}</option>
                        ))}
                      </select>
                    </label>
                  )}
                </>
              ) : (
                <>
                  <label className="text-xs font-medium text-neutral-600">
                    Jar Size
                    <select
                      value={packaging.jar?.size || ""}
                      onChange={(e) => {
                        setPackaging((prev) => ({
                          ...prev,
                          jar: {
                            ...(prev.jar || { color: "" }),
                            size: e.target.value,
                          },
                        }));
                        setPackagingError(null);
                      }}
                      className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm"
                    >
                      <option value="">Select…</option>
                      {JAR_SIZE_OPTIONS.map((option) => (
                        <option key={option} value={option}>{toDisplayLabel(option)}</option>
                      ))}
                    </select>
                  </label>

                  <label className="text-xs font-medium text-neutral-600">
                    Jar Color
                    <select
                      value={packaging.jar?.color || ""}
                      onChange={(e) => {
                        setPackaging((prev) => ({
                          ...prev,
                          jar: {
                            ...(prev.jar || { size: "" }),
                            color: e.target.value,
                          },
                        }));
                        setPackagingError(null);
                      }}
                      className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm"
                    >
                      <option value="">Select…</option>
                      {JAR_COLOR_OPTIONS.map((option) => (
                        <option key={option} value={option}>{toDisplayLabel(option)}</option>
                      ))}
                    </select>
                  </label>
                </>
              )}
            </div>
          ) : (
            <div className="mt-3">
              <label className="mb-1 block text-sm font-medium">Packaging details (required)</label>
              <textarea
                value={packaging.customDescription}
                onChange={(e) => {
                  setPackaging((prev) => ({ ...prev, customDescription: e.target.value }));
                  setPackagingError(null);
                }}
                rows={4}
                placeholder="Describe your custom packaging requirements"
                className="w-full rounded-xl border bg-white px-3 py-2 text-sm"
              />
            </div>
          )}

          <div className="mt-3">
            <textarea
              value={packaging.notes}
              onChange={(e) => {
                setPackaging((prev) => ({ ...prev, notes: e.target.value }));
                setPackagingError(null);
              }}
              rows={2}
              placeholder="Packaging notes (optional)"
              className="w-full rounded-xl border bg-white px-3 py-2 text-sm"
            />
          </div>

          {packagingError && (
            <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {packagingError}
            </div>
          )}
        </div>

        <div className="text-sm font-semibold">
          Selected Shades: {selectedItems.length}
        </div>
        <div className="text-sm">
          Total Units: {totalUnits}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setOrder({})}
            className="rounded-xl border bg-white px-4 py-2 text-xs"
          >
            Clear
          </button>

          <button
            onClick={async () => {
              const text = selectedItems
                .map(([sku, qty]) => `${sku} x ${qty}`)
                .join("\n");
              await navigator.clipboard.writeText(text);
            }}
            className="rounded-xl border bg-white px-4 py-2 text-xs"
          >
            Copy list
          </button>

          <button
            onClick={handleSubmitOrder}
            disabled={isSubmitting}
            className="rounded-xl bg-black px-4 py-2 text-xs text-white"
          >
            {isSubmitting ? "Submitting..." : "Submit Order"}
          </button>
        </div>

        {submitMessage && (
          <div
            className={`mt-3 rounded-xl border px-3 py-2 text-xs ${
              submitMessage.type === "success"
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {submitMessage.text}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {filtered.map((r, idx) => {
          const sku = r["Internal_SKU"] || "";
          const name = r["Shade_Name"] || "";
          const hex = r["Hex_Code"] || "";
          const img = r["Swatch_Image"] || "";
          const key = sku || `row-${idx}`;
          const status = imgStatus[key];
          return (
            <div key={key} className="rounded-2xl border bg-white p-3 shadow-sm">
              <div className="aspect-square overflow-hidden rounded-xl bg-neutral-50 relative">
                {img ? (
                  <>
                    <img
                      src={img}
                      alt={sku}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      onLoad={() =>
                        setImgStatus((prev) => (prev[key] === "OK" ? prev : { ...prev, [key]: "OK" }))
                      }
                      onError={() =>
                        setImgStatus((prev) =>
                          prev[key] === "MISSING" ? prev : { ...prev, [key]: "MISSING" }
                        )
                      }
                    />

                    {/* Status badge */}
                    <div className="absolute top-2 left-2 rounded-full border bg-white px-2 py-0.5 text-[10px] shadow-sm">
                      {status ?? "…"}
                    </div>
                  </>
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-neutral-500">
                    No image
                  </div>
                )}
              </div>

              <div className="mt-2">
                <div className="text-xs font-semibold">{sku}</div>
                <div className="text-[11px] text-neutral-600 line-clamp-2">{name}</div>
                <div className="text-[11px] text-neutral-600 mt-1">HEX: {hex || "—"}</div>

                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    placeholder="Qty"
                    value={order[sku] || ""}
                    onChange={(e) => {
                      const val = parseInt(e.target.value || "0", 10);
                      if (val === 0) {
                        setOrder((prev) => ({ ...prev, [sku]: 0 }));
                      } else if (val < 30) {
                        setOrder((prev) => ({ ...prev, [sku]: 30 }));
                      } else {
                        setOrder((prev) => ({ ...prev, [sku]: val }));
                      }
                    }}
                    className="w-16 rounded border px-2 py-1 text-xs"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!filtered.length && (
        <div className="mt-8 rounded-xl border bg-white p-6 text-sm text-neutral-600">
          No results. Check that <code className="font-mono">pilot-80.json</code> exists in{" "}
          <code className="font-mono">public/data/solid-colour/</code>.
        </div>
      )}
    </div>
  );
}
