import type { Handler } from '@netlify/functions';

/**
 * Scheduled function to automatically refresh Instagram long-lived access tokens
 * Runs daily to check token expiry and refresh when needed
 * 
 * Schedule: Daily at 2 AM UTC (configured in netlify.toml)
 * 
 * Environment Variables Required:
 * - IG_ACCESS_TOKEN: Leeukopf long-lived access token
 * - IG_GELITUP_ACCESS_TOKEN: GEL.IT.UP long-lived access token
 * - FACEBOOK_APP_ID: Facebook App ID
 * - FACEBOOK_APP_SECRET: Facebook App Secret
 * - NETLIFY_API_TOKEN: Netlify personal access token (for updating env vars)
 * - NETLIFY_SITE_ID: Netlify site ID
 */

// Configuration
const DAYS_BEFORE_EXPIRY_TO_REFRESH = 7; // Refresh when less than 7 days remain
const GRAPH_API_VERSION = 'v18.0';

interface TokenDebugResponse {
  data: {
    app_id: string;
    type: string;
    application: string;
    data_access_expires_at: number;
    expires_at: number;
    is_valid: boolean;
    scopes: string[];
    user_id: string;
  };
}

interface TokenRefreshResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

// Check token expiry using Facebook's debug_token endpoint
async function checkTokenExpiry(accessToken: string, appId: string, appSecret: string): Promise<{
  isValid: boolean;
  expiresAt: number;
  daysUntilExpiry: number;
}> {
  const appToken = `${appId}|${appSecret}`;
  const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/debug_token?input_token=${accessToken}&access_token=${appToken}`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('Failed to check token expiry:', response.status);
      return { isValid: false, expiresAt: 0, daysUntilExpiry: 0 };
    }

    const data: TokenDebugResponse = await response.json();
    
    if (!data.data || !data.data.is_valid) {
      console.error('Token is invalid');
      return { isValid: false, expiresAt: 0, daysUntilExpiry: 0 };
    }

    const expiresAt = data.data.expires_at;
    const now = Math.floor(Date.now() / 1000);
    const secondsUntilExpiry = expiresAt - now;
    const daysUntilExpiry = Math.floor(secondsUntilExpiry / 86400);

    return {
      isValid: true,
      expiresAt,
      daysUntilExpiry
    };
  } catch (error) {
    console.error('Exception checking token expiry:', error);
    return { isValid: false, expiresAt: 0, daysUntilExpiry: 0 };
  }
}

// Refresh/extend a long-lived token
async function refreshLongLivedToken(accessToken: string): Promise<string | null> {
  const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.FACEBOOK_APP_ID}&client_secret=${process.env.FACEBOOK_APP_SECRET}&fb_exchange_token=${accessToken}`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Failed to refresh token:', response.status, errorData);
      return null;
    }

    const data: TokenRefreshResponse = await response.json();
    
    if (!data.access_token) {
      console.error('No access token in refresh response');
      return null;
    }

    console.log(`Token refreshed successfully. New token expires in ${data.expires_in} seconds (${Math.floor(data.expires_in / 86400)} days)`);
    
    return data.access_token;
  } catch (error) {
    console.error('Exception refreshing token:', error);
    return null;
  }
}

// Update Netlify environment variable using Netlify API
async function updateNetlifyEnvVar(varName: string, newValue: string): Promise<boolean> {
  const siteId = process.env.NETLIFY_SITE_ID;
  const apiToken = process.env.NETLIFY_API_TOKEN;

  if (!siteId || !apiToken) {
    console.error('Missing NETLIFY_SITE_ID or NETLIFY_API_TOKEN');
    return false;
  }

  try {
    // Netlify API v2 endpoint for updating environment variables
    const url = `https://api.netlify.com/api/v1/accounts/-/env/${varName}`;
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiToken}`
      },
      body: JSON.stringify({
        context: 'production',
        value: newValue,
        site_id: siteId
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`Failed to update ${varName} in Netlify:`, response.status, errorData);
      return false;
    }

    console.log(`Successfully updated ${varName} in Netlify environment variables`);
    return true;
  } catch (error) {
    console.error(`Exception updating ${varName} in Netlify:`, error);
    return false;
  }
}

// Process token refresh for a single brand
async function processTokenRefresh(brand: 'leeukopf' | 'gelitup'): Promise<{
  success: boolean;
  message: string;
}> {
  const envVarName = brand === 'leeukopf' ? 'IG_ACCESS_TOKEN' : 'IG_GELITUP_ACCESS_TOKEN';
  const accessToken = process.env[envVarName];

  if (!accessToken) {
    return {
      success: false,
      message: `${envVarName} not found in environment variables`
    };
  }

  const appId = process.env.FACEBOOK_APP_ID;
  const appSecret = process.env.FACEBOOK_APP_SECRET;

  if (!appId || !appSecret) {
    return {
      success: false,
      message: 'Missing FACEBOOK_APP_ID or FACEBOOK_APP_SECRET'
    };
  }

  console.log(`\n[${brand.toUpperCase()}] Checking token expiry...`);

  // Check current token status
  const tokenStatus = await checkTokenExpiry(accessToken, appId, appSecret);

  if (!tokenStatus.isValid) {
    return {
      success: false,
      message: `Token is invalid or check failed`
    };
  }

  console.log(`[${brand.toUpperCase()}] Token is valid. Days until expiry: ${tokenStatus.daysUntilExpiry}`);

  // Only refresh if within threshold
  if (tokenStatus.daysUntilExpiry > DAYS_BEFORE_EXPIRY_TO_REFRESH) {
    return {
      success: true,
      message: `Token is still valid for ${tokenStatus.daysUntilExpiry} days. No refresh needed.`
    };
  }

  console.log(`[${brand.toUpperCase()}] Token expires in ${tokenStatus.daysUntilExpiry} days. Refreshing...`);

  // Refresh the token
  const newToken = await refreshLongLivedToken(accessToken);

  if (!newToken) {
    return {
      success: false,
      message: `Failed to refresh token`
    };
  }

  // Update Netlify environment variable
  const updated = await updateNetlifyEnvVar(envVarName, newToken);

  if (!updated) {
    return {
      success: false,
      message: `Token refreshed but failed to update Netlify environment variable`
    };
  }

  return {
    success: true,
    message: `Token successfully refreshed and persisted. Was ${tokenStatus.daysUntilExpiry} days from expiry.`
  };
}

interface RefreshResult {
  attempted: boolean;
  success?: boolean;
  message?: string;
}

interface RefreshJobResults {
  timestamp: string;
  leeukopf: RefreshResult;
  gelitup: RefreshResult;
}

const handler: Handler = async () => {
  console.log('=== Instagram Token Refresh Job Started ===');
  console.log('Timestamp:', new Date().toISOString());

  const results: RefreshJobResults = {
    timestamp: new Date().toISOString(),
    leeukopf: { attempted: false },
    gelitup: { attempted: false }
  };

  // Process Leeukopf token
  try {
    results.leeukopf.attempted = true;
    const leeukopfResult = await processTokenRefresh('leeukopf');
    results.leeukopf = { ...results.leeukopf, ...leeukopfResult };
  } catch (error) {
    console.error('[LEEUKOPF] Exception during token refresh:', error);
    results.leeukopf.success = false;
    results.leeukopf.message = `Exception: ${error}`;
  }

  // Process GEL.IT.UP token
  try {
    results.gelitup.attempted = true;
    const gelitupResult = await processTokenRefresh('gelitup');
    results.gelitup = { ...results.gelitup, ...gelitupResult };
  } catch (error) {
    console.error('[GEL.IT.UP] Exception during token refresh:', error);
    results.gelitup.success = false;
    results.gelitup.message = `Exception: ${error}`;
  }

  console.log('\n=== Token Refresh Job Completed ===');
  console.log('Leeukopf:', results.leeukopf.success ? '✓' : '✗', results.leeukopf.message);
  console.log('GEL.IT.UP:', results.gelitup.success ? '✓' : '✗', results.gelitup.message);

  // Always return 200 - we don't want to trigger alerts for expected scenarios
  // (e.g., token still has many days until expiry)
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(results, null, 2),
  };
};

export { handler };
