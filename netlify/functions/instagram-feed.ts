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
  brand: string;
  items: InstagramFeedItem[];
  error?: string;
  errorCode?: number;
  errorType?: string;
  // Debug fields (only present when debug=1)
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
  return process.env.IG_GRAPH_API_VERSION || 'v21.0';
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

// Get Instagram Business Account ID from environment variables
function getInstagramBusinessAccountId(brand: string): string | null {
  let igUserId: string | undefined;
  
  if (brand === 'leeukopf') {
    // For Leeukopf: support new IG_LEEUKOPF_USER_ID and legacy names
    igUserId = process.env.IG_LEEUKOPF_USER_ID || process.env.LEEUKOPF_IG_USER_ID || process.env.IG_USER_ID;
  } else if (brand === 'gelitup') {
    // For GelItUp: support new IG_GELITUP_USER_ID and legacy names
    igUserId = process.env.IG_GELITUP_USER_ID || process.env.GELITUP_IG_USER_ID;
  }
  
  if (!igUserId) {
    console.log(`IG[${brand}] No Instagram Business Account ID found in environment variables`);
    return null;
  }
  
  console.log(`IG[${brand}] Using Instagram Business Account ID: ...${igUserId.slice(-4)}`);
  return igUserId;
}

// Fetch Instagram media using the correct Graph API flow
async function fetchInstagramMedia(accessToken: string, brand: string, debug: boolean): Promise<InstagramApiResponse> {
  // Step 1: Get Instagram Business Account ID from environment variables
  const igUserId = getInstagramBusinessAccountId(brand);
  
  if (!igUserId) {
    const errorMsg = 'Failed to retrieve Instagram Business Account ID. Please ensure the required environment variables are set (IG_LEEUKOPF_USER_ID or IG_GELITUP_USER_ID).';
    console.log(`IG[${brand}] Failed to get Instagram Business Account ID from environment`);
    const response: InstagramApiResponse = {
      brand,
      items: [],
      error: errorMsg,
    };
    if (debug) {
      response.igIdLast4 = '';
      response.fetchedCount = 0;
    }
    return response;
  }

  // Step 2: Fetch media directly from Instagram Business Account
  const apiVersion = getApiVersion();
  const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';
  const url = `https://graph.facebook.com/${apiVersion}/${igUserId}/media?fields=${fields}&limit=${API_FETCH_LIMIT}&access_token=${accessToken}`;

  console.log(`IG[${brand}] Fetching media from Instagram Business Account: ...${igUserId.slice(-4)}`);

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorObj = (errorData as InstagramAPIResponse)?.error;
      const errorMessage = errorObj?.message || 'Unknown error';
      const errorCode = errorObj?.code;
      console.log(`IG[${brand}] API error: status=${response.status} code=${errorCode || 'N/A'} message="${errorMessage}"`);
      const result: InstagramApiResponse = {
        brand,
        items: [],
        error: `Instagram API error (code ${errorCode || 'unknown'}): ${errorMessage}`,
      };
      // Detect error code 190 (token invalidated)
      if (errorCode === 190) {
        result.errorCode = 190;
        result.errorType = 'TOKEN_INVALIDATED';
      }
      if (debug) {
        result.igIdLast4 = igUserId.slice(-4);
        result.fetchedCount = 0;
      }
      return result;
    }

    const data: InstagramAPIResponse = await response.json();
    
    // Check if we got an error in the response body
    if (data.error) {
      const errorCode = data.error.code;
      const errorMessage = data.error.message;
      console.log(`IG[${brand}] API returned error: code=${errorCode || 'N/A'} message="${errorMessage}"`);
      const result: InstagramApiResponse = {
        brand,
        items: [],
        error: `Instagram API error (code ${errorCode || 'unknown'}): ${errorMessage}`,
      };
      // Detect error code 190 (token invalidated)
      if (errorCode === 190) {
        result.errorCode = 190;
        result.errorType = 'TOKEN_INVALIDATED';
      }
      if (debug) {
        result.igIdLast4 = igUserId.slice(-4);
        result.fetchedCount = 0;
      }
      return result;
    }

    // Extract media items and filter to only IMAGE, CAROUSEL_ALBUM, VIDEO
    const mediaData = (data.data || []).filter(item => 
      item.media_type === 'IMAGE' || 
      item.media_type === 'CAROUSEL_ALBUM' || 
      item.media_type === 'VIDEO'
    );
    
    // Transform and return items (limit to API_FETCH_LIMIT for display)
    const items = mediaData.slice(0, API_FETCH_LIMIT).map(transformItem);
    
    console.log(`IG[${brand}] Success: instagram_business_account_found=true fetchedCount=${items.length}`);
    
    const result: InstagramApiResponse = {
      brand,
      items,
    };
    if (debug) {
      result.igIdLast4 = igUserId.slice(-4);
      result.fetchedCount = items.length;
    }
    return result;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown';
    console.log(`IG[${brand}] Exception: ${errorMsg}`);
    const result: InstagramApiResponse = {
      brand,
      items: [],
      error: 'An unexpected error occurred while fetching Instagram posts.',
    };
    if (debug) {
      result.igIdLast4 = igUserId.slice(-4);
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
    // Cache for 5 minutes at browser/CDN level
    'Cache-Control': 'public, max-age=300',
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
    // Get brand from query parameter (NO DEFAULT - must be explicit)
    const brand = event.queryStringParameters?.brand;
    
    // Get debug flag
    const debug = event.queryStringParameters?.debug === '1';
    
    // Brand parameter is REQUIRED
    if (!brand) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ brand: 'unknown', items: [], error: 'Missing brand parameter (expected leeukopf|gelitup)' }),
      };
    }
    
    // Validate brand parameter
    if (brand !== 'leeukopf' && brand !== 'gelitup') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ brand, items: [], error: 'Invalid brand parameter (expected leeukopf|gelitup)' }),
      };
    }

    // Get environment variables based on brand (using new naming convention)
    let accessToken: string | undefined;
    
    if (brand === 'leeukopf') {
      // For Leeukopf: support both new IG_LEEUKOPF_ACCESS_TOKEN and legacy names
      accessToken = process.env.IG_LEEUKOPF_ACCESS_TOKEN || process.env.LEEUKOPF_IG_ACCESS_TOKEN || process.env.VITE_LEEUKOPF_IG_ACCESS_TOKEN || process.env.IG_ACCESS_TOKEN;
    } else {
      // For GelItUp: support both new IG_GELITUP_ACCESS_TOKEN and legacy names
      accessToken = process.env.IG_GELITUP_ACCESS_TOKEN || process.env.VITE_GELITUP_IG_ACCESS_TOKEN;
    }

    // Check for required environment variables
    if (!accessToken) {
      console.log(`IG[${brand}] Configuration error: missing access token`);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          brand,
          items: [],
          error: 'Instagram feed is not configured. Please set the required environment variables.',
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

    // Fetch Instagram media using the correct Graph API flow
    console.log(`IG[${brand}] Fetching from Graph API`);
    const response = await fetchInstagramMedia(accessToken, brand, debug);

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
    
    // Extract brand from query params if possible
    const brand = event.queryStringParameters?.brand || 'unknown';
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        brand,
        items: [],
        error: 'An unexpected error occurred while loading the Instagram feed.',
      }),
    };
  }
};

export { handler };
