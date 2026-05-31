import { useCallback, useEffect, useRef, useState } from 'react';
import { API_BASE_URL } from '../config/api';

export interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Lean fetch hook for screen-level data loads. Auto-refetches at `refreshMs`,
 * cancels in-flight requests on unmount, exposes loading/error so every screen
 * can render LoadingState / ErrorState consistently per TV UX rules.
 */
export function useFetch<T>(path: string, refreshMs = 30_000): FetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cancelled = useRef(false);

  const load = useCallback(async () => {
    setLoading((prev) => (data === null ? true : prev));
    setError(null);
    try {
      const url = `${API_BASE_URL}${path}`;
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const json = (await resp.json()) as T;
      if (!cancelled.current) {
        setData(json);
        setLoading(false);
      }
    } catch (err) {
      if (!cancelled.current) {
        setError((err as Error).message || 'Network error');
        setLoading(false);
      }
    }
  }, [path, data]);

  useEffect(() => {
    cancelled.current = false;
    void load();
    const id = setInterval(load, refreshMs);
    return () => {
      cancelled.current = true;
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, refreshMs]);

  return { data, loading, error, refetch: load };
}
