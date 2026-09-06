# Math Practice App - Build & Deployment Guide

## 🚀 Deployment

### Web (React PWA)

#### Build for Production
```bash
cd web
npm run build
```

#### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

#### Deploy to Netlify
```bash
cd web
npm run build
# Then drag 'dist' folder to Netlify
```

#### Deploy to GitHub Pages
```bash
cd web
npm run build
# Push 'dist' to gh-pages branch
```

### Mobile (React Native + Expo)

#### Build for Android
```bash
cd mobile
npm install -g eas-cli
eas build --platform android
# APK available for download
```

#### Build for iOS
```bash
cd mobile
eas build --platform ios
# IPA available for download
```

#### Submit to App Stores
```bash
# After building
eas submit --platform ios      # Submit to App Store
eas submit --platform android  # Submit to Google Play
```

## 📋 Checklist

- [ ] Update app version in package.json files
- [ ] Test on multiple devices
- [ ] Verify offline functionality
- [ ] Check data persistence
- [ ] Test all game flows
- [ ] Verify animations on target devices
- [ ] Update privacy policy
- [ ] Add app icons and splash screens
- [ ] Configure build settings
- [ ] Set up analytics (optional)

## 🔧 Configuration

### Environment Variables
Create `.env` files for each platform if needed:

```bash
# web/.env
VITE_API_URL=https://api.example.com
```

### App Icons
Replace in `mobile/assets/icon.png` (192x192 minimum)

### Splash Screens
Replace in `mobile/assets/splash.png` (1242x2436 for iOS, 1080x1920 for Android)

## 📦 Distribution

### Web
- Available at custom domain
- Installable as PWA on all devices
- Works offline

### Android
- Google Play Store
- APK direct distribution
- F-Droid (for open-source)

### iOS
- Apple App Store
- TestFlight for beta testing

## 🐛 Testing

### Unit Tests (to implement)
```bash
# Add jest configuration
npm install --save-dev jest @testing-library/react
```

### E2E Tests (to implement)
```bash
# Add cypress or playwright
npm install --save-dev cypress
```

## 📊 Analytics (Optional)

Integrate Google Analytics or similar:
```typescript
// web/src/utils/analytics.ts
import ReactGA from 'react-ga4';

ReactGA.initialize('G-XXXXXXXXXX');
```

## 🔐 Security

- [ ] Enable HTTPS for web version
- [ ] Set up CSP headers
- [ ] Review data handling
- [ ] Implement rate limiting if needed
- [ ] Regular security audits

## 📈 Performance

### Web Performance
- Lighthouse score: Aim for 90+
- Bundle size: Keep under 500KB
- First Contentful Paint: < 2s
- Time to Interactive: < 3.5s

### Mobile Performance
- App size: Keep under 50MB
- Launch time: < 2s
- Memory usage: Optimize for low-end devices

## 🆘 Troubleshooting

### IndexedDB Issues
```javascript
// Check available storage
navigator.storage.estimate().then(estimate => {
  console.log(`Available: ${estimate.quota}`);
  console.log(`Used: ${estimate.usage}`);
});
```

### Service Worker Issues
```javascript
// Clear service worker cache
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(reg => reg.unregister());
});
```

### React Native Build Issues
```bash
# Clear cache
cd mobile
rm -rf node_modules/.cache
expo start --clear
```

## 📚 Resources

- [Vite Docs](https://vitejs.dev)
- [React Docs](https://react.dev)
- [React Native Docs](https://reactnative.dev)
- [Expo Docs](https://docs.expo.dev)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
