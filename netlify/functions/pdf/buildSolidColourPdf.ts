import fs from "fs";
import path from "path";
import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, PDFPage, StandardFonts, rgb } from "pdf-lib";

type Line = { code: string; name: string; qty: number; unit?: "pcs" | "kg" };

type Payload = {
  orderId: string;
  createdAt: string;
  orderFormat?: "finished_units" | "bulk";
  bulkContainer?: "1kg_flask" | "5kg_bucket" | null;
  client: {
    company: string;
    contactPerson: string;
    contactPhone: string;
    invoiceAddress: string;
    invoiceRegion: string;
    invoicePostalCode: string;
    shippingAddress: string;
    shippingRegion: string;
    shippingPostalCode: string;
    sameAddress: boolean;
    vat?: string;
    country?: string;
    contactEmail: string;
  };
  packaging: {
    mode: "standard" | "custom";
    system: "bottle" | "jar" | "bulk";
    bottle?: { size?: string; color?: string; brushShape?: string; brushType?: string };
    jar?: { size?: string; color?: string };
    customDescription?: string;
    notes?: string;
  };
  lines: Line[];
};

const A4 = { w: 595.28, h: 841.89 };
const M = 40;
const TOP = 40;
const BOTTOM = 86;
const LETTERHEAD_MAX_WIDTH = 170;
const LETTERHEAD_TOP_PADDING = 16;
const BODY_FONT_SIZE = 10;
const TITLE_FONT_SIZE = 16;
const SECTION_TITLE_FONT_SIZE = 12;
const LINE_GAP = 12;
const RIGHT_EDGE = A4.w - M;
const LETTERHEAD_INFO_FONT_SIZE = 8;
const LETTERHEAD_INFO_LINE_GAP = 9;

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
    const isBulkKg = data.lines.length > 0 && data.lines.every((line) => line.unit === "kg");
    const qtyLabel = isBulkKg ? "QTY (kg)" : "QTY (pcs)";
    const totalLabel = isBulkKg ? "Total KG" : "Total Units";

  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);

  let font = await pdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  try {
    const customFontPath = path.join(process.cwd(), "netlify/functions/assets/pf-futura-neu-book.ttf");
    if (fs.existsSync(customFontPath)) {
      const customFontBytes = fs.readFileSync(customFontPath);
      font = await pdf.embedFont(customFontBytes);
    }
  } catch {
    font = await pdf.embedFont(StandardFonts.Helvetica);
  }

  const resolveAssetPath = (fileName: string): string | null => {
    const candidates = [
      path.join(process.cwd(), `netlify/functions/assets/${fileName}`),
      path.join(process.cwd(), `.netlify/functions-assets/${fileName}`),
    ];

    return candidates.find((candidate) => fs.existsSync(candidate)) || null;
  };

  let letterheadImage: Awaited<ReturnType<typeof pdf.embedPng>> | null = null;
  let letterheadDims: { width: number; height: number } | null = null;
  let watermarkImage: Awaited<ReturnType<typeof pdf.embedPng>> | null = null;
  let watermarkDims: { width: number; height: number } | null = null;

  try {
    const letterheadPath = resolveAssetPath("leeukopf_black.png") || resolveAssetPath("leeukopf-logo.png");
    if (letterheadPath) {
      const letterheadBytes = fs.readFileSync(letterheadPath);
      letterheadImage = await pdf.embedPng(letterheadBytes);
      letterheadDims = letterheadImage.scale(0.6);
    }

    const watermarkPath = resolveAssetPath("watermark.logo.Lion.png") || resolveAssetPath("leeukopf-logo.png");
    if (watermarkPath) {
      const watermarkBytes = fs.readFileSync(watermarkPath);
      watermarkImage = await pdf.embedPng(watermarkBytes);
      watermarkDims = watermarkImage.scale(0.8);
    }
  } catch {
    letterheadImage = null;
    letterheadDims = null;
    watermarkImage = null;
    watermarkDims = null;
  }

  const drawLogoWatermark = (page: PDFPage) => {
    if (!watermarkImage || !watermarkDims) {
      return;
    }

    const watermarkWidth = Math.min(watermarkDims.width, A4.w - (M * 2));
    const ratio = watermarkWidth / watermarkDims.width;
    const watermarkHeight = watermarkDims.height * ratio;

    page.drawImage(watermarkImage, {
      x: (A4.w - watermarkWidth) / 2,
      y: (A4.h - watermarkHeight) / 2,
      width: watermarkWidth,
      height: watermarkHeight,
      opacity: 1,
    });
  };

  const drawLogoHeader = (page: PDFPage) => {
    if (!letterheadImage || !letterheadDims) {
      return;
    }

    const headerWidth = Math.min(LETTERHEAD_MAX_WIDTH, letterheadDims.width);
    const ratio = headerWidth / letterheadDims.width;
    const headerHeight = letterheadDims.height * ratio;

    page.drawImage(letterheadImage, {
      x: M,
      y: A4.h - LETTERHEAD_TOP_PADDING - headerHeight,
      width: headerWidth,
      height: headerHeight,
      opacity: 1,
    });
  };

  const drawCompanyHeaderDetails = (page: PDFPage, logoHeight: number) => {
    const infoX = M + LETTERHEAD_MAX_WIDTH + 12;
    const infoTopY = A4.h - LETTERHEAD_TOP_PADDING - 2;

    const lines = [
      "Head Office:",
      "Thermitek Ltd, 8 Racho Dimchev, Sofia, 1000",
      "Factory Address:",
      "Leeukopf Laboratories, 30 Zelenondolsko Shose, Blagoevgrad, 2700",
      "Tel: (+359) 73 891 041",
      "Email: info@leeukopf.com",
    ];

    let y = infoTopY;
    for (const [index, value] of lines.entries()) {
      const isHeading = index === 0 || index === 2;
      text(page, value, infoX, y, LETTERHEAD_INFO_FONT_SIZE, isHeading);
      y -= LETTERHEAD_INFO_LINE_GAP;
    }

    return Math.max(logoHeight, lines.length * LETTERHEAD_INFO_LINE_GAP);
  };

  const text = (page: PDFPage, value: string, x: number, y: number, size = BODY_FONT_SIZE, bold = false) => {
    page.drawText(value ?? "—", {
      x,
      y,
      size,
      font: bold ? fontBold : font,
      color: rgb(0, 0, 0),
    });
  };

  const textRight = (page: PDFPage, value: string, rightX: number, y: number, size = BODY_FONT_SIZE, bold = false) => {
    const safeValue = value ?? "—";
    const activeFont = bold ? fontBold : font;
    const textWidth = activeFont.widthOfTextAtSize(safeValue, size);
    text(page, safeValue, rightX - textWidth, y, size, bold);
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
    line(page, 72, 0.8);
    page.drawRectangle({
      x: M,
      y: 31,
      width: 4,
      height: 8,
      color: rgb(0.34, 0.22, 0.09),
    });
    page.drawCircle({
      x: M + 2,
      y: 42,
      size: 5,
      color: rgb(0.18, 0.52, 0.24),
    });
    page.drawCircle({
      x: M - 2,
      y: 40,
      size: 4,
      color: rgb(0.18, 0.52, 0.24),
    });
    page.drawCircle({
      x: M + 6,
      y: 40,
      size: 4,
      color: rgb(0.18, 0.52, 0.24),
    });
    text(
      page,
      "Thank you for your request. Our team will be in contact with you very soon.",
      M,
      54,
      BODY_FONT_SIZE,
      true
    );
    text(page, "Think before you print — together we reduce waste.", M + 14, 34, BODY_FONT_SIZE, false);
  };

  const drawHeaderBlocks = (page: PDFPage): number => {
    drawLogoWatermark(page);
    drawLogoHeader(page);

    const letterheadHeight = letterheadDims ? Math.min(LETTERHEAD_MAX_WIDTH, letterheadDims.width) * (letterheadDims.height / letterheadDims.width) : 0;
    const headerDetailsHeight = drawCompanyHeaderDetails(page, letterheadHeight);
    let y = A4.h - TOP - headerDetailsHeight - 8;

    text(page, "Solid Colour Order Request", M, y, TITLE_FONT_SIZE, true);
    y -= 18;

    text(page, `Order ID: ${data.orderId}`, M, y, BODY_FONT_SIZE, true);
    textRight(page, `Date: ${data.createdAt}`, RIGHT_EDGE, y, BODY_FONT_SIZE, false);
    y -= LINE_GAP;
    line(page, y);
    y -= LINE_GAP;

    text(page, "Client Details", M, y, SECTION_TITLE_FONT_SIZE, true);
    y -= LINE_GAP;

    const leftX = M;
    const rightX = A4.w / 2 + 10;
    const yStart = y;

    text(page, `Company: ${safe(data.client.company)}`, leftX, y, BODY_FONT_SIZE);
    y -= LINE_GAP;
    text(page, `Invoice Address: ${safe(data.client.invoiceAddress)}`, leftX, y, BODY_FONT_SIZE);
    y -= LINE_GAP;
    text(page, `Invoice Region: ${safe(data.client.invoiceRegion)}`, leftX, y, BODY_FONT_SIZE);
    y -= LINE_GAP;
    text(page, `Invoice Postal Code: ${safe(data.client.invoicePostalCode)}`, leftX, y, BODY_FONT_SIZE);
    y -= LINE_GAP;
    text(page, `Shipping Address: ${safe(data.client.shippingAddress)}`, leftX, y, BODY_FONT_SIZE);
    y -= LINE_GAP;
    text(page, `Shipping Region: ${safe(data.client.shippingRegion)}`, leftX, y, BODY_FONT_SIZE);
    y -= LINE_GAP;
    text(page, `Shipping Postal Code: ${safe(data.client.shippingPostalCode)}`, leftX, y, BODY_FONT_SIZE);
    y -= LINE_GAP;
    text(page, `Same Address: ${data.client.sameAddress ? "Yes" : "No"}`, leftX, y, BODY_FONT_SIZE);
    y -= LINE_GAP;
    text(page, `VAT: ${safe(data.client.vat)}`, leftX, y, BODY_FONT_SIZE);
    y -= LINE_GAP;
    text(page, `Country: ${safe(data.client.country)}`, leftX, y, BODY_FONT_SIZE);

    let yRight = yStart;
    text(page, `Email: ${safe(data.client.contactEmail)}`, rightX, yRight, BODY_FONT_SIZE);
    yRight -= LINE_GAP;
    text(page, `Contact: ${safe(data.client.contactPerson)}`, rightX, yRight, BODY_FONT_SIZE);
    yRight -= LINE_GAP;
    text(page, `Phone: ${safe(data.client.contactPhone)}`, rightX, yRight, BODY_FONT_SIZE);

    y -= LINE_GAP;
    line(page, y);
    y -= LINE_GAP;

    text(page, "Packaging (applies to all shades)", M, y, SECTION_TITLE_FONT_SIZE, true);
    y -= LINE_GAP;
    const isBulkOrder = data.orderFormat === "bulk" || data.packaging.system === "bulk" || isBulkKg;
    const hasFlaskQty = data.lines.some((line) => (Number(line.qty) || 0) > 0 && (Number(line.qty) || 0) < 5);
    const hasBucketQty = data.lines.some((line) => (Number(line.qty) || 0) >= 5);
    const packagingChoice = isBulkOrder
      ? (hasFlaskQty && hasBucketQty
        ? "1kg Flasks + 5kg Buckets"
        : data.bulkContainer === "5kg_bucket" || hasBucketQty
          ? "5kg Buckets"
          : "1kg Flasks")
      : data.packaging.mode === "custom"
        ? "Custom"
        : "Standard";
    text(page, `Packaging choice: ${packagingChoice}`, M, y, BODY_FONT_SIZE);
    y -= LINE_GAP;
    text(page, `System: ${isBulkOrder ? "Bulk" : safe(data.packaging.system)}`, M, y, BODY_FONT_SIZE);
    y -= LINE_GAP;

    if (isBulkOrder || data.packaging.mode === "custom") {
      const descriptionLines = wrapText(`Custom packaging requested: ${safe(data.packaging.customDescription)}`, 95);
      text(page, descriptionLines[0], M, y);
      y -= LINE_GAP;
      for (let index = 1; index < descriptionLines.length; index += 1) {
        text(page, descriptionLines[index], M + 24, y);
        y -= LINE_GAP;
      }
    } else if (data.packaging.system === "bottle") {
      const bottle = data.packaging.bottle ?? {};
      text(page, `Bottle Size: ${safe(bottle.size)}`, M, y);
      y -= LINE_GAP;
      text(page, `Bottle Colour: ${safe(bottle.color)}`, M, y);
      y -= LINE_GAP;
      text(page, `Brush Shape: ${safe(bottle.brushShape)}`, M, y);
      y -= LINE_GAP;
      if (bottle.brushType) {
        text(page, `Brush Type: ${safe(bottle.brushType)}`, M, y);
        y -= LINE_GAP;
      }
    } else {
      const jar = data.packaging.jar ?? {};
      text(page, `Jar Size: ${safe(jar.size)}`, M, y);
      y -= LINE_GAP;
      text(page, `Jar Colour: ${safe(jar.color)}`, M, y);
      y -= LINE_GAP;
    }

    if (data.packaging.notes?.trim()) {
      const noteLines = wrapText(data.packaging.notes, 95);
      text(page, `Notes: ${noteLines[0]}`, M, y);
      y -= LINE_GAP;
      for (let index = 1; index < noteLines.length; index += 1) {
        text(page, noteLines[index], M + 48, y);
        y -= LINE_GAP;
      }
    }

    y -= 4;
    line(page, y);
    y -= LINE_GAP;

    text(page, "Order Lines", M, y, SECTION_TITLE_FONT_SIZE, true);
    y -= LINE_GAP;

    return y;
  };

  const drawTableHeader = (page: PDFPage, y: number) => {
    const colCode = M;
    const colName = M + 140;
    const colQtyRight = RIGHT_EDGE;

    text(page, "CODE", colCode, y, BODY_FONT_SIZE, true);
    text(page, "SHADE", colName, y, BODY_FONT_SIZE, true);
    textRight(page, qtyLabel, colQtyRight, y, BODY_FONT_SIZE, true);

    y -= 10;
    page.drawLine({
      start: { x: M, y },
      end: { x: A4.w - M, y },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8),
    });
    y -= LINE_GAP;

    return { y, colCode, colName, colQtyRight };
  };

  let page = pdf.addPage([A4.w, A4.h]);
  let y = drawHeaderBlocks(page);
  const tableHeader = drawTableHeader(page, y);
  y = tableHeader.y;
  let colCode = tableHeader.colCode;
  let colName = tableHeader.colName;
  let colQtyRight = tableHeader.colQtyRight;

  let totalUnits = 0;

  const ensureRoom = () => {
    if (y < BOTTOM) {
      page = pdf.addPage([A4.w, A4.h]);

      drawLogoWatermark(page);
      drawLogoHeader(page);

      const letterheadHeight = letterheadDims ? Math.min(LETTERHEAD_MAX_WIDTH, letterheadDims.width) * (letterheadDims.height / letterheadDims.width) : 0;
      const headerDetailsHeight = drawCompanyHeaderDetails(page, letterheadHeight);
      let y2 = A4.h - TOP - headerDetailsHeight - 8;
      text(page, "Solid Colour Order Request", M, y2, 14, true);
      y2 -= 16;
      text(page, `Order ID: ${data.orderId}`, M, y2, BODY_FONT_SIZE, true);
      textRight(page, `Date: ${data.createdAt}`, RIGHT_EDGE, y2, BODY_FONT_SIZE, false);
      y2 -= LINE_GAP;
      line(page, y2);
      y2 -= LINE_GAP;

      const tableHeader = drawTableHeader(page, y2);
      y = tableHeader.y;
      colCode = tableHeader.colCode;
      colName = tableHeader.colName;
      colQtyRight = tableHeader.colQtyRight;
    }
  };

  for (const row of data.lines) {
    ensureRoom();

    const code = safe(row.code);
    const qty = Number(row.qty) || 0;
    totalUnits += qty;

    const nameLines = wrapText(safe(row.name), 52).slice(0, 2);
    const rowHeight = LINE_GAP * nameLines.length;

    if (y - rowHeight < BOTTOM) {
      ensureRoom();
    }

    text(page, code, colCode, y, BODY_FONT_SIZE);
    text(page, nameLines[0], colName, y, BODY_FONT_SIZE);
    if (nameLines.length > 1) {
      text(page, nameLines[1], colName, y - LINE_GAP, BODY_FONT_SIZE);
    }

    textRight(page, `${qty} ${isBulkKg ? "kg" : "pcs"}`, colQtyRight, y, BODY_FONT_SIZE);
    y -= rowHeight;
  }

  y -= 10;
  page.drawLine({
    start: { x: M, y },
    end: { x: A4.w - M, y },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });
  y -= 14;

  textRight(page, `Total Shades: ${data.lines.length}`, RIGHT_EDGE, y, BODY_FONT_SIZE, true);
  y -= LINE_GAP;
  textRight(page, `${totalLabel}: ${totalUnits}${isBulkKg ? " kg" : " pcs"}`, RIGHT_EDGE, y, BODY_FONT_SIZE, true);

  footer(page);

  return pdf.save();
}
