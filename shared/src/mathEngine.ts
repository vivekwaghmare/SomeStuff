/**
 * Core math problem generation and validation engine
 */

import { MathProblem, Operation, Difficulty } from './types';
import { DIFFICULTY_RANGES } from './constants';

/**
 * Generate a random math problem based on difficulty and operation
 */
export function generateProblem(
  operation: Operation,
  difficulty: Difficulty,
  problemId?: string
): MathProblem {
  const range = DIFFICULTY_RANGES[difficulty];
  const operand1 = getRandomInt(range.min, range.max);
  let operand2 = getRandomInt(range.min, range.max);

  // For division, ensure no division by zero and whole number results
  if (operation === 'division') {
    operand2 = getRandomInt(1, range.max);
  }

  const correctAnswer = calculateAnswer(operand1, operand2, operation);

  return {
    id: problemId || `prob_${Date.now()}_${Math.random()}`,
    operation,
    operand1,
    operand2,
    difficulty,
    correctAnswer
  };
}

/**
 * Generate a sequence of problems with progressive difficulty
 */
export function generateProblems(
  count: number,
  startDifficulty: Difficulty = 'easy'
): MathProblem[] {
  const problems: MathProblem[] = [];
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'expert'];
  const difficultyIndex = difficulties.indexOf(startDifficulty);
  const operations: Operation[] = ['addition', 'subtraction', 'multiplication', 'division'];

  for (let i = 0; i < count; i++) {
    // Gradually increase difficulty
    const diffIdx = Math.min(
      difficultyIndex + Math.floor(i / Math.ceil(count / 2)),
      difficulties.length - 1
    );
    const difficulty = difficulties[diffIdx];
    const operation = operations[i % operations.length];

    problems.push(generateProblem(operation, difficulty));
  }

  return problems;
}

/**
 * Calculate the correct answer for a problem
 */
export function calculateAnswer(
  operand1: number,
  operand2: number,
  operation: Operation
): number {
  switch (operation) {
    case 'addition':
      return operand1 + operand2;
    case 'subtraction':
      return Math.abs(operand1 - operand2);
    case 'multiplication':
      return operand1 * operand2;
    case 'division':
      return operand2 !== 0 ? Math.floor(operand1 / operand2) : 0;
    default:
      return 0;
  }
}

/**
 * Check if an answer is correct
 */
export function checkAnswer(userAnswer: number, correctAnswer: number): boolean {
  return userAnswer === correctAnswer;
}

/**
 * Get difficulty based on current performance
 */
export function getNextDifficulty(
  currentDifficulty: Difficulty,
  accuracy: number,
  streakCount: number
): Difficulty {
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'expert'];
  const currentIndex = difficulties.indexOf(currentDifficulty);

  // Increase difficulty if performing well
  if (accuracy > 80 && streakCount >= 3 && currentIndex < difficulties.length - 1) {
    return difficulties[currentIndex + 1];
  }

  // Decrease difficulty if struggling
  if (accuracy < 50 && currentIndex > 0) {
    return difficulties[currentIndex - 1];
  }

  return currentDifficulty;
}

/**
 * Format problem for display
 */
export function formatProblem(problem: MathProblem): string {
  const operationSymbol = getOperationSymbol(problem.operation);
  return `${problem.operand1} ${operationSymbol} ${problem.operand2}`;
}

/**
 * Get operation symbol
 */
export function getOperationSymbol(operation: Operation): string {
  const symbols: Record<Operation, string> = {
    addition: '+',
    subtraction: '−',
    multiplication: '×',
    division: '÷'
  };
  return symbols[operation];
}

/**
 * Utility: Get random integer between min and max (inclusive)
 */
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Utility: Shuffle array
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
