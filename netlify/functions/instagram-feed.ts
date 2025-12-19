import type { Handler, HandlerEvent } from '@netlify/functions';

// Configure the function path
export const config = {
  path: '/api/instagram'
};

// Instagram API response types
interface InstagramMediaItem {
  id: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  caption?: string;
  timestamp: string;
}

interface InstagramAPIResponse {
  data: InstagramMediaItem[];
  paging?: {
    cursors: {
      before: string;
      after: string;
    };
    next?: string;
  };
  error?: {
    message: string;
    type: string;
    code: number;
  };
}

// Response format matching the frontend contract
interface InstagramFeedItem {
  id: string;
  type: 'IMAGE' | 'VIDEO' | 'REEL' | 'CAROUSEL';
  imageUrl: string;
  videoUrl: string | null;
  permalink: string;
  caption: string | null;
  timestamp: string;
}

interface InstagramApiResponse {
  items: InstagramFeedItem[];
  error: string | null;
  // Debug fields (only present when debug=1)
  brand?: string;
  pageIdLast4?: string;
  igIdLast4?: string;
  fetchedCount?: number;
}

// In-memory cache - store separate cache for each brand
const cache = new Map<string, { response: InstagramApiResponse; timestamp: number }>();

// Number of posts to fetch from API (matches display count to minimize response size)
const API_FETCH_LIMIT = 12;

// Get cache TTL from environment or default to 300 seconds
function getCacheTTL(): number {
  const ttl = process.env.IG_CACHE_TTL_SECONDS;
  if (ttl) {
    const parsed = parseInt(ttl, 10);
    if (!isNaN(parsed) && parsed > 0) {
      return parsed;
    }
  }
  return 300; // Default: 5 minutes
}

// Get API version from environment or default
function getApiVersion(): string {
  return process.env.IG_GRAPH_API_VERSION || 'v20.0';
}

// Transform Instagram media type to our contract type
function mapMediaType(mediaType: string): 'IMAGE' | 'VIDEO' | 'REEL' | 'CAROUSEL' {
  switch (mediaType) {
    case 'IMAGE':
      return 'IMAGE';
    case 'CAROUSEL_ALBUM':
      return 'CAROUSEL';
    case 'VIDEO':
    default:
      return 'VIDEO';
  }
}

// Transform Instagram API item to our contract format
function transformItem(item: InstagramMediaItem): InstagramFeedItem {
  const type = mapMediaType(item.media_type);
  
  // For IMAGE or CAROUSEL: imageUrl = media_url, videoUrl = null
  // For VIDEO/REEL: imageUrl = thumbnail_url (or media_url), videoUrl = media_url
  const isVideo = type === 'VIDEO' || type === 'REEL';
  
  return {
    id: item.id,
    type,
    imageUrl: isVideo ? (item.thumbnail_url || item.media_url) : item.media_url,
    videoUrl: isVideo ? item.media_url : null,
    permalink: item.permalink,
    caption: item.caption || null,
    timestamp: item.timestamp,
  };
}

// Direct fetch of Instagram media using User ID (new approach)
async function fetchInstagramMediaDirect(accessToken: string, userId: string, brand: string, debug: boolean): Promise<InstagramApiResponse> {
  const apiVersion = getApiVersion();
  const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';
  const url = `https://graph.facebook.com/${apiVersion}/${userId}?fields=media.limit(${API_FETCH_LIMIT}){${fields}}&access_token=${accessToken}`;

  console.log(`IG[${brand}] Direct fetch from User ID: ...${userId.slice(-4)}`);

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = (errorData as InstagramAPIResponse)?.error?.message || 'Unknown error';
      console.log(`IG[${brand}] API error: status=${response.status} error="${errorMessage}"`);
      const result: InstagramApiResponse = {
        items: [],
        error: `Instagram API error: ${errorMessage}`,
      };
      if (debug) {
        result.brand = brand;
        result.igIdLast4 = userId.slice(-4);
        result.fetchedCount = 0;
      }
      return result;
    }

    const data = await response.json();
    
    // Check if we got an error in the response body
    if (data.error) {
      console.log(`IG[${brand}] API returned error: "${data.error.message}"`);
      const result: InstagramApiResponse = {
        items: [],
        error: `Instagram API error: ${data.error.message}`,
      };
      if (debug) {
        result.brand = brand;
        result.igIdLast4 = userId.slice(-4);
        result.fetchedCount = 0;
      }
      return result;
    }

    // Extract media items from the nested structure
    const mediaData = data.media?.data || [];
    
    // Transform and return items (limit to API_FETCH_LIMIT for display)
    const items = mediaData.slice(0, API_FETCH_LIMIT).map(transformItem);
    
    console.log(`IG[${brand}] Success (direct): fetched=${items.length} posts`);
    
    const result: InstagramApiResponse = {
      items,
      error: null,
    };
    if (debug) {
      result.brand = brand;
      result.igIdLast4 = userId.slice(-4);
      result.fetchedCount = items.length;
    }
    return result;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown';
    console.log(`IG[${brand}] Exception: ${errorMsg}`);
    const result: InstagramApiResponse = {
      items: [],
      error: 'An unexpected error occurred while fetching Instagram posts.',
    };
    if (debug) {
      result.brand = brand;
      result.igIdLast4 = userId.slice(-4);
      result.fetchedCount = 0;
    }
    return result;
  }
}

// Fetch Instagram Business Account ID from Facebook Page
async function fetchInstagramBusinessAccountId(accessToken: string, pageId: string, brand: string): Promise<string | null> {
  const apiVersion = getApiVersion();
  const url = `https://graph.facebook.com/${apiVersion}/${pageId}?fields=instagram_business_account&access_token=${accessToken}`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = (errorData as { error?: { message: string } })?.error?.message || 'Unknown error';
      console.log(`IG[${brand}] Error fetching IG account: status=${response.status} error="${errorMessage}"`);
      return null;
    }

    const data = await response.json();
    
    if (!data.instagram_business_account?.id) {
      console.log(`IG[${brand}] No Instagram Business Account found for Page ID`);
      return null;
    }

    return data.instagram_business_account.id;
  } catch (error) {
    console.log(`IG[${brand}] Exception fetching IG account: ${error instanceof Error ? error.message : 'Unknown'}`);
    return null;
  }
}

// Fetch Instagram media using the Facebook Graph API (Page lookup mode)
async function fetchInstagramMediaViaPage(accessToken: string, pageId: string, brand: string, debug: boolean): Promise<InstagramApiResponse> {
  // Step 1: Get Instagram Business Account ID from Page ID
  const igAccountId = await fetchInstagramBusinessAccountId(accessToken, pageId, brand);
  
  if (!igAccountId) {
    const errorMsg = 'Failed to retrieve Instagram Business Account. Please ensure the Page ID is correct and connected to an Instagram Business Account.';
    console.log(`IG[${brand}] Failed to get IG account from Page ID`);
    const response: InstagramApiResponse = {
      items: [],
      error: errorMsg,
    };
    if (debug) {
      response.brand = brand;
      response.pageIdLast4 = pageId.slice(-4);
      response.igIdLast4 = '';
      response.fetchedCount = 0;
    }
    return response;
  }

  console.log(`IG[${brand}] Got IG account: ...${igAccountId.slice(-4)}`);

  // Step 2: Fetch media from Instagram Business Account
  const apiVersion = getApiVersion();
  const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';
  const url = `https://graph.facebook.com/${apiVersion}/${igAccountId}?fields=media.limit(${API_FETCH_LIMIT}){${fields}}&access_token=${accessToken}`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = (errorData as InstagramAPIResponse)?.error?.message || 'Unknown error';
      console.log(`IG[${brand}] API error: status=${response.status} error="${errorMessage}"`);
      const result: InstagramApiResponse = {
        items: [],
        error: `Instagram API error: ${errorMessage}`,
      };
      if (debug) {
        result.brand = brand;
        result.pageIdLast4 = pageId.slice(-4);
        result.igIdLast4 = igAccountId.slice(-4);
        result.fetchedCount = 0;
      }
      return result;
    }

    const data = await response.json();
    
    // Check if we got an error in the response body
    if (data.error) {
      console.log(`IG[${brand}] API returned error: "${data.error.message}"`);
      const result: InstagramApiResponse = {
        items: [],
        error: `Instagram API error: ${data.error.message}`,
      };
      if (debug) {
        result.brand = brand;
        result.pageIdLast4 = pageId.slice(-4);
        result.igIdLast4 = igAccountId.slice(-4);
        result.fetchedCount = 0;
      }
      return result;
    }

    // Extract media items from the nested structure
    const mediaData = data.media?.data || [];
    
    // Transform and return items (limit to API_FETCH_LIMIT for display)
    const items = mediaData.slice(0, API_FETCH_LIMIT).map(transformItem);
    
    console.log(`IG[${brand}] Success: fetched=${items.length} posts`);
    
    const result: InstagramApiResponse = {
      items,
      error: null,
    };
    if (debug) {
      result.brand = brand;
      result.pageIdLast4 = pageId.slice(-4);
      result.igIdLast4 = igAccountId.slice(-4);
      result.fetchedCount = items.length;
    }
    return result;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown';
    console.log(`IG[${brand}] Exception: ${errorMsg}`);
    const result: InstagramApiResponse = {
      items: [],
      error: 'An unexpected error occurred while fetching Instagram posts.',
    };
    if (debug) {
      result.brand = brand;
      result.pageIdLast4 = pageId.slice(-4);
      result.igIdLast4 = igAccountId.slice(-4);
      result.fetchedCount = 0;
    }
    return result;
  }
}

// Get allowed origins from environment or default to leeukopf.com
function getAllowedOrigin(requestOrigin: string | undefined): string {
  const allowedOrigins = [
    'https://leeukopf.com',
    'https://www.leeukopf.com',
    // Allow localhost for development
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
  ];
  
  // Also allow Netlify preview deployments
  if (requestOrigin && (
    allowedOrigins.includes(requestOrigin) ||
    requestOrigin.endsWith('.netlify.app')
  )) {
    return requestOrigin;
  }
  
  // Default to the main domain
  return 'https://leeukopf.com';
}

const handler: Handler = async (event: HandlerEvent) => {
  const requestOrigin = event.headers.origin || event.headers.Origin;
  
  // CORS headers for frontend requests - restricted to allowed domains
  const headers = {
    'Access-Control-Allow-Origin': getAllowedOrigin(requestOrigin),
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
    // Cache for 1 minute at browser/CDN level
    'Cache-Control': 'public, max-age=60',
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
      body: JSON.stringify({ items: [], error: 'Method not allowed' }),
    };
  }

  try {
    // Get brand from query parameter (default to leeukopf)
    const brand = event.queryStringParameters?.brand || 'leeukopf';
    
    // Get debug flag
    const debug = event.queryStringParameters?.debug === '1';
    
    // Validate brand parameter
    if (brand !== 'leeukopf' && brand !== 'gelitup') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ items: [], error: 'Invalid brand parameter. Use brand=leeukopf or brand=gelitup' }),
      };
    }

    // Get environment variables based on brand
    let accessToken: string | undefined;
    let userId: string | undefined;
    let pageId: string | undefined;
    
    if (brand === 'leeukopf') {
      // For Leeukopf: support both new direct USER_ID approach and legacy PAGE_ID approach
      accessToken = process.env.LEEUKOPF_IG_ACCESS_TOKEN || process.env.VITE_LEEUKOPF_IG_ACCESS_TOKEN || process.env.IG_ACCESS_TOKEN;
      userId = process.env.LEEUKOPF_IG_USER_ID; // Optional - if set, use direct fetch
      pageId = process.env.LEEUKOPF_IG_PAGE_ID || process.env.VITE_LEEUKOPF_IG_PAGE_ID || process.env.IG_PAGE_ID;
    } else {
      // For GelItUp: use direct USER_ID approach (required)
      accessToken = process.env.IG_GELITUP_ACCESS_TOKEN || process.env.VITE_GELITUP_IG_ACCESS_TOKEN;
      userId = process.env.IG_GELITUP_USER_ID || process.env.VITE_GELITUP_IG_USER_ID;
    }

    // Check for required environment variables
    if (!accessToken) {
      console.log(`IG[${brand}] Configuration error: missing access token`);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          items: [],
          error: 'Instagram feed is not configured. Please set the required environment variables.',
        }),
      };
    }

    // For gelitup, userId is required
    if (brand === 'gelitup' && !userId) {
      console.log(`IG[${brand}] Configuration error: missing user ID`);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          items: [],
          error: 'Instagram feed is not configured. Please set IG_GELITUP_USER_ID.',
        }),
      };
    }

    // For leeukopf, need either userId OR pageId
    if (brand === 'leeukopf' && !userId && !pageId) {
      console.log(`IG[${brand}] Configuration error: missing both user ID and page ID`);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          items: [],
          error: 'Instagram feed is not configured. Please set LEEUKOPF_IG_USER_ID or LEEUKOPF_IG_PAGE_ID.',
        }),
      };
    }

    // Check in-memory cache (separate cache per brand)
    const cacheTTL = getCacheTTL();
    const now = Date.now();
    const cached = cache.get(brand);
    
    if (cached && (now - cached.timestamp) < cacheTTL * 1000) {
      // If debug mode, add debug fields to cached response
      if (debug) {
        const cachedWithDebug = {
          ...cached.response,
          brand,
          igIdLast4: cached.response.igIdLast4 || '',
          fetchedCount: cached.response.items.length,
        };
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(cachedWithDebug),
        };
      }
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(cached.response),
      };
    }

    // Determine which fetch method to use and fetch Instagram media
    let response: InstagramApiResponse;
    
    if (brand === 'gelitup') {
      // GelItUp: Always use direct fetch with userId (already validated above)
      if (!userId) {
        // This should never happen due to validation above, but TypeScript needs assurance
        throw new Error('userId is required for gelitup but was not found');
      }
      console.log(`IG[${brand}] Mode: direct fetch`);
      response = await fetchInstagramMediaDirect(accessToken, userId, brand, debug);
    } else {
      // Leeukopf: Use direct fetch if userId is available, otherwise use page lookup
      if (userId) {
        console.log(`IG[${brand}] Mode: direct fetch (userId available)`);
        response = await fetchInstagramMediaDirect(accessToken, userId, brand, debug);
      } else if (pageId) {
        console.log(`IG[${brand}] Mode: page lookup (no userId, using pageId)`);
        response = await fetchInstagramMediaViaPage(accessToken, pageId, brand, debug);
      } else {
        // This should never happen due to validation above, but TypeScript needs assurance
        throw new Error('Either userId or pageId is required for leeukopf but neither was found');
      }
    }

    // Update cache for this brand
    cache.set(brand, { response, timestamp: now });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response),
    };
  } catch (error) {
    // Catch-all error handler to ensure we NEVER return 500
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.log(`IG[unknown] Unexpected handler error: ${errorMsg}`);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        items: [],
        error: 'An unexpected error occurred while loading the Instagram feed.',
      }),
    };
  }
};

export { handler };
