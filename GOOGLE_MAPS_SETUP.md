# Google Maps Setup Guide

This guide explains how to set up Google Maps for the Gelitup Distribution page.

## Prerequisites

- A Google Cloud account
- Billing enabled on your Google Cloud project

## Steps

### 1. Create a Google Cloud Project (if you don't have one)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one

### 2. Enable Google Maps JavaScript API

1. Go to **APIs & Services** > **Library**
2. Search for "Maps JavaScript API"
3. Click on it and click **Enable**

### 3. Create an API Key

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **API Key**
3. Copy the generated API key
4. **Important**: Click "Restrict Key" to secure it

### 4. Restrict the API Key (CRITICAL for Security)

To prevent unauthorized use of your API key:

1. Under **Application restrictions**:
   - Select **HTTP referrers (web sites)**
   - Add your website domains:
     - `https://yourdomain.com/*`
     - `https://www.yourdomain.com/*`
     - For local development: `http://localhost:5173/*` and `http://localhost:5174/*`

2. Under **API restrictions**:
   - Select **Restrict key**
   - Select only: **Maps JavaScript API**

3. Click **Save**

### 5. Create a Map ID

1. Go to [Google Maps Platform](https://console.cloud.google.com/google/maps-apis/studio/maps)
2. Click **Create Map ID**
3. Enter:
   - **Map ID**: `distributor-map` (must match the code)
   - **Map name**: "Distributor Map" (or any name you prefer)
   - **Map type**: Vector
4. Click **Save**

### 6. Configure Environment Variable

Add the API key to your `.env` file:

```env
VITE_GOOGLE_MAPS_API_KEY=YOUR_API_KEY_HERE
```

**For Netlify deployment:**

1. Go to your Netlify site dashboard
2. Navigate to **Site settings** > **Environment variables**
3. Add a new variable:
   - Key: `VITE_GOOGLE_MAPS_API_KEY`
   - Value: Your Google Maps API key
4. Redeploy your site

### 7. Test the Map

1. Start the development server: `npm run dev`
2. Navigate to `/gelitup-distribution`
3. Verify the map loads with custom brand-colored pins
4. Click on pins to see distributor information

## Security Best Practices

- ✅ Always restrict your API key by HTTP referrer
- ✅ Only enable the APIs you need
- ✅ Monitor API usage in Google Cloud Console
- ✅ Set up billing alerts to avoid unexpected charges
- ❌ Never commit API keys to version control
- ❌ Never share your API key publicly

## Troubleshooting

### Map not loading
- Check that the API key is correctly set in `.env`
- Verify the Maps JavaScript API is enabled
- Check browser console for error messages

### "This page can't load Google Maps correctly"
- The API key may not be properly restricted
- Make sure your domain is added to the HTTP referrer restrictions
- Verify billing is enabled on your Google Cloud project

### Pins not showing
- Verify the Map ID `distributor-map` is created and active
- Check that coordinates are valid (lat/lng format)

## Cost Information

Google Maps Platform offers:
- $200 monthly credit (covers ~28,000 map loads)
- Pay-as-you-go pricing after free credit

For typical website traffic, the free tier should be sufficient.

## Additional Resources

- [Google Maps Platform Documentation](https://developers.google.com/maps/documentation)
- [API Key Best Practices](https://developers.google.com/maps/api-security-best-practices)
- [Pricing Calculator](https://mapsplatform.google.com/pricing/)
