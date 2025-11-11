import { Task, Sprint, ProjectMetrics, AIInsight } from "@/types";
import { projectTasks, projectSprints } from "./dataLoader";

// Use the actual project data from Excel
export const mockTasks: Task[] = projectTasks;

export const mockSprints: Sprint[] = projectSprints;

// Calculate metrics from actual data
const completedTasks = mockTasks.filter((t) => t.status === "done").length;
const delayedTasks = mockTasks.filter((t) => t.status === "delayed").length;
const avgVelocity = mockSprints.reduce((sum, s) => sum + s.velocity, 0) / mockSprints.length;
const onTimeRate = ((completedTasks / mockTasks.length) * 100);
const aiScore = Math.max(1, Math.min(10, 10 - (delayedTasks * 1.5)));

export const mockMetrics: ProjectMetrics = {
  totalTasks: mockTasks.length,
  completedTasks,
  delayedTasks,
  averageVelocity: Math.round(avgVelocity),
  onTimeDelivery: Math.round(onTimeRate),
  aiDeliveryScore: Math.round(aiScore * 10) / 10,
};

// Generate AI insights based on actual data
const delayedTasksList = mockTasks.filter(t => t.status === 'delayed');
const generateInsights = (): AIInsight[] => {
  const insights: AIInsight[] = [];
  
  // Root cause analysis for delayed tasks
  delayedTasksList.forEach((task, idx) => {
    if (task.delayReason) {
      insights.push({
        id: `insight-delay-${idx}`,
        type: 'root_cause',
        title: `${task.title} Delay Analysis`,
        description: task.delayReason,
        impact: task.priority === 'critical' ? 'high' : 'medium',
        recommendation: task.actualHours > task.estimatedHours 
          ? `Re-estimate similar tasks with ${Math.round((task.actualHours - task.estimatedHours) / task.estimatedHours * 100)}% buffer to improve accuracy`
          : 'Review task breakdown and identify blockers early in sprint planning',
        timestamp: new Date().toISOString(),
      });
    }
  });
  
  // Prediction for in-progress tasks
  const inProgressTasks = mockTasks.filter(t => t.status === 'in_progress' && t.progress < 50);
  if (inProgressTasks.length > 0) {
    insights.push({
      id: 'insight-prediction',
      type: 'prediction',
      title: 'At-Risk Tasks Detected',
      description: `${inProgressTasks.length} in-progress tasks showing slow velocity`,
      impact: 'medium',
      recommendation: 'Daily check-ins recommended for low-velocity tasks to identify blockers early',
      timestamp: new Date().toISOString(),
    });
  }
  
  // Fast-track opportunities
  const completedEarly = mockTasks.filter(t => t.status === 'done' && t.actualHours < t.estimatedHours);
  if (completedEarly.length > 0) {
    insights.push({
      id: 'insight-fast-track',
      type: 'fast_track',
      title: 'Efficiency Gains Identified',
      description: `${completedEarly.length} tasks completed under estimate`,
      impact: 'low',
      recommendation: 'Document successful patterns from early completions to replicate efficiency',
      timestamp: new Date().toISOString(),
    });
  }
  
  // Resource allocation
  const owners = [...new Set(mockTasks.map(t => t.assignee))];
  const ownerLoad = owners.map(owner => ({
    owner,
    tasks: mockTasks.filter(t => t.assignee === owner && t.status !== 'done').length
  }));
  const maxLoad = Math.max(...ownerLoad.map(o => o.tasks));
  const minLoad = Math.min(...ownerLoad.map(o => o.tasks));
  
  if (maxLoad - minLoad >= 2) {
    insights.push({
      id: 'insight-resource',
      type: 'resource_shift',
      title: 'Workload Imbalance Detected',
      description: `Uneven task distribution across team members`,
      impact: 'medium',
      recommendation: `Consider redistributing tasks from high-load to low-load team members to optimize delivery`,
      timestamp: new Date().toISOString(),
    });
  }
  
  return insights;
};

export const mockInsights: AIInsight[] = generateInsights();

// Generate velocity data from actual sprints
export const velocityData = mockSprints.map(sprint => ({
  sprint: sprint.name,
  velocity: sprint.velocity,
  target: 75, // target velocity
}));

// Calculate status distribution from actual data
const statusCounts = {
  done: mockTasks.filter(t => t.status === 'done').length,
  inProgress: mockTasks.filter(t => t.status === 'in_progress').length,
  delayed: mockTasks.filter(t => t.status === 'delayed').length,
  notStarted: mockTasks.filter(t => t.status === 'not_started').length,
};

export const statusDistribution = [
  { name: "Done", value: statusCounts.done, color: "hsl(var(--success))" },
  { name: "In Progress", value: statusCounts.inProgress, color: "hsl(var(--primary))" },
  { name: "Delayed", value: statusCounts.delayed, color: "hsl(var(--destructive))" },
  { name: "Not Started", value: statusCounts.notStarted, color: "hsl(var(--muted))" },
];
