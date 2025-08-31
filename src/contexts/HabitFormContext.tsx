import React, { createContext, useContext, useState, ReactNode } from "react";

interface HabitFormData {
  name: string;
  requiredValue: number;
  requiredType: 'minutes' | 'hours' | 'times' | 'liters';
}

interface HabitFormContextType {
  formData: HabitFormData;
  updateFormData: (updates: Partial<HabitFormData>) => void;
  resetFormData: () => void;
}

const defaultFormData: HabitFormData = {
  name: "",
  requiredValue: 1,
  requiredType: 'times',
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
