# Contributing Guidelines

## Development Workflow

### 1. Setup
```bash
git clone https://github.com/vivekwaghmare/SomeStuff.git
cd SomeStuff
git checkout math-practice-app
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install workspace dependencies
npm run install:all
```

### 3. Development

#### Web
```bash
cd web
npm run dev
# Runs on http://localhost:3000
```

#### Mobile
```bash
cd mobile
npx expo start
# Scan QR code with Expo Go
```

### 4. Type Checking
```bash
npm run type-check
```

### 5. Code Structure

#### Adding a New Feature
1. Define types in `shared/src/types.ts`
2. Implement logic in `shared/src/mathEngine.ts` or `scoring.ts`
3. Add constants to `shared/src/constants.ts`
4. Create UI components in `web/src/pages/` or `mobile/src/screens/`
5. Update state in `gameStore.ts` if needed

#### Styling
- **Web**: Use Emotion CSS-in-JS (styled components)
- **Mobile**: Use React Native StyleSheet
- Keep colors in constants for consistency

### 6. Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes
# Commit with clear messages
git commit -m "feat: Add new feature"

# Push to branch
git push origin feature/your-feature

# Create Pull Request
```

## Code Standards

### TypeScript
- Always use strict mode
- Define interfaces for all data structures
- Avoid `any` type
- Use descriptive variable names

### React
- Functional components with hooks
- Use custom hooks for shared logic
- Memoize expensive computations
- Keep components focused and small

### File Organization
```
src/
├── components/       # Reusable components
├── pages/           # Screen components
├── screens/         # Mobile screens
├── services/        # External integrations
├── store/           # State management
├── styles/          # Global styles
├── utils/           # Utility functions
└── hooks/           # Custom hooks
```

### Naming Conventions
- Components: PascalCase (HomeScreen.tsx)
- Functions: camelCase (calculatePoints)
- Constants: UPPER_SNAKE_CASE (COLORS, PROBLEMS_PER_SESSION)
- Files: Descriptive names matching exports

## Testing

### Manual Testing Checklist
- [ ] New player creation
- [ ] Game flow completion
- [ ] Problem generation
- [ ] Scoring calculation
- [ ] Data persistence
- [ ] Offline functionality
- [ ] Responsive design
- [ ] Animation performance
- [ ] Error handling
- [ ] Platform-specific features

### Performance Testing
```bash
# Lighthouse audit (web)
cd web
npm run build
# Use Chrome DevTools Lighthouse

# Mobile profiling
# Use React Native Profiler in Expo
```

## Documentation

- Keep README.md updated
- Add JSDoc comments for complex functions
- Document API changes
- Update IMPLEMENTATION.md for major changes

## Common Tasks

### Adding a new difficulty level
1. Update `DIFFICULTY_RANGES` in `shared/src/constants.ts`
2. Add to `difficulties` array in `mathEngine.ts`
3. Update UI to show new level

### Adding a new achievement
1. Add to `ACHIEVEMENTS` array in constants
2. Update achievement checking logic
3. Add visual badge

### Changing scoring rules
1. Update `SCORING_RULES` in constants
2. Update formulas in `scoring.ts`
3. Test with various scenarios

## Debugging

### Web
```javascript
// React DevTools
import React from 'react'
devTools.registerComponent(...)

// Redux DevTools for Zustand
import { devtools } from 'zustand/middleware'
```

### Mobile
```bash
# Expo DevTools
expo start --dev-client

# Debug menu (shake device or Cmd+D)
```

## Performance Optimization

- Use React.memo for components that render frequently
- Implement virtualization for large lists
- Optimize animations with transform/opacity only
- Lazy load components when possible
- Profile regularly with DevTools

## Release Process

1. Update version numbers
2. Run full test suite
3. Build for all platforms
4. Tag release: `git tag v1.0.0`
5. Push tag: `git push origin v1.0.0`
6. Deploy to platforms
7. Update changelog
