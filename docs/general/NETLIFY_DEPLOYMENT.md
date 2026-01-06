# Netlify Deployment Guide

This document provides instructions for deploying the HRMS frontend application to Netlify.

## Prerequisites

- A Netlify account
- Git repository with your project

## Environment Variables

The application uses environment variables to configure API endpoints for different environments. When deploying to Netlify, you **MUST** set the following environment variables in the Netlify dashboard:

| Variable | Description | Value for Production |
|----------|-------------|---------------|
| `VUE_APP_API_BASE_URL` | The base URL for API requests | `https://hrms-backend-api-v1-main-wrhlmg.laravel.cloud/api/v1` |
| `VUE_APP_ENV` | The environment name | `production` |

### Important Note About Environment Variables

Vue CLI only includes variables that start with `VUE_APP_` in your application. Environment variables are embedded during **build time**, not runtime. This means:

1. After changing environment variables in Netlify, you must trigger a new build
2. You cannot change these values without rebuilding the application
3. The values in `.env.production` are only used during local production builds, not on Netlify

## Deployment Steps

### Option 1: Deploy via Netlify UI

1. Log in to your Netlify account
2. Click "New site from Git"
3. Connect to your Git provider (GitHub, GitLab, or Bitbucket)
4. Select your repository
5. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click "Show advanced" and add the environment variables listed above
7. Click "Deploy site"

### Option 2: Deploy via Netlify CLI

1. Install Netlify CLI: `npm install -g netlify-cli`
2. Login to Netlify: `netlify login`
3. Initialize your site: `netlify init`
4. Set environment variables:
   ```
   netlify env:set VUE_APP_API_BASE_URL https://hrms-backend-api-v1-main-wrhlmg.laravel.cloud/api/v1
   netlify env:set VUE_APP_ENV production
   ```
5. Deploy your site: `netlify deploy --prod`

## Verifying Environment Variables

To verify that your environment variables are correctly set:

1. After deployment, open your browser's developer console
2. Look for logs showing the current environment and API base URL
3. Check network requests to ensure they're going to the correct API URL

If you see requests to `127.0.0.1:8000` after deployment, your environment variables are not being applied correctly.

## Handling SPA Routing

The `netlify.toml` file in the project root includes configuration for proper SPA routing with Vue Router. This ensures that all routes are directed to `index.html`, allowing Vue Router to handle client-side routing.

## Troubleshooting

If you encounter issues with API requests:

1. Check that the `VUE_APP_API_BASE_URL` environment variable is set correctly in Netlify
2. Ensure your API server has proper CORS headers configured
3. Verify that your API endpoints match those defined in `src/config/api.config.js`
4. Check the browser console for any errors related to CORS or network requests
5. Try clearing your browser cache or using incognito mode

## Local Testing of Production Build

To test the production build locally before deploying:

```bash
# Build for production
npm run build

# Install serve
npm install -g serve

# Serve the production build
serve -s dist
``` 