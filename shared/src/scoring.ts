/**
 * Scoring and points calculation logic
 */

import { GameAnswer, Difficulty } from './types';
import { SCORING_RULES } from './constants';

/**
 * Calculate points for a single answer
 */
export function calculatePoints(
  isCorrect: boolean,
  timeTaken: number,
  difficulty: Difficulty,
  streak: number = 0
): number {
  if (!isCorrect) return 0;

  let points = SCORING_RULES.basePoints;

  // Difficulty multiplier
  const difficultyMultipliers: Record<Difficulty, number> = {
    easy: 1,
    medium: 1.5,
    hard: 2,
    expert: 3
  };
  points *= difficultyMultipliers[difficulty];

  // Speed bonus (faster = more points)
  if (timeTaken <= SCORING_RULES.speedBonus.threshold) {
    points *= SCORING_RULES.speedBonus.multiplier;
  }

  // Streak bonus
  points += SCORING_RULES.streakBonus(streak);

  return Math.round(points);
}

/**
 * Calculate accuracy percentage
 */
export function calculateAccuracy(answers: GameAnswer[]): number {
  if (answers.length === 0) return 0;
  const correct = answers.filter(a => a.isCorrect).length;
  return Math.round((correct / answers.length) * 100);
}

/**
 * Calculate average time per problem
 */
export function calculateAverageTime(answers: GameAnswer[]): number {
  if (answers.length === 0) return 0;
  const totalTime = answers.reduce((sum, a) => sum + a.timeTaken, 0);
  return Math.round(totalTime / answers.length);
}

/**
 * Get best and worst response times
 */
export function getTimeBounds(answers: GameAnswer[]): { best: number; worst: number } {
  if (answers.length === 0) return { best: 0, worst: 0 };
  const times = answers.map(a => a.timeTaken);
  return {
    best: Math.min(...times),
    worst: Math.max(...times)
  };
}

/**
 * Calculate total session score
 */
export function calculateSessionScore(answers: GameAnswer[]): number {
  return answers.reduce((sum, answer) => sum + answer.points, 0);
}

/**
 * Get streak count from consecutive correct answers
 */
export function getStreakCount(answers: GameAnswer[]): number {
  if (answers.length === 0) return 0;

  let streak = 0;
  for (let i = answers.length - 1; i >= 0; i--) {
    if (answers[i].isCorrect) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

/**
 * Format time for display (ms to readable format)
 */
export function formatTime(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const ms = milliseconds % 1000;
  return `${seconds}.${Math.floor(ms / 100)}s`;
}

/**
 * Get performance feedback
 */
export function getPerformanceFeedback(accuracy: number): string {
  if (accuracy === 100) return 'Perfect! 🌟';
  if (accuracy >= 90) return 'Excellent! ⭐';
  if (accuracy >= 80) return 'Great job! 👍';
  if (accuracy >= 70) return 'Good work! 💪';
  if (accuracy >= 60) return 'Keep practicing! 📚';
  return 'Keep trying! 🎯';
}
