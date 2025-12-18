import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Brain, 
  DollarSign, 
  Target,
  Clock,
  Lightbulb,
  PlayCircle,
  FileText
} from "lucide-react";
import { Prediction, Recommendation } from "@/utils/predictions";
import { RecommendationFeedback } from "@/components/RecommendationFeedback";
import { QuickActions } from "@/components/QuickActions";
import { toast } from "sonner";

interface PredictiveInsightsProps {
  predictions: Prediction[];
  recommendations: Recommendation[];
}

const TrendIcon = ({ trend }: { trend: "up" | "down" | "stable" }) => {
  if (trend === "up") return <TrendingUp className="w-4 h-4 text-destructive" />;
  if (trend === "down") return <TrendingDown className="w-4 h-4 text-success" />;
  return <Minus className="w-4 h-4 text-muted-foreground" />;
};

const getEffortColor = (effort: "low" | "medium" | "high") => {
  switch (effort) {
    case "low": return "bg-success/20 text-success border-success/30";
    case "medium": return "bg-warning/20 text-warning border-warning/30";
    case "high": return "bg-destructive/20 text-destructive border-destructive/30";
  }
};

const getPriorityColor = (priority: "critical" | "high" | "medium" | "low") => {
  switch (priority) {
    case "critical": return "destructive";
    case "high": return "default";
    case "medium": return "secondary";
    case "low": return "outline";
  }
};

export const PredictiveInsights = ({ predictions, recommendations }: PredictiveInsightsProps) => {
  const handleApplyRecommendation = (title: string) => {
    toast.info(`Applying: ${title}...`, { duration: 2000 });
    setTimeout(() => {
      toast.success("Action queued for implementation");
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions Bar */}
      <Card className="bg-card border-border border-primary/20">
        <CardContent className="py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h4 className="font-medium text-foreground">Quick Actions</h4>
              <p className="text-xs text-muted-foreground">Common optimization tasks</p>
            </div>
            <QuickActions />
          </div>
        </CardContent>
      </Card>

      {/* Predictions Section */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">AI Forecasts</CardTitle>
              <p className="text-sm text-muted-foreground">Predicted metrics for the next 7 days</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {predictions.map((prediction, index) => (
              <div 
                key={index}
                className="p-4 bg-muted/50 rounded-lg border border-border hover:border-primary/30 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">{prediction.metric}</span>
                  <TrendIcon trend={prediction.trend} />
                </div>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-2xl font-bold text-foreground">
                    {prediction.predictedValue}
                    {prediction.metric.includes("Score") ? "%" : "m"}
                  </span>
                  <span className={`text-sm ${prediction.change > 0 ? "text-destructive" : prediction.change < 0 ? "text-success" : "text-muted-foreground"}`}>
                    {prediction.change > 0 ? "+" : ""}{prediction.change}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Current: {prediction.currentValue}{prediction.metric.includes("Score") ? "%" : "m"}</span>
                  <div className="flex items-center gap-1">
                    <span>Confidence:</span>
                    <span className="font-medium text-foreground">{prediction.confidence}%</span>
                  </div>
                </div>
                <Progress value={prediction.confidence} className="mt-2 h-1" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations Section */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Prescriptive Recommendations</CardTitle>
              <p className="text-sm text-muted-foreground">AI-generated action items with quantified impact</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div 
                key={rec.id}
                className="p-4 bg-muted/50 rounded-lg border border-border hover:border-primary/30 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-foreground">{rec.title}</h4>
                      <Badge variant={getPriorityColor(rec.priority)}>
                        {rec.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{rec.description}</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleApplyRecommendation(rec.title)}
                    className="gap-1 shrink-0"
                  >
                    <PlayCircle className="w-3 h-3" />
                    Apply
                  </Button>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-success" />
                    <div>
                      <p className="text-xs text-muted-foreground">SLA Impact</p>
                      <p className="font-semibold text-success">+{rec.impact.sla}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Est. Savings</p>
                      <p className="font-semibold text-foreground">${rec.impact.cost.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Effort</p>
                      <Badge variant="outline" className={getEffortColor(rec.impact.effort)}>
                        {rec.impact.effort}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Feedback Section */}
                <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-end">
                  <RecommendationFeedback recommendationId={rec.id} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
