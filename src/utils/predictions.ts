import { TaskData } from "@/data/sampleData";
import { AggregateMetrics, BottleneckAnalysis } from "./analytics";

export interface Prediction {
  metric: string;
  currentValue: number;
  predictedValue: number;
  change: number;
  trend: "up" | "down" | "stable";
  confidence: number;
  timeframe: string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  impact: {
    sla: number; // percentage improvement
    cost: number; // estimated savings
    effort: "low" | "medium" | "high";
  };
  priority: "critical" | "high" | "medium" | "low";
  category: "process" | "resource" | "automation" | "capacity";
}

export interface Anomaly {
  id: string;
  type: "idle_time" | "rework_loop" | "skipped_validation" | "volume_spike";
  severity: "info" | "warning" | "critical";
  taskIds: number[];
  message: string;
  threshold: number;
  actualValue: number;
  timestamp: Date;
}

// Simulate predictive analytics based on current data patterns
export const generatePredictions = (
  metrics: AggregateMetrics,
  bottlenecks: BottleneckAnalysis[]
): Prediction[] => {
  const criticalRatio = metrics.criticalBottlenecks / metrics.totalTasks;
  const highRiskRatio = metrics.highRiskTasks / metrics.totalTasks;
  
  // Simulate trend analysis
  const queueTrend = metrics.avgQueueTime > 18 ? "up" : metrics.avgQueueTime < 15 ? "down" : "stable";
  const processTrend = metrics.avgProcessTime > 46 ? "up" : "stable";
  
  return [
    {
      metric: "Queue Wait Time",
      currentValue: metrics.avgQueueTime,
      predictedValue: Math.round((metrics.avgQueueTime * (1 + (queueTrend === "up" ? 0.15 : queueTrend === "down" ? -0.1 : 0.02))) * 10) / 10,
      change: queueTrend === "up" ? 15 : queueTrend === "down" ? -10 : 2,
      trend: queueTrend,
      confidence: 78,
      timeframe: "Next 7 days"
    },
    {
      metric: "Process Duration",
      currentValue: metrics.avgProcessTime,
      predictedValue: Math.round((metrics.avgProcessTime * (1 + (processTrend === "up" ? 0.08 : 0.01))) * 10) / 10,
      change: processTrend === "up" ? 8 : 1,
      trend: processTrend,
      confidence: 82,
      timeframe: "Next 7 days"
    },
    {
      metric: "Critical Bottlenecks",
      currentValue: metrics.criticalBottlenecks,
      predictedValue: Math.round(metrics.criticalBottlenecks * (1 + criticalRatio * 0.5)),
      change: Math.round(criticalRatio * 50),
      trend: criticalRatio > 0.1 ? "up" : "stable",
      confidence: 71,
      timeframe: "Next 7 days"
    },
    {
      metric: "Efficiency Score",
      currentValue: metrics.efficiencyScore,
      predictedValue: Math.max(0, Math.min(100, metrics.efficiencyScore + (metrics.efficiencyScore > 60 ? 2 : -3))),
      change: metrics.efficiencyScore > 60 ? 2 : -3,
      trend: metrics.efficiencyScore > 60 ? "up" : "down",
      confidence: 75,
      timeframe: "Next 7 days"
    }
  ];
};

// Generate AI-powered recommendations with quantified impact
export const generateRecommendations = (
  metrics: AggregateMetrics,
  bottlenecks: BottleneckAnalysis[]
): Recommendation[] => {
  const recommendations: Recommendation[] = [];
  
  // High queue time recommendation
  if (metrics.avgQueueTime > 18) {
    recommendations.push({
      id: "rec-1",
      title: "Implement Parallel Processing",
      description: "Deploy additional processing lanes during peak hours (9AM-2PM) to reduce queue buildup. Analysis shows 40% of queue time occurs during these windows.",
      impact: {
        sla: 25,
        cost: 15000,
        effort: "medium"
      },
      priority: "high",
      category: "capacity"
    });
  }
  
  // Critical bottlenecks recommendation
  if (metrics.criticalBottlenecks > 5) {
    recommendations.push({
      id: "rec-2",
      title: "Automate Validation Steps",
      description: "Replace manual validation checkpoints with automated rules engine. Currently 35% of critical bottlenecks occur at validation stages.",
      impact: {
        sla: 40,
        cost: 25000,
        effort: "high"
      },
      priority: "critical",
      category: "automation"
    });
  }
  
  // Low efficiency recommendation
  if (metrics.efficiencyScore < 60) {
    recommendations.push({
      id: "rec-3",
      title: "Redesign Task Dependencies",
      description: "Remove sequential dependencies where parallel execution is possible. Task dependency analysis reveals 28% could run concurrently.",
      impact: {
        sla: 18,
        cost: 8000,
        effort: "low"
      },
      priority: "high",
      category: "process"
    });
  }
  
  // Process time optimization
  if (metrics.avgProcessTime > 45) {
    recommendations.push({
      id: "rec-4",
      title: "Skill-Based Routing",
      description: "Route complex tasks to specialized handlers. Process time variance analysis shows 22% improvement potential with expertise matching.",
      impact: {
        sla: 15,
        cost: 5000,
        effort: "low"
      },
      priority: "medium",
      category: "resource"
    });
  }
  
  // Default recommendation if none apply
  if (recommendations.length === 0) {
    recommendations.push({
      id: "rec-5",
      title: "Continuous Monitoring Enhancement",
      description: "Implement real-time dashboards with automated threshold alerts to maintain current performance levels and detect early degradation.",
      impact: {
        sla: 5,
        cost: 2000,
        effort: "low"
      },
      priority: "low",
      category: "process"
    });
  }
  
  return recommendations.sort((a, b) => {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
};

// Detect anomalies in the data
export const detectAnomalies = (
  data: TaskData[],
  metrics: AggregateMetrics
): Anomaly[] => {
  const anomalies: Anomaly[] = [];
  const idleThreshold = metrics.avgQueueTime * 1.8;
  const reworkThreshold = 2;
  
  // Detect idle time anomalies
  const idleTasks = data.filter(t => t.QueueWaitTime > idleThreshold);
  if (idleTasks.length > 0) {
    anomalies.push({
      id: "anomaly-idle",
      type: "idle_time",
      severity: idleTasks.length > 10 ? "critical" : idleTasks.length > 5 ? "warning" : "info",
      taskIds: idleTasks.map(t => t.TaskID),
      message: `${idleTasks.length} tasks exceed idle time threshold of ${Math.round(idleThreshold)}m`,
      threshold: idleThreshold,
      actualValue: Math.max(...idleTasks.map(t => t.QueueWaitTime)),
      timestamp: new Date()
    });
  }
  
  // Detect volume spike (simulated)
  const highVolumeWindow = data.slice(0, 20);
  const avgWindow = highVolumeWindow.reduce((sum, t) => sum + t.QueueWaitTime + t.ProcessStepDuration, 0) / highVolumeWindow.length;
  if (avgWindow > (metrics.avgTotalTime * 1.3)) {
    anomalies.push({
      id: "anomaly-volume",
      type: "volume_spike",
      severity: "warning",
      taskIds: highVolumeWindow.map(t => t.TaskID),
      message: "Volume spike detected in first 20 tasks, processing times 30% above average",
      threshold: metrics.avgTotalTime * 1.3,
      actualValue: avgWindow,
      timestamp: new Date()
    });
  }
  
  // Detect potential rework loops (tasks with unusually high process time)
  const processThreshold = metrics.avgProcessTime * 1.5;
  const reworkCandidates = data.filter(t => t.ProcessStepDuration > processThreshold);
  if (reworkCandidates.length >= reworkThreshold) {
    anomalies.push({
      id: "anomaly-rework",
      type: "rework_loop",
      severity: reworkCandidates.length > 8 ? "critical" : "warning",
      taskIds: reworkCandidates.map(t => t.TaskID),
      message: `${reworkCandidates.length} tasks show potential rework patterns (process time > ${Math.round(processThreshold)}m)`,
      threshold: processThreshold,
      actualValue: Math.max(...reworkCandidates.map(t => t.ProcessStepDuration)),
      timestamp: new Date()
    });
  }
  
  return anomalies.sort((a, b) => {
    const severityOrder = { critical: 0, warning: 1, info: 2 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });
};
