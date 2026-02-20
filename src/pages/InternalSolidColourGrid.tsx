import { useEffect, useMemo, useState } from "react";
import { categories } from "../config/categories";

type Row = Record<string, string>;
type OrderFormat = "finished_units" | "bulk";
type BulkContainer = "1kg_flask" | "5kg_bucket";
type OrderLine = {
  code: string;
  name: string;
  qty: number;
  unit: "pcs" | "kg";
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
const solidColourConfig = categories.solidColour;
const ALLOWED_UNITS = solidColourConfig.allowedUnits;
const ALLOWED_PACKAGING = solidColourConfig.allowedPackaging;
const ENABLE_BRUSH_TYPE = solidColourConfig.hasGlobalBrush;
const SHOW_JAR_SIZE_SELECTOR = solidColourConfig.hasJarSizeSelector;
const ALLOWS_PCS_UNIT = ALLOWED_UNITS.includes("pcs");
const ALLOWS_KG_UNIT = ALLOWED_UNITS.includes("kg");
const ALLOWS_BUCKET_PACKAGING = ALLOWED_PACKAGING.includes("bucket");

const toDisplayLabel = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

export default function InternalSolidColourGrid() {
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [imgStatus, setImgStatus] = useState<Record<string, "OK" | "MISSING">>({});
  const [tileView, setTileView] = useState<Record<string, "nail" | "card">>({});
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
    sameAddress: false,
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
  const [showThankYouPopup, setShowThankYouPopup] = useState(false);
  const [orderFormat, setOrderFormat] = useState<OrderFormat>("finished_units");
  const [bulkContainer, setBulkContainer] = useState<BulkContainer | "">("");
  const [isBulkContainerAuto, setIsBulkContainerAuto] = useState(false);

  useEffect(() => {
    fetch("/data/solid-1200.json")
      .then((res) => res.json())
      .then((data: unknown) => setRows(Array.isArray(data) ? (data as Row[]) : []))
      .catch(() => setRows([]));
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("solidColourOrder1200");
    if (saved) {
      try {
        setOrder(JSON.parse(saved));
      } catch {
        setOrder({});
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("solidColourOrder1200", JSON.stringify(order));
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
  const qtyUnit: "pcs" | "kg" = orderFormat === "bulk"
    ? (ALLOWS_KG_UNIT ? "kg" : "pcs")
    : (ALLOWS_PCS_UNIT ? "pcs" : "kg");
  const bulkRequiresBucket = orderFormat === "bulk" && selectedItems.some(([, qty]) => qty >= 5);
  const totalUnits = selectedItems.reduce((sum, [skuKey, qty]) => (skuKey ? sum + qty : sum), 0);

  useEffect(() => {
    if ((!ALLOWS_KG_UNIT || !ALLOWS_BUCKET_PACKAGING) && orderFormat === "bulk") {
      setOrderFormat("finished_units");
      setBulkContainer("");
      setIsBulkContainerAuto(false);
    }
  }, [orderFormat]);

  useEffect(() => {
    if (!SHOW_JAR_SIZE_SELECTOR && packaging.system !== "bottle") {
      setPackaging((prev) => ({ ...prev, system: "bottle" }));
    }
  }, [packaging.system]);

  useEffect(() => {
    if (orderFormat !== "bulk") {
      setIsBulkContainerAuto(false);
      return;
    }

    if (bulkRequiresBucket && (bulkContainer === "" || isBulkContainerAuto) && bulkContainer !== "5kg_bucket") {
      setBulkContainer("5kg_bucket");
      setIsBulkContainerAuto(true);
      return;
    }

    if (!bulkRequiresBucket && isBulkContainerAuto && bulkContainer === "5kg_bucket") {
      setBulkContainer("");
      setIsBulkContainerAuto(false);
    }
  }, [bulkRequiresBucket, bulkContainer, isBulkContainerAuto, orderFormat]);

  const handleSubmitOrder = async () => {
    const exportData: OrderLine[] = selectedItems.map(([sku, qty]) => {
      const row = rows.find((item) => (item["Internal_SKU"] || "") === sku);
      return {
        code: row?.["Shade_Code"] || sku,
        name: row?.["Shade_Name"] || sku,
        qty,
        unit: qtyUnit,
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

    if (orderFormat === "bulk") {
      if (!bulkContainer) {
        const message = "Please choose a bulk packing type: 1kg Flasks or 5kg Buckets.";
        setPackagingError(message);
        setSubmitMessage({ type: "error", text: message });
        return;
      }
      setPackagingError(null);
    } else {
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
    }

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
      orderFormat,
      qtyUnit,
      bulkContainer: orderFormat === "bulk" ? bulkContainer : undefined,
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
        mode: orderFormat === "bulk" ? "custom" : packaging.mode,
        system: orderFormat === "bulk" ? "bulk" : packaging.system,
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
        setShowThankYouPopup(true);
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
      {showThankYouPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl border bg-white p-5 shadow-xl">
            <div className="text-base font-semibold">Leeukopf Laboratories</div>
            <p className="mt-2 text-sm text-neutral-700">
              Leeukopf Laboratories thanks you for your request, our dedicated team will be in contact with you soon!
            </p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowThankYouPopup(false)}
                className="rounded-xl bg-black px-4 py-2 text-xs text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Internal Solid Colour Grid (1200)</h1>
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
        <div className="mb-2 text-xs text-neutral-600">Fields marked with <span className="text-red-600">*</span> are required.</div>
        <div className="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <label className="text-xs font-medium text-neutral-600">Company Name or Client Name <span className="text-red-600">*</span>
            <input
              value={client.companyName}
              onChange={(e) => setClient((prev) => ({ ...prev, companyName: e.target.value }))}
              placeholder="Company Name or Client Name"
              className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm"
            />
          </label>
          <label className="text-xs font-medium text-neutral-600">Contact Name <span className="text-red-600">*</span>
            <input
              value={client.contactName}
              onChange={(e) => setClient((prev) => ({ ...prev, contactName: e.target.value }))}
              placeholder="Contact Name"
              className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm"
            />
          </label>
          <label className="text-xs font-medium text-neutral-600">Contact Number <span className="text-red-600">*</span>
            <input
              value={client.contactNumber}
              onChange={(e) => setClient((prev) => ({ ...prev, contactNumber: e.target.value }))}
              placeholder="Contact Number"
              className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm"
            />
          </label>
          <label className="text-xs font-medium text-neutral-600">Invoice Address <span className="text-red-600">*</span>
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
              className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm"
            />
          </label>
          <label className="text-xs font-medium text-neutral-600">Invoice Region <span className="text-red-600">*</span>
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
              className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm"
            />
          </label>
          <label className="text-xs font-medium text-neutral-600">Invoice Postal Code <span className="text-red-600">*</span>
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
              className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm"
            />
          </label>
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
              <label className="text-xs font-medium text-neutral-600">Shipping Address <span className="text-red-600">*</span>
                <input
                  value={client.shippingAddress}
                  onChange={(e) => setClient((prev) => ({ ...prev, shippingAddress: e.target.value }))}
                  placeholder="Shipping Address"
                  className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm"
                />
              </label>
              <label className="text-xs font-medium text-neutral-600">Shipping Region <span className="text-red-600">*</span>
                <input
                  value={client.shippingRegion}
                  onChange={(e) => setClient((prev) => ({ ...prev, shippingRegion: e.target.value }))}
                  placeholder="Shipping Region"
                  className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm"
                />
              </label>
              <label className="text-xs font-medium text-neutral-600">Shipping Postal Code <span className="text-red-600">*</span>
                <input
                  value={client.shippingPostalCode}
                  onChange={(e) => setClient((prev) => ({ ...prev, shippingPostalCode: e.target.value }))}
                  placeholder="Shipping Postal Code"
                  className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm"
                />
              </label>
            </>
          )}
          <label className="text-xs font-medium text-neutral-600">VAT (optional)
            <input
              value={client.vat}
              onChange={(e) => setClient((prev) => ({ ...prev, vat: e.target.value }))}
              placeholder="VAT (optional)"
              className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm"
            />
          </label>
          <label className="text-xs font-medium text-neutral-600">Country <span className="text-red-600">*</span>
            <input
              value={client.country}
              onChange={(e) => setClient((prev) => ({ ...prev, country: e.target.value }))}
              placeholder="Country"
              className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm"
            />
          </label>
          <label className="text-xs font-medium text-neutral-600">Contact Email <span className="text-red-600">*</span>
            <input
              type="email"
              value={client.email}
              onChange={(e) => setClient((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="Contact Email"
              className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm"
            />
          </label>
        </div>

        <div className="rounded-xl border bg-neutral-50 p-3">
          <div className="text-sm font-semibold">Order format <span className="text-red-600">*</span></div>
          <div className="mt-2 grid gap-2 text-sm">
            <label className="flex items-start gap-2">
              <input
                type="radio"
                name="order-format"
                value="finished_units"
                checked={orderFormat === "finished_units"}
                onChange={() => setOrderFormat("finished_units")}
              />
              <span>Finished units (we bottle it)</span>
            </label>
            {ALLOWS_KG_UNIT && ALLOWS_BUCKET_PACKAGING && (
              <label className="flex items-start gap-2">
                <input
                  type="radio"
                  name="order-format"
                  value="bulk"
                  checked={orderFormat === "bulk"}
                  onChange={() => setOrderFormat("bulk")}
                />
                <span>Bulk (you fill your own bottles)</span>
              </label>
            )}
          </div>

          {orderFormat === "bulk" && (
            <div className="mt-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-700">
              Bulk selected: MOQ per shade is 1kg.
            </div>
          )}

          {orderFormat === "bulk" ? (
            <>
              <div className="mt-3 border-t pt-3 text-sm font-semibold">Bulk Packing <span className="text-red-600">*</span></div>
              <div className="mt-2 grid gap-2 text-sm">
                <label className="flex items-start gap-2">
                  <input
                    type="radio"
                    name="bulk-container"
                    value="1kg_flask"
                    checked={bulkContainer === "1kg_flask"}
                    onChange={() => {
                      setBulkContainer("1kg_flask");
                      setIsBulkContainerAuto(false);
                      setPackagingError(null);
                    }}
                  />
                  <span>1kg Flasks</span>
                </label>
                <label className="flex items-start gap-2">
                  <input
                    type="radio"
                    name="bulk-container"
                    value="5kg_bucket"
                    checked={bulkContainer === "5kg_bucket"}
                    onChange={() => {
                      setBulkContainer("5kg_bucket");
                      setIsBulkContainerAuto(false);
                      setPackagingError(null);
                    }}
                  />
                  <span>5kg Buckets</span>
                </label>
              </div>
              {bulkRequiresBucket && (
                <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                  5kg or more selected: 5kg Buckets has been auto-selected as a suggestion (you can still change it).
                </div>
              )}
            </>
          ) : (
            <>
              <div className="mt-3 border-t pt-3 text-sm font-semibold">Packaging <span className="text-red-600">*</span></div>
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
                  {SHOW_JAR_SIZE_SELECTOR && (
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
                  )}
                </div>
              </div>

              {packaging.mode === "standard" ? (
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {!SHOW_JAR_SIZE_SELECTOR || packaging.system === "bottle" ? (
                    <>
                      <label className="text-xs font-medium text-neutral-600">
                        Bottle Size <span className="text-red-600">*</span>
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
                        Bottle Color <span className="text-red-600">*</span>
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
                        Brush Shape <span className="text-red-600">*</span>
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
                          Brush Type <span className="text-red-600">*</span>
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
                        Jar Size <span className="text-red-600">*</span>
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
                        Jar Color <span className="text-red-600">*</span>
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
                  <label className="mb-1 block text-sm font-medium">Packaging details (required) <span className="text-red-600">*</span></label>
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
            </>
          )}

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
          {qtyUnit === "kg" ? "Total KG" : "Total Units"}: {totalUnits}
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
                .map(([sku, qty]) => `${sku} x ${qty}${qtyUnit === "kg" ? "kg" : " pcs"}`)
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
          const hex = r["Hex_Code"] || r["HEX"] || "";
          const img = r["Swatch_Image"] || (sku ? `/img/solid-colour/${sku}.webp` : "");
          const key = sku || `row-${idx}`;
          const status = imgStatus[key];
          const hasImage = Boolean(img) && status !== "MISSING";
          const currentView = tileView[key] || "nail";
          const showImage = hasImage && currentView === "nail";
          const showCard = !hasImage || currentView === "card";
          return (
            <div key={key} className="rounded-2xl border bg-white p-3 shadow-sm">
              <button
                type="button"
                className="aspect-square w-full overflow-hidden rounded-xl bg-neutral-50 relative text-left"
                onClick={() => {
                  if (!hasImage) return;
                  setTileView((prev) => ({
                    ...prev,
                    [key]: (prev[key] || "nail") === "nail" ? "card" : "nail",
                  }));
                }}
              >
                {showImage ? (
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

                    <div className="absolute bottom-2 right-2 rounded-full border bg-white px-2 py-0.5 text-[10px] shadow-sm">
                      View card
                    </div>
                  </>
                ) : showCard && hex ? (
                  <>
                    <div className="h-full w-full" style={{ backgroundColor: hex }} />
                    {hasImage && (
                      <div className="absolute bottom-2 right-2 rounded-full border bg-white px-2 py-0.5 text-[10px] shadow-sm">
                        View nail
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-neutral-500">No image</div>
                )}
              </button>

              <div className="mt-2">
                <div className="text-xs font-semibold">{sku}</div>
                <div className="text-[11px] text-neutral-600 line-clamp-2">{name}</div>
                <div className="text-[11px] text-neutral-600 mt-1">HEX: {hex || "—"}</div>

                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    placeholder={qtyUnit === "kg" ? "KG" : "Qty"}
                    value={order[sku] || ""}
                    onChange={(e) => {
                      const minQty = orderFormat === "bulk" ? 1 : 30;
                      const val = parseInt(e.target.value || "0", 10);
                      if (val === 0) {
                        setOrder((prev) => ({ ...prev, [sku]: 0 }));
                      } else if (val < minQty) {
                        setOrder((prev) => ({ ...prev, [sku]: minQty }));
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
          No results. Check that <code className="font-mono">solid-1200.json</code> exists in{" "}
          <code className="font-mono">public/data/</code>.
        </div>
      )}
    </div>
  );
}
