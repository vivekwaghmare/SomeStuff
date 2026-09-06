/**
 * Game state management using Zustand
 */

import { create } from 'zustand';
import {
  PlayerProfile,
  GameSession,
  MathProblem,
  GameAnswer,
  GameState as AppGameState
} from '../../../shared/src/index';
import { generateProblems } from '../../../shared/src/mathEngine';
import { calculateAccuracy, getStreakCount } from '../../../shared/src/scoring';

interface GameStoreState {
  player: PlayerProfile | null;
  currentSession: GameSession | null;
  currentProblemIndex: number;
  gameStarted: boolean;
  gamePaused: boolean;
  
  // Actions
  setPlayer: (player: PlayerProfile) => void;
  startNewSession: (playerName: string) => void;
  addAnswer: (answer: GameAnswer) => void;
  endSession: () => void;
  resumeSession: (session: GameSession) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameStoreState>((set, get) => ({
  player: null,
  currentSession: null,
  currentProblemIndex: 0,
  gameStarted: false,
  gamePaused: false,

  setPlayer: (player) => set({ player }),

  startNewSession: (playerName) => {
    const playerId = `player_${Date.now()}`;
    const sessionId = `session_${Date.now()}`;
    const problems = generateProblems(10, 'easy');

    const newSession: GameSession = {
      id: sessionId,
      playerId,
      playerName,
      startTime: Date.now(),
      isActive: true,
      problems,
      answers: [],
      totalScore: 0,
      accuracy: 0,
      currentStreak: 0,
      bestStreak: 0
    };

    set({
      currentSession: newSession,
      currentProblemIndex: 0,
      gameStarted: true,
      gamePaused: false,
      player: {
        id: playerId,
        name: playerName,
        createdAt: Date.now(),
        totalScore: 0,
        totalProblemsAnswered: 0,
        totalCorrect: 0,
        bestStreak: 0,
        currentStreak: 0,
        sessions: [],
        achievements: []
      }
    });
  },

  addAnswer: (answer) =>
    set((state) => {
      if (!state.currentSession) return state;

      const newAnswers = [...state.currentSession.answers, answer];
      const accuracy = calculateAccuracy(newAnswers);
      const streak = getStreakCount(newAnswers);

      return {
        currentSession: {
          ...state.currentSession,
          answers: newAnswers,
          accuracy,
          currentStreak: streak,
          totalScore: newAnswers.reduce((sum, a) => sum + a.points, 0)
        },
        currentProblemIndex: state.currentProblemIndex + 1
      };
    }),

  endSession: () =>
    set((state) => {
      if (!state.currentSession) return state;

      const endedSession: GameSession = {
        ...state.currentSession,
        endTime: Date.now(),
        isActive: false
      };

      return {
        currentSession: endedSession,
        gameStarted: false,
        player: state.player
          ? {
              ...state.player,
              totalScore: state.player.totalScore + endedSession.totalScore,
              totalProblemsAnswered:
                state.player.totalProblemsAnswered + endedSession.answers.length,
              totalCorrect:
                state.player.totalCorrect +
                endedSession.answers.filter((a) => a.isCorrect).length,
              bestStreak: Math.max(
                state.player.bestStreak,
                endedSession.currentStreak
              ),
              sessions: [...state.player.sessions, endedSession]
            }
          : null
      };
    }),

  resumeSession: (session) =>
    set({
      currentSession: session,
      currentProblemIndex: session.answers.length,
      gameStarted: true,
      gamePaused: false
    }),

  resetGame: () =>
    set({
      player: null,
      currentSession: null,
      currentProblemIndex: 0,
      gameStarted: false,
      gamePaused: false
    })
}));
