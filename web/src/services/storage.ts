/**
 * IndexedDB storage service for persistent data
 */

const DB_NAME = 'MathPracticeDB';
const DB_VERSION = 1;
const STORES = {
  PLAYERS: 'players',
  SESSIONS: 'sessions',
  ACHIEVEMENTS: 'achievements'
};

let db: IDBDatabase | null = null;

export const initDB = async (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;

      // Create object stores
      if (!database.objectStoreNames.contains(STORES.PLAYERS)) {
        database.createObjectStore(STORES.PLAYERS, { keyPath: 'id' });
      }
      if (!database.objectStoreNames.contains(STORES.SESSIONS)) {
        const sessionStore = database.createObjectStore(STORES.SESSIONS, {
          keyPath: 'id'
        });
        sessionStore.createIndex('playerId', 'playerId', { unique: false });
      }
      if (!database.objectStoreNames.contains(STORES.ACHIEVEMENTS)) {
        database.createObjectStore(STORES.ACHIEVEMENTS, { keyPath: 'id' });
      }
    };
  });
};

const getDB = async (): Promise<IDBDatabase> => {
  if (!db) {
    return initDB();
  }
  return db;
};

export const savePlayer = async (player: any): Promise<void> => {
  const database = await getDB();
  const transaction = database.transaction([STORES.PLAYERS], 'readwrite');
  const store = transaction.objectStore(STORES.PLAYERS);
  return new Promise((resolve, reject) => {
    const request = store.put(player);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const getPlayer = async (playerId: string): Promise<any> => {
  const database = await getDB();
  const transaction = database.transaction([STORES.PLAYERS], 'readonly');
  const store = transaction.objectStore(STORES.PLAYERS);
  return new Promise((resolve, reject) => {
    const request = store.get(playerId);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const getAllPlayers = async (): Promise<any[]> => {
  const database = await getDB();
  const transaction = database.transaction([STORES.PLAYERS], 'readonly');
  const store = transaction.objectStore(STORES.PLAYERS);
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const saveSession = async (session: any): Promise<void> => {
  const database = await getDB();
  const transaction = database.transaction([STORES.SESSIONS], 'readwrite');
  const store = transaction.objectStore(STORES.SESSIONS);
  return new Promise((resolve, reject) => {
    const request = store.put(session);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const getSession = async (sessionId: string): Promise<any> => {
  const database = await getDB();
  const transaction = database.transaction([STORES.SESSIONS], 'readonly');
  const store = transaction.objectStore(STORES.SESSIONS);
  return new Promise((resolve, reject) => {
    const request = store.get(sessionId);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const getSessionsByPlayer = async (playerId: string): Promise<any[]> => {
  const database = await getDB();
  const transaction = database.transaction([STORES.SESSIONS], 'readonly');
  const store = transaction.objectStore(STORES.SESSIONS);
  const index = store.index('playerId');
  return new Promise((resolve, reject) => {
    const request = index.getAll(playerId);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const deleteSession = async (sessionId: string): Promise<void> => {
  const database = await getDB();
  const transaction = database.transaction([STORES.SESSIONS], 'readwrite');
  const store = transaction.objectStore(STORES.SESSIONS);
  return new Promise((resolve, reject) => {
    const request = store.delete(sessionId);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};
