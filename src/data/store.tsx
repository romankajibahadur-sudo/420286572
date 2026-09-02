import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Journey } from './types';
import { journeys as fallbackJourneys } from './treks';
import { listJourneys } from '../lib/db';

interface JourneysContextValue {
  journeys: Journey[];
  loading: boolean;
  source: 'database' | 'default';
  refresh: () => Promise<void>;
}

const JourneysContext = createContext<JourneysContextValue>({
  journeys: fallbackJourneys,
  loading: true,
  source: 'default',
  refresh: async () => {},
});

/**
 * Live journey catalogue. Seeds instantly with the shipped data, then
 * hydrates from the database (admin edits/additions merge over the
 * catalogue). Admin actions call refresh() to push changes site-wide.
 */
export function JourneysProvider({ children }: { children: ReactNode }) {
  const [journeys, setJourneys] = useState<Journey[]>(fallbackJourneys);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<'database' | 'default'>('default');

  const refresh = useCallback(async () => {
    try {
      const list = await listJourneys();
      setJourneys(list);
      setSource('database');
    } catch (e) {
      console.error('Failed to load journeys from database', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return (
    <JourneysContext.Provider value={{ journeys, loading, source, refresh }}>
      {children}
    </JourneysContext.Provider>
  );
}

export const useJourneys = () => useContext(JourneysContext);
