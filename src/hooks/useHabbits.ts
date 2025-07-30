import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { generateId } from "@/utils/idGenerator";

export interface Habit {
  id: string;
  name: string;
  progress: string;
  icon: string;
  color: string;
  buttonText: string;
  buttonIcon: string;
  requiredValue: number;
  requiredType: string;
}

const HABITS_STORAGE_KEY = "habits";

// API functions for AsyncStorage
const habitsApi = {
  async getHabits(): Promise<Habit[]> {
    try {
      const stored = await AsyncStorage.getItem(HABITS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      return [];
    } catch (error) {
      console.error("Error loading habits:", error);
      return [];
    }
  },

  async saveHabits(habits: Habit[]): Promise<void> {
    try {
      await AsyncStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habits));
    } catch (error) {
      console.error("Error saving habits:", error);
      throw error;
    }
  },
};

export const useHabbits = () => {
  const queryClient = useQueryClient();

  // Query for fetching habits
  const { data: habits = [], isLoading, error } = useQuery({
    queryKey: ["habits"],
    queryFn: habitsApi.getHabits,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Mutation for adding a habit
  const addHabitMutation = useMutation({
    mutationFn: async (habit: Omit<Habit, "id">) => {
      const newHabit: Habit = {
        ...habit,
        id: generateId(),
      };
      const updatedHabits = [...habits, newHabit];
      await habitsApi.saveHabits(updatedHabits);
      return newHabit;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });

  // Mutation for updating a habit
  const updateHabitMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Habit> }) => {
      const updatedHabits = habits.map((habit) =>
        habit.id === id ? { ...habit, ...updates } : habit
      );
      await habitsApi.saveHabits(updatedHabits);
      return { id, updates };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });

  // Mutation for deleting a habit
  const deleteHabitMutation = useMutation({
    mutationFn: async (id: string) => {
      const updatedHabits = habits.filter((habit) => habit.id !== id);
      await habitsApi.saveHabits(updatedHabits);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });

  // Helper functions
  const addHabit = (habit: Omit<Habit, "id">) => {
    return addHabitMutation.mutateAsync(habit);
  };

  const updateHabit = (id: string, updates: Partial<Habit>) => {
    updateHabitMutation.mutate({ id, updates });
  };

  const deleteHabit = (id: string) => {
    deleteHabitMutation.mutate(id);
  };

  const getHabitById = (id: string) => {
    return habits.find((habit) => habit.id === id);
  };

  return {
    habits,
    isLoading,
    error,
    addHabit,
    updateHabit,
    deleteHabit,
    getHabitById,
    // Mutation states for UI feedback
    isAddingHabit: addHabitMutation.isPending,
    isUpdatingHabit: updateHabitMutation.isPending,
    isDeletingHabit: deleteHabitMutation.isPending,
  };
};
