import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockMetrics, velocityData, statusDistribution, mockTasks, mockSprints } from "@/lib/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from "recharts";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Clock } from "lucide-react";

const OverviewDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Project Overview</h2>
        <p className="text-muted-foreground mt-1">Real-time delivery intelligence and sprint analytics</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-bold text-foreground">{mockMetrics.totalTasks}</div>
              <Badge variant="secondary" className="ml-2">Active</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-bold text-success">{mockMetrics.completedTasks}</div>
              <CheckCircle2 className="w-5 h-5 text-success ml-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Delayed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-bold text-destructive">{mockMetrics.delayedTasks}</div>
              <AlertTriangle className="w-5 h-5 text-destructive ml-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">AI Delivery Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-bold text-primary">{mockMetrics.aiDeliveryScore}/10</div>
              <Badge variant="outline" className="ml-2">Good</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Velocity Trend</CardTitle>
            <CardDescription>Sprint velocity vs target over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={velocityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="sprint" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="velocity" stroke="hsl(var(--primary))" strokeWidth={2} name="Actual Velocity" />
                <Line type="monotone" dataKey="target" stroke="hsl(var(--success))" strokeWidth={2} strokeDasharray="5 5" name="Target" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Task Status Distribution</CardTitle>
            <CardDescription>Current breakdown of all tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="hsl(var(--primary))"
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottleneck Card - Dynamic based on actual delayed tasks */}
      {mockTasks.filter(t => t.status === 'delayed').length > 0 && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <CardTitle className="text-destructive">Critical Bottlenecks Detected</CardTitle>
            </div>
            <CardDescription>{mockTasks.filter(t => t.status === 'delayed').length} delayed tasks requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTasks.filter(t => t.status === 'delayed').map((task) => (
                <div key={task.id}>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">{task.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      <strong>Delay Reason:</strong> {task.delayReason || 'Under investigation'}
                    </p>
                    <div className="flex items-center gap-4 text-sm flex-wrap">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                      <Badge variant="destructive" className="capitalize">{task.priority} Priority</Badge>
                      <Badge variant="outline">{task.progress}% Complete</Badge>
                      <span className="text-muted-foreground">Assigned: {task.assignee}</span>
                    </div>
                  </div>
                  <div className="bg-card p-4 rounded-lg border border-border mt-3">
                    <p className="text-sm font-medium text-foreground mb-1">AI Recommendation</p>
                    <p className="text-sm text-muted-foreground">
                      {task.actualHours > task.estimatedHours 
                        ? `Task requires ${task.actualHours - task.estimatedHours} extra hours. Consider pair programming or breaking into smaller subtasks.`
                        : 'Review dependencies and remove blockers to restore momentum.'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Summary Card - Dynamic */}
      <Card className="border-primary/50 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-primary">AI Executive Summary</CardTitle>
          <CardDescription>Generated insights from {mockTasks.length} tasks across {mockSprints.length} sprints</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-foreground">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
              <p><strong>Progress:</strong> {mockMetrics.completedTasks} of {mockMetrics.totalTasks} tasks complete ({Math.round((mockMetrics.completedTasks / mockMetrics.totalTasks) * 100)}% completion rate)</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-destructive mt-2" />
              <p><strong>Blockers:</strong> {mockMetrics.delayedTasks} delayed tasks requiring immediate attention ({mockTasks.filter(t => t.status === 'delayed').map(t => t.title).join(', ')})</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-warning mt-2" />
              <p><strong>Risks:</strong> {mockTasks.filter(t => t.status === 'in_progress' && t.progress < 50).length} in-progress tasks showing slow velocity</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-success mt-2" />
              <p><strong>Wins:</strong> {mockTasks.filter(t => t.status === 'done' && t.actualHours < t.estimatedHours).length} tasks completed under estimate</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
              <p><strong>Team Health:</strong> {[...new Set(mockTasks.map(t => t.assignee))].length} active contributors, average velocity at {mockMetrics.averageVelocity}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewDashboard;
