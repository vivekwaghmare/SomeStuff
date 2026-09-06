/**
 * Home screen for mobile
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated
} from 'react-native';
import { useGameStore } from '../store/gameStore';
import { getAllPlayers } from '../services/storage';
import { PlayerProfile } from '../../../shared/src/types';
import { COLORS, MASCOT_PHRASES } from '../../../shared/src/constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 40,
    fontWeight: '700',
    color: 'white',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 30,
    textAlign: 'center'
  },
  mascot: {
    fontSize: 80,
    marginBottom: 30,
    textAlign: 'center'
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 12,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500'
  },
  playersList: {
    width: '100%',
    maxHeight: 200,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 10
  },
  playerItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 5,
    borderWidth: 2,
    borderColor: 'white'
  },
  playerItemText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  button: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 12,
    width: '100%',
    marginTop: 10,
    alignItems: 'center'
  },
  buttonDisabled: {
    opacity: 0.5
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  mascotMessage: {
    marginTop: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'white',
    minHeight: 60,
    justifyContent: 'center',
    alignItems: 'center'
  },
  mascotMessageText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center'
  }
});

export const HomeScreen: React.FC = () => {
  const [playerName, setPlayerName] = useState('');
  const [savedPlayers, setSavedPlayers] = useState<PlayerProfile[]>([]);
  const [mascotMessage, setMascotMessage] = useState(MASCOT_PHRASES[0]);
  const { startNewSession } = useGameStore();
  const mascotAnim = new Animated.Value(0);

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

    // Animate mascot
    Animated.loop(
      Animated.sequence([
        Animated.timing(mascotAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true
        }),
        Animated.timing(mascotAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true
        })
      ])
    ).start();
  }, []);

  const handleStart = () => {
    if (playerName.trim()) {
      startNewSession(playerName);
    }
  };

  const handlePlayerSelect = (player: PlayerProfile) => {
    setPlayerName(player.name);
  };

  const mascotScale = mascotAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.05]
  });

  const isNameValid = playerName.trim().length > 0;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🎓 Math Master</Text>
      <Text style={styles.subtitle}>Practice math and become a champion!</Text>

      <Animated.Text
        style={[styles.mascot, { transform: [{ scale: mascotScale }] }]}
      >
        🧙
      </Animated.Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={playerName}
          onChangeText={setPlayerName}
          placeholderTextColor="#999"
        />
      </View>

      {savedPlayers.length > 0 && (
        <View style={styles.playersList}>
          {savedPlayers.map((player) => (
            <TouchableOpacity
              key={player.id}
              style={styles.playerItem}
              onPress={() => handlePlayerSelect(player)}
            >
              <Text style={styles.playerItemText}>
                {player.name} ({player.totalScore} pts)
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.button,
          !isNameValid && styles.buttonDisabled
        ]}
        onPress={handleStart}
        disabled={!isNameValid}
      >
        <Text style={styles.buttonText}>Start Game</Text>
      </TouchableOpacity>

      <View style={styles.mascotMessage}>
        <Text style={styles.mascotMessageText}>{mascotMessage}</Text>
      </View>
    </ScrollView>
  );
};
