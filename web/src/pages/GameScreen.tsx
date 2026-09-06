/**
 * Game screen component
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { calculatePoints, formatTime } from '../../../shared/src/scoring';
import { checkAnswer, formatProblem } from '../../../shared/src/mathEngine';
import styled from '@emotion/styled';
import { COLORS } from '../../../shared/src/constants';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(180deg, #f093fb 0%, #f5576c 100%);
  color: white;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 600px;
  margin-bottom: 2rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
`;

const Stats = styled.div`
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
`;

const Stat = styled.div`
  text-align: center;

  .label {
    font-size: 0.9rem;
    opacity: 0.8;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .value {
    font-size: 1.5rem;
    font-weight: 700;
  }
`;

const Timer = styled(motion.div)<{ isLowTime?: boolean }>`
  font-size: 2rem;
  font-weight: 700;
  color: ${(props) => (props.isLowTime ? '#FFE66D' : 'white')};
`;

const ProblemCard = styled(motion.div)`
  background: white;
  color: ${COLORS.text};
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
  margin-bottom: 2rem;
  width: 100%;
  max-width: 500px;
  text-align: center;
`;

const ProblemNumber = styled.div`
  font-size: 0.9rem;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 1rem;
`;

const Problem = styled.div`
  font-size: 3rem;
  font-weight: 700;
  color: ${COLORS.primary};
  margin-bottom: 2rem;
  font-family: 'Monaco', 'Courier New', monospace;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const InputField = styled.input`
  width: 100%;
  max-width: 300px;
  padding: 1rem;
  font-size: 1.5rem;
  border: 3px solid ${COLORS.primary};
  border-radius: 12px;
  text-align: center;
  font-weight: 700;
  margin-bottom: 1.5rem;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 4px rgba(255, 107, 107, 0.2);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
  max-width: 500px;
`;

const Button = styled(motion.button)<{ variant?: 'primary' | 'danger' }>`
  flex: 1;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
  background: ${(props) =>
    props.variant === 'danger' ? '#FF6B6B' : COLORS.success};
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const FeedbackMessage = styled(motion.div)<{ isCorrect?: boolean }>`
  font-size: 1.3rem;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  background: ${(props) =>
    props.isCorrect
      ? 'rgba(149, 225, 211, 0.2)'
      : 'rgba(255, 107, 107, 0.2)'};
  color: ${(props) => (props.isCorrect ? '#95E1D3' : '#FF6B6B')};
  border: 2px solid ${(props) =>
    props.isCorrect ? '#95E1D3' : '#FF6B6B'};
`;

const ProgressBar = styled.div`
  width: 100%;
  max-width: 600px;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 2rem;
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: ${COLORS.success};
  border-radius: 4px;
`;

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
    <Container>
      <ProgressBar>
        <ProgressFill
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5 }}
        />
      </ProgressBar>

      <Header>
        <Stats>
          <Stat>
            <div className="label">Problem</div>
            <div className="value">
              {currentProblemIndex + 1}/{currentSession.problems.length}
            </div>
          </Stat>
          <Stat>
            <div className="label">Score</div>
            <div className="value">{currentSession.totalScore}</div>
          </Stat>
          <Stat>
            <div className="label">Streak</div>
            <div className="value">{currentSession.currentStreak}</div>
          </Stat>
        </Stats>
        <Stat>
          <div className="label">Time</div>
          <Timer isLowTime={timeElapsed > 50}>{formattedTime}</Timer>
        </Stat>
      </Header>

      {!isGameOver ? (
        <>
          <ProblemCard
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <ProblemNumber>Problem {currentProblemIndex + 1}</ProblemNumber>
            <Problem>{formatProblem(currentProblem)}</Problem>
            <InputField
              type="number"
              placeholder="Your answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              disabled={answered}
              autoFocus
            />
          </ProblemCard>

          <AnimatePresence>
            {feedback && (
              <FeedbackMessage
                isCorrect={feedback.isCorrect}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                {feedback.message}
              </FeedbackMessage>
            )}
          </AnimatePresence>

          <ButtonGroup>
            <Button
              onClick={handleSubmit}
              disabled={answered || !answer.trim()}
              whileHover={!answered && answer.trim() ? { scale: 1.05 } : {}}
              whileTap={!answered && answer.trim() ? { scale: 0.95 } : {}}
            >
              Submit
            </Button>
            {answered && (
              <Button
                variant="primary"
                onClick={handleNext}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isGameOver ? 'Finish' : 'Next'}
              </Button>
            )}
          </ButtonGroup>
        </>
      ) : (
        <ProblemCard
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <Problem>🎉</Problem>
          <div style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>
            All done! Great work!
          </div>
          <Button onClick={handleNext} whileHover={{ scale: 1.05 }}>
            View Results
          </Button>
        </ProblemCard>
      )}
    </Container>
  );
};
