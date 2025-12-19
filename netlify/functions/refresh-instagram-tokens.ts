import type { Handler } from '@netlify/functions';

/**
 * Scheduled function to automatically refresh Instagram long-lived access tokens
 * Runs daily to check token expiry and refresh when needed
 * 
 * Schedule: Daily at midnight UTC (configured via schedule export)
 * 
 * Environment Variables Required:
 * - LEEUKOPF_IG_ACCESS_TOKEN: Leeukopf long-lived access token
 * - IG_GELITUP_ACCESS_TOKEN: GEL.IT.UP long-lived access token
 * - FB_APP_ID: Facebook App ID
 * - FB_APP_SECRET: Facebook App Secret
 * - NETLIFY_ACCESS_TOKEN: Netlify personal access token (for updating env vars)
 * - NETLIFY_SITE_ID: Netlify site ID
 */

// Configuration
const DAYS_BEFORE_EXPIRY_TO_REFRESH = 7; // Refresh when less than 7 days remain
const API_VERSION = 'v20.0'; // Fixed API version as per requirements

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
  errorMessage?: string;
}> {
  const appToken = `${appId}|${appSecret}`;
  const url = `https://graph.facebook.com/${API_VERSION}/debug_token?input_token=${accessToken}&access_token=${appToken}`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg = (errorData as { error?: { message: string } })?.error?.message || 'Unknown error';
      console.error('Failed to check token expiry:', response.status, errorMsg);
      return { isValid: false, expiresAt: 0, daysUntilExpiry: 0, errorMessage: errorMsg };
    }

    const data: TokenDebugResponse = await response.json();
    
    if (!data.data || !data.data.is_valid) {
      console.error('Token is invalid');
      return { isValid: false, expiresAt: 0, daysUntilExpiry: 0, errorMessage: 'Token is invalid' };
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
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Exception checking token expiry:', errorMsg);
    return { isValid: false, expiresAt: 0, daysUntilExpiry: 0, errorMessage: errorMsg };
  }
}

// Refresh/extend a long-lived token
async function refreshLongLivedToken(accessToken: string, appId: string, appSecret: string): Promise<{
  success: boolean;
  access_token?: string;
  expires_in?: number;
  errorMessage?: string;
  errorCode?: number;
}> {
  const url = `https://graph.facebook.com/${API_VERSION}/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${accessToken}`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorObj = (errorData as { error?: { message: string; code: number } })?.error;
      const errorMessage = errorObj?.message || 'Unknown error';
      const errorCode = errorObj?.code;
      console.error('Failed to refresh token:', response.status, errorMessage);
      return { success: false, errorMessage, errorCode };
    }

    const data: TokenRefreshResponse = await response.json();
    
    if (!data.access_token) {
      console.error('No access token in refresh response');
      return { success: false, errorMessage: 'No access token in response' };
    }

    console.log(`Token refreshed successfully. New token expires in ${data.expires_in} seconds (${Math.floor(data.expires_in / 86400)} days)`);
    
    return { 
      success: true, 
      access_token: data.access_token, 
      expires_in: data.expires_in 
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Exception refreshing token:', errorMessage);
    return { success: false, errorMessage };
  }
}

// Update Netlify environment variable using Netlify API
async function updateNetlifyEnvVar(varName: string, newValue: string): Promise<{
  success: boolean;
  errorMessage?: string;
}> {
  const siteId = process.env.NETLIFY_SITE_ID;
  const apiToken = process.env.NETLIFY_ACCESS_TOKEN;

  if (!siteId || !apiToken) {
    const msg = 'Missing NETLIFY_SITE_ID or NETLIFY_ACCESS_TOKEN';
    console.error(msg);
    return { success: false, errorMessage: msg };
  }

  try {
    // Netlify API v1 endpoint for updating environment variables
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
      const errorMsg = (errorData as { error?: string })?.error || 'Unknown error';
      console.error(`Failed to update ${varName} in Netlify:`, response.status, errorMsg);
      return { success: false, errorMessage: errorMsg };
    }

    console.log(`Successfully updated ${varName} in Netlify environment variables`);
    return { success: true };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Exception updating ${varName} in Netlify:`, errorMsg);
    return { success: false, errorMessage: errorMsg };
  }
}

// Process token refresh for a single brand
async function processTokenRefresh(brand: 'leeukopf' | 'gelitup'): Promise<{
  success: boolean;
  expires_in?: number;
  tokenLast4?: string;
  errorMessage?: string;
}> {
  const envVarName = brand === 'leeukopf' ? 'LEEUKOPF_IG_ACCESS_TOKEN' : 'IG_GELITUP_ACCESS_TOKEN';
  const accessToken = process.env[envVarName];

  if (!accessToken) {
    return {
      success: false,
      errorMessage: `${envVarName} not found in environment variables`
    };
  }

  const appId = process.env.FB_APP_ID;
  const appSecret = process.env.FB_APP_SECRET;

  if (!appId || !appSecret) {
    return {
      success: false,
      errorMessage: 'Missing FB_APP_ID or FB_APP_SECRET'
    };
  }

  console.log(`\n[${brand.toUpperCase()}] Checking token expiry...`);

  // Check current token status
  const tokenStatus = await checkTokenExpiry(accessToken, appId, appSecret);

  if (!tokenStatus.isValid) {
    // Check if token is expired
    const isExpired = tokenStatus.daysUntilExpiry <= 0;
    const errorMsg = isExpired 
      ? 'Token expired; manual re-auth required.'
      : (tokenStatus.errorMessage || 'Token is invalid or check failed');
    return {
      success: false,
      errorMessage: errorMsg
    };
  }

  console.log(`[${brand.toUpperCase()}] Token is valid. Days until expiry: ${tokenStatus.daysUntilExpiry}`);

  // Always refresh the token (don't check threshold - ensure it happens on manual call)
  console.log(`[${brand.toUpperCase()}] Refreshing token...`);

  // Refresh the token
  const refreshResult = await refreshLongLivedToken(accessToken, appId, appSecret);

  if (!refreshResult.success || !refreshResult.access_token) {
    return {
      success: false,
      errorMessage: refreshResult.errorMessage || 'Failed to refresh token'
    };
  }

  // Update Netlify environment variable
  const updateResult = await updateNetlifyEnvVar(envVarName, refreshResult.access_token);

  if (!updateResult.success) {
    return {
      success: false,
      errorMessage: `Token refreshed but failed to update Netlify: ${updateResult.errorMessage || 'Unknown error'}`
    };
  }

  return {
    success: true,
    expires_in: refreshResult.expires_in,
    tokenLast4: refreshResult.access_token.slice(-4)
  };
}

interface BrandRefreshResult {
  success: boolean;
  expires_in?: number;
  tokenLast4?: string;
}

interface RefreshResponse {
  ok: boolean;
  refreshed: {
    leeukopf: BrandRefreshResult;
    gelitup: BrandRefreshResult;
  };
  errors: string[];
}

const handler: Handler = async () => {
  console.log('=== Instagram Token Refresh Job Started ===');
  console.log('Timestamp:', new Date().toISOString());

  const errors: string[] = [];
  const response: RefreshResponse = {
    ok: true,
    refreshed: {
      leeukopf: { success: false },
      gelitup: { success: false }
    },
    errors: []
  };

  // Process Leeukopf token
  try {
    console.log('\n[LEEUKOPF] Processing token refresh...');
    const leeukopfResult = await processTokenRefresh('leeukopf');
    
    if (leeukopfResult.success) {
      response.refreshed.leeukopf = {
        success: true,
        expires_in: leeukopfResult.expires_in,
        tokenLast4: leeukopfResult.tokenLast4
      };
      console.log('[LEEUKOPF] ✓ Success');
    } else {
      response.refreshed.leeukopf = { success: false };
      response.ok = false;
      const errorMsg = `Leeukopf: ${leeukopfResult.errorMessage || 'Unknown error'}`;
      errors.push(errorMsg);
      console.error('[LEEUKOPF] ✗ Failed:', leeukopfResult.errorMessage);
    }
  } catch (error) {
    const errorMsg = `Leeukopf exception: ${error instanceof Error ? error.message : 'Unknown'}`;
    console.error('[LEEUKOPF] Exception during token refresh:', error);
    response.refreshed.leeukopf = { success: false };
    response.ok = false;
    errors.push(errorMsg);
  }

  // Process GEL.IT.UP token
  try {
    console.log('\n[GEL.IT.UP] Processing token refresh...');
    const gelitupResult = await processTokenRefresh('gelitup');
    
    if (gelitupResult.success) {
      response.refreshed.gelitup = {
        success: true,
        expires_in: gelitupResult.expires_in,
        tokenLast4: gelitupResult.tokenLast4
      };
      console.log('[GEL.IT.UP] ✓ Success');
    } else {
      response.refreshed.gelitup = { success: false };
      response.ok = false;
      const errorMsg = `GEL.IT.UP: ${gelitupResult.errorMessage || 'Unknown error'}`;
      errors.push(errorMsg);
      console.error('[GEL.IT.UP] ✗ Failed:', gelitupResult.errorMessage);
    }
  } catch (error) {
    const errorMsg = `GEL.IT.UP exception: ${error instanceof Error ? error.message : 'Unknown'}`;
    console.error('[GEL.IT.UP] Exception during token refresh:', error);
    response.refreshed.gelitup = { success: false };
    response.ok = false;
    errors.push(errorMsg);
  }

  response.errors = errors;

  console.log('\n=== Token Refresh Job Completed ===');
  console.log('Overall status:', response.ok ? '✓ Success' : '✗ Failed');
  console.log('Leeukopf:', response.refreshed.leeukopf.success ? '✓' : '✗');
  console.log('GEL.IT.UP:', response.refreshed.gelitup.success ? '✓' : '✗');
  if (errors.length > 0) {
    console.log('Errors:', errors);
  }

  // Always return 200 - we don't want to trigger alerts for expected scenarios
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(response, null, 2),
  };
};

// Schedule configuration for Netlify
export const schedule = '@daily'; // Run once per day at midnight UTC

export { handler };
