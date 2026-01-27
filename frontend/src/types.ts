
export enum Role {
  ADMIN = 'admin',
  STAFF = 'staff',
  USER = 'user',
}

export enum TaskCategory {
  HSL = 'hsl',
  CARE = 'care',
  SERVICE = 'service',
  SOCIAL = 'social',
  ADMIN = 'admin',
}

export enum TaskStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  MISSED = 'missed',
  SIGNED = 'signed',
}

export type ShiftRole =
  | 'morning_red'
  | 'morning_blue'
  | 'evening_red'
  | 'evening_blue'
  | 'night_red'
  | 'night_blue'
  | 'admin_day'
  | 'dev_alpha'
  | 'dev_beta'
  | 'dev_gamma'
  | 'dev_delta'
  | 'off';

export interface Person {
  id: string;
  name: string;
  role: string;
  avatar: string;
  teamColor?: 'red' | 'blue' | 'purple' | 'white';
  unitId?: string;
}

export interface Report {
  id: string;
  date: string; // YYYY-MM-DD
  unitId: string;
  type: 'night_to_day' | 'day_to_evening';
  authorName: string;
  toName: string;
  content: string;
  timestamp: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  substituteInstructions?: string;
  timeStart: string;
  timeEnd: string;
  category: TaskCategory;
  status: TaskStatus;
  assigneeId?: string;
  recipientId?: string;
  requiresSign?: boolean;
  notes?: string;
  isTeamTask?: boolean;
  unitId?: string;
  date?: string;
  shiftRole?: ShiftRole;
  isReportTask?: boolean; // Flaggar om detta är en rapportuppgift
  reportType?: 'night_to_day' | 'day_to_evening';
  validOnDate?: string;
  reportData?: {
    recipient?: string;
    content?: string;
    authorName?: string;
    timestamp?: string;
  };
}

export interface Unit {
  id: string;
  name: string;
  type: string;
}
