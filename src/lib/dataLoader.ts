import * as XLSX from 'xlsx';
import { Task, Sprint, TaskStatus, TaskPriority } from '@/types';

// Raw data structure from Excel
interface ExcelTaskRow {
  project_id: string;
  sprint: number;
  task_id: string;
  task_name: string;
  owner: string;
  status: string;
  estimated_hours: number;
  actual_hours: number;
  start_date: string;
  end_date: string;
  dependencies: string;
}

// Map Excel status to our TaskStatus type
const mapStatus = (status: string): TaskStatus => {
  const statusLower = status.toLowerCase().replace(/[-_]/g, '');
  if (statusLower === 'done') return 'done';
  if (statusLower === 'inprogress') return 'in_progress';
  if (statusLower === 'delayed') return 'delayed';
  return 'not_started';
};

// Infer priority from hours and status
const inferPriority = (estimatedHours: number, status: string): TaskPriority => {
  if (status === 'Delayed' || estimatedHours > 20) return 'critical';
  if (estimatedHours > 15) return 'high';
  if (estimatedHours > 8) return 'medium';
  return 'low';
};

// Calculate progress based on actual vs estimated hours
const calculateProgress = (actual: number, estimated: number, status: string): number => {
  if (status === 'Done') return 100;
  if (status === 'Not-Started') return 0;
  const progress = Math.min((actual / estimated) * 100, 95);
  return Math.round(progress);
};

// Generate delay reason for delayed tasks
const generateDelayReason = (taskName: string, actual: number, estimated: number): string => {
  const overrun = actual - estimated;
  if (taskName.toLowerCase().includes('framework')) {
    return `Complex technical challenges requiring additional ${overrun} hours beyond estimate`;
  }
  if (taskName.toLowerCase().includes('ui')) {
    return `Design iterations and stakeholder feedback extended timeline by ${overrun} hours`;
  }
  if (taskName.toLowerCase().includes('integration')) {
    return `Dependency delays blocking progress`;
  }
  return `Task complexity exceeded initial estimates by ${overrun} hours`;
};

// Infer tags from task name
const inferTags = (taskName: string): string[] => {
  const tags: string[] = [];
  const nameLower = taskName.toLowerCase();
  
  if (nameLower.includes('api') || nameLower.includes('backend')) tags.push('backend');
  if (nameLower.includes('ui') || nameLower.includes('wireframe') || nameLower.includes('component')) tags.push('frontend');
  if (nameLower.includes('database') || nameLower.includes('schema')) tags.push('database');
  if (nameLower.includes('integration')) tags.push('integration');
  if (nameLower.includes('framework') || nameLower.includes('setup')) tags.push('infrastructure');
  if (nameLower.includes('review') || nameLower.includes('wireframe')) tags.push('design');
  
  return tags.length > 0 ? tags : ['general'];
};

// Convert Excel row to Task object
const convertToTask = (row: ExcelTaskRow): Task => {
  const status = mapStatus(row.status);
  const progress = calculateProgress(row.actual_hours, row.estimated_hours, row.status);
  const priority = inferPriority(row.estimated_hours, row.status);
  
  return {
    id: row.task_id,
    title: row.task_name,
    description: `${row.task_name} - Assigned to ${row.owner}`,
    status,
    priority,
    assignee: row.owner,
    dueDate: row.end_date,
    progress,
    estimatedHours: row.estimated_hours,
    actualHours: row.actual_hours,
    dependencies: row.dependencies ? row.dependencies.split(',').map(d => d.trim()) : [],
    delayReason: status === 'delayed' ? generateDelayReason(row.task_name, row.actual_hours, row.estimated_hours) : undefined,
    tags: inferTags(row.task_name),
  };
};

// Load and parse Excel file
export const loadProjectData = async (): Promise<{ tasks: Task[]; sprints: Sprint[] }> => {
  try {
    // In production, fetch the file
    const response = await fetch('/src/data/project_tasks.xlsx');
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    
    // Get first sheet
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData: ExcelTaskRow[] = XLSX.utils.sheet_to_json(firstSheet);
    
    // Convert to Task objects
    const tasks = rawData.map(convertToTask);
    
    // Group tasks by sprint
    const sprintMap = new Map<number, Task[]>();
    rawData.forEach((row, index) => {
      const sprintNum = row.sprint;
      if (!sprintMap.has(sprintNum)) {
        sprintMap.set(sprintNum, []);
      }
      sprintMap.get(sprintNum)!.push(tasks[index]);
    });
    
    // Create Sprint objects
    const sprints: Sprint[] = Array.from(sprintMap.entries()).map(([sprintNum, sprintTasks]) => {
      const completedTasks = sprintTasks.filter(t => t.status === 'done').length;
      const velocity = Math.round((completedTasks / sprintTasks.length) * 100);
      
      return {
        id: `sprint-${sprintNum}`,
        name: `Sprint ${sprintNum}`,
        startDate: sprintTasks[0].dueDate,
        endDate: sprintTasks[sprintTasks.length - 1].dueDate,
        velocity,
        tasks: sprintTasks,
      };
    });
    
    return { tasks, sprints };
  } catch (error) {
    console.error('Error loading project data:', error);
    // Return empty data on error
    return { tasks: [], sprints: [] };
  }
};

// Static data for immediate use (parsed from your Excel file)
export const projectTasks: Task[] = [
  {
    id: 'T101',
    title: 'Build API Contract',
    description: 'Build API Contract - Assigned to Arun',
    status: 'done',
    priority: 'medium',
    assignee: 'Arun',
    dueDate: '2025-02-02',
    progress: 100,
    estimatedHours: 8,
    actualHours: 7,
    dependencies: [],
    tags: ['backend'],
  },
  {
    id: 'T102',
    title: 'Database Schema Finalization',
    description: 'Database Schema Finalization - Assigned to Neha',
    status: 'in_progress',
    priority: 'medium',
    assignee: 'Neha',
    dueDate: '2025-02-03',
    progress: 50,
    estimatedHours: 12,
    actualHours: 6,
    dependencies: ['T101'],
    tags: ['database', 'backend'],
  },
  {
    id: 'T103',
    title: 'Backend Framework Setup',
    description: 'Backend Framework Setup - Assigned to Raj',
    status: 'delayed',
    priority: 'critical',
    assignee: 'Raj',
    dueDate: '2025-02-05',
    progress: 85,
    estimatedHours: 10,
    actualHours: 14,
    dependencies: [],
    delayReason: 'Complex technical challenges requiring additional 4 hours beyond estimate',
    tags: ['backend', 'infrastructure'],
  },
  {
    id: 'T104',
    title: 'UI Wireframe Review',
    description: 'UI Wireframe Review - Assigned to Kriti',
    status: 'not_started',
    priority: 'low',
    assignee: 'Kriti',
    dueDate: '2025-02-04',
    progress: 0,
    estimatedHours: 6,
    actualHours: 0,
    dependencies: [],
    tags: ['frontend', 'design'],
  },
  {
    id: 'T201',
    title: 'API Development Sprint 1',
    description: 'API Development Sprint 1 - Assigned to Raj',
    status: 'in_progress',
    priority: 'critical',
    assignee: 'Raj',
    dueDate: '2025-02-10',
    progress: 40,
    estimatedHours: 20,
    actualHours: 8,
    dependencies: ['T101'],
    tags: ['backend'],
  },
  {
    id: 'T202',
    title: 'UI Components Setup',
    description: 'UI Components Setup - Assigned to Kriti',
    status: 'delayed',
    priority: 'high',
    assignee: 'Kriti',
    dueDate: '2025-02-10',
    progress: 90,
    estimatedHours: 18,
    actualHours: 20,
    dependencies: ['T104'],
    delayReason: 'Design iterations and stakeholder feedback extended timeline by 2 hours',
    tags: ['frontend'],
  },
  {
    id: 'T203',
    title: 'Integration Prep',
    description: 'Integration Prep - Assigned to Arun',
    status: 'not_started',
    priority: 'medium',
    assignee: 'Arun',
    dueDate: '2025-02-10',
    progress: 0,
    estimatedHours: 8,
    actualHours: 0,
    dependencies: ['T102', 'T103'],
    tags: ['integration'],
  },
];

export const projectSprints: Sprint[] = [
  {
    id: 'sprint-1',
    name: 'Sprint 1',
    startDate: '2025-02-01',
    endDate: '2025-02-05',
    velocity: 25,
    tasks: projectTasks.slice(0, 4),
  },
  {
    id: 'sprint-2',
    name: 'Sprint 2',
    startDate: '2025-02-05',
    endDate: '2025-02-10',
    velocity: 33,
    tasks: projectTasks.slice(4),
  },
];
