export type TaskStatus = "not_started" | "in_progress" | "delayed" | "done";

export type TaskPriority = "low" | "medium" | "high" | "critical";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  dueDate: string;
  progress: number;
  dependencies?: string[];
  delayReason?: string;
  estimatedHours: number;
  actualHours: number;
  tags: string[];
}

export interface Sprint {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  velocity: number;
  tasks: Task[];
}

export interface ProjectMetrics {
  totalTasks: number;
  completedTasks: number;
  delayedTasks: number;
  averageVelocity: number;
  onTimeDelivery: number;
  aiDeliveryScore: number;
}

export interface AIInsight {
  id: string;
  type: "root_cause" | "fast_track" | "resource_shift" | "reprioritize" | "prediction";
  title: string;
  description: string;
  impact: "low" | "medium" | "high";
  recommendation: string;
  timestamp: string;
}
