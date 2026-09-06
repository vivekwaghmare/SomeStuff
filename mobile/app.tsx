/**
 * Root navigation component for mobile app
 */

import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useGameStore } from './store/gameStore';
import { HomeScreen } from './screens/HomeScreen';
import { GameScreen } from './screens/GameScreen';
import { ResultsScreen } from './screens/ResultsScreen';

export default function App() {
  const { gameStarted, currentSession } = useGameStore();

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

  return <View style={{ flex: 1 }}>{screen}</View>
}
