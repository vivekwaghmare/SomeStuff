/**
 * App-wide constants
 */

export const DIFFICULTY_RANGES = {
  easy: { min: 1, max: 10 },
  medium: { min: 10, max: 50 },
  hard: { min: 50, max: 100 },
  expert: { min: 100, max: 999 }
};

export const OPERATIONS = ['addition', 'subtraction', 'multiplication', 'division'] as const;

export const SCORING_RULES = {
  basePoints: 10,
  speedBonus: { threshold: 5000, multiplier: 1.5 }, // 5 seconds or less
  streakBonus: (streak: number) => streak > 0 ? streak * 2 : 0,
  accuracyBonus: (accuracy: number) => accuracy === 100 ? 50 : 0
};

export const PROBLEMS_PER_SESSION = 10;

export const TIME_LIMIT_MS = 120000; // 2 minutes per problem

export const ACHIEVEMENTS = [
  { id: 'first_ten', name: 'First Steps', description: 'Answer 10 questions correctly', threshold: 10 },
  { id: 'speed_demon', name: 'Speed Demon', description: 'Answer a question in under 3 seconds', threshold: 3000 },
  { id: 'perfect_session', name: 'Perfect Session', description: 'Get 100% accuracy in a session', threshold: 100 },
  { id: 'streak_10', name: 'On Fire', description: 'Reach a 10-question streak', threshold: 10 },
  { id: 'master_math', name: 'Math Master', description: 'Score 1000 points', threshold: 1000 }
];

export const STORAGE_KEYS = {
  player: 'math_app_player',
  sessions: 'math_app_sessions',
  currentSession: 'math_app_current_session',
  achievements: 'math_app_achievements'
};

export const ANIMATIONS = {
  correctAnswer: 'bounce',
  incorrectAnswer: 'shake',
  newLevel: 'fadeIn',
  achievement: 'pulse'
};

export const COLORS = {
  primary: '#FF6B6B',
  secondary: '#4ECDC4',
  success: '#95E1D3',
  warning: '#FFE66D',
  danger: '#FF6B6B',
  background: '#F7F7F7',
  text: '#2D3436',
  light: '#FFFFFF'
};

export const MASCOT_PHRASES = [
  '🎉 Awesome job!',
  '⭐ You\'re a star!',
  '🚀 Keep it up!',
  '💪 You\'re strong!',
  '🎯 Perfect aim!',
  '🌟 Shining bright!',
  '🎪 What a performance!',
  '🏆 Champion!'
];
