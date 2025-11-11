import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockInsights } from "@/lib/mockData";
import { AlertTriangle, Zap, Users, Target, TrendingUp, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

const AIInsightsPanel = () => {
  const getInsightIcon = (type: string) => {
    switch (type) {
      case "root_cause":
        return AlertTriangle;
      case "fast_track":
        return Zap;
      case "resource_shift":
        return Users;
      case "reprioritize":
        return Target;
      case "prediction":
        return TrendingUp;
      default:
        return Lightbulb;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case "root_cause":
        return "text-destructive bg-destructive/10 border-destructive/20";
      case "fast_track":
        return "text-success bg-success/10 border-success/20";
      case "resource_shift":
        return "text-primary bg-primary/10 border-primary/20";
      case "reprioritize":
        return "text-warning bg-warning/10 border-warning/20";
      case "prediction":
        return "text-chart-5 bg-chart-5/10 border-chart-5/20";
      default:
        return "text-muted-foreground bg-muted border-border";
    }
  };

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case "high":
        return <Badge variant="destructive">High Impact</Badge>;
      case "medium":
        return <Badge className="bg-warning text-warning-foreground">Medium Impact</Badge>;
      case "low":
        return <Badge variant="secondary">Low Impact</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">AI Insights</h2>
        <p className="text-muted-foreground mt-1">Intelligent recommendations powered by agentic reasoning</p>
      </div>

      {/* Summary Card */}
      <Card className="border-primary/50 bg-primary/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            <CardTitle className="text-primary">AI Analysis Summary</CardTitle>
          </div>
          <CardDescription>Real-time insights from monitoring agents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-card rounded-lg border border-border">
              <div className="text-3xl font-bold text-destructive">1</div>
              <p className="text-sm text-muted-foreground mt-1">Critical Issues</p>
            </div>
            <div className="text-center p-4 bg-card rounded-lg border border-border">
              <div className="text-3xl font-bold text-warning">2</div>
              <p className="text-sm text-muted-foreground mt-1">Optimization Opportunities</p>
            </div>
            <div className="text-center p-4 bg-card rounded-lg border border-border">
              <div className="text-3xl font-bold text-success">3</div>
              <p className="text-sm text-muted-foreground mt-1">Actionable Recommendations</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights List */}
      <div className="space-y-4">
        {mockInsights.map((insight) => {
          const Icon = getInsightIcon(insight.type);
          return (
            <Card key={insight.id} className={cn("border", getInsightColor(insight.type))}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-base">{insight.title}</CardTitle>
                      <CardDescription className="mt-1">{insight.description}</CardDescription>
                    </div>
                  </div>
                  {getImpactBadge(insight.impact)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-card p-4 rounded-lg border border-border">
                  <p className="text-sm font-medium text-foreground mb-2">💡 AI Recommendation</p>
                  <p className="text-sm text-muted-foreground">{insight.recommendation}</p>
                </div>
                <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
                  <span className="capitalize">{insight.type.replace("_", " ")}</span>
                  <span>{new Date(insight.timestamp).toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Prediction Card */}
      <Card className="border-chart-5/50 bg-chart-5/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-chart-5" />
            <CardTitle>3-Day Predictive Outlook</CardTitle>
          </div>
          <CardDescription>AI-powered delay predictions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-border">
              <div>
                <p className="font-medium text-foreground">Database Optimization</p>
                <p className="text-xs text-muted-foreground mt-1">Predicted 3-day slip at current pace</p>
              </div>
              <Badge className="bg-warning text-warning-foreground">Medium Risk</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-border">
              <div>
                <p className="font-medium text-foreground">Analytics Module</p>
                <p className="text-xs text-muted-foreground mt-1">On track for planned start date</p>
              </div>
              <Badge className="bg-success text-success-foreground">Low Risk</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIInsightsPanel;
