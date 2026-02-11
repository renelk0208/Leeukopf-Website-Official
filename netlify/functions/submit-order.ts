import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { randomBytes } from 'node:crypto';

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

// Store order (TODO: Replace with Google Sheets integration)
async function storeOrder(orderId: string, orderData: OrderSubmission): Promise<void> {
  // For now, just log to console in production
  // In development, this could write to a local file
  
  console.log('=== NEW ORDER RECEIVED ===');
  console.log('Order ID:', orderId);
  console.log('Customer:', orderData.customer.company_name);
  console.log('Email:', orderData.customer.email);
  console.log('Items count:', orderData.items.length);
  console.log('Total quantity:', orderData.items.reduce((sum, item) => sum + item.quantity, 0));
  console.log('Date:', orderData.order_date);
  console.log('Full order data:', JSON.stringify(orderData, null, 2));
  console.log('=========================');

  // TODO: Implement Google Sheets integration
  // This should:
  // 1. Authenticate with Google Sheets API
  // 2. Append order to a spreadsheet
  // 3. Send confirmation email to customer
  // 4. Send notification email to admin
}

export const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
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

    const orderData: OrderSubmission = JSON.parse(body);

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

    // Store order
    await storeOrder(orderId, sanitizedOrder);

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
        message: 'Order submitted successfully',
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
