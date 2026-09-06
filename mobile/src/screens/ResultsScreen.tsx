/**
 * Results screen for mobile
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet
} from 'react-native';
import { useGameStore } from '../store/gameStore';
import { saveSession, savePlayer } from '../services/storage';
import {
  calculateAccuracy,
  calculateAverageTime,
  getTimeBounds,
  getPerformanceFeedback,
  formatTime
} from '../../../shared/src/scoring';
import { COLORS } from '../../../shared/src/constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.success,
    paddingHorizontal: 20,
    paddingVertical: 40
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 15,
    textAlign: 'center'
  },
  scoreDisplay: {
    fontSize: 56,
    fontWeight: '700',
    color: COLORS.primary,
    textAlign: 'center',
    marginVertical: 15,
    fontFamily: 'Courier New'
  },
  feedbackText: {
    fontSize: 18,
    color: COLORS.secondary,
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: '600'
  },
  statsGrid: {
    display: 'flex',
    flexDirection: 'column',
    marginVertical: 15
  },
  statBox: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginVertical: 8,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    textTransform: 'uppercase',
    fontWeight: '600'
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary
  },
  achievementsList: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginVertical: 15,
    gap: 10
  },
  achievement: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFE66D',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4
  },
  achievementText: {
    fontSize: 32,
    textAlign: 'center'
  },
  buttonGroup: {
    flexDirection: 'column',
    marginTop: 20,
    gap: 10
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center'
  },
  buttonSecondary: {
    backgroundColor: COLORS.secondary
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
    textTransform: 'uppercase'
  }
});

export const ResultsScreen: React.FC = () => {
  const { currentSession, player, resetGame } = useGameStore();

  if (!currentSession || !player) return null;

  useEffect(() => {
    const saveData = async () => {
      try {
        await saveSession(currentSession);
        await savePlayer(player);
      } catch (error) {
        console.error('Error saving data:', error);
      }
    };
    saveData();
  }, [currentSession, player]);

  const accuracy = calculateAccuracy(currentSession.answers);
  const avgTime = calculateAverageTime(currentSession.answers);
  const { best: bestTime, worst: worstTime } = getTimeBounds(
    currentSession.answers
  );
  const correctCount = currentSession.answers.filter((a) => a.isCorrect).length;
  const performance = getPerformanceFeedback(accuracy);

  const handlePlayAgain = () => {
    resetGame();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>🎉 Session Complete!</Text>
        <Text style={styles.scoreDisplay}>{currentSession.totalScore}</Text>
        <Text style={styles.feedbackText}>{performance}</Text>

        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Correct</Text>
            <Text style={styles.statValue}>{correctCount}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Accuracy</Text>
            <Text style={styles.statValue}>{accuracy}%</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Avg Time</Text>
            <Text style={styles.statValue}>{formatTime(avgTime)}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Best Time</Text>
            <Text style={styles.statValue}>{formatTime(bestTime)}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Worst Time</Text>
            <Text style={styles.statValue}>{formatTime(worstTime)}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Streak</Text>
            <Text style={styles.statValue}>{currentSession.currentStreak}</Text>
          </View>
        </View>

        <View style={styles.achievementsList}>
          {accuracy === 100 && (
            <View style={styles.achievement}>
              <Text style={styles.achievementText}>⭐</Text>
            </View>
          )}
          {currentSession.currentStreak >= 5 && (
            <View style={styles.achievement}>
              <Text style={styles.achievementText}>🔥</Text>
            </View>
          )}
          {bestTime < 3000 && (
            <View style={styles.achievement}>
              <Text style={styles.achievementText}>⚡</Text>
            </View>
          )}
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.button} onPress={handlePlayAgain}>
            <Text style={styles.buttonText}>Play Again</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            onPress={handlePlayAgain}
          >
            <Text style={styles.buttonText}>Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};
