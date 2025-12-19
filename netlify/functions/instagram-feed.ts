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
}

// In-memory cache - store separate cache for each brand
const cache = new Map<string, { response: InstagramApiResponse; timestamp: number }>();

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

// Fetch Instagram Business Account ID from Facebook Page
async function fetchInstagramBusinessAccountId(accessToken: string, pageId: string): Promise<string | null> {
  const apiVersion = getApiVersion();
  const url = `https://graph.facebook.com/${apiVersion}/${pageId}?fields=instagram_business_account&access_token=${accessToken}`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = (errorData as { error?: { message: string } })?.error?.message || 'Unknown error';
      console.error('Error fetching Instagram Business Account ID:', response.status, errorMessage);
      return null;
    }

    const data = await response.json();
    
    if (!data.instagram_business_account?.id) {
      console.error('No Instagram Business Account found for Page ID:', pageId);
      return null;
    }

    return data.instagram_business_account.id;
  } catch (error) {
    console.error('Exception fetching Instagram Business Account ID:', error);
    return null;
  }
}

// Fetch Instagram media using the Facebook Graph API
async function fetchInstagramMedia(accessToken: string, pageId: string): Promise<InstagramApiResponse> {
  // Step 1: Get Instagram Business Account ID from Page ID
  const igAccountId = await fetchInstagramBusinessAccountId(accessToken, pageId);
  
  if (!igAccountId) {
    console.error('Failed to get Instagram Business Account ID from Page ID:', pageId);
    return {
      items: [],
      error: 'Failed to retrieve Instagram Business Account. Please ensure the Page ID is correct and connected to an Instagram Business Account.',
    };
  }

  console.log(`Successfully retrieved Instagram Business Account ID: ${igAccountId} from Page ID: ${pageId}`);

  // Step 2: Fetch media from Instagram Business Account
  const apiVersion = getApiVersion();
  const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';
  const url = `https://graph.facebook.com/${apiVersion}/${igAccountId}?fields=media.limit(12){${fields}}&access_token=${accessToken}`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = (errorData as InstagramAPIResponse)?.error?.message || 'Unknown error';
      console.error('Instagram API error:', response.status, errorMessage);
      return {
        items: [],
        error: `Instagram API error: ${errorMessage}`,
      };
    }

    const data = await response.json();
    
    // Check if we got an error in the response body
    if (data.error) {
      console.error('Instagram API returned error:', data.error.message);
      return {
        items: [],
        error: `Instagram API error: ${data.error.message}`,
      };
    }

    // Extract media items from the nested structure
    const mediaData = data.media?.data || [];
    
    // Transform and return items (at most 4 for display)
    const items = mediaData.slice(0, 4).map(transformItem);
    
    console.log(`Successfully fetched ${items.length} Instagram posts`);
    
    return {
      items,
      error: null,
    };
  } catch (error) {
    console.error('Exception fetching Instagram media:', error);
    return {
      items: [],
      error: 'An unexpected error occurred while fetching Instagram posts.',
    };
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

  // Get brand from query parameter (default to leeukopf)
  const brand = event.queryStringParameters?.brand || 'leeukopf';
  
  // Validate brand parameter
  if (brand !== 'leeukopf' && brand !== 'gelitup') {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ items: [], error: 'Invalid brand parameter' }),
    };
  }

  // Get environment variables based on brand
  const accessToken = brand === 'leeukopf' 
    ? process.env.IG_ACCESS_TOKEN 
    : process.env.IG_GELITUP_ACCESS_TOKEN;
  // Support both old (USER_ID) and new (PAGE_ID) variable names for backward compatibility
  const pageId = brand === 'leeukopf' 
    ? (process.env.IG_PAGE_ID || process.env.IG_USER_ID)
    : (process.env.IG_GELITUP_PAGE_ID || process.env.IG_GELITUP_USER_ID);

  // Check for required environment variables
  if (!accessToken || !pageId) {
    console.error(`Instagram API misconfigured for brand ${brand}: missing access token or page ID.`);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
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
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(cached.response),
    };
  }

  try {
    // Fetch and transform Instagram media
    const response = await fetchInstagramMedia(accessToken, pageId);

    // Update cache for this brand
    cache.set(brand, { response, timestamp: now });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error('Unexpected error fetching Instagram feed:', error);
    
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
