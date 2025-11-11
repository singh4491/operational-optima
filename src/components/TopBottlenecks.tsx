import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BottleneckAnalysis } from "@/utils/analytics";
import { AlertTriangle, TrendingUp, Clock } from "lucide-react";
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

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Critical Bottlenecks</h3>
        <Badge variant="outline" className="text-xs">
          Top {limit} Tasks
        </Badge>
      </div>

      <div className="space-y-3">
        {topBottlenecks.map((bottleneck, index) => {
          const RiskIcon = getRiskIcon(bottleneck.riskLevel);
          
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

              <div className="space-y-1">
                {bottleneck.insights.map((insight, idx) => (
                  <p key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>{insight}</span>
                  </p>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
