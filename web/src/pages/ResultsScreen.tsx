/**
 * Results screen component
 */

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import {
  calculateAccuracy,
  calculateAverageTime,
  getTimeBounds,
  getPerformanceFeedback,
  formatTime
} from '../../../shared/src/scoring';
import styled from '@emotion/styled';
import { COLORS } from '../../../shared/src/constants';
import { saveSession, savePlayer } from '../services/storage';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, ${COLORS.success} 0%, ${COLORS.secondary} 100%);
  color: white;
  overflow-y: auto;
`;

const Card = styled(motion.div)`
  background: white;
  color: ${COLORS.text};
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
  margin-bottom: 2rem;
  width: 100%;
  max-width: 600px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: ${COLORS.primary};

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const ScoreDisplay = styled.div`
  font-size: 4rem;
  font-weight: 700;
  color: ${COLORS.primary};
  margin: 1rem 0;
  font-family: 'Monaco', 'Courier New', monospace;
`;

const FeedbackText = styled.p`
  font-size: 1.3rem;
  color: ${COLORS.secondary};
  margin: 1rem 0;
  font-weight: 600;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
  text-align: center;
`;

const StatBox = styled.div`
  background: ${COLORS.background};
  padding: 1.5rem;
  border-radius: 12px;
  border-left: 4px solid ${COLORS.primary};
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.5rem;
`;

const StatValue = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${COLORS.primary};
`;

const AchievementsList = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin: 2rem 0;
`;

const Achievement = styled(motion.div)`
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #FFE66D 0%, #FF6B6B 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  cursor: pointer;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  width: 100%;
  flex-direction: column;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const Button = styled(motion.button)`
  flex: 1;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  background: ${COLORS.primary};
  color: white;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }

  &:nth-of-type(2) {
    background: ${COLORS.secondary};
  }
`;

const ChartContainer = styled.div`
  margin: 2rem 0;
  padding: 1.5rem;
  background: ${COLORS.background};
  border-radius: 12px;
`;

export const ResultsScreen: React.FC = () => {
  const { currentSession, player, resetGame } = useGameStore();

  if (!currentSession || !player) return null;

  useEffect(() => {
    // Save session and player data
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

  const chartData = {
    labels: currentSession.answers.map((_, i) => `Q${i + 1}`),
    datasets: [
      {
        label: 'Time (seconds)',
        data: currentSession.answers.map((a) => a.timeTaken / 1000),
        borderColor: COLORS.primary,
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const handlePlayAgain = () => {
    resetGame();
  };

  const handleHome = () => {
    resetGame();
  };

  return (
    <Container>
      <Card
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Title>🎉 Session Complete!</Title>
        <ScoreDisplay>{currentSession.totalScore}</ScoreDisplay>
        <FeedbackText>{performance}</FeedbackText>

        <StatsGrid>
          <StatBox>
            <StatLabel>Correct</StatLabel>
            <StatValue>{correctCount}</StatValue>
          </StatBox>
          <StatBox>
            <StatLabel>Accuracy</StatLabel>
            <StatValue>{accuracy}%</StatValue>
          </StatBox>
          <StatBox>
            <StatLabel>Avg Time</StatLabel>
            <StatValue>{formatTime(avgTime)}</StatValue>
          </StatBox>
          <StatBox>
            <StatLabel>Best Time</StatLabel>
            <StatValue>{formatTime(bestTime)}</StatValue>
          </StatBox>
          <StatBox>
            <StatLabel>Worst Time</StatLabel>
            <StatValue>{formatTime(worstTime)}</StatValue>
          </StatBox>
          <StatBox>
            <StatLabel>Streak</StatLabel>
            <StatValue>{currentSession.currentStreak}</StatValue>
          </StatBox>
        </StatsGrid>

        {currentSession.answers.length > 0 && (
          <ChartContainer>
            <Line data={chartData} options={{ responsive: true }} />
          </ChartContainer>
        )}

        <AchievementsList>
          {accuracy === 100 && (
            <Achievement
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              title="Perfect Score!"
            >
              ⭐
            </Achievement>
          )}
          {currentSession.currentStreak >= 5 && (
            <Achievement
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring' }}
              title="On Fire!"
            >
              🔥
            </Achievement>
          )}
          {bestTime < 3000 && (
            <Achievement
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: 'spring' }}
              title="Speed Demon!"
            >
              ⚡
            </Achievement>
          )}
        </AchievementsList>

        <ButtonGroup>
          <Button
            onClick={handlePlayAgain}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Play Again
          </Button>
          <Button
            onClick={handleHome}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Home
          </Button>
        </ButtonGroup>
      </Card>
    </Container>
  );
};
