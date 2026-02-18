import { Handler } from "@netlify/functions";
import { PDFDocument, StandardFonts } from "pdf-lib";
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

async function createOrderPdf(
  payload: OrderPayload,
  orderId: string,
  totalUnits: number
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  let currentPage = pdfDoc.addPage([595.28, 841.89]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const fontSize = 10;
  let y = 800;
  const createdAt = new Date();
  const createdAtText = createdAt.toLocaleString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const writeLine = (text: string, isBold = false, gap = 16) => {
    currentPage.drawText(text, {
      x: 40,
      y,
      size: fontSize,
      font: isBold ? boldFont : font,
    });
    y -= gap;
  };

  const ensurePageSpace = (requiredHeight = 20) => {
    if (y < 40 + requiredHeight) {
      currentPage = pdfDoc.addPage([595.28, 841.89]);
      y = 800;
    }
  };

  const drawTableHeader = () => {
    currentPage.drawText("Code", { x: 40, y, size: fontSize, font: boldFont });
    currentPage.drawText("Name", { x: 130, y, size: fontSize, font: boldFont });
    currentPage.drawText("Qty", { x: 520, y, size: fontSize, font: boldFont });
    y -= 12;
    currentPage.drawLine({
      start: { x: 40, y },
      end: { x: 555, y },
      thickness: 0.7,
    });
    y -= 12;
  };

  writeLine("Leeukopf Laboratories", true, 18);
  writeLine("Solid Colour Order Request", true, 18);
  y -= 2;
  writeLine(`Order ID: ${orderId}`);
  writeLine(`Date: ${createdAtText}`);
  y -= 4;

  writeLine("Client", true);
  writeLine(`Company: ${payload.client.companyName}`);
  writeLine(`VAT: ${payload.client.vat || ""}`);
  writeLine(`Country: ${payload.client.country || ""}`);
  writeLine(`Contact Email: ${payload.client.contactEmail}`);
  y -= 4;

  writeLine("Packaging", true);
  writeLine(`Packaging System: ${payload.packaging?.system || ""}`);
  writeLine(`Bottle Size: ${payload.packaging?.bottle?.size || ""}`);
  writeLine(`Bottle Color: ${payload.packaging?.bottle?.color || ""}`);
  writeLine(`Brush Shape: ${payload.packaging?.bottle?.brushShape || ""}`);
  writeLine(`Brush Type: ${payload.packaging?.bottle?.brushType || ""}`);
  const jarText = payload.packaging?.jar
    ? Object.entries(payload.packaging.jar)
        .map(([key, value]) => `${key}: ${String(value)}`)
        .join(", ")
    : "";
  writeLine(`Jar Details: ${jarText}`);
  writeLine(`Packaging Notes: ${payload.packaging?.notes || ""}`);

  y -= 6;
  writeLine("Lines", true);
  ensurePageSpace(60);
  drawTableHeader();

  for (const line of payload.lines) {
    if (y < 50) {
      currentPage = pdfDoc.addPage([595.28, 841.89]);
      y = 800;
      drawTableHeader();
    }
    currentPage.drawText(line.code || "", { x: 40, y, size: fontSize, font });
    currentPage.drawText(line.name || "", { x: 130, y, size: fontSize, font, maxWidth: 380 });
    currentPage.drawText(String(line.qty || 0), { x: 520, y, size: fontSize, font });
    y -= 14;
  }

  y -= 4;
  currentPage.drawLine({
    start: { x: 40, y },
    end: { x: 555, y },
    thickness: 0.7,
  });
  y -= 14;
  currentPage.drawText(`Total Units: ${totalUnits}`, {
    x: 430,
    y,
    size: fontSize,
    font: boldFont,
  });

  return pdfDoc.save();
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

    const pdfBytes = await createOrderPdf(payload, orderId, totalUnits);
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
