import type { Handler, HandlerEvent } from '@netlify/functions';

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
}

// In-memory cache
let lastResponse: InstagramApiResponse | null = null;
let lastFetchTime: number | null = null;

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
  return process.env.IG_GRAPH_API_VERSION || 'v18.0';
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

// Fetch Instagram media using the Facebook Graph API
async function fetchInstagramMedia(accessToken: string, userId: string): Promise<InstagramApiResponse> {
  const apiVersion = getApiVersion();
  const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';
  const url = `https://graph.facebook.com/${apiVersion}/${userId}/media?fields=${fields}&access_token=${accessToken}&limit=4`;

  const response = await fetch(url);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = (errorData as InstagramAPIResponse)?.error?.message || 'Unknown error';
    console.error('Instagram API error:', response.status, errorMessage);
    return {
      items: [],
      error: 'UPSTREAM_ERROR',
    };
  }

  let data: InstagramAPIResponse;
  try {
    data = await response.json();
  } catch (parseError) {
    console.error('Failed to parse Instagram API response:', parseError);
    return {
      items: [],
      error: 'PARSE_ERROR',
    };
  }

  // Check if we got an error in the response body
  if (data.error) {
    console.error('Instagram API returned error:', data.error.message);
    return {
      items: [],
      error: 'UPSTREAM_ERROR',
    };
  }

  // Transform and return items (at most 4)
  const items = (data.data || []).slice(0, 4).map(transformItem);
  
  return {
    items,
    error: null,
  };
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

  // Get environment variables
  const accessToken = process.env.IG_ACCESS_TOKEN;
  const userId = process.env.IG_USER_ID;

  // Check for required environment variables
  if (!accessToken || !userId) {
    console.error('Instagram API misconfigured: missing env vars.');
    return {
      statusCode: 503,
      headers,
      body: JSON.stringify({ 
        items: [],
        error: 'SERVICE_UNAVAILABLE',
      }),
    };
  }

  // Check in-memory cache
  const cacheTTL = getCacheTTL();
  const now = Date.now();
  
  if (lastResponse && lastFetchTime && (now - lastFetchTime) < cacheTTL * 1000) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(lastResponse),
    };
  }

  try {
    // Fetch and transform Instagram media
    const response = await fetchInstagramMedia(accessToken, userId);

    // Update cache
    lastResponse = response;
    lastFetchTime = now;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error('Error fetching Instagram feed:', error);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        items: [],
        error: 'UPSTREAM_ERROR',
      }),
    };
  }
};

export { handler };
