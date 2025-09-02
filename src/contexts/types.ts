import { RepeatType } from "./constants";

export interface HabitFormData {
  name: string;
  requiredValue: number;
  requiredType: 'minutes' | 'hours' | 'times' | 'liters';
  frequency: {
    type: RepeatType.Daily;
    selectedDays: string[];
  }
}

export interface HabitFormContextType {
  formData: HabitFormData;
  updateFormData: (updates: Partial<HabitFormData>) => void;
  resetFormData: () => void;
}

export type Tab = {
  label: string;
  options: { value: string, label: string, shortLabel: string }[];
  disabled?: boolean;
};
