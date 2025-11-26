import type { Handler, HandlerEvent } from '@netlify/functions';

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
}

interface TransformedMediaItem {
  id: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  mediaUrl: string;
  thumbnailUrl: string;
  permalink: string;
  caption?: string;
  timestamp: string;
}

// Fetch Instagram media using the Graph API
async function fetchInstagramMedia(accessToken: string, limit: number = 4): Promise<TransformedMediaItem[]> {
  // Instagram Graph API endpoint for user media
  const fields = 'id,media_type,media_url,thumbnail_url,permalink,caption,timestamp';
  const url = `https://graph.instagram.com/me/media?fields=${fields}&limit=${limit}&access_token=${accessToken}`;

  const response = await fetch(url);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Instagram API error:', response.status, errorData);
    throw new Error(`Instagram API returned ${response.status}`);
  }

  const data: InstagramAPIResponse = await response.json();

  // Transform the data to a cleaner format
  return data.data.map((item) => ({
    id: item.id,
    mediaType: item.media_type,
    // For videos, use thumbnail_url; for images/carousels, use media_url
    mediaUrl: item.media_url,
    thumbnailUrl: item.thumbnail_url || item.media_url,
    permalink: item.permalink,
    caption: item.caption,
    timestamp: item.timestamp,
  }));
}

const handler: Handler = async (event: HandlerEvent) => {
  // CORS headers for frontend requests
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
    // Cache for 5 minutes to reduce API calls
    'Cache-Control': 'public, max-age=300, s-maxage=300',
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

  // Get Instagram access token from environment variable
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

  if (!accessToken) {
    console.error('INSTAGRAM_ACCESS_TOKEN environment variable not set');
    return {
      statusCode: 503,
      headers,
      body: JSON.stringify({ 
        error: 'Instagram feed not configured',
        posts: [] 
      }),
    };
  }

  try {
    // Fetch 4 latest media items
    const posts = await fetchInstagramMedia(accessToken, 4);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ posts }),
    };
  } catch (error) {
    console.error('Error fetching Instagram feed:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to fetch Instagram feed',
        posts: [] 
      }),
    };
  }
};

export { handler };
