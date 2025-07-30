import { useEffect, useState } from 'react';
import { initDatabase } from '../database/database';

export const useDatabase = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeDB = async () => {
      try {
        await initDatabase();
        setIsInitialized(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize database');
      }
    };

    initializeDB();
  }, []);

  return { isInitialized, error };
}; 