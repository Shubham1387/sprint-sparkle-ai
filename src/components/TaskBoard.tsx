import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockTasks } from "@/lib/mockData";
import { Task, TaskStatus } from "@/types";
import { Clock, User, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const TaskBoard = () => {
  const columns: { status: TaskStatus; label: string; color: string }[] = [
    { status: "not_started", label: "Not Started", color: "bg-muted" },
    { status: "in_progress", label: "In Progress", color: "bg-primary/10" },
    { status: "delayed", label: "Delayed", color: "bg-destructive/10" },
    { status: "done", label: "Done", color: "bg-success/10" },
  ];

  const getTasksByStatus = (status: TaskStatus) => {
    return mockTasks.filter((task) => task.status === status);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-destructive text-destructive-foreground";
      case "high":
        return "bg-warning text-warning-foreground";
      case "medium":
        return "bg-primary text-primary-foreground";
      case "low":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Task Board</h2>
        <p className="text-muted-foreground mt-1">Kanban view with AI-powered delay analysis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column) => {
          const tasks = getTasksByStatus(column.status);
          return (
            <div key={column.status} className="space-y-4">
              <div className={cn("rounded-lg p-4", column.color)}>
                <h3 className="font-semibold text-foreground flex items-center justify-between">
                  {column.label}
                  <Badge variant="secondary">{tasks.length}</Badge>
                </h3>
              </div>

              <div className="space-y-3">
                {tasks.map((task) => (
                  <Card key={task.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-sm font-semibold line-clamp-2">{task.title}</CardTitle>
                        <Badge className={cn("text-xs", getPriorityColor(task.priority))}>
                          {task.priority}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>

                      {task.delayReason && (
                        <div className="flex items-start gap-2 p-2 bg-destructive/10 rounded border border-destructive/20">
                          <AlertCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-destructive">{task.delayReason}</p>
                        </div>
                      )}

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Progress</span>
                          <span className="font-medium">{task.progress}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className={cn(
                              "h-2 rounded-full transition-all",
                              task.status === "delayed"
                                ? "bg-destructive"
                                : task.status === "done"
                                ? "bg-success"
                                : "bg-primary"
                            )}
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span className="truncate">{task.assignee.split(" ")[0]}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-2">
                          {task.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TaskBoard;
