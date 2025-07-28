import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistQueryClient, PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { QueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { SplashScreen } from "expo-router";

// Create the async storage persister
const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: "REACT_QUERY_CACHE", // The key used to store the cache in AsyncStorage
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Time in milliseconds that data remains fresh
      staleTime: 1000 * 60 * 5, // 5 minutes
      // Time in milliseconds that data remains in cache
      gcTime: 1000 * 60 * 60 * 24, // 24 hours (formerly cacheTime)
      // Retry failed requests
      retry: 3,
      // Retry delay
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      // Retry failed mutations
      retry: 1,
    },
  },
});

export function QueryProvider({ children, onRestored }: { children: React.ReactNode; onRestored: () => void }) {
  useEffect(() => {
    // Wait for persistence to be restored

    const restore = async () => {
      const unsubscribe = await asyncStoragePersister.restoreClient();
      onRestored();
    };

    restore();
  }, []);

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: asyncStoragePersister }}>
      {children}
    </PersistQueryClientProvider>
  );
}
