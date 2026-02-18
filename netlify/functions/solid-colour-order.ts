import { Handler } from "@netlify/functions";
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

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ success: false, message: "Method Not Allowed" }),
      };
    }

    const expected = process.env.SOLID_COLOUR_ORDER_TOKEN;
    const authHeader = event.headers["authorization"] || event.headers["Authorization"];
    const incoming = authHeader?.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
    if (!expected || incoming !== expected) {
      return {
        statusCode: 401,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ success: false, message: "Unauthorized" }),
      };
    }

    if (!event.body) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ success: false, message: "Missing body" }),
      };
    }

    const payload = JSON.parse(event.body) as OrderPayload;
    const { client, lines, packaging } = payload;

    if (!client?.companyName || !client?.contactEmail || !lines?.length) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
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
          filename: `solid-colour-order-${new Date()
            .toISOString()
            .slice(0, 10)}.json`,
          content: Buffer.from(JSON.stringify(payload, null, 2)).toString("base64"),
          contentType: "application/json",
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
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ success: true, orderId, emailSent: true }),
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
