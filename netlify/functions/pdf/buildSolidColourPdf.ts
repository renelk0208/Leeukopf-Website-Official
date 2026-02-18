import fs from "fs";
import path from "path";
import { PDFDocument, PDFPage, StandardFonts, rgb } from "pdf-lib";

type Line = { code: string; name: string; qty: number };

type Payload = {
  orderId: string;
  createdAt: string;
  client: {
    company: string;
    vat?: string;
    country?: string;
    contactEmail: string;
    contactPerson?: string;
    contactPhone?: string;
  };
  packaging: {
    mode: "standard" | "custom";
    system: "bottle" | "jar";
    bottle?: { size?: string; color?: string; brushShape?: string; brushType?: string };
    jar?: { size?: string; color?: string };
    customDescription?: string;
    notes?: string;
  };
  lines: Line[];
};

const A4 = { w: 595.28, h: 841.89 };
const M = 48;
const TOP = 48;
const BOTTOM = 80;

function safe(value?: string): string {
  return value && value.trim().length ? value.trim() : "—";
}

function wrapText(text: string, maxChars: number): string[] {
  const words = (text ?? "").split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (test.length <= maxChars) {
      line = test;
    } else {
      if (line) {
        lines.push(line);
      }
      line = word;
    }
  }

  if (line) {
    lines.push(line);
  }

  return lines.length ? lines : ["—"];
}

export async function buildSolidColourPdf(data: Payload): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  let logoImage: Awaited<ReturnType<typeof pdf.embedPng>> | null = null;
  let logoDims: { width: number; height: number } | null = null;

  try {
    const logoPath = path.join(process.cwd(), "netlify/functions/assets/leeukopf-logo.png");
    const logoBytes = fs.readFileSync(logoPath);
    logoImage = await pdf.embedPng(logoBytes);
    logoDims = logoImage.scale(0.4);
  } catch {
    logoImage = null;
    logoDims = null;
  }

  const text = (page: PDFPage, value: string, x: number, y: number, size = 10.5, bold = false) => {
    page.drawText(value ?? "—", {
      x,
      y,
      size,
      font: bold ? fontBold : font,
      color: rgb(0, 0, 0),
    });
  };

  const line = (page: PDFPage, y: number, thickness = 1) => {
    page.drawLine({
      start: { x: M, y },
      end: { x: A4.w - M, y },
      thickness,
      color: rgb(0.85, 0.85, 0.85),
    });
  };

  const footer = (page: PDFPage) => {
    text(
      page,
      "This request is not a final invoice. A quotation will be sent by email once reviewed.",
      M,
      60,
      9.5,
      false
    );
    text(page, "Generated automatically by Leeukopf B2B Order System", M, 42, 9, false);
  };

  const drawHeaderBlocks = (page: PDFPage): number => {
    if (logoImage && logoDims) {
      page.drawImage(logoImage, {
        x: M,
        y: A4.h - TOP - logoDims.height + 10,
        width: logoDims.width,
        height: logoDims.height,
      });
    }

    let y = logoDims ? A4.h - TOP - logoDims.height - 10 : A4.h - TOP;

    text(page, "Solid Colour Order Request", M, y, 16, true);
    y -= 24;

    text(page, `Order ID: ${data.orderId}`, M, y, 10.5, true);
    text(page, `Date: ${data.createdAt}`, A4.w - M - 180, y, 10.5, false);
    y -= 18;
    line(page, y);
    y -= 18;

    text(page, "Client Details", M, y, 12, true);
    y -= 16;

    const leftX = M;
    const rightX = A4.w / 2 + 10;
    const yStart = y;

    text(page, `Company: ${safe(data.client.company)}`, leftX, y, 10.5);
    y -= 14;
    text(page, `VAT: ${safe(data.client.vat)}`, leftX, y, 10.5);
    y -= 14;
    text(page, `Country: ${safe(data.client.country)}`, leftX, y, 10.5);

    let yRight = yStart;
    text(page, `Email: ${safe(data.client.contactEmail)}`, rightX, yRight, 10.5);
    yRight -= 14;
    text(page, `Contact: ${safe(data.client.contactPerson)}`, rightX, yRight, 10.5);
    yRight -= 14;
    text(page, `Phone: ${safe(data.client.contactPhone)}`, rightX, yRight, 10.5);

    y -= 18;
    line(page, y);
    y -= 18;

    text(page, "Packaging (applies to all shades)", M, y, 12, true);
    y -= 16;
    const packagingChoice = data.packaging.mode === "custom" ? "Custom" : "Standard";
    text(page, `Packaging choice: ${packagingChoice}`, M, y, 10.5);
    y -= 14;
    text(page, `System: ${safe(data.packaging.system)}`, M, y, 10.5);
    y -= 14;

    if (data.packaging.mode === "custom") {
      const descriptionLines = wrapText(`Custom packaging requested: ${safe(data.packaging.customDescription)}`, 95);
      text(page, descriptionLines[0], M, y);
      y -= 14;
      for (let index = 1; index < descriptionLines.length; index += 1) {
        text(page, descriptionLines[index], M + 24, y);
        y -= 14;
      }
    } else if (data.packaging.system === "bottle") {
      const bottle = data.packaging.bottle ?? {};
      text(page, `Bottle Size: ${safe(bottle.size)}`, M, y);
      y -= 14;
      text(page, `Bottle Colour: ${safe(bottle.color)}`, M, y);
      y -= 14;
      text(page, `Brush Shape: ${safe(bottle.brushShape)}`, M, y);
      y -= 14;
      if (bottle.brushType) {
        text(page, `Brush Type: ${safe(bottle.brushType)}`, M, y);
        y -= 14;
      }
    } else {
      const jar = data.packaging.jar ?? {};
      text(page, `Jar Size: ${safe(jar.size)}`, M, y);
      y -= 14;
      text(page, `Jar Colour: ${safe(jar.color)}`, M, y);
      y -= 14;
    }

    if (data.packaging.notes?.trim()) {
      const noteLines = wrapText(data.packaging.notes, 95);
      text(page, `Notes: ${noteLines[0]}`, M, y);
      y -= 14;
      for (let index = 1; index < noteLines.length; index += 1) {
        text(page, noteLines[index], M + 48, y);
        y -= 14;
      }
    }

    y -= 6;
    line(page, y);
    y -= 18;

    text(page, "Order Lines", M, y, 12, true);
    y -= 18;

    return y;
  };

  const drawTableHeader = (page: PDFPage, y: number) => {
    const colCode = M;
    const colName = M + 140;
    const colQty = A4.w - M - 60;

    text(page, "CODE", colCode, y, 10.5, true);
    text(page, "SHADE", colName, y, 10.5, true);
    text(page, "QTY", colQty, y, 10.5, true);

    y -= 10;
    page.drawLine({
      start: { x: M, y },
      end: { x: A4.w - M, y },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8),
    });
    y -= 14;

    return { y, colCode, colName, colQty };
  };

  let page = pdf.addPage([A4.w, A4.h]);
  let y = drawHeaderBlocks(page);
  let { y: tableY, colCode, colName, colQty } = drawTableHeader(page, y);
  y = tableY;

  let totalUnits = 0;

  const ensureRoom = () => {
    if (y < BOTTOM) {
      footer(page);

      page = pdf.addPage([A4.w, A4.h]);

      if (logoImage && logoDims) {
        page.drawImage(logoImage, {
          x: M,
          y: A4.h - TOP - logoDims.height + 10,
          width: logoDims.width,
          height: logoDims.height,
        });
      }

      let y2 = logoDims ? A4.h - TOP - logoDims.height - 6 : A4.h - TOP;
      text(page, "Solid Colour Order Request", M, y2, 14, true);
      y2 -= 18;
      text(page, `Order ID: ${data.orderId}`, M, y2, 10.5, true);
      text(page, `Date: ${data.createdAt}`, A4.w - M - 180, y2, 10.5, false);
      y2 -= 14;
      line(page, y2);
      y2 -= 18;

      const tableHeader = drawTableHeader(page, y2);
      y = tableHeader.y;
      colCode = tableHeader.colCode;
      colName = tableHeader.colName;
      colQty = tableHeader.colQty;
    }
  };

  for (const row of data.lines) {
    ensureRoom();

    const code = safe(row.code);
    const qty = Number(row.qty) || 0;
    totalUnits += qty;

    const nameLines = wrapText(safe(row.name), 52).slice(0, 2);
    const rowHeight = 14 * nameLines.length;

    if (y - rowHeight < BOTTOM) {
      ensureRoom();
    }

    text(page, code, colCode, y, 10.5);
    text(page, nameLines[0], colName, y, 10.5);
    if (nameLines.length > 1) {
      text(page, nameLines[1], colName, y - 14, 10.5);
    }

    text(page, String(qty), colQty + 20, y, 10.5);
    y -= rowHeight;
  }

  y -= 10;
  page.drawLine({
    start: { x: M, y },
    end: { x: A4.w - M, y },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });
  y -= 18;

  text(page, `Total Shades: ${data.lines.length}`, A4.w - M - 220, y, 10.5, true);
  y -= 14;
  text(page, `Total Units: ${totalUnits}`, A4.w - M - 220, y, 10.5, true);

  footer(page);

  return pdf.save();
}
