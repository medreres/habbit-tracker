import { formatWeekday } from "@/utils/formatWeekday";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface HabitFormData {
  name: string;
  requiredValue: number;
  requiredType: "minutes" | "hours" | "times" | "liters";
  frequency: {
    unit: "day";
    value: string[];
  };
}

interface HabitFormContextType {
  formData: HabitFormData;
  updateFormData: (updates: Partial<HabitFormData>) => void;
  resetFormData: () => void;
};

export const WEEK_DAYS = Array.from({ length: 7 }, (_, i) => {
  const date = new Date(2024, 0, i + 7); // Using Jan 7-13 2024 to get all days
  return {
    key: date.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase(),
    value: date,
    label: date.toLocaleDateString("uk-UA", { weekday: "long" }),
  };
});

const defaultFormData: HabitFormData = {
  name: "",
  frequency: {
    unit: "day",
    value: WEEK_DAYS.map((day) => formatWeekday(day.value))
  },
  requiredValue: 1,
  requiredType: "times",
};

const HabitFormContext = createContext<HabitFormContextType | undefined>(undefined);

export function HabitFormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<HabitFormData>(defaultFormData);

  const updateFormData = (updates: Partial<HabitFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const resetFormData = () => {
    setFormData(defaultFormData);
  };

  return (
    <HabitFormContext.Provider value={{ formData, updateFormData, resetFormData }}>
      {children}
    </HabitFormContext.Provider>
  );
}

export function useHabitForm() {
  const context = useContext(HabitFormContext);
  if (!context) {
    throw new Error("useHabitForm must be used within a HabitFormProvider");
  }
  return context;
}
