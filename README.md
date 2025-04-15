# SolHound Extension

Built using the WXT Framework, React, and TypeScript.

## Project Structure

```
.gitignore
package.json
README.md
tsconfig.json
wxt.config.ts
.output/
    edge-mv3/
        background.js
        highlighting.js
        manifest.json
        popup.html
        assets/
        chunks/
        content-scripts/
        icon/
.wxt/
    tsconfig.json
    wxt.d.ts
    types/
        globals.d.ts
        i18n.d.ts
        imports.d.ts
        paths.d.ts
src/
    assets/
    components/
        feature-toggle.tsx
        header.tsx
        login-status.tsx
    data/
        const.ts
    entrypoints/
        content.ts
        highlight-styles.css
        ...
    hooks/
        ...
    public/
        icon/
    utils/
```

- **.output/**: Contains the build output files.
  - **edge-mv3/**: Contains files specific to the Edge browser extension.
    - **background.js**: Background script for the extension.
    - **highlighting.js**: Script for highlighting functionality.
    - **manifest.json**: Manifest file for the extension.
    - **popup.html**: HTML file for the extension's popup.
    - **assets/**: Contains asset files.
    - **chunks/**: Contains chunk files.
    - **content-scripts/**: Contains content scripts.
    - **icon/**: Contains icon files.

- **.wxt/**: Contains WXT framework configuration and type definitions.
  - **tsconfig.json**: TypeScript configuration for the WXT framework.
  - **wxt.d.ts**: Type definitions for the WXT framework.
  - **types/**: Contains additional type definitions.
    - **globals.d.ts**: Global type definitions.
    - **i18n.d.ts**: Internationalization type definitions.
    - **imports.d.ts**: Import type definitions.
    - **paths.d.ts**: Path type definitions.

- **src/**: Contains the source code of the project.
  - **assets/**: Contains asset files.
  - **components/**: Contains React components.
    - **feature-toggle.tsx**: Feature toggle component.
    - **header.tsx**: Header component.
    - **login-status.tsx**: Login status component.
  - **data/**: Contains data-related files.
    - **const.ts**: Constants file.
  - **entrypoints/**: Contains entry point files.
    - **content.ts**: Content script entry point.
    - **highlight-styles.css**: CSS styles for highlighting.
  - **hooks/**: Contains custom React hooks.
  - **public/**: Contains public files.
    - **icon/**: Contains icon files.
  - **utils/**: Contains utility functions.


# Solhound Extension Deployment Guide

This document outlines the process for deploying the Solhound extension to different environments using WXT, including the Chrome Web Store.

## Environment Configuration

The extension supports multiple environments using WXT's environment variables system:

### Environment Files

We use the following environment files:

- `.env` - Base environment variables shared across all environments
- `.env.development` - Development environment specific variables
- `.env.production` - Production environment specific variables

### Environment Variables

All environment variables are prefixed with `WXT_` as per WXT's requirements:

- `WXT_API_BASE_URL` - The base URL for API calls
- `WXT_BASE_URL` - The base URL for the web application
- `WXT_ENVIRONMENT` - The current environment name
- `WXT_ENABLE_VERBOSE_LOGGING` - Whether to enable verbose logging
- `WXT_APP_NAME` - The name of the extension
- `WXT_APP_VERSION` - The version of the extension
- `WXT_REFERRAL_CODE` - The referral code to use for affiliate links

## Building for Different Environments

### Development Build

```bash
# Build for development
npm run dev

# Build and watch for changes
npm run build --mode=development
```

### Production Build

```bash
# Build for production
npm run build --mode=production

# Build and create zip for Chrome Web Store
npm run build --mode=production && npm run zip
```

## Chrome Web Store Submission

1. **Create a Developer Account** (if you don't have one already)
   - Go to the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
   - Sign in with your Google account
   - Pay the one-time developer registration fee if required

2. **Prepare Your Store Listing**
   - Create high-quality screenshots (1280x800 or 640x400)
   - Prepare a 128x128 icon
   - Write a detailed description
   - Create a promotional tile image (440x280)

3. **Upload Your Extension**
   - Go to the Developer Dashboard
   - Click "New Item" or "Add new item"
   - Upload the production ZIP file
   - Fill out all the required fields
   - Select appropriate category (Productivity)
   - Set pricing and distribution (Free, Public)
   - Submit for review

4. **After Submission**
   - Initial review typically takes 1-3 business days
   - You'll receive an email when your extension is approved or if there are issues to address

## Updating Your Extension

1. **Increment Version Number**
   - Update the version in `.env` file: `WXT_APP_VERSION=x.x.x`

2. **Build and Create ZIP**
   - Run `npm run build --mode=production && npm run zip`

3. **Upload New Version**
   - Go to your extension in the Developer Dashboard
   - Click "Upload Updated Package"
   - Submit for review

## Environment-Specific Behaviors

The extension will automatically:

- Use the appropriate API endpoints for each environment
- Show "(Dev)" suffix in the extension name in development mode
- Enable verbose logging in development mode
- Use development URLs for API requests in development mode

## Testing Before Submission

Always perform these tests before submitting to the Chrome Web Store:

1. **Functionality Testing**
   - Test all features with real Solana addresses
   - Verify premium features are properly locked/unlocked
   - Test login/logout flows

2. **Performance Testing**
   - Test on sites with many addresses
   - Check memory usage

3. **Security Testing**
   - Ensure sensitive data is properly handled
   - Verify API calls are secure

## Add Scripts to package.json

You may want to add these convenient scripts to your package.json:

```json
"scripts": {
  "dev": "wxt --mode=development",
  "build:dev": "wxt build --mode=development",
  "build:prod": "wxt build --mode=production",
  "zip": "cd dist && zip -r ../solhound.zip ."
}
```

## Troubleshooting

If your extension is rejected:
- Read the rejection reason carefully
- Fix all issues mentioned
- If the issue is unclear, you can contact the Chrome Web Store team
- Resubmit with a detailed description of changes made

## Common Issues

1. **Environment Variables Not Available**
   - Make sure they are prefixed with `WXT_` or `VITE_`
   - Check that you're using the function form of the manifest if using env vars there

2. **Wrong Environment Used in Production**
   - Check that you built with `--mode=production`
   - Verify the `.env.production` file has correct values

3. **Extension Not Working After Upload**
   - Check for any network requests to development URLs
   - Ensure API endpoints are accessible from users' browsers