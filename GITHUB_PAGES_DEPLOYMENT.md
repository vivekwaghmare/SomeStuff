# GitHub Pages Deployment Guide for Math Practice App (Web)

## 📋 Prerequisites

1. GitHub repository: `vivekwaghmare/SomeStuff` ✓
2. GitHub account with free tier ✓
3. Node.js 18+ installed ✓
4. Git configured locally ✓

## 🚀 Step-by-Step Deployment

### Step 1: Install gh-pages Package

```bash
cd web
npm install --save-dev gh-pages
```

### Step 2: Update Vite Configuration

The `vite.config.ts` is already configured with:
```typescript
base: '/',  // For user/org GitHub Pages
```

**Note**: If you want to host at `vivekwaghmare.github.io` (user/org pages), use `/`
If you want to host at a subdirectory like `vivekwaghmare.github.io/math-app`, use `/math-app/`

### Step 3: Build the Project

```bash
cd web
npm run build
```

This creates a `dist/` folder with optimized production files.

### Step 4: Deploy to GitHub Pages

**Option A: Using the deploy script (Recommended)**

```bash
npm run deploy
```

This automatically:
1. Builds the project
2. Pushes the `dist/` folder to the `gh-pages` branch
3. Triggers GitHub Pages deployment

**Option B: Manual deployment**

```bash
# Build
npm run build

# Deploy using gh-pages CLI
npx gh-pages -d dist
```

### Step 5: Configure GitHub Repository

1. Go to **GitHub** → **vivekwaghmare/SomeStuff**
2. Click **Settings** → **Pages** (left sidebar)
3. Under "Source", select:
   - **Branch**: `gh-pages`
   - **Folder**: `/ (root)`
4. Click **Save**
5. GitHub will show your live URL (usually takes 1-2 minutes)

## 📍 Access Your App

Once deployed, your app will be live at:

```
https://vivekwaghmare.github.io/SomeStuff/
```

## 🔧 Configuration Options

### If hosting at root (vivekwaghmare.github.io)

Create a new repository: `vivekwaghmare.github.io`

Update:
- `vite.config.ts`: `base: '/'`
- Deploy to the root repo
- Access at: `https://vivekwaghmare.github.io`

### If hosting under SomeStuff (current setup)

Keep:
- `vite.config.ts`: `base: '/'` (already correct)
- `package.json`: `"homepage": "https://vivekwaghmare.github.io/SomeStuff/"`
- Access at: `https://vivekwaghmare.github.io/SomeStuff/`

## 📝 Deployment Checklist

- [ ] Run `cd web && npm install`
- [ ] Run `npm run build` (test build locally)
- [ ] Run `npm run deploy` (deploy to gh-pages)
- [ ] Go to GitHub Settings → Pages
- [ ] Select `gh-pages` branch
- [ ] Wait 1-2 minutes for deployment
- [ ] Visit your GitHub Pages URL
- [ ] Test offline functionality (Service Worker)

## 🔄 Update & Redeploy

Whenever you make changes:

```bash
cd web

# Make your changes...

# Commit changes
git add .
git commit -m "feat: Update game feature"
git push origin math-practice-app

# Deploy to GitHub Pages
npm run deploy
```

## 🆘 Troubleshooting

### Issue: Pages not deploying
**Solution**: 
1. Verify `gh-pages` branch exists in GitHub
2. Check GitHub Pages settings (Source → gh-pages branch)
3. Wait 1-2 minutes for deployment
4. Clear browser cache and hard refresh (Ctrl+Shift+R)

### Issue: Blank page or 404
**Solution**:
1. Check `vite.config.ts` has correct `base` path
2. Verify `package.json` has correct `homepage`
3. Open DevTools (F12) → Console for errors
4. Check dist folder was created: `ls web/dist`

### Issue: Service Worker not working
**Solution**:
1. GitHub Pages requires HTTPS ✓ (automatically provided)
2. Service Worker only works over HTTPS
3. Open DevTools → Application → Service Workers
4. Check registration status

### Issue: Assets loading with 404
**Solution**:
1. Verify relative paths in imports
2. Check `base` path in vite.config.ts
3. Ensure all assets are in `public/` folder
4. Rebuild: `npm run build`

## 📊 Performance

GitHub Pages provides:
- ✅ Free HTTPS
- ✅ CDN distribution
- ✅ Service Worker support
- ✅ Unlimited bandwidth
- ✅ 1GB storage (per repo)

Your PWA will work:
- ✅ Online (loads from GitHub Pages)
- ✅ Offline (Service Worker cache)
- ✅ Installable (PWA manifest)

## 🚀 Continuous Deployment (GitHub Actions)

For automatic deployment on push, create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - math-practice-app
    paths:
      - 'web/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install dependencies
        working-directory: ./web
        run: npm install
      
      - name: Build
        working-directory: ./web
        run: npm run build
      
      - name: Deploy
        working-directory: ./web
        run: npx gh-pages -d dist
```

## 🎉 You're Done!

Your Math Practice App is now live on GitHub Pages!

### Next Steps:
1. Test the deployed app
2. Test offline functionality
3. Share the URL with others
4. Make improvements and redeploy

### Commands Reference

```bash
# Development
cd web
npm run dev          # Local development server

# Production
npm run build        # Build optimized bundle
npm run preview      # Preview production build locally
npm run deploy       # Build and deploy to GitHub Pages
```

---

**Questions?** Check the troubleshooting section or see DEPLOYMENT.md for more details.
