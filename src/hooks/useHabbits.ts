import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { generateId } from "@/utils/idGenerator";
import { useMemo } from "react";

export interface HabitRecord {
  id: string;
  createdAt?: Date;

  name: string;
  requiredValue: number;
  requiredType: string;
};

export type Habit = Pick<HabitRecord, "id" | "name" | "requiredType" | "requiredValue"> & {
  createdAt: Date;
}

const HABITS_STORAGE_KEY = "habits";

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

type UseHabbits = () => {
  habits: Habit[];
  deleteHabit: (id: string) => void;
  addHabit: (habit: Pick<Habit, "name" | "requiredType" | "requiredValue">) => Promise<Habit>;
  updateHabit: (id: string, updates: Partial<Pick<Habit, "name" | "requiredType" | "requiredValue">>) => Promise<void>;
};

// TODO split adding and creating habbit
export const useHabbits: UseHabbits = () => {
  const queryClient = useQueryClient();

  const { data: rawHabits = [] } = useQuery<Habit[]>({
    queryKey: ["habits"],
    queryFn: habitsApi.getHabits,
    staleTime: 1000 * 60 * 5,
  });

  const habits = useMemo(() => {
    return rawHabits.map((habit) => ({
      ...habit,
      createdAt: habit.createdAt ? new Date(habit.createdAt) : new Date(0),
    }));
  }, [rawHabits]);

  // Mutation for adding a habit
  const addHabitMutation = useMutation({
    mutationFn: async (habit: Pick<Habit, "name" | "requiredType" | "requiredValue">) => {
      const newHabit: Habit = {
        ...habit,
        id: generateId(),
        createdAt: new Date(),
      };
      console.log('newHabit', newHabit)
      const updatedHabits = [...habits, newHabit];
      await habitsApi.saveHabits(updatedHabits);
      return newHabit;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });

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

  const deleteHabit = (id: string) => {
    deleteHabitMutation.mutate(id);
  };

  // Update habit mutation
  const updateHabitMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Pick<Habit, "name" | "requiredType" | "requiredValue">> }) => {
      const updatedHabits = habits.map(habit => 
        habit.id === id ? { ...habit, ...updates } : habit
      );
      await habitsApi.saveHabits(updatedHabits);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });

  const updateHabit = (id: string, updates: Partial<Pick<Habit, "name" | "requiredType" | "requiredValue">>) => {
    return updateHabitMutation.mutateAsync({ id, updates });
  };

   // Helper functions
   const addHabit = (habit: Pick<Habit, "name" | "requiredType" | "requiredValue">) => {
    return addHabitMutation.mutateAsync(habit);
  };

  return {
    habits,
    deleteHabit,
    addHabit,
    updateHabit,
  };
};
