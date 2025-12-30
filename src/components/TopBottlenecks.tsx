import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BottleneckAnalysis } from "@/utils/analytics";
import { AlertTriangle, TrendingUp, Clock, ArrowRight, CheckCircle2, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface TopBottlenecksProps {
  bottlenecks: BottleneckAnalysis[];
  limit?: number;
}

export const TopBottlenecks = ({ bottlenecks, limit = 10 }: TopBottlenecksProps) => {
  const topBottlenecks = bottlenecks.slice(0, limit);

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case "critical": return "destructive";
      case "high": return "default";
      case "medium": return "secondary";
      default: return "outline";
    }
  };

  const getRiskIcon = (risk: string) => {
    if (risk === "critical" || risk === "high") return AlertTriangle;
    return TrendingUp;
  };

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case "immediate": return "bg-destructive/20 text-destructive border-destructive/40";
      case "high": return "bg-warning/20 text-warning border-warning/40";
      case "medium": return "bg-accent/20 text-accent-foreground border-accent/40";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "immediate": return "🚨 Immediate";
      case "high": return "⚡ High Priority";
      case "medium": return "📋 Medium";
      default: return "📌 Low";
    }
  };

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-primary rounded-lg">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Critical Bottlenecks</h3>
            <p className="text-sm text-muted-foreground">With actionable next steps</p>
          </div>
        </div>
        <Badge variant="outline" className="text-xs">
          Top {limit} Tasks
        </Badge>
      </div>

      <div className="space-y-4">
        {topBottlenecks.map((bottleneck, index) => {
          const RiskIcon = getRiskIcon(bottleneck.riskLevel);
          const showActions = bottleneck.riskLevel === "critical" || bottleneck.riskLevel === "high";
          
          return (
            <div
              key={bottleneck.taskId}
              className={cn(
                "p-4 rounded-lg border-2 transition-all duration-300 hover:shadow-lg",
                bottleneck.riskLevel === "critical" && "bg-destructive/5 border-destructive/30",
                bottleneck.riskLevel === "high" && "bg-warning/5 border-warning/30",
                bottleneck.riskLevel === "medium" && "bg-accent/5 border-accent/30",
                bottleneck.riskLevel === "low" && "bg-muted border-border"
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-background text-sm font-bold text-foreground">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Task #{bottleneck.taskId}</p>
                    <p className="text-xs text-muted-foreground">
                      Score: {Math.round(bottleneck.bottleneckScore)}/100
                    </p>
                  </div>
                </div>
                <Badge variant={getRiskBadgeVariant(bottleneck.riskLevel)} className="capitalize">
                  <RiskIcon className="w-3 h-3 mr-1" />
                  {bottleneck.riskLevel}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-3 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Queue</p>
                    <p className="font-semibold text-foreground">{bottleneck.queueWaitTime}m</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Process</p>
                    <p className="font-semibold text-foreground">{bottleneck.processTime}m</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="font-semibold text-foreground">{bottleneck.totalTime}m</p>
                  </div>
                </div>
              </div>

              {/* Insights */}
              <div className="space-y-1 mb-4">
                {bottleneck.insights.map((insight, idx) => (
                  <p key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>{insight}</span>
                  </p>
                ))}
              </div>

              {/* Actionable Recommendations - Always shown for critical/high, condensed for others */}
              {bottleneck.actionableSteps && bottleneck.actionableSteps.length > 0 && (
                <div className={cn(
                  "rounded-lg p-3 space-y-2",
                  showActions ? "bg-background/50 border border-primary/20" : "bg-background/30"
                )}>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className={cn(
                      "w-4 h-4",
                      showActions ? "text-primary" : "text-muted-foreground"
                    )} />
                    <p className={cn(
                      "text-sm font-semibold",
                      showActions ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {showActions ? "Recommended Actions" : "Status"}
                    </p>
                  </div>
                  
                  {bottleneck.actionableSteps.slice(0, showActions ? 4 : 1).map((step, idx) => (
                    <div 
                      key={idx} 
                      className={cn(
                        "flex items-start gap-3 p-2 rounded-md border",
                        getPriorityStyles(step.priority)
                      )}
                    >
                      <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-medium">{getPriorityLabel(step.priority)}</span>
                        </div>
                        <p className="text-sm font-medium mt-1">{step.action}</p>
                        <p className="text-xs opacity-80 mt-0.5">
                          Expected Impact: {step.expectedImpact}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};
