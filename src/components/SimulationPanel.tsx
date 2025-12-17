import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FlaskConical, 
  Play, 
  RefreshCw,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  AlertTriangle,
  CheckCircle,
  Zap
} from "lucide-react";
import { 
  SimulationScenario, 
  SimulationResult, 
  SimulationParameters,
  presetScenarios, 
  runSimulation 
} from "@/utils/simulation";
import { AggregateMetrics } from "@/utils/analytics";

interface SimulationPanelProps {
  baseMetrics: AggregateMetrics;
}

const MetricComparison = ({ 
  label, 
  original, 
  projected, 
  unit = "",
  inverse = false 
}: { 
  label: string; 
  original: number; 
  projected: number;
  unit?: string;
  inverse?: boolean;
}) => {
  const change = projected - original;
  const percentChange = original > 0 ? (change / original) * 100 : 0;
  const isImprovement = inverse ? change < 0 : change > 0;
  
  return (
    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
      <span className="text-sm text-foreground">{label}</span>
      <div className="flex items-center gap-3">
        <span className="text-muted-foreground">{original}{unit}</span>
        <span className="text-muted-foreground">→</span>
        <span className={`font-semibold ${isImprovement ? "text-success" : "text-destructive"}`}>
          {projected}{unit}
        </span>
        <div className={`flex items-center gap-1 text-xs ${isImprovement ? "text-success" : "text-destructive"}`}>
          {isImprovement ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
          {Math.abs(percentChange).toFixed(1)}%
        </div>
      </div>
    </div>
  );
};

export const SimulationPanel = ({ baseMetrics }: SimulationPanelProps) => {
  const [selectedScenario, setSelectedScenario] = useState<SimulationScenario>(presetScenarios[1]);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [customParams, setCustomParams] = useState<SimulationParameters>({
    queueCapacityChange: 25,
    automationLevel: 35,
    staffingChange: 10,
    processRedesign: true
  });

  const handleRunSimulation = () => {
    setIsRunning(true);
    // Simulate processing time
    setTimeout(() => {
      const result = runSimulation(baseMetrics, selectedScenario);
      setSimulationResult(result);
      setIsRunning(false);
    }, 1500);
  };

  const handleCustomParamChange = (key: keyof SimulationParameters, value: number | boolean) => {
    const newParams = { ...customParams, [key]: value };
    setCustomParams(newParams);
    setSelectedScenario({
      id: "custom",
      name: "Custom Scenario",
      description: "Your custom simulation parameters",
      parameters: newParams
    });
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-primary rounded-lg">
            <FlaskConical className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg">Workflow Simulation</CardTitle>
            <p className="text-sm text-muted-foreground">Test process changes safely before implementation</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="presets" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="presets">Preset Scenarios</TabsTrigger>
            <TabsTrigger value="custom">Custom Parameters</TabsTrigger>
          </TabsList>
          
          <TabsContent value="presets" className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {presetScenarios.map((scenario) => (
                <div
                  key={scenario.id}
                  onClick={() => setSelectedScenario(scenario)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedScenario.id === scenario.id 
                      ? "border-primary bg-primary/10" 
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <h4 className="font-medium text-foreground mb-1">{scenario.name}</h4>
                  <p className="text-xs text-muted-foreground">{scenario.description}</p>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="custom" className="space-y-4">
            <div className="space-y-6 p-4 bg-muted/50 rounded-lg">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-foreground">Queue Capacity Change</label>
                  <span className="text-sm text-primary">{customParams.queueCapacityChange > 0 ? "+" : ""}{customParams.queueCapacityChange}%</span>
                </div>
                <Slider
                  value={[customParams.queueCapacityChange]}
                  onValueChange={([v]) => handleCustomParamChange("queueCapacityChange", v)}
                  min={-50}
                  max={100}
                  step={5}
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-foreground">Automation Level</label>
                  <span className="text-sm text-primary">{customParams.automationLevel}%</span>
                </div>
                <Slider
                  value={[customParams.automationLevel]}
                  onValueChange={([v]) => handleCustomParamChange("automationLevel", v)}
                  min={0}
                  max={100}
                  step={5}
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-foreground">Staffing Change</label>
                  <span className="text-sm text-primary">{customParams.staffingChange > 0 ? "+" : ""}{customParams.staffingChange}%</span>
                </div>
                <Slider
                  value={[customParams.staffingChange]}
                  onValueChange={([v]) => handleCustomParamChange("staffingChange", v)}
                  min={-30}
                  max={50}
                  step={5}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Include Process Redesign</label>
                <Switch
                  checked={customParams.processRedesign}
                  onCheckedChange={(v) => handleCustomParamChange("processRedesign", v)}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 p-4 bg-secondary/50 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="font-medium text-foreground">{selectedScenario.name}</h4>
              <p className="text-sm text-muted-foreground">{selectedScenario.description}</p>
            </div>
            <Button onClick={handleRunSimulation} disabled={isRunning}>
              {isRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Simulating...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Run Simulation
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Simulation Results */}
        {simulationResult && (
          <div className="mt-6 space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Simulation Results
            </h3>
            
            {/* Metric Comparisons */}
            <div className="space-y-2">
              <MetricComparison 
                label="Queue Wait Time" 
                original={simulationResult.originalMetrics.avgQueueTime}
                projected={simulationResult.projectedMetrics.avgQueueTime}
                unit="m"
                inverse
              />
              <MetricComparison 
                label="Process Time" 
                original={simulationResult.originalMetrics.avgProcessTime}
                projected={simulationResult.projectedMetrics.avgProcessTime}
                unit="m"
                inverse
              />
              <MetricComparison 
                label="Efficiency Score" 
                original={simulationResult.originalMetrics.efficiencyScore}
                projected={simulationResult.projectedMetrics.efficiencyScore}
                unit="%"
              />
              <MetricComparison 
                label="Critical Bottlenecks" 
                original={simulationResult.originalMetrics.criticalBottlenecks}
                projected={simulationResult.projectedMetrics.criticalBottlenecks}
                inverse
              />
            </div>

            {/* Cost Impact */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              <div className="p-3 bg-muted/50 rounded-lg text-center">
                <DollarSign className="w-5 h-5 mx-auto mb-1 text-destructive" />
                <p className="text-xs text-muted-foreground">Implementation</p>
                <p className="font-semibold text-foreground">${simulationResult.costImpact.implementationCost.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg text-center">
                <DollarSign className="w-5 h-5 mx-auto mb-1 text-success" />
                <p className="text-xs text-muted-foreground">Annual Savings</p>
                <p className="font-semibold text-success">${simulationResult.costImpact.annualSavings.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg text-center">
                <Target className="w-5 h-5 mx-auto mb-1 text-primary" />
                <p className="text-xs text-muted-foreground">ROI</p>
                <p className="font-semibold text-foreground">{simulationResult.costImpact.roi}%</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg text-center">
                <TrendingUp className="w-5 h-5 mx-auto mb-1 text-primary" />
                <p className="text-xs text-muted-foreground">Payback</p>
                <p className="font-semibold text-foreground">{simulationResult.costImpact.paybackMonths} months</p>
              </div>
            </div>

            {/* Risks */}
            <div className="p-4 bg-warning/10 border border-warning/30 rounded-lg">
              <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-warning" />
                Implementation Risks
              </h4>
              <ul className="space-y-1">
                {simulationResult.risks.map((risk, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-warning">•</span>
                    {risk}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
