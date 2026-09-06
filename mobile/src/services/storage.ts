/**
 * Mobile storage service using AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { PlayerProfile, GameSession } from '../../../shared/src/types';

const KEYS = {
  PLAYERS: 'players',
  SESSIONS: 'sessions',
  CURRENT_PLAYER: 'current_player'
};

export const savePlayer = async (player: PlayerProfile): Promise<void> => {
  try {
    const players = await getAllPlayers();
    const index = players.findIndex((p) => p.id === player.id);
    if (index >= 0) {
      players[index] = player;
    } else {
      players.push(player);
    }
    await AsyncStorage.setItem(KEYS.PLAYERS, JSON.stringify(players));
  } catch (error) {
    console.error('Error saving player:', error);
  }
};

export const getPlayer = async (playerId: string): Promise<PlayerProfile | null> => {
  try {
    const players = await getAllPlayers();
    return players.find((p) => p.id === playerId) || null;
  } catch (error) {
    console.error('Error getting player:', error);
    return null;
  }
};

export const getAllPlayers = async (): Promise<PlayerProfile[]> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.PLAYERS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting all players:', error);
    return [];
  }
};

export const saveSession = async (session: GameSession): Promise<void> => {
  try {
    const sessions = await getAllSessions();
    sessions.push(session);
    await AsyncStorage.setItem(KEYS.SESSIONS, JSON.stringify(sessions));
  } catch (error) {
    console.error('Error saving session:', error);
  }
};

export const getSessionsByPlayer = async (
  playerId: string
): Promise<GameSession[]> => {
  try {
    const sessions = await getAllSessions();
    return sessions.filter((s) => s.playerId === playerId);
  } catch (error) {
    console.error('Error getting sessions:', error);
    return [];
  }
};

export const getAllSessions = async (): Promise<GameSession[]> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.SESSIONS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting all sessions:', error);
    return [];
  }
};

export const setCurrentPlayer = async (player: PlayerProfile): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.CURRENT_PLAYER, JSON.stringify(player));
  } catch (error) {
    console.error('Error setting current player:', error);
  }
};

export const getCurrentPlayer = async (): Promise<PlayerProfile | null> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.CURRENT_PLAYER);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting current player:', error);
    return null;
  }
};
