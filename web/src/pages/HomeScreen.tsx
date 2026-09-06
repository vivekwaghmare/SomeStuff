/**
 * Home screen component
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { getAllPlayers } from '../services/storage';
import { PlayerProfile } from '../../../shared/src/types';
import styled from '@emotion/styled';
import { COLORS, MASCOT_PHRASES } from '../../../shared/src/constants';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary});
  color: white;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  margin-bottom: 3rem;
  opacity: 0.9;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const Mascot = styled(motion.div)`
  font-size: 5rem;
  margin-bottom: 2rem;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));

  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

const InputContainer = styled.div`
  width: 100%;
  max-width: 400px;
  margin-bottom: 2rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  border: none;
  border-radius: 12px;
  background: white;
  color: ${COLORS.text};
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  &::placeholder {
    color: #999;
  }

  &:focus {
    outline: none;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
  max-width: 400px;
  flex-direction: column;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const Button = styled(motion.button)<{ variant?: 'primary' | 'secondary' }>`
  padding: 1rem 2rem;
  font-size: 1.1rem;
  border-radius: 12px;
  font-weight: 600;
  flex: 1;
  background: ${(props) =>
    props.variant === 'secondary' ? 'rgba(255, 255, 255, 0.2)' : 'white'};
  color: ${(props) =>
    props.variant === 'secondary' ? 'white' : COLORS.primary};
  border: 2px solid white;
  text-transform: uppercase;
  letter-spacing: 1px;
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

const PlayersList = styled.div`
  width: 100%;
  max-width: 400px;
  margin-bottom: 2rem;
  max-height: 200px;
  overflow-y: auto;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem;
`;

const PlayerItem = styled(motion.button)`
  width: 100%;
  padding: 0.8rem;
  margin-bottom: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  text-align: left;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateX(4px);
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const MascotMessage = styled.div`
  font-size: 1.3rem;
  margin-top: 2rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const HomeScreen: React.FC = () => {
  const [playerName, setPlayerName] = useState('');
  const [savedPlayers, setSavedPlayers] = useState<PlayerProfile[]>([]);
  const { startNewSession } = useGameStore();
  const [mascotMessage, setMascotMessage] = useState(MASCOT_PHRASES[0]);

  useEffect(() => {
    const loadPlayers = async () => {
      try {
        const players = await getAllPlayers();
        setSavedPlayers(players);
      } catch (error) {
        console.error('Error loading players:', error);
      }
    };
    loadPlayers();
    setMascotMessage(
      MASCOT_PHRASES[Math.floor(Math.random() * MASCOT_PHRASES.length)]
    );
  }, []);

  const handleStart = () => {
    if (playerName.trim()) {
      startNewSession(playerName);
    }
  };

  const handlePlayerSelect = (player: PlayerProfile) => {
    setPlayerName(player.name);
  };

  const isNameValid = playerName.trim().length > 0;

  return (
    <Container>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Title>🧮 Math Master</Title>
        <Subtitle>Practice math and become a champion!</Subtitle>
      </motion.div>

      <Mascot
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
      >
        🎓
      </Mascot>

      <InputContainer>
        <Input
          type="text"
          placeholder="Enter your name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleStart()}
        />
      </InputContainer>

      {savedPlayers.length > 0 && (
        <PlayersList>
          <div style={{ color: 'white', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            Quick Start:
          </div>
          {savedPlayers.map((player) => (
            <PlayerItem
              key={player.id}
              onClick={() => handlePlayerSelect(player)}
              whileHover={{ scale: 1.02 }}
            >
              {player.name} ({player.totalScore} pts)
            </PlayerItem>
          ))}
        </PlayersList>
      )}

      <ButtonGroup>
        <Button
          variant="primary"
          onClick={handleStart}
          disabled={!isNameValid}
          whileHover={isNameValid ? { scale: 1.05 } : {}}
          whileTap={isNameValid ? { scale: 0.95 } : {}}
        >
          Start Game
        </Button>
      </ButtonGroup>

      <MascotMessage>{mascotMessage}</MascotMessage>
    </Container>
  );
};
