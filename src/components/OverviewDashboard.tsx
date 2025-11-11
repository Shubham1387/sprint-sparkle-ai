import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockMetrics, velocityData, statusDistribution } from "@/lib/mockData";
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

      {/* Bottleneck Card */}
      <Card className="border-destructive/50 bg-destructive/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <CardTitle className="text-destructive">Critical Bottleneck Detected</CardTitle>
          </div>
          <CardDescription>High-priority task at risk</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-foreground mb-2">Payment Gateway Integration</h4>
              <p className="text-sm text-muted-foreground mb-3">
                <strong>Delay Reason:</strong> Waiting for API credentials from client
              </p>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  Due: Jan 13, 2025
                </span>
                <Badge variant="destructive">Critical Priority</Badge>
                <Badge variant="outline">40% Complete</Badge>
              </div>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border">
              <p className="text-sm font-medium text-foreground mb-1">AI Recommendation</p>
              <p className="text-sm text-muted-foreground">
                Set up staging environment with test credentials to unblock development. Estimated time savings: 3-5 days.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Summary Card */}
      <Card className="border-primary/50 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-primary">AI Executive Summary</CardTitle>
          <CardDescription>Generated insights for stakeholders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-foreground">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
              <p><strong>Progress:</strong> Sprint 3 is 68% complete with 2 of 3 tasks on track</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-destructive mt-2" />
              <p><strong>Blockers:</strong> Payment gateway integration blocked by external dependency (client credentials)</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-warning mt-2" />
              <p><strong>Risks:</strong> Database optimization task showing early signs of delay due to research complexity</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-success mt-2" />
              <p><strong>Wins:</strong> UI mockups completed 1 day ahead of schedule with high quality</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
              <p><strong>Next Actions:</strong> Unblock payment integration, allocate senior dev to database optimization</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewDashboard;
