import { HabitFormData, Tab } from "./types";
export enum RepeatType {
  Daily = 'daily',
  Weekly = 'weekly',
  Monthly = 'monthly',
}

export const defaultFormData: HabitFormData = {
  name: "",
  requiredValue: 1,
  requiredType: 'times',
  frequency: {
    type: RepeatType.Daily,
    selectedDays: [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ],
  },
};

export const FREQUENCY: Record<RepeatType, Tab> = {
  [RepeatType.Daily]: {
    label: "Щодня",
    options: [
      { value: "monday",  label: "Понеділок", shortLabel: "Пн" },
      { value: "tuesday", label: "Вівторок", shortLabel: "Вт" },
      { value: "wednesday", label: "Середа", shortLabel: "Ср" },
      { value: "thursday", label: "Четвер", shortLabel: "Чт" },
      { value: "friday", label: "П'ятниця", shortLabel: "Пт" },
      { value: "saturday", label: "Субота", shortLabel: "Сб" },
      { value: "sunday", label: "Неділя", shortLabel: "Нд" },
    ],
  },
  [RepeatType.Weekly]: { label: "Щотижня", options: [], disabled: true },
  [RepeatType.Monthly]: { label: "Щомісяця", options: [], disabled: true },
};