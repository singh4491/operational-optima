import { TaskData } from "@/data/sampleData";

export interface BottleneckAnalysis {
  taskId: number;
  totalTime: number;
  queueWaitTime: number;
  processTime: number;
  bottleneckScore: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  insights: string[];
}

export interface AggregateMetrics {
  avgQueueTime: number;
  avgProcessTime: number;
  avgTotalTime: number;
  totalTasks: number;
  criticalBottlenecks: number;
  highRiskTasks: number;
  efficiencyScore: number;
}

export const calculateBottleneckScore = (queueTime: number, processTime: number): number => {
  // AI-powered scoring: weighs queue time more heavily as it's pure waste
  const queueWeight = 0.7;
  const processWeight = 0.3;
  const totalTime = queueTime + processTime;
  
  // Normalize based on typical ranges in dataset (0-100 scale)
  const normalizedQueue = (queueTime / 35) * 100;
  const normalizedProcess = (processTime / 60) * 100;
  
  return (normalizedQueue * queueWeight + normalizedProcess * processWeight);
};

export const getRiskLevel = (score: number): "low" | "medium" | "high" | "critical" => {
  if (score >= 80) return "critical";
  if (score >= 60) return "high";
  if (score >= 40) return "medium";
  return "low";
};

export const generateInsights = (task: TaskData, avgQueue: number, avgProcess: number): string[] => {
  const insights: string[] = [];
  const { QueueWaitTime, ProcessStepDuration } = task;
  
  if (QueueWaitTime > avgQueue * 1.5) {
    insights.push(`Queue wait time is ${Math.round((QueueWaitTime / avgQueue - 1) * 100)}% above average`);
  }
  
  if (ProcessStepDuration > avgProcess * 1.3) {
    insights.push(`Process duration exceeds normal by ${Math.round((ProcessStepDuration / avgProcess - 1) * 100)}%`);
  }
  
  if (QueueWaitTime > ProcessStepDuration) {
    insights.push("Queue time exceeds process time - prioritize queue optimization");
  }
  
  const totalTime = QueueWaitTime + ProcessStepDuration;
  if (totalTime > (avgQueue + avgProcess) * 1.4) {
    insights.push("Critical delay detected - immediate intervention recommended");
  }
  
  return insights.length > 0 ? insights : ["Performance within normal parameters"];
};

export const analyzeData = (data: TaskData[]): {
  bottlenecks: BottleneckAnalysis[];
  metrics: AggregateMetrics;
} => {
  const avgQueueTime = data.reduce((sum, task) => sum + task.QueueWaitTime, 0) / data.length;
  const avgProcessTime = data.reduce((sum, task) => sum + task.ProcessStepDuration, 0) / data.length;
  const avgTotalTime = avgQueueTime + avgProcessTime;

  const bottlenecks: BottleneckAnalysis[] = data.map(task => {
    const totalTime = task.QueueWaitTime + task.ProcessStepDuration;
    const bottleneckScore = calculateBottleneckScore(task.QueueWaitTime, task.ProcessStepDuration);
    const riskLevel = getRiskLevel(bottleneckScore);
    const insights = generateInsights(task, avgQueueTime, avgProcessTime);

    return {
      taskId: task.TaskID,
      totalTime,
      queueWaitTime: task.QueueWaitTime,
      processTime: task.ProcessStepDuration,
      bottleneckScore,
      riskLevel,
      insights,
    };
  });

  // Sort by bottleneck score
  bottlenecks.sort((a, b) => b.bottleneckScore - a.bottleneckScore);

  const criticalBottlenecks = bottlenecks.filter(b => b.riskLevel === "critical").length;
  const highRiskTasks = bottlenecks.filter(b => b.riskLevel === "high" || b.riskLevel === "critical").length;
  
  // Calculate efficiency score (inverse of average bottleneck score)
  const avgBottleneckScore = bottlenecks.reduce((sum, b) => sum + b.bottleneckScore, 0) / bottlenecks.length;
  const efficiencyScore = Math.round(100 - avgBottleneckScore);

  const metrics: AggregateMetrics = {
    avgQueueTime: Math.round(avgQueueTime * 10) / 10,
    avgProcessTime: Math.round(avgProcessTime * 10) / 10,
    avgTotalTime: Math.round(avgTotalTime * 10) / 10,
    totalTasks: data.length,
    criticalBottlenecks,
    highRiskTasks,
    efficiencyScore,
  };

  return { bottlenecks, metrics };
};
