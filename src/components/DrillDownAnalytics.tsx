import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, GitBranch, AlertTriangle, CheckCircle, XCircle, Info, ArrowRight, Layers, Target, Lightbulb } from "lucide-react";
import { BottleneckAnalysis } from "@/utils/analytics";

interface RootCause {
  id: string;
  factor: string;
  contribution: number;
  category: "process" | "resource" | "system" | "external";
  description: string;
  evidence: string[];
  remediation: string;
}

interface WorkflowStep {
  id: string;
  name: string;
  expectedTime: number;
  actualTime: number;
  status: "optimal" | "warning" | "critical" | "skipped";
  conformance: number;
  deviations: string[];
}

interface DrillDownAnalyticsProps {
  bottlenecks: BottleneckAnalysis[];
}

export const DrillDownAnalytics = ({ bottlenecks }: DrillDownAnalyticsProps) => {
  const [selectedTask, setSelectedTask] = useState<number | null>(
    bottlenecks.length > 0 ? bottlenecks[0].taskId : null
  );

  // Simulated root cause analysis data
  const rootCauses: RootCause[] = [
    {
      id: "rc-1",
      factor: "Resource Contention",
      contribution: 35,
      category: "resource",
      description: "Multiple high-priority tasks competing for same processing pool",
      evidence: [
        "85% CPU utilization during peak hours",
        "Queue depth increased 3x in last hour",
        "Parallel task count exceeds optimal threshold",
      ],
      remediation: "Implement dynamic resource allocation based on task priority scoring",
    },
    {
      id: "rc-2",
      factor: "Upstream Delays",
      contribution: 28,
      category: "process",
      description: "Dependency on slow-running validation step causing cascading delays",
      evidence: [
        "Validation step averaging 45% above SLA",
        "Batch size increased beyond optimal limit",
        "Missing data requiring manual intervention",
      ],
      remediation: "Add parallel validation paths and implement data pre-validation",
    },
    {
      id: "rc-3",
      factor: "System Latency",
      contribution: 22,
      category: "system",
      description: "Database query performance degradation during high load periods",
      evidence: [
        "P95 query latency: 850ms (threshold: 500ms)",
        "Index fragmentation at 45%",
        "Connection pool exhaustion events: 12",
      ],
      remediation: "Optimize slow queries, rebuild indexes, increase connection pool size",
    },
    {
      id: "rc-4",
      factor: "External API Delays",
      contribution: 15,
      category: "external",
      description: "Third-party service response times exceeding expectations",
      evidence: [
        "External API P99: 2.3s (expected: 800ms)",
        "Retry rate increased to 8%",
        "Timeout events: 23 in last hour",
      ],
      remediation: "Implement circuit breaker pattern and add response caching",
    },
  ];

  // Ideal workflow conformance analysis
  const workflowSteps: WorkflowStep[] = [
    {
      id: "step-1",
      name: "Task Intake",
      expectedTime: 5,
      actualTime: 4,
      status: "optimal",
      conformance: 100,
      deviations: [],
    },
    {
      id: "step-2",
      name: "Data Validation",
      expectedTime: 10,
      actualTime: 18,
      status: "critical",
      conformance: 55,
      deviations: ["Missing required fields", "Schema validation failures", "Duplicate detection delays"],
    },
    {
      id: "step-3",
      name: "Enrichment",
      expectedTime: 8,
      actualTime: 12,
      status: "warning",
      conformance: 67,
      deviations: ["External API timeout", "Cache miss rate high"],
    },
    {
      id: "step-4",
      name: "Processing",
      expectedTime: 15,
      actualTime: 14,
      status: "optimal",
      conformance: 100,
      deviations: [],
    },
    {
      id: "step-5",
      name: "Quality Check",
      expectedTime: 5,
      actualTime: 0,
      status: "skipped",
      conformance: 0,
      deviations: ["Step bypassed due to time constraints"],
    },
    {
      id: "step-6",
      name: "Final Approval",
      expectedTime: 10,
      actualTime: 15,
      status: "warning",
      conformance: 67,
      deviations: ["Manual review queue backlog"],
    },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "process":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      case "resource":
        return "bg-purple-500/20 text-purple-400 border-purple-500/50";
      case "system":
        return "bg-orange-500/20 text-orange-400 border-orange-500/50";
      case "external":
        return "bg-pink-500/20 text-pink-400 border-pink-500/50";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "optimal":
        return <CheckCircle className="w-5 h-5 text-success" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-warning" />;
      case "critical":
        return <XCircle className="w-5 h-5 text-destructive" />;
      case "skipped":
        return <Info className="w-5 h-5 text-muted-foreground" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "optimal":
        return "border-success bg-success/10";
      case "warning":
        return "border-warning bg-warning/10";
      case "critical":
        return "border-destructive bg-destructive/10";
      case "skipped":
        return "border-muted bg-muted/30";
      default:
        return "border-border";
    }
  };

  const overallConformance = Math.round(
    workflowSteps.reduce((sum, step) => sum + step.conformance, 0) / workflowSteps.length
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Search className="w-5 h-5 text-primary" />
            Drill-Down Analytics & Explainability
          </CardTitle>
          <CardDescription>
            Root cause analysis with visual conformance against ideal workflows
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="rootcause" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-grid">
          <TabsTrigger value="rootcause" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Root Cause Analysis
          </TabsTrigger>
          <TabsTrigger value="conformance" className="flex items-center gap-2">
            <GitBranch className="w-4 h-4" />
            Workflow Conformance
          </TabsTrigger>
        </TabsList>

        {/* Root Cause Analysis Tab */}
        <TabsContent value="rootcause" className="space-y-6">
          {/* Task Selector */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground text-lg">Select Bottleneck to Analyze</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {bottlenecks.slice(0, 8).map((bottleneck) => (
                  <Button
                    key={bottleneck.taskId}
                    variant={selectedTask === bottleneck.taskId ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTask(bottleneck.taskId)}
                    className="gap-2"
                  >
                    Task #{bottleneck.taskId}
                    <Badge
                      variant={bottleneck.riskLevel === "critical" ? "destructive" : "secondary"}
                      className="text-xs"
                    >
                      {bottleneck.riskLevel}
                    </Badge>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Root Cause Breakdown */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Layers className="w-5 h-5 text-primary" />
                Contributing Factors for Task #{selectedTask}
              </CardTitle>
              <CardDescription>
                AI-identified factors ranked by contribution to delay
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rootCauses.map((cause) => (
                  <Accordion key={cause.id} type="single" collapsible>
                    <AccordionItem value={cause.id} className="border rounded-lg px-4">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-4 w-full pr-4">
                          <div className="flex-1 text-left">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-foreground">{cause.factor}</h4>
                              <Badge className={getCategoryColor(cause.category)}>
                                {cause.category}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {cause.description}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Progress value={cause.contribution} className="w-24 h-2" />
                            <span className="font-bold text-foreground w-12 text-right">
                              {cause.contribution}%
                            </span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-4">
                        <div className="space-y-4">
                          <div>
                            <h5 className="font-medium text-foreground mb-2 flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-warning" />
                              Evidence
                            </h5>
                            <ul className="space-y-1 ml-6">
                              {cause.evidence.map((item, idx) => (
                                <li key={idx} className="text-sm text-muted-foreground list-disc">
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="p-3 bg-primary/10 rounded-lg border border-primary/30">
                            <h5 className="font-medium text-foreground mb-1 flex items-center gap-2">
                              <Lightbulb className="w-4 h-4 text-primary" />
                              Recommended Remediation
                            </h5>
                            <p className="text-sm text-foreground">{cause.remediation}</p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Workflow Conformance Tab */}
        <TabsContent value="conformance" className="space-y-6">
          {/* Overall Conformance Score */}
          <Card className="bg-card border-2 border-primary/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Overall Workflow Conformance</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Comparison against ideal workflow pattern
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-primary">{overallConformance}%</div>
                  <p className="text-sm text-muted-foreground">conformance rate</p>
                </div>
              </div>
              <Progress value={overallConformance} className="h-3 mt-4" />
            </CardContent>
          </Card>

          {/* Visual Workflow Steps */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <GitBranch className="w-5 h-5 text-primary" />
                Workflow Step Analysis
              </CardTitle>
              <CardDescription>
                Visual conformance comparison against ideal process flow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workflowSteps.map((step, index) => (
                  <div key={step.id} className="relative">
                    {index < workflowSteps.length - 1 && (
                      <div className="absolute left-6 top-16 w-0.5 h-8 bg-border" />
                    )}
                    <div
                      className={`p-4 rounded-lg border-2 ${getStatusColor(step.status)}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">{getStatusIcon(step.status)}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-foreground">
                              Step {index + 1}: {step.name}
                            </h4>
                            <Badge
                              variant={step.status === "skipped" ? "secondary" : "outline"}
                              className="capitalize"
                            >
                              {step.status}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-3 gap-4 mb-3">
                            <div>
                              <span className="text-xs text-muted-foreground">Expected</span>
                              <p className="font-medium text-foreground">{step.expectedTime}m</p>
                            </div>
                            <div>
                              <span className="text-xs text-muted-foreground">Actual</span>
                              <p className="font-medium text-foreground">
                                {step.actualTime > 0 ? `${step.actualTime}m` : "—"}
                              </p>
                            </div>
                            <div>
                              <span className="text-xs text-muted-foreground">Conformance</span>
                              <p className="font-medium text-foreground">{step.conformance}%</p>
                            </div>
                          </div>

                          {step.deviations.length > 0 && (
                            <div className="bg-card/50 p-3 rounded border border-border">
                              <p className="text-xs font-medium text-destructive mb-1">
                                Deviations Detected:
                              </p>
                              <ul className="space-y-1">
                                {step.deviations.map((deviation, idx) => (
                                  <li
                                    key={idx}
                                    className="text-xs text-muted-foreground flex items-center gap-2"
                                  >
                                    <ArrowRight className="w-3 h-3" />
                                    {deviation}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
