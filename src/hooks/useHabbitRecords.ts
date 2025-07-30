import { useState, useEffect } from 'react';
import { HabbitRecord } from '../types/HabbitRecord';
import { HabbitRecordRepository } from '../database/habbitRecordRepository';

interface UseHabbitRecordsReturn {
  records: HabbitRecord[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useHabbitRecords = (habbitIds: string[], date: Date): UseHabbitRecordsReturn => {
  const [records, setRecords] = useState<HabbitRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedRecords = await HabbitRecordRepository.getByHabbitIdAndDate(habbitIds, date);
      setRecords(fetchedRecords);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch habbit records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [habbitIds, date.toISOString()]);

  return {
    records,
    loading,
    error,
    refetch: fetchRecords,
  };
}; 