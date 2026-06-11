import { Handler } from "@netlify/functions";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SolidOrderClient {
  companyName: string;
  contactEmail: string;
  vat?: string;
  country?: string;
}

interface SolidOrderLine {
  sku: string;
  qty: number | string;
}

interface SolidOrderPayload {
  client: SolidOrderClient;
  lines: SolidOrderLine[];
}

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const token = event.headers["x-solid-order-token"];
    if (token !== process.env.SOLID_COLOUR_ORDER_TOKEN) {
      return { statusCode: 401, body: "Unauthorized" };
    }

    if (!event.body) {
      return { statusCode: 400, body: "Missing body" };
    }

    const payload = JSON.parse(event.body) as Partial<SolidOrderPayload>;

    const { client, lines } = payload;

    if (!client?.companyName || !client?.contactEmail || !lines?.length) {
      return { statusCode: 400, body: "Invalid order payload" };
    }

    const totalUnits = lines.reduce(
      (sum: number, line: SolidOrderLine) => sum + (Number(line.qty) || 0),
      0
    );

    const linesText = lines
      .map((line: SolidOrderLine) => `• ${line.sku} x ${line.qty}`)
      .join("\n");

    const subject = `Solid Colour Order — ${client.companyName}`;

    const text = `
Solid Colour Order Submission

Company: ${client.companyName}
VAT: ${client.vat || ""}
Country: ${client.country || ""}
Contact Email: ${client.contactEmail}

Total Units: ${totalUnits}

Order Lines:
${linesText}
`;

    const result = await resend.emails.send({
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

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ success: true, result }),
    };
  } catch (error) {
    console.error("Order submission error:", error);
    return { statusCode: 500, body: "Server error" };
  }
};
