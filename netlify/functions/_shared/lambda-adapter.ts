import type { Handler, HandlerEvent } from '@netlify/functions';

/**
 * Runs a classic (event → {statusCode, body}) handler as a modern Netlify function.
 * Modern functions get the full Netlify Blobs context, which strongly consistent reads need.
 */
export function asModernFunction(handler: Handler) {
  return async (req: Request, context?: { geo?: { country?: { name?: string; code?: string } } }): Promise<Response> => {
    const url = new URL(req.url);
    const headers: Record<string, string> = {};
    req.headers.forEach((v, k) => {
      headers[k.toLowerCase()] = v;
    });
    // Visitor country from Netlify's geolocation (never trusted from the request itself).
    delete headers['x-visitor-country'];
    const geoCountry = context?.geo?.country?.name || context?.geo?.country?.code;
    if (geoCountry) headers['x-visitor-country'] = geoCountry;
    const body = req.method === 'GET' || req.method === 'HEAD' ? null : await req.text();
    const event = {
      httpMethod: req.method,
      headers,
      multiValueHeaders: {},
      body,
      isBase64Encoded: false,
      path: url.pathname,
      rawUrl: req.url,
      rawQuery: url.search.replace(/^\?/, ''),
      queryStringParameters: Object.fromEntries(url.searchParams),
      multiValueQueryStringParameters: null,
    } as unknown as HandlerEvent;
    const res = (await handler(event, {} as never, () => undefined)) || { statusCode: 204, body: '' };
    return new Response(res.statusCode === 204 ? null : (res.body ?? ''), {
      status: res.statusCode,
      headers: (res.headers ?? {}) as Record<string, string>,
    });
  };
}
