/**
 * Core TypeScript types for the math practice app
 */

export type Operation = 'addition' | 'subtraction' | 'multiplication' | 'division';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface MathProblem {
  id: string;
  operation: Operation;
  operand1: number;
  operand2: number;
  difficulty: Difficulty;
  correctAnswer: number;
}

export interface GameAnswer {
  problemId: string;
  userAnswer: number;
  isCorrect: boolean;
  timeTaken: number; // milliseconds
  points: number;
}

export interface GameSession {
  id: string;
  playerId: string;
  playerName: string;
  startTime: number;
  endTime?: number;
  isActive: boolean;
  problems: MathProblem[];
  answers: GameAnswer[];
  totalScore: number;
  accuracy: number; // percentage
  currentStreak: number;
  bestStreak: number;
}

export interface PlayerProfile {
  id: string;
  name: string;
  createdAt: number;
  lastSessionId?: string;
  totalScore: number;
  totalProblemsAnswered: number;
  totalCorrect: number;
  bestStreak: number;
  currentStreak: number;
  sessions: GameSession[];
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: number;
}

export interface GameState {
  player: PlayerProfile;
  currentSession: GameSession | null;
  currentProblemIndex: number;
  gameStarted: boolean;
  gamePaused: boolean;
}

export interface ScoreBreakdown {
  correctAnswers: number;
  incorrectAnswers: number;
  totalAnswers: number;
  accuracy: number;
  totalPoints: number;
  averageTimePerProblem: number;
  bestTime: number;
  worstTime: number;
}
