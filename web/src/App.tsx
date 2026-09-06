/**
 * Main App component
 */

import React, { useEffect } from 'react';
import { Global } from '@emotion/react';
import { css } from '@emotion/react';
import { useGameStore } from './store/gameStore';
import { initDB } from './services/storage';
import { HomeScreen } from './pages/HomeScreen';
import { GameScreen } from './pages/GameScreen';
import { ResultsScreen } from './pages/ResultsScreen';
import { COLORS } from '../../shared/src/constants';

const globalStyles = css`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html,
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${COLORS.background};
    color: ${COLORS.text};
  }

  body {
    overflow-x: hidden;
  }

  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  button {
    cursor: pointer;
    border: none;
    font-family: inherit;
    transition: all 0.3s ease;
  }

  input {
    font-family: inherit;
    font-size: 1rem;
  }

  /* Chrome, Safari and Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type='number'] {
    -moz-appearance: textfield;
  }

  @media (max-width: 768px) {
    body {
      font-size: 14px;
    }
  }
`;

function App() {
  const { gameStarted, currentSession, resetGame } = useGameStore();

  useEffect(() => {
    // Initialize IndexedDB
    const initializeDB = async () => {
      try {
        await initDB();
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    };
    initializeDB();
  }, []);

  // Determine which screen to show
  let screen = <HomeScreen />;

  if (gameStarted && currentSession) {
    // Check if game is finished
    if (currentSession.answers.length >= currentSession.problems.length) {
      screen = <ResultsScreen />;
    } else {
      screen = <GameScreen />;
    }
  }

  return (
    <>
      <Global styles={globalStyles} />
      {screen}
    </>
  );
}

export default App;
