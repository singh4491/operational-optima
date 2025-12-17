import { AggregateMetrics } from "./analytics";

export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  parameters: SimulationParameters;
}

export interface SimulationParameters {
  queueCapacityChange: number; // percentage change (-50 to +100)
  automationLevel: number; // 0-100%
  staffingChange: number; // percentage change (-30 to +50)
  processRedesign: boolean;
}

export interface SimulationResult {
  scenario: SimulationScenario;
  originalMetrics: AggregateMetrics;
  projectedMetrics: AggregateMetrics;
  improvements: {
    queueTimeReduction: number;
    processTimeReduction: number;
    efficiencyGain: number;
    bottleneckReduction: number;
  };
  costImpact: {
    implementationCost: number;
    annualSavings: number;
    roi: number;
    paybackMonths: number;
  };
  risks: string[];
}

export const presetScenarios: SimulationScenario[] = [
  {
    id: "conservative",
    name: "Conservative Optimization",
    description: "Low-risk improvements with minimal resource changes",
    parameters: {
      queueCapacityChange: 10,
      automationLevel: 15,
      staffingChange: 0,
      processRedesign: false
    }
  },
  {
    id: "balanced",
    name: "Balanced Improvement",
    description: "Moderate changes balancing cost and efficiency gains",
    parameters: {
      queueCapacityChange: 25,
      automationLevel: 35,
      staffingChange: 10,
      processRedesign: true
    }
  },
  {
    id: "aggressive",
    name: "Aggressive Transformation",
    description: "Maximum optimization with significant process changes",
    parameters: {
      queueCapacityChange: 50,
      automationLevel: 60,
      staffingChange: 25,
      processRedesign: true
    }
  },
  {
    id: "automation-focus",
    name: "Automation First",
    description: "Heavy automation investment with minimal staffing changes",
    parameters: {
      queueCapacityChange: 15,
      automationLevel: 75,
      staffingChange: -10,
      processRedesign: true
    }
  }
];

export const runSimulation = (
  baseMetrics: AggregateMetrics,
  scenario: SimulationScenario
): SimulationResult => {
  const { parameters } = scenario;
  
  // Calculate projected improvements based on parameters
  const queueReduction = Math.min(50, 
    parameters.queueCapacityChange * 0.4 + 
    parameters.automationLevel * 0.3 + 
    (parameters.processRedesign ? 15 : 0)
  );
  
  const processReduction = Math.min(40,
    parameters.automationLevel * 0.35 +
    parameters.staffingChange * 0.2 +
    (parameters.processRedesign ? 10 : 0)
  );
  
  const efficiencyGain = Math.min(35,
    queueReduction * 0.4 +
    processReduction * 0.3 +
    parameters.automationLevel * 0.15
  );
  
  // Project new metrics
  const projectedMetrics: AggregateMetrics = {
    avgQueueTime: Math.round((baseMetrics.avgQueueTime * (1 - queueReduction / 100)) * 10) / 10,
    avgProcessTime: Math.round((baseMetrics.avgProcessTime * (1 - processReduction / 100)) * 10) / 10,
    avgTotalTime: Math.round((baseMetrics.avgTotalTime * (1 - (queueReduction + processReduction) / 200)) * 10) / 10,
    totalTasks: baseMetrics.totalTasks,
    criticalBottlenecks: Math.max(0, Math.floor(baseMetrics.criticalBottlenecks * (1 - efficiencyGain / 50))),
    highRiskTasks: Math.max(0, Math.floor(baseMetrics.highRiskTasks * (1 - efficiencyGain / 60))),
    efficiencyScore: Math.min(100, Math.round(baseMetrics.efficiencyScore + efficiencyGain))
  };
  
  // Calculate cost impact
  const baseCostPerMinute = 2.5; // $ per minute of processing
  const implementationCost = 
    parameters.queueCapacityChange * 500 +
    parameters.automationLevel * 800 +
    Math.max(0, parameters.staffingChange) * 5000 +
    (parameters.processRedesign ? 15000 : 0);
  
  const timeSavedPerTask = (baseMetrics.avgTotalTime - projectedMetrics.avgTotalTime);
  const annualTasks = baseMetrics.totalTasks * 52; // Assuming weekly batches
  const annualSavings = Math.round(timeSavedPerTask * baseCostPerMinute * annualTasks);
  
  const roi = implementationCost > 0 ? Math.round((annualSavings / implementationCost) * 100) : 0;
  const paybackMonths = annualSavings > 0 ? Math.round((implementationCost / annualSavings) * 12) : 0;
  
  // Identify risks
  const risks: string[] = [];
  if (parameters.automationLevel > 50) {
    risks.push("High automation may require significant training and change management");
  }
  if (parameters.staffingChange < -20) {
    risks.push("Significant staff reduction may impact team morale and knowledge retention");
  }
  if (parameters.queueCapacityChange > 40) {
    risks.push("Large capacity increases may strain existing infrastructure");
  }
  if (parameters.processRedesign) {
    risks.push("Process redesign requires thorough testing before production deployment");
  }
  if (risks.length === 0) {
    risks.push("Low-risk scenario with minimal implementation challenges");
  }
  
  return {
    scenario,
    originalMetrics: baseMetrics,
    projectedMetrics,
    improvements: {
      queueTimeReduction: Math.round(queueReduction * 10) / 10,
      processTimeReduction: Math.round(processReduction * 10) / 10,
      efficiencyGain: Math.round(efficiencyGain * 10) / 10,
      bottleneckReduction: Math.round((1 - projectedMetrics.criticalBottlenecks / Math.max(1, baseMetrics.criticalBottlenecks)) * 100)
    },
    costImpact: {
      implementationCost,
      annualSavings,
      roi,
      paybackMonths
    },
    risks
  };
};

export const createCustomScenario = (
  name: string,
  params: SimulationParameters
): SimulationScenario => ({
  id: `custom-${Date.now()}`,
  name,
  description: "Custom simulation scenario",
  parameters: params
});
