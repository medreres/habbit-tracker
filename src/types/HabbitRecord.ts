export interface HabbitRecord {
  id: string;
  habbitId: string;
  requiredValue: number;
  requiredType: string
  actualValue: number;
  completedAt: Date;
}

export type RequiredType = 'minutes' | 'hours' | 'times' | 'liters'; 