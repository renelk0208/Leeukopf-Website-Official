import { Handler } from "@netlify/functions";
import { buildSolidColourPdf } from "./pdf/buildSolidColourPdf";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type ClientPayload = {
  companyName: string;
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

type PackagingPayload = {
  system?: string;
  bottle?: BottlePackaging | null;
  jar?: Record<string, string> | null;
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
    const authHeader = event.headers["authorization"] || event.headers["Authorization"];
    const legacyHeader = event.headers["x-solid-order-token"] || event.headers["X-Solid-Order-Token"];
    const incoming = normalizeToken(
      authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : legacyHeader || ""
    );
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

    if (!client?.companyName || !client?.contactEmail || !lines?.length) {
      return {
        statusCode: 400,
        headers: jsonHeaders,
        body: JSON.stringify({ success: false, message: "Invalid order payload" }),
      };
    }

    const orderId = `SC-${Date.now()}`;

    const totalUnits = lines.reduce(
      (sum, line) => sum + (Number(line.qty) || 0),
      0
    );

    const linesText = lines
      .map((line) => `• ${line.code} (${line.name}) x ${line.qty}`)
      .join("\n");

    const packagingSystem = packaging?.system === "jar" ? "jar" : "bottle";
    const jarRecord = packaging?.jar ?? null;

    const pdfBytes = await buildSolidColourPdf({
      orderId,
      createdAt: new Date().toISOString().slice(0, 10),
      client: {
        company: client.companyName,
        vat: client.vat,
        country: client.country,
        contactEmail: client.contactEmail,
      },
      packaging: {
        system: packagingSystem,
        bottle: packaging?.bottle || undefined,
        jar: jarRecord
          ? {
              size: jarRecord.size || jarRecord.Size,
              color: jarRecord.color || jarRecord.Color,
            }
          : undefined,
        notes: packaging?.notes,
      },
      lines,
    });
    const pdfFileName = `Leeukopf-Solid-Colour-Order-${orderId}.pdf`;
    const pdfBase64 = Buffer.from(pdfBytes).toString("base64");

    const subject = `Solid Colour Order — ${client.companyName} (${orderId})`;

    const text = `
Solid Colour Order Submission

Order ID: ${orderId}
Company: ${client.companyName}
VAT: ${client.vat || ""}
Country: ${client.country || ""}
Contact Email: ${client.contactEmail}
Packaging System: ${packaging?.system || ""}
Bottle Size: ${packaging?.bottle?.size || ""}
Bottle Color: ${packaging?.bottle?.color || ""}
Brush Shape: ${packaging?.bottle?.brushShape || ""}
Brush Type: ${packaging?.bottle?.brushType || ""}
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
Total Units: ${totalUnits}

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
