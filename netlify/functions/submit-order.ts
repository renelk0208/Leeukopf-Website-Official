import type { Handler, HandlerEvent } from '@netlify/functions';
import { randomBytes } from 'node:crypto';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

export const config = {
  path: '/api/submit-order',
};

interface OrderLine {
  code: string;
  product_name: string;
  size: string;
  unit: string;
  quantity: number;
  moq: string;
  notes?: string;
}

interface CustomerDetails {
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  country: string;
  vat_number?: string;
  shipping_address: string;
  additional_comments?: string;
}

interface OrderSubmission {
  customer: CustomerDetails;
  items: OrderLine[];
  order_date: string;
}

type OrderPersistResult = {
  emailSent: boolean;
  emailError?: string;
  source?: string;
};

interface B2BCustomerDetails {
  companyName: string;
  vatNumber: string;
  invoiceAddress: string;
  invoicePostalCode: string;
  invoiceCity: string;
  invoiceRegion: string;
  invoiceCountry: string;
  shippingAddress: string;
  shippingPostalCode: string;
  shippingCity: string;
  shippingRegion: string;
  shippingCountry: string;
  contactPerson: string;
  contactEmail: string;
  contactNumber: string;
  orderDate: string;
  signatureName: string;
  notes: string;
}

interface B2BOrderSubmission {
  customer: B2BCustomerDetails;
  order: {
    items: Array<{
      groupCode: string;
      shadeCode: string;
      packSize: string;
      qty: number;
      moq: number;
      productName?: string;
    }>;
    totals?: {
      totalItems?: number;
      totalUnits?: number;
    };
  };
  createdAt?: string;
  source?: string;
}

// Sanitize string input
function sanitizeString(input: string, maxLength: number = 500): string {
  return input.trim().slice(0, maxLength);
}

// Validate email format
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Generate order reference ID
function generateOrderId(): string {
  const timestamp = Date.now().toString(36);
  const random = randomBytes(4).toString('hex').toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

function isB2BOrderSubmission(data: unknown): data is B2BOrderSubmission {
  if (!data || typeof data !== 'object') return false;
  const candidate = data as B2BOrderSubmission;
  return Boolean(candidate.customer && candidate.order && Array.isArray(candidate.order.items));
}

function normalizeOrderSubmission(input: unknown): OrderSubmission {
  if (isB2BOrderSubmission(input)) {
    return {
      customer: {
        company_name: input.customer.companyName,
        contact_name: input.customer.contactPerson,
        email: input.customer.contactEmail,
        phone: input.customer.contactNumber,
        country: input.customer.shippingCountry || input.customer.invoiceCountry,
        vat_number: input.customer.vatNumber,
        shipping_address: [
          input.customer.shippingAddress,
          input.customer.shippingPostalCode,
          input.customer.shippingCity,
          input.customer.shippingRegion,
          input.customer.shippingCountry,
        ]
          .filter(Boolean)
          .join(', '),
        additional_comments: [
          input.customer.notes,
          `Signature: ${input.customer.signatureName}`,
          `Invoice: ${[
            input.customer.invoiceAddress,
            input.customer.invoicePostalCode,
            input.customer.invoiceCity,
            input.customer.invoiceRegion,
            input.customer.invoiceCountry,
          ]
            .filter(Boolean)
            .join(', ')}`,
        ]
          .filter(Boolean)
          .join('\n'),
      },
      items: input.order.items.map((item) => ({
        code: `${item.groupCode}-${item.shadeCode}`,
        product_name: item.productName || item.groupCode,
        size: item.packSize,
        unit: 'pcs',
        quantity: Number(item.qty) || 0,
        moq: String(item.moq ?? ''),
      })),
      order_date: input.customer.orderDate || input.createdAt || new Date().toISOString(),
    };
  }

  return input as OrderSubmission;
}

// Validate order submission
function validateOrderSubmission(data: OrderSubmission): { valid: boolean; error?: string } {
  // Check customer details
  if (!data.customer || typeof data.customer !== 'object') {
    return { valid: false, error: 'Invalid customer details' };
  }

  const { company_name, email } = data.customer;

  if (!company_name || sanitizeString(company_name) === '') {
    return { valid: false, error: 'Company name is required' };
  }

  if (!email || !isValidEmail(email)) {
    return { valid: false, error: 'Valid email is required' };
  }

  // Check items
  if (!Array.isArray(data.items) || data.items.length === 0) {
    return { valid: false, error: 'At least one order item is required' };
  }

  // Validate each item
  for (const item of data.items) {
    if (!item.code || !item.product_name || !item.quantity || item.quantity <= 0) {
      return { valid: false, error: 'Invalid order item data' };
    }
  }

  return { valid: true };
}

async function storeOrder(orderId: string, orderData: OrderSubmission, result: OrderPersistResult): Promise<void> {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Order persistence is not configured. Missing SUPABASE_URL/VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
  }

  const adminSupabase = createClient(supabaseUrl, serviceRoleKey);

  const lineCount = orderData.items.length;
  const totalQty = orderData.items.reduce((sum, item) => sum + item.quantity, 0);

  const { error } = await adminSupabase.from('b2b_orders').insert({
    order_id: orderId,
    status: 'completed',
    order_date: orderData.order_date,
    company_name: orderData.customer.company_name,
    contact_name: orderData.customer.contact_name,
    contact_email: orderData.customer.email,
    contact_phone: orderData.customer.phone,
    country: orderData.customer.country,
    vat_number: orderData.customer.vat_number || null,
    shipping_address: orderData.customer.shipping_address,
    line_count: lineCount,
    total_qty: totalQty,
    items: orderData.items,
    source: result.source || 'b2b_portal_checkout',
    email_sent: result.emailSent,
    email_error: result.emailError || null,
  });

  if (error) {
    throw new Error(`Failed to persist order: ${error.message}`);
  }
}

function generateOrderEmailHtml(orderId: string, orderData: OrderSubmission): string {
  const itemsHtml = orderData.items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px;border:1px solid #e5e7eb;">${item.code}</td>
          <td style="padding:8px;border:1px solid #e5e7eb;">${item.product_name}</td>
          <td style="padding:8px;border:1px solid #e5e7eb;">${item.size}</td>
          <td style="padding:8px;border:1px solid #e5e7eb;text-align:right;">${item.quantity}</td>
          <td style="padding:8px;border:1px solid #e5e7eb;text-align:right;">${item.moq}</td>
        </tr>
      `
    )
    .join('');

  const totalQty = orderData.items.reduce((sum, item) => sum + item.quantity, 0);

  return `
    <h2>New B2B Order</h2>
    <p><strong>Order ID:</strong> ${orderId}</p>
    <p><strong>Order Date:</strong> ${orderData.order_date}</p>
    <h3>Customer</h3>
    <p>
      <strong>Company:</strong> ${orderData.customer.company_name}<br>
      <strong>Contact:</strong> ${orderData.customer.contact_name}<br>
      <strong>Email:</strong> ${orderData.customer.email}<br>
      <strong>Phone:</strong> ${orderData.customer.phone}<br>
      <strong>Country:</strong> ${orderData.customer.country}<br>
      <strong>VAT:</strong> ${orderData.customer.vat_number ?? '-'}<br>
      <strong>Shipping Address:</strong> ${orderData.customer.shipping_address}
    </p>
    <h3>Order Items</h3>
    <table style="width:100%;border-collapse:collapse;">
      <thead>
        <tr>
          <th style="padding:8px;border:1px solid #e5e7eb;text-align:left;">Code</th>
          <th style="padding:8px;border:1px solid #e5e7eb;text-align:left;">Product</th>
          <th style="padding:8px;border:1px solid #e5e7eb;text-align:left;">Size</th>
          <th style="padding:8px;border:1px solid #e5e7eb;text-align:right;">Qty</th>
          <th style="padding:8px;border:1px solid #e5e7eb;text-align:right;">MOQ</th>
        </tr>
      </thead>
      <tbody>${itemsHtml}</tbody>
    </table>
    <p style="margin-top:12px;"><strong>Total Quantity:</strong> ${totalQty}</p>
    ${
      orderData.customer.additional_comments
        ? `<h3>Notes</h3><p>${orderData.customer.additional_comments.replace(/\n/g, '<br>')}</p>`
        : ''
    }
  `;
}

async function sendOrderEmail(orderId: string, orderData: OrderSubmission): Promise<void> {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    throw new Error('Order email is not configured (missing RESEND_API_KEY).');
  }

  const toEmail =
    process.env.ORDER_NOTIFICATION_EMAIL ||
    process.env.ORDERS_INBOX_EMAIL ||
    'leeukopf@gmail.com';
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@leeukopf.com';
  const resend = new Resend(resendApiKey);

  await resend.emails.send({
    from: `Leeukopf Orders <${fromEmail}>`,
    to: toEmail,
    subject: `New B2B Order ${orderId}`,
    html: generateOrderEmailHtml(orderId, orderData),
    replyTo: orderData.customer.email,
  });

  await resend.emails.send({
    from: `Leeukopf Orders <${fromEmail}>`,
    to: orderData.customer.email,
    subject: `We received your order ${orderId}`,
    html: `
      <h2>Thank you for your order</h2>
      <p>Order ID: <strong>${orderId}</strong></p>
      <p>Company: ${orderData.customer.company_name}</p>
      <p>Our Admin Office will be in touch with you shortly for your pro forma.</p>
    `,
  });
}

export const handler: Handler = async (event: HandlerEvent) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Parse request body
    const body = event.body;
    if (!body) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Request body is required' }),
      };
    }

    // Check payload size (prevent extremely large payloads)
    if (body.length > 1024 * 1024) { // 1MB limit
      return {
        statusCode: 413,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Payload too large' }),
      };
    }

    const rawOrderData = JSON.parse(body) as unknown;
    const orderData = normalizeOrderSubmission(rawOrderData);

    // Validate order
    const validation = validateOrderSubmission(orderData);
    if (!validation.valid) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: validation.error }),
      };
    }

    // Sanitize customer data
    const sanitizedOrder: OrderSubmission = {
      customer: {
        company_name: sanitizeString(orderData.customer.company_name, 200),
        contact_name: sanitizeString(orderData.customer.contact_name, 200),
        email: sanitizeString(orderData.customer.email, 200),
        phone: sanitizeString(orderData.customer.phone, 50),
        country: sanitizeString(orderData.customer.country, 100),
        vat_number: orderData.customer.vat_number
          ? sanitizeString(orderData.customer.vat_number, 50)
          : undefined,
        shipping_address: sanitizeString(orderData.customer.shipping_address, 500),
        additional_comments: orderData.customer.additional_comments
          ? sanitizeString(orderData.customer.additional_comments, 1000)
          : undefined,
      },
      items: orderData.items.map((item) => ({
        code: sanitizeString(item.code, 50),
        product_name: sanitizeString(item.product_name, 200),
        size: sanitizeString(item.size, 20),
        unit: sanitizeString(item.unit, 20),
        quantity: Math.max(0, Math.floor(item.quantity)),
        moq: sanitizeString(item.moq, 20),
        notes: item.notes ? sanitizeString(item.notes, 500) : undefined,
      })),
      order_date: orderData.order_date,
    };

    // Generate order ID
    const orderId = generateOrderId();
    const source = isB2BOrderSubmission(rawOrderData)
      ? sanitizeString(rawOrderData.source || 'b2b_portal_checkout', 100)
      : 'submit_order_api';

    let emailSent = true;
    let emailError: string | undefined;

    try {
      await sendOrderEmail(orderId, sanitizedOrder);
    } catch (sendError) {
      emailSent = false;
      emailError = sendError instanceof Error ? sendError.message : 'Unknown email error';
      console.error('Order email dispatch failed:', sendError);
    }

    await storeOrder(orderId, sanitizedOrder, {
      emailSent,
      emailError,
      source,
    });

    // Return success response
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: true,
        order_id: orderId,
        email_sent: emailSent,
        message: emailSent
          ? 'Order submitted successfully'
          : 'Order saved successfully, but confirmation email could not be sent. Admin can still view it in completed orders.',
      }),
    };
  } catch (error) {
    console.error('Error processing order:', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: false,
        error: 'Internal server error',
      }),
    };
  }
};
