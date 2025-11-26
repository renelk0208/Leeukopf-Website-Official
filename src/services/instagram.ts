/**
 * Instagram Graph API client for fetching media from the frontend.
 * 
 * SECURITY NOTE: This file exposes the long-lived Instagram token to the browser.
 * Only use this if you accept that the token will be visible in client-side code.
 * For production, consider using the serverless function at /api/instagram instead.
 */

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

// Response format for the frontend
export interface InstagramFeedItem {
  id: string;
  type: 'IMAGE' | 'VIDEO' | 'REEL' | 'CAROUSEL';
  imageUrl: string;
  videoUrl: string | null;
  permalink: string;
  caption: string | null;
  timestamp: string;
}

export interface InstagramApiResponse {
  items: InstagramFeedItem[];
  error: string | null;
}

// Get the long-lived token from Vite environment variables
function getAccessToken(): string | undefined {
  return import.meta.env.VITE_INSTAGRAM_LONG_LIVED_TOKEN;
}

// Default API version
const API_VERSION = 'v18.0';

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

/**
 * Fetches Instagram media directly from the Graph API.
 * 
 * This function uses the VITE_INSTAGRAM_LONG_LIVED_TOKEN environment variable.
 * It should only be used if you're comfortable exposing the token in client-side code.
 * 
 * For production use, prefer calling the serverless function at /api/instagram.
 * 
 * @param limit - Maximum number of media items to fetch (default: 4)
 * @returns Promise with Instagram media items or error
 */
export async function fetchInstagramMedia(limit: number = 4): Promise<InstagramApiResponse> {
  const accessToken = getAccessToken();

  if (!accessToken) {
    console.warn('Instagram access token not configured. Set VITE_INSTAGRAM_LONG_LIVED_TOKEN.');
    return {
      items: [],
      error: 'TOKEN_NOT_CONFIGURED',
    };
  }

  try {
    // The long-lived token includes user context, so we can use 'me' for the user ID
    const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';
    const url = `https://graph.instagram.com/${API_VERSION}/me/media?fields=${fields}&access_token=${accessToken}&limit=${limit}`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})) as InstagramAPIResponse;
      const errorMessage = errorData?.error?.message || 'Unknown error';
      console.error('Instagram API error:', response.status, errorMessage);
      return {
        items: [],
        error: 'UPSTREAM_ERROR',
      };
    }

    const data: InstagramAPIResponse = await response.json();

    // Check if we got an error in the response body
    if (data.error) {
      console.error('Instagram API returned error:', data.error.message);
      return {
        items: [],
        error: 'UPSTREAM_ERROR',
      };
    }

    // Transform and return items
    const items = (data.data || []).slice(0, limit).map(transformItem);

    return {
      items,
      error: null,
    };
  } catch (error) {
    console.error('Failed to fetch Instagram media:', error);
    return {
      items: [],
      error: 'NETWORK_ERROR',
    };
  }
}

/**
 * Helper to fetch Instagram media via the serverless function.
 * This is the recommended approach for production as it doesn't expose tokens.
 * 
 * @returns Promise with Instagram media items or error
 */
export async function fetchInstagramMediaViaServer(): Promise<InstagramApiResponse> {
  try {
    const response = await fetch('/api/instagram');

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data: InstagramApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to load Instagram feed:', error);
    return {
      items: [],
      error: 'NETWORK_ERROR',
    };
  }
}
