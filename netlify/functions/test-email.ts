import type { Handler, HandlerEvent } from '@netlify/functions';

// Configure the function path
export const config = {
  path: '/api/test-email'
};

const handler: Handler = async (event: HandlerEvent) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  // Return a success response to confirm the function is working
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      success: true,
      message: 'Netlify Function is working correctly!',
      timestamp: new Date().toISOString(),
      path: event.path,
      method: event.httpMethod,
    }),
  };
};

export { handler };
