# Math Practice App - Developer Documentation

## Architecture Overview

### Monorepo Structure

```
┌─────────────────────────────────────────────────────┐
│                  shared/                            │
│        (Game Logic & Types)                         │
│  - mathEngine.ts (problem generation)               │
│  - scoring.ts (points calculation)                  │
│  - types.ts (TypeScript interfaces)                 │
│  - constants.ts (config & data)                     │
└─────────────────────────────────────────────────────┘
           ↑                              ↑
    ┌──────┴──────┐              ┌───────┴──────┐
    │   web/      │              │   mobile/    │
    │  (React)    │              │ (React Native)│
    │             │              │              │
    │ • PWA       │              │ • Expo       │
    │ • Service   │              │ • AsyncStorage│
    │   Worker    │              │ • Native     │
    │ • IndexedDB │              │   components │
    └─────────────┘              └──────────────┘
```

## Data Flow

### State Management with Zustand

```
User Input
   ↓
GameStore (Zustand)
   ↓
Derived Data
   ↓
Component Render
   ↓
UI Update
```

### Storage Architecture

```
Web:
IndexedDB ← → Zustand Store → React Components
   ↓
Service Worker (offline cache)

Mobile:
AsyncStorage ← → Zustand Store → React Native Components
```

## Game Loop

```
1. HOME SCREEN
   - User enters name
   - Load previous players
   - Initialize new session

2. GAME SCREEN
   - Generate problem
   - User enters answer
   - Validate answer
   - Calculate points
   - Update score & streak
   - Next problem or end

3. RESULTS SCREEN
   - Display score
   - Show statistics
   - Save session
   - Offer replay
```

## Problem Generation Algorithm

```typescript
function generateProblems(count: 10, startDifficulty: 'easy'):
  1. Initialize difficulty index: 0
  2. For each problem (i=0 to 9):
     - Calculate difficulty progression: easy → medium → hard → expert
     - Select operation (rotation through all 4)
     - Generate random operands within range
     - Calculate correct answer
     - Store problem
  3. Return array of 10 problems
```

## Scoring Algorithm

```
Base Points: 10

Apply Difficulty Multiplier:
  easy: 1x
  medium: 1.5x
  hard: 2x
  expert: 3x

Apply Speed Bonus (if < 5 seconds):
  multiply by 1.5x

Add Streak Bonus:
  +2 points per consecutive correct

Final Points = Base × Difficulty × Speed Bonus + Streak Bonus
```

## Component Hierarchy

### Web App
```
App
├── HomeScreen
│   ├── Title
│   ├── Mascot (animated)
│   ├── Input
│   └── PlayersList
├── GameScreen
│   ├── Header (stats)
│   ├── ProgressBar
│   ├── ProblemCard
│   │   ├── Problem
│   │   └── Input
│   ├── FeedbackMessage
│   └── ButtonGroup
└── ResultsScreen
    ├── ScoreDisplay
    ├── StatsGrid
    ├── AchievementsList
    ├── Chart
    └── ButtonGroup
```

### Mobile App
```
App
├── HomeScreen (ScrollView)
│   ├── Title
│   ├── Mascot (animated)
│   ├── Input
│   └── PlayersList
├── GameScreen (KeyboardAvoidingView)
│   ├── ProgressBar
│   ├── Header (row of stats)
│   ├── ProblemCard
│   │   ├── Problem
│   │   └── Input
│   ├── FeedbackMessage
│   └── ButtonGroup
└── ResultsScreen (ScrollView)
    ├── ScoreDisplay
    ├── StatsGrid
    ├── AchievementsList
    └── ButtonGroup
```

## Storage Schema

### IndexedDB (Web)

**Players Store**
```json
{
  "id": "player_123456",
  "name": "John",
  "createdAt": 1234567890,
  "totalScore": 5000,
  "totalProblemsAnswered": 500,
  "totalCorrect": 450,
  "bestStreak": 25,
  "currentStreak": 5,
  "achievements": []
}
```

**Sessions Store**
```json
{
  "id": "session_123456",
  "playerId": "player_123456",
  "playerName": "John",
  "startTime": 1234567890,
  "endTime": 1234568990,
  "problems": [...],
  "answers": [...],
  "totalScore": 150,
  "accuracy": 95,
  "currentStreak": 8,
  "bestStreak": 8
}
```

## API Reference

### Math Engine

```typescript
// Generate single problem
function generateProblem(
  operation: 'addition' | 'subtraction' | 'multiplication' | 'division',
  difficulty: 'easy' | 'medium' | 'hard' | 'expert'
): MathProblem

// Generate batch
function generateProblems(count: number, startDifficulty?: Difficulty): MathProblem[]

// Validate answer
function checkAnswer(userAnswer: number, correctAnswer: number): boolean

// Format for display
function formatProblem(problem: MathProblem): string  // "5 + 3"
```

### Scoring

```typescript
function calculatePoints(
  isCorrect: boolean,
  timeTaken: number,
  difficulty: Difficulty,
  streak?: number
): number

function calculateAccuracy(answers: GameAnswer[]): number  // 0-100

function getStreakCount(answers: GameAnswer[]): number

function formatTime(milliseconds: number): string  // "5.3s"
```

### Storage (Web)

```typescript
// Initialize IndexedDB
async function initDB(): Promise<IDBDatabase>

// Player operations
async function savePlayer(player: PlayerProfile): Promise<void>
async function getPlayer(playerId: string): Promise<PlayerProfile | null>
async function getAllPlayers(): Promise<PlayerProfile[]>

// Session operations
async function saveSession(session: GameSession): Promise<void>
async function getSessionsByPlayer(playerId: string): Promise<GameSession[]>
```

### Storage (Mobile)

```typescript
// AsyncStorage operations (same signatures as web)
async function savePlayer(player: PlayerProfile): Promise<void>
async function getAllPlayers(): Promise<PlayerProfile[]>
async function saveSession(session: GameSession): Promise<void>
async function getSessionsByPlayer(playerId: string): Promise<GameSession[]>
```

## Error Handling

### Storage Errors
```typescript
try {
  await savePlayer(player);
} catch (error) {
  console.error('Error saving player:', error);
  // Fallback: store in memory
}
```

### Input Validation
```typescript
if (!playerName.trim()) {
  // Show error, prevent game start
}

if (isNaN(parseInt(answer))) {
  // Show error, don't submit
}
```

## Performance Tips

1. **Memoization**: Use `React.memo` for components that don't need frequent updates
2. **Animation**: Only animate transform/opacity for 60fps performance
3. **Storage**: Batch operations when possible
4. **Rendering**: Use conditional rendering to avoid unnecessary renders
5. **Bundling**: Code-split routes and lazy load components

## Browser Support

- Chrome/Edge: 90+
- Firefox: 88+
- Safari: 14+
- Mobile browsers: Latest versions
- IE: Not supported (use modern APIs)

## Device Support

- **Android**: 8.0+
- **iOS**: 12.0+
- **Web**: All modern browsers
- **Tablet**: Full responsive support

## Known Limitations

1. **IndexedDB Quota**: ~50MB per origin (browser-dependent)
2. **Service Worker**: Requires HTTPS in production
3. **AsyncStorage**: ~6MB on Android, ~10MB on iOS
4. **Animations**: May be less smooth on low-end devices

## Future Enhancements

- [ ] Backend sync for cross-device play
- [ ] Multiplayer mode
- [ ] Advanced statistics and analytics
- [ ] Custom difficulty settings
- [ ] Theme customization
- [ ] Sound effects and music
- [ ] Push notifications for daily challenges
- [ ] Parent dashboard
- [ ] Cloud save support
- [ ] Internationalization (i18n)

## Troubleshooting Guide

### Game not saving progress
- Check browser storage permissions
- Clear cache and reload
- Verify IndexedDB is enabled
- Check browser console for errors

### Animations stuttering
- Profile with DevTools Performance tab
- Reduce animation count
- Use GPU-accelerated properties (transform, opacity)
- Test on actual device

### Offline mode not working
- Check Service Worker registration
- Verify assets are cached
- Clear Service Worker cache
- Check browser HTTPS requirement

### Mobile app crashes
- Check console logs
- Verify memory availability
- Reduce image sizes
- Profile with React Native Profiler
