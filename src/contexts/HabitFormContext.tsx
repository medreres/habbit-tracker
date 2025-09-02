import React, { createContext, useContext, useState, ReactNode } from "react";
import { defaultFormData } from "./constants";
import { HabitFormContextType, HabitFormData } from "./types";

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
