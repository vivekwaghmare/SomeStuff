/**
 * Game screen for mobile
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  KeyboardAvoidingView
} from 'react-native';
import { useGameStore } from '../store/gameStore';
import { calculatePoints, formatTime } from '../../../shared/src/scoring';
import { checkAnswer, formatProblem } from '../../../shared/src/mathEngine';
import { COLORS } from '../../../shared/src/constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f093fb',
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    width: '100%',
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  stat: {
    alignItems: 'center'
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textTransform: 'uppercase',
    fontWeight: '600'
  },
  statValue: {
    fontSize: 20,
    color: 'white',
    fontWeight: '700',
    marginTop: 4
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    marginBottom: 20,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.success,
    borderRadius: 4
  },
  problemCard: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8
  },
  problemNumber: {
    fontSize: 12,
    color: '#999',
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 15
  },
  problem: {
    fontSize: 48,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 20,
    fontFamily: 'Courier New'
  },
  input: {
    width: '80%',
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
    borderWidth: 3,
    borderColor: COLORS.primary,
    borderRadius: 12,
    textAlign: 'center',
    marginBottom: 20
  },
  feedback: {
    width: '100%',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center'
  },
  feedbackCorrect: {
    backgroundColor: 'rgba(149, 225, 211, 0.2)',
    borderWidth: 2,
    borderColor: COLORS.success
  },
  feedbackIncorrect: {
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    borderWidth: 2,
    borderColor: COLORS.danger
  },
  feedbackText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white'
  },
  buttonGroup: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center'
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.success
  },
  buttonDisabled: {
    opacity: 0.5
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
    textTransform: 'uppercase'
  },
  completionText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
    textAlign: 'center'
  }
});

export const GameScreen: React.FC = () => {
  const {
    currentSession,
    currentProblemIndex,
    addAnswer,
    endSession
  } = useGameStore();

  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<{
    message: string;
    isCorrect: boolean;
  } | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [answered, setAnswered] = useState(false);

  if (!currentSession) return null;

  const currentProblem = currentSession.problems[currentProblemIndex];
  const isGameOver = currentProblemIndex >= currentSession.problems.length;

  useEffect(() => {
    if (isGameOver || answered) return;

    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 100);

    return () => clearInterval(timer);
  }, [isGameOver, answered]);

  const handleSubmit = () => {
    if (!answer.trim() || answered) return;

    const userAnswer = parseInt(answer, 10);
    const isCorrect = checkAnswer(userAnswer, currentProblem.correctAnswer);
    const points = calculatePoints(
      isCorrect,
      timeElapsed * 100,
      currentProblem.difficulty,
      currentSession.currentStreak
    );

    addAnswer({
      problemId: currentProblem.id,
      userAnswer,
      isCorrect,
      timeTaken: timeElapsed * 100,
      points
    });

    setFeedback({
      message: isCorrect
        ? `✅ Correct! +${points} points`
        : `❌ Wrong! The answer is ${currentProblem.correctAnswer}`,
      isCorrect
    });
    setAnswered(true);
  };

  const handleNext = () => {
    if (isGameOver) {
      endSession();
    } else {
      setAnswer('');
      setFeedback(null);
      setTimeElapsed(0);
      setAnswered(false);
    }
  };

  const progressPercentage =
    ((currentProblemIndex + 1) / currentSession.problems.length) * 100;
  const formattedTime = formatTime(timeElapsed * 100);

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <View style={styles.progressBar}>
        <Animated.View
          style={[
            styles.progressFill,
            {
              width: `${progressPercentage}%`
            }
          ]}
        />
      </View>

      <View style={styles.header}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Problem</Text>
          <Text style={styles.statValue}>
            {currentProblemIndex + 1}/{currentSession.problems.length}
          </Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Score</Text>
          <Text style={styles.statValue}>{currentSession.totalScore}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Streak</Text>
          <Text style={styles.statValue}>{currentSession.currentStreak}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Time</Text>
          <Text style={styles.statValue}>{formattedTime}</Text>
        </View>
      </View>

      {!isGameOver ? (
        <>
          <View style={styles.problemCard}>
            <Text style={styles.problemNumber}>
              Problem {currentProblemIndex + 1}
            </Text>
            <Text style={styles.problem}>{formatProblem(currentProblem)}</Text>
            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              placeholder="Answer"
              value={answer}
              onChangeText={setAnswer}
              editable={!answered}
              autoFocus
            />
          </View>

          {feedback && (
            <View
              style={[
                styles.feedback,
                feedback.isCorrect
                  ? styles.feedbackCorrect
                  : styles.feedbackIncorrect
              ]}
            >
              <Text style={styles.feedbackText}>{feedback.message}</Text>
            </View>
          )}

          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[
                styles.button,
                (answered || !answer.trim()) && styles.buttonDisabled
              ]}
              onPress={handleSubmit}
              disabled={answered || !answer.trim()}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            {answered && (
              <TouchableOpacity
                style={[styles.button, { backgroundColor: COLORS.primary }]}
                onPress={handleNext}
              >
                <Text style={styles.buttonText}>
                  {isGameOver ? 'Finish' : 'Next'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </>
      ) : (
        <View style={styles.problemCard}>
          <Text style={{ fontSize: 48 }}>🎉</Text>
          <Text style={styles.completionText}>All done! Great work!</Text>
          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>View Results</Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};
