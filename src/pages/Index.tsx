import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import OverviewDashboard from "@/components/OverviewDashboard";
import TaskBoard from "@/components/TaskBoard";
import AIInsightsPanel from "@/components/AIInsightsPanel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewDashboard />;
      case "tasks":
        return <TaskBoard />;
      case "insights":
        return <AIInsightsPanel />;
      case "notifications":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Notifications</h2>
              <p className="text-muted-foreground mt-1">Real-time alerts and daily digests</p>
            </div>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  <CardTitle>Daily Standup Summary</CardTitle>
                </div>
                <CardDescription>Auto-generated at 9:00 AM</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-success mt-2" />
                    <p><strong>Progress:</strong> 2 tasks completed yesterday (UI mockups, API docs draft)</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-destructive mt-2" />
                    <p><strong>Blockers:</strong> Payment gateway waiting on client credentials</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-warning mt-2" />
                    <p><strong>At Risk:</strong> Database optimization showing signs of delay</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                    <p><strong>Priorities Today:</strong> Complete CI/CD setup, advance API documentation</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Recent Alerts</CardTitle>
                <CardDescription>Last 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-destructive/5 rounded-lg border border-destructive/20">
                    <Badge variant="destructive" className="mt-0.5">Critical</Badge>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">Payment Gateway Delay</p>
                      <p className="text-xs text-muted-foreground mt-1">Task blocked by external dependency - 2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-warning/5 rounded-lg border border-warning/20">
                    <Badge className="bg-warning text-warning-foreground mt-0.5">Warning</Badge>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">Velocity Drop Detected</p>
                      <p className="text-xs text-muted-foreground mt-1">Sprint velocity 15% below target - 6 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-success/5 rounded-lg border border-success/20">
                    <Badge className="bg-success text-success-foreground mt-0.5">Success</Badge>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">Task Completed Early</p>
                      <p className="text-xs text-muted-foreground mt-1">UI mockups finished 1 day ahead - 1 day ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return <OverviewDashboard />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </DashboardLayout>
  );
};

export default Index;
