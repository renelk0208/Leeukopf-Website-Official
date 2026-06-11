# Instagram Fallback Images

This directory contains fallback images that are displayed when the Instagram feed cannot be loaded.

## Requirements

- Exactly 4 high-quality images (1:1 aspect ratio / square) to match the 2x2 grid layout
- Images should represent your brand and products
- Recommended size: 1080x1080px
- Supported formats: JPG, PNG, WebP
- File naming: `fallback-1.jpg`, `fallback-2.png`, etc.

## Current Images

Replace the placeholder images with actual brand photos showing:
- Product photos
- Behind-the-scenes content
- Brand lifestyle shots
- Professional nail art examples
- Workshop or manufacturing scenes

## Usage

These images are automatically displayed by the `InstagramFeed` component when:
- The Instagram API is unavailable
- Access token has expired
- No posts are returned from the API
- Network connectivity issues occur

The component displays exactly 4 fallback images in a 2x2 grid (1 column on mobile, 2 columns on tablet+).

