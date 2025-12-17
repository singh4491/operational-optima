import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  FlaskConical, 
  Brain, 
  Bell, 
  Search, 
  Plug, 
  Layout 
} from "lucide-react";

const roadmapItems = [
  {
    title: "Dynamic Bottleneck Detection",
    description: "Real-time tracking that adjusts based on volume spikes or seasonal trends.",
    icon: Activity,
    priority: "high",
  },
  {
    title: "Workflow Simulation",
    description: "Guided simulation flow for non-technical users to test scenarios safely.",
    icon: FlaskConical,
    priority: "high",
  },
  {
    title: "Predictive & Prescriptive AI",
    description: "Forecast upcoming bottlenecks and recommend process changes with quantified impact (SLA, cost, effort).",
    icon: Brain,
    priority: "high",
  },
  {
    title: "Automated Alerts & Anomaly Detection",
    description: "Threshold-based alerts for idle time, rework loops, skipped validations.",
    icon: Bell,
    priority: "medium",
  },
  {
    title: "Drill-Down Analytics & Explainability",
    description: "Root cause analysis with visual conformance against ideal workflows.",
    icon: Search,
    priority: "medium",
  },
  {
    title: "Integration & Templates",
    description: "Pre-built connectors for CRM/ERP/WFM systems and industry-specific workflow templates.",
    icon: Plug,
    priority: "medium",
  },
  {
    title: "UI/UX Enhancements",
    description: "Export dashboards and simulation outputs; add collaboration features like annotations and shareable snapshots.",
    icon: Layout,
    priority: "low",
  },
];

const getPriorityVariant = (priority: string) => {
  switch (priority) {
    case "high":
      return "destructive";
    case "medium":
      return "default";
    default:
      return "secondary";
  }
};

export const ClientRoadmap = () => {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Client Feedback & Roadmap
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {roadmapItems.map((item, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border border-border/50 bg-background/50 hover:bg-background/80 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-md bg-primary/10">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm truncate">{item.title}</h4>
                    <Badge variant={getPriorityVariant(item.priority)} className="text-xs capitalize">
                      {item.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
