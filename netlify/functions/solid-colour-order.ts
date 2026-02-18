import { Handler } from "@netlify/functions";
import { buildSolidColourPdf } from "./pdf/buildSolidColourPdf";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type ClientPayload = {
  companyName: string;
  contactName: string;
  contactNumber: string;
  invoiceAddress: string;
  invoiceRegion: string;
  invoicePostalCode: string;
  shippingAddress: string;
  shippingRegion: string;
  shippingPostalCode: string;
  sameAddress?: boolean;
  vat?: string;
  country?: string;
  contactEmail: string;
};

type LinePayload = {
  code: string;
  name: string;
  qty: number;
};

type BottlePackaging = {
  size?: string;
  color?: string;
  brushShape?: string;
  brushType?: string;
};

type JarPackaging = {
  size?: string;
  color?: string;
};

type PackagingPayload = {
  mode?: "standard" | "custom";
  system?: string;
  bottle?: BottlePackaging | null;
  jar?: JarPackaging | null;
  customDescription?: string;
  notes?: string;
};

type OrderPayload = {
  client: ClientPayload;
  lines: LinePayload[];
  packaging?: PackagingPayload;
};

function normalizeToken(value?: string | null): string {
  return (value ?? "").trim().replace(/^['"]|['"]$/g, "");
}

function extractIncomingToken(headers: Record<string, string | undefined>): string {
  const authHeader = headers["authorization"] || headers["Authorization"] || "";
  const legacyHeader = headers["x-solid-order-token"] || headers["X-Solid-Order-Token"] || "";

  if (authHeader) {
    const stripped = authHeader.replace(/^Bearer\s+/i, "");
    return normalizeToken(stripped || authHeader);
  }

  return normalizeToken(legacyHeader);
}

export const handler: Handler = async (event) => {
  try {
    const jsonHeaders: Record<string, string> = { "Content-Type": "application/json" };

    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        headers: jsonHeaders,
        body: JSON.stringify({ success: false, message: "Method Not Allowed" }),
      };
    }

    const expected = normalizeToken(
      process.env.SOLID_COLOUR_ORDER_TOKEN || process.env.VITE_SOLID_COLOUR_ORDER_TOKEN
    );
    const incoming = extractIncomingToken(event.headers);
    if (!expected || incoming !== expected) {
      const message = !expected
        ? "Unauthorized: server token is not configured"
        : "Unauthorized: token mismatch";
      return {
        statusCode: 401,
        headers: jsonHeaders,
        body: JSON.stringify({ success: false, message }),
      };
    }

    if (!event.body) {
      return {
        statusCode: 400,
        headers: jsonHeaders,
        body: JSON.stringify({ success: false, message: "Missing body" }),
      };
    }

    const payload = JSON.parse(event.body) as OrderPayload;
    const { client, lines, packaging } = payload;

    const missingClientFields: string[] = [];
    if (!client?.companyName?.trim()) missingClientFields.push("client.companyName");
    if (!client?.contactName?.trim()) missingClientFields.push("client.contactName");
    if (!client?.contactNumber?.trim()) missingClientFields.push("client.contactNumber");
    if (!client?.invoiceAddress?.trim()) missingClientFields.push("client.invoiceAddress");
    if (!client?.invoiceRegion?.trim()) missingClientFields.push("client.invoiceRegion");
    if (!client?.country?.trim()) missingClientFields.push("client.country");
    if (!client?.invoicePostalCode?.trim()) missingClientFields.push("client.invoicePostalCode");
    if (!client?.contactEmail?.trim()) missingClientFields.push("client.contactEmail");

    const sameAddress = Boolean(client?.sameAddress);
    if (!sameAddress) {
      if (!client?.shippingAddress?.trim()) missingClientFields.push("client.shippingAddress");
      if (!client?.shippingRegion?.trim()) missingClientFields.push("client.shippingRegion");
      if (!client?.shippingPostalCode?.trim()) missingClientFields.push("client.shippingPostalCode");
    }

    if (missingClientFields.length > 0 || !lines?.length) {
      const missingFields = !lines?.length
        ? [...missingClientFields, "lines"]
        : missingClientFields;
      return {
        statusCode: 400,
        headers: jsonHeaders,
        body: JSON.stringify({
          success: false,
          message: "Invalid order payload",
          missingFields,
        }),
      };
    }

    const orderId = `SC-${Date.now()}`;
    const shippingAddress = sameAddress ? client.invoiceAddress : client.shippingAddress;
    const shippingRegion = sameAddress ? client.invoiceRegion : client.shippingRegion;
    const shippingPostalCode = sameAddress ? client.invoicePostalCode : client.shippingPostalCode;

    const packagingMode = packaging?.mode;
    const packagingSystem = packaging?.system;
    const requiresBrushType = true;

    const missingPackagingFields: string[] = [];

    if (!packagingMode) {
      missingPackagingFields.push("packaging.mode");
    }

    if (!packagingSystem) {
      missingPackagingFields.push("packaging.system");
    }

    if (missingPackagingFields.length > 0) {
      return {
        statusCode: 400,
        headers: jsonHeaders,
        body: JSON.stringify({
          success: false,
          message: "Invalid packaging payload.",
          missingFields: missingPackagingFields,
        }),
      };
    }

    if (packagingMode === "standard") {
      if (packagingSystem === "bottle") {
        const missingFields: string[] = [];
        if (!packaging?.bottle?.size) missingFields.push("bottle.size");
        if (!packaging?.bottle?.color) missingFields.push("bottle.color");
        if (!packaging?.bottle?.brushShape) missingFields.push("bottle.brushShape");
        if (requiresBrushType && !packaging?.bottle?.brushType) missingFields.push("bottle.brushType");

        if (missingFields.length > 0) {
          return {
            statusCode: 400,
            headers: jsonHeaders,
            body: JSON.stringify({
              success: false,
              message: "Invalid packaging for standard mode.",
              missingFields,
            }),
          };
        }
      } else {
        const missingFields: string[] = [];
        if (!packaging?.jar?.size) missingFields.push("jar.size");
        if (!packaging?.jar?.color) missingFields.push("jar.color");

        if (missingFields.length > 0) {
          return {
            statusCode: 400,
            headers: jsonHeaders,
            body: JSON.stringify({
              success: false,
              message: "Invalid packaging for standard mode.",
              missingFields,
            }),
          };
        }
      }
    }

    if (packagingMode === "custom") {
      const customDescription = packaging?.customDescription?.trim() || "";
      if (customDescription.length < 20) {
        return {
          statusCode: 400,
          headers: jsonHeaders,
          body: JSON.stringify({
            success: false,
            message: "Invalid packaging for custom mode. customDescription must be at least 20 characters.",
            missingFields: ["packaging.customDescription"],
          }),
        };
      }
    }

    if (packagingMode !== "standard" && packagingMode !== "custom") {
      return {
        statusCode: 400,
        headers: jsonHeaders,
        body: JSON.stringify({
          success: false,
          message: "Invalid packaging mode.",
          missingFields: ["packaging.mode"],
        }),
      };
    }

    if (packagingSystem !== "bottle" && packagingSystem !== "jar") {
      return {
        statusCode: 400,
        headers: jsonHeaders,
        body: JSON.stringify({
          success: false,
          message: "Invalid packaging system.",
          missingFields: ["packaging.system"],
        }),
      };
    }

    const totalUnits = lines.reduce(
      (sum, line) => sum + (Number(line.qty) || 0),
      0
    );

    const linesText = lines
      .map((line) => `• ${line.code} (${line.name}) x ${line.qty}`)
      .join("\n");

    const pdfBytes = await buildSolidColourPdf({
      orderId,
      createdAt: new Date().toISOString().slice(0, 10),
      client: {
        company: client.companyName,
        contactPerson: client.contactName,
        contactPhone: client.contactNumber,
        invoiceAddress: client.invoiceAddress,
        invoiceRegion: client.invoiceRegion,
        invoicePostalCode: client.invoicePostalCode,
        shippingAddress,
        shippingRegion,
        shippingPostalCode,
        sameAddress,
        vat: client.vat,
        country: client.country,
        contactEmail: client.contactEmail,
      },
      packaging: {
        mode: packagingMode,
        system: packagingSystem,
        bottle: packaging?.bottle || undefined,
        jar: packaging?.jar || undefined,
        customDescription: packaging?.customDescription,
        notes: packaging?.notes,
      },
      lines,
    });
    const pdfFileName = `Leeukopf-Solid-Colour-Order-${orderId}.pdf`;
    const pdfBase64 = Buffer.from(pdfBytes).toString("base64");

    const subject = `Solid Colour Order — ${client.companyName} (${orderId})`;

    const packagingChoiceLabel = packagingMode === "custom" ? "Custom" : "Standard";
    const packagingDetailsText = packagingMode === "custom"
      ? `Custom packaging requested: ${packaging?.customDescription || ""}`
      : packagingSystem === "jar"
        ? `Jar Size: ${packaging?.jar?.size || ""}\nJar Color: ${packaging?.jar?.color || ""}`
        : `Bottle Size: ${packaging?.bottle?.size || ""}\nBottle Color: ${packaging?.bottle?.color || ""}\nBrush Shape: ${packaging?.bottle?.brushShape || ""}${requiresBrushType ? `\nBrush Type: ${packaging?.bottle?.brushType || ""}` : ""}`;

    const text = `
Solid Colour Order Submission

Order ID: ${orderId}
Company: ${client.companyName}
Contact Name: ${client.contactName}
Contact Number: ${client.contactNumber}
Invoice Address: ${client.invoiceAddress}
Invoice Region: ${client.invoiceRegion}
Invoice Postal Code: ${client.invoicePostalCode}
Shipping Address: ${shippingAddress}
Shipping Region: ${shippingRegion}
Shipping Postal Code: ${shippingPostalCode}
VAT: ${client.vat || ""}
Country: ${client.country || ""}
Contact Email: ${client.contactEmail}
Packaging Choice: ${packagingChoiceLabel}
Packaging System: ${packagingSystem}
${packagingDetailsText}
Packaging Notes: ${packaging?.notes || ""}

Total Units: ${totalUnits}

Order Lines:
${linesText}
`;

    await resend.emails.send({
      from: `Leeukopf <${process.env.RESEND_FROM_EMAIL}>`,
      to: process.env.ORDERS_INBOX_EMAIL as string,
      replyTo: client.contactEmail,
      subject,
      text,
      attachments: [
        {
          filename: pdfFileName,
          content: pdfBase64,
          contentType: "application/pdf",
        },
      ],
    });

    await resend.emails.send({
      from: `Leeukopf <${process.env.RESEND_FROM_EMAIL}>`,
      to: client.contactEmail,
      subject: `We received your Solid Colour order (${orderId})`,
      text: `
Thank you for your order request.

Order ID: ${orderId}
Company: ${client.companyName}
Contact Name: ${client.contactName}
Contact Number: ${client.contactNumber}
Invoice Address: ${client.invoiceAddress}
Invoice Region: ${client.invoiceRegion}
Invoice Postal Code: ${client.invoicePostalCode}
Shipping Address: ${shippingAddress}
Shipping Region: ${shippingRegion}
Shipping Postal Code: ${shippingPostalCode}
Total Units: ${totalUnits}
    Packaging Choice: ${packagingChoiceLabel}
    Packaging System: ${packagingSystem}
    ${packagingMode === "custom" ? `Custom packaging requested: ${packaging?.customDescription || ""}` : "Standard packaging details received."}

We received your request and our team will contact you shortly.
`,
      attachments: [
        {
          filename: pdfFileName,
          content: pdfBase64,
          contentType: "application/pdf",
        },
      ],
    });

    const pdfHeaders: Record<string, string> = {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="Leeukopf-Solid-Colour-Order-${orderId}.pdf"`,
      "x-order-id": orderId,
    };

    return {
      statusCode: 200,
      isBase64Encoded: true,
      headers: pdfHeaders,
      body: Buffer.from(pdfBytes).toString("base64"),
    };
  } catch (error) {
    console.error("Order submission error:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ success: false, message: "Server error" }),
    };
  }
};
