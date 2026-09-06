# Math Practice App - Cross-Platform

A stunning, kid-friendly math practice app for ages 6-14 with support for Web (PWA), Android, and iOS.

## Features

- 🎮 Interactive math practice with 4 operations (addition, subtraction, multiplication, division)
- 📱 Cross-platform: Web (PWA), Android (React Native/Expo), iOS (React Native/Expo)
- 💾 Full offline support with local storage and service workers
- 🎨 Kid-friendly UI with bright colors, animations, and playful mascot
- 📊 Progress tracking, streaks, and cumulative scoring
- ⭐ Encouraging feedback with animations, badges, and sounds
- 🔄 Resume sessions seamlessly

## Technology Stack

- **Web**: React + PWA (service workers, IndexedDB)
- **Mobile**: React Native with Expo
- **Shared Code**: Core game logic, UI components (where possible)
- **Storage**: IndexedDB (web), AsyncStorage (React Native)

## Project Structure

```
.
├── web/                          # React PWA version
│   ├── public/
│   ├── src/
│   │   ├── components/           # Shared UI components
│   │   ├── pages/                # Home, Game, Results screens
│   │   ├── hooks/                # Custom React hooks
│   │   ├── utils/                # Shared utilities
│   │   ├── services/             # Storage, math logic
│   │   ├── styles/               # Global styles
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── package.json
│   └── tsconfig.json
├── mobile/                       # React Native + Expo
│   ├── app/                      # Expo Router structure
│   ├── src/
│   │   ├── components/           # RN components
│   │   ├── screens/              # Game screens
│   │   ├── hooks/                # Custom hooks
│   │   ├── utils/                # Shared utilities
│   │   └── services/             # Storage, math logic
│   ├── app.json
│   ├── package.json
│   └── tsconfig.json
├── shared/                       # Shared code (game logic, types)
│   ├── src/
│   │   ├── types.ts              # TypeScript interfaces
│   │   ├── mathEngine.ts         # Problem generation
│   │   ├── scoring.ts            # Scoring logic
│   │   └── constants.ts          # App constants
│   └── package.json
└── package.json                  # Monorepo root
```

## Quick Start

### Web Version
```bash
cd web
npm install
npm start
```

### Mobile Version
```bash
cd mobile
npm install
npx expo start
```

## Development

- Each platform (web/mobile) shares core logic from `/shared`
- UI is platform-specific but uses similar patterns
- Local storage handles player data persistence
- Service workers enable offline-first web experience

## License

MIT
