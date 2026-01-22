/**
 * React Hook for API calls with loading, error, and data states
 * 
 * Usage:
 * const { data, loading, error } = useApi(fetchUsers);
 * const { data: user, loading: userLoading } = useApi(() => fetchUser(userId));
 */

import { useState, useEffect, useCallback } from 'react';

export function useApi(apiFunction, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction();
      setData(result.data);
    } catch (err) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  useEffect(() => {
    fetchData();
  }, [fetchData, ...dependencies]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

export default useApi;
