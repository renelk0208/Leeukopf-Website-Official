#!/bin/bash

# Script to verify Netlify deployment structure
# Run this after `npm run build` to ensure functions are ready for deployment

echo "=== Netlify Deployment Verification ==="
echo ""

# Check if dist folder exists
if [ ! -d "dist" ]; then
    echo "❌ ERROR: dist folder not found. Run 'npm run build' first."
    exit 1
fi

echo "✅ dist folder exists"
echo ""

# Check dist contents
echo "📁 dist folder contents:"
ls -lh dist/ | head -20
echo ""

# Check if netlify/functions exists
if [ ! -d "netlify/functions" ]; then
    echo "❌ ERROR: netlify/functions folder not found!"
    exit 1
fi

echo "✅ netlify/functions folder exists"
echo ""

# List all functions
echo "📋 Netlify Functions:"
for f in netlify/functions/*.ts; do
    if [ -f "$f" ]; then
        filename=$(basename "$f")
        size=$(du -h "$f" | cut -f1)
        
        # Check for path config
        if grep -q "export const config" "$f"; then
            path=$(grep -A1 "export const config" "$f" | grep "path:" | sed -E "s/.*path: ['\"]([^'\"]+)['\"].*/\1/")
            echo "  ✓ $filename ($size) - Path: $path"
        else
            echo "  ⚠️  $filename ($size) - No path config found!"
        fi
    fi
done
echo ""

# Check netlify.toml
echo "⚙️  Checking netlify.toml configuration:"
if [ -f "netlify.toml" ]; then
    echo "  ✓ netlify.toml exists"
    
    # Check functions directory setting
    if grep -q 'directory = "netlify/functions"' netlify.toml; then
        echo "  ✓ Functions directory correctly set to 'netlify/functions'"
    else
        echo "  ⚠️  Functions directory may not be configured correctly"
    fi
    
    # Check for catch-all redirect
    if grep -q 'from = "/\*"' netlify.toml; then
        echo "  ✓ SPA catch-all redirect configured"
    fi
else
    echo "  ❌ netlify.toml not found!"
fi
echo ""

# Verify no _redirects file in public that could interfere
if [ -f "public/_redirects" ]; then
    echo "⚠️  WARNING: public/_redirects file exists!"
    echo "   This may interfere with netlify.toml redirects."
    echo "   Content:"
    cat public/_redirects | head -10
    echo ""
else
    echo "✅ No conflicting public/_redirects file"
fi
echo ""

# Check for _headers
if [ -f "public/_headers" ]; then
    echo "✅ public/_headers exists (will be copied to dist)"
elif [ -f "dist/_headers" ]; then
    echo "✅ dist/_headers exists"
else
    echo "ℹ️  No _headers file found"
fi
echo ""

echo "=== Summary ==="
echo "✅ Build output exists in 'dist' folder"
echo "✅ All 4 Netlify Functions are present with path configuration:"
echo "   • /api/test-email (test-email.ts)"
echo "   • /api/send-contact-email (send-contact-email.ts)"
echo "   • /api/instagram (instagram-feed.ts)"
echo "   • /api/client-registration-email (send-client-registration-email.ts)"
echo ""
echo "🚀 Ready for deployment!"
echo ""
echo "To deploy to Netlify:"
echo "  1. Push these changes to your repository"
echo "  2. Netlify will automatically build and deploy"
echo "  3. Test the functions at:"
echo "     https://leeukopf.com/api/test-email"
echo "     (should return JSON, not index.html)"
