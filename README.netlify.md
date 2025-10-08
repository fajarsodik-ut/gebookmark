# Markit - Netlify Deployment Guide

This project has been adapted from Cloudflare Pages to Netlify deployment.

## Changes Made for Netlify

1. **Removed Cloudflare dependencies**:

   - Removed `@cloudflare/vite-plugin` from vite.config.ts
   - Removed Cloudflare Workers-specific code references

2. **Added Netlify configuration**:

   - `netlify.toml` - Main Netlify configuration file
   - `public/_redirects` - SPA redirect rules

3. **Updated deployment scripts**:
   - `bun run deploy` - Deploy to production
   - `bun run deploy:preview` - Deploy preview/draft

## Local Development

```bash
# Install dependencies
bun install

# Run development server
bun dev

# Build for production
bun run build

# Preview production build
bun run preview
```

## Deploying to Netlify

### Option 1: Using Netlify CLI (Recommended)

1. Install Netlify CLI globally:

```bash
npm install -g netlify-cli
```

2. Login to Netlify:

```bash
netlify login
```

3. Initialize your site:

```bash
netlify init
```

4. Deploy:

```bash
# Deploy preview
bun run deploy:preview

# Deploy to production
bun run deploy
```

### Option 2: Using Netlify Dashboard

1. Push your code to GitHub
2. Go to [Netlify Dashboard](https://app.netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect to your GitHub repository
5. Configure build settings:
   - **Build command**: `bun run build`
   - **Publish directory**: `dist`
   - **Node version**: 20
6. Click "Deploy site"

### Option 3: Drag & Drop Deploy

1. Build your project locally:

```bash
bun run build
```

2. Go to [Netlify Drop](https://app.netlify.com/drop)
3. Drag and drop the `dist` folder

## Environment Variables

If you need environment variables, add them in:

- Netlify Dashboard → Site Settings → Environment Variables

Or create a `.env` file locally (don't commit it):

```bash
VITE_API_URL=https://your-api-url.com
```

## Custom Domain

1. Go to Netlify Dashboard → Domain Settings
2. Add your custom domain
3. Follow DNS configuration instructions

## Notes

- The backend API (worker folder) is not deployed with this setup
- All bookmarks are stored in browser localStorage (client-side only)
- If you need backend functionality, consider:
  - Netlify Functions (serverless functions)
  - External API service
  - Supabase/Firebase for data storage

## Troubleshooting

### Build fails on Netlify

Make sure your build settings match:

- Build command: `bun run build`
- Publish directory: `dist`
- Node version: 20

### SPA routing doesn't work

Ensure `public/_redirects` file exists with:

```
/* /index.html 200
```

### Assets not loading

Check the `base` path in vite.config.ts matches your Netlify site URL structure.
