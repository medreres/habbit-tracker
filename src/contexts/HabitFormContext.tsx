import React, { createContext, useContext, useState, ReactNode } from "react";

interface HabitFormData {
  name: string;
  goal: string;
  timeOfDay: string;
  reminder: string;
  checklist: string;
  startDate: string;
  selectedDays: Map<string, boolean>;
}

interface HabitFormContextType {
  formData: HabitFormData;
  updateFormData: (updates: Partial<HabitFormData>) => void;
  resetFormData: () => void;
}

const defaultFormData: HabitFormData = {
  name: "",
  goal: "1 раз на день",
  timeOfDay: "Будь-який час",
  reminder: "09:00",
  checklist: "Нічого",
  startDate: "Сьогодні",
  selectedDays: new Map(Array.from({ length: 7 }, (_, i) => {
    const date = new Date(2024, 0, i + 7); // Using Jan 7-13 2024 to get all days
    return [date.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase(), true];
  })),
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
