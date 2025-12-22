import { useEffect, useState } from "react";
import { sampleData } from "@/data/sampleData";
import { analyzeData, BottleneckAnalysis, AggregateMetrics } from "@/utils/analytics";
import { generatePredictions, generateRecommendations, detectAnomalies, Prediction, Recommendation, Anomaly } from "@/utils/predictions";
import { MetricsCard } from "@/components/MetricsCard";
import { BottleneckChart } from "@/components/BottleneckChart";
import { TopBottlenecks } from "@/components/TopBottlenecks";
import { PredictiveInsights } from "@/components/PredictiveInsights";
import { AlertsPanel } from "@/components/AlertsPanel";
import { SimulationPanel } from "@/components/SimulationPanel";
import { ExportPanel } from "@/components/ExportPanel";
import { DynamicBottleneckPanel } from "@/components/DynamicBottleneckPanel";
import { DrillDownAnalytics } from "@/components/DrillDownAnalytics";
import { IntegrationTemplates } from "@/components/IntegrationTemplates";
import { DashboardSkeleton } from "@/components/DashboardSkeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Clock, TrendingUp, AlertTriangle, Target, Zap, Brain, FlaskConical, Bell, Share2, Radio, Search, Plug } from "lucide-react";

const Index = () => {
  const [bottlenecks, setBottlenecks] = useState<BottleneckAnalysis[]>([]);
  const [metrics, setMetrics] = useState<AggregateMetrics | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Preparing dashboard...");

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      // Simulate realistic loading with progress messages
      setLoadingMessage("Analyzing workflow data...");
      await new Promise(r => setTimeout(r, 300));
      
      const { bottlenecks: analyzedBottlenecks, metrics: analyzedMetrics } = analyzeData(sampleData);
      setBottlenecks(analyzedBottlenecks);
      setMetrics(analyzedMetrics);
      
      setLoadingMessage("Generating AI predictions...");
      await new Promise(r => setTimeout(r, 300));
      
      // Generate AI predictions and recommendations
      const preds = generatePredictions(analyzedMetrics, analyzedBottlenecks);
      setPredictions(preds);
      
      setLoadingMessage("Preparing recommendations...");
      await new Promise(r => setTimeout(r, 200));
      
      const recs = generateRecommendations(analyzedMetrics, analyzedBottlenecks);
      setRecommendations(recs);
      
      setLoadingMessage("Detecting anomalies...");
      await new Promise(r => setTimeout(r, 200));
      
      // Detect anomalies
      const detectedAnomalies = detectAnomalies(sampleData, analyzedMetrics);
      setAnomalies(detectedAnomalies);
      
      setIsLoading(false);
    };
    
    loadData();
  }, []);

  if (isLoading || !metrics) {
    return (
      <div className="min-h-screen bg-gradient-dark">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  AI Bottleneck Intelligence
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Real-time process optimization and workflow analytics
                </p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-primary rounded-lg">
                <Zap className="w-5 h-5 text-white" />
                <span className="font-semibold text-white">AI Powered</span>
              </div>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-6 py-8">
          <div className="mb-6 p-4 bg-primary/10 border border-primary/30 rounded-lg flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
            <span className="text-foreground font-medium">{loadingMessage}</span>
          </div>
          <DashboardSkeleton />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                AI Bottleneck Intelligence
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Real-time process optimization and workflow analytics
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-primary rounded-lg">
              <Zap className="w-5 h-5 text-white" />
              <span className="font-semibold text-white">AI Powered</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Key Metrics */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Performance Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <MetricsCard
              title="Efficiency Score"
              value={`${metrics.efficiencyScore}%`}
              subtitle="Overall process efficiency"
              icon={Target}
              variant={metrics.efficiencyScore > 60 ? "success" : "warning"}
            />
            <MetricsCard
              title="Average Queue Time"
              value={`${metrics.avgQueueTime}m`}
              subtitle="Average waiting period"
              icon={Clock}
              variant="default"
            />
            <MetricsCard
              title="Average Process Time"
              value={`${metrics.avgProcessTime}m`}
              subtitle="Average execution time"
              icon={TrendingUp}
              variant="default"
            />
            <MetricsCard
              title="Total Tasks Analyzed"
              value={metrics.totalTasks}
              subtitle="Complete dataset coverage"
              icon={Activity}
              variant="default"
            />
            <MetricsCard
              title="Critical Bottlenecks"
              value={metrics.criticalBottlenecks}
              subtitle="Require immediate action"
              icon={AlertTriangle}
              variant={metrics.criticalBottlenecks > 0 ? "critical" : "success"}
            />
            <MetricsCard
              title="Active Alerts"
              value={anomalies.filter(a => a.severity === "critical" || a.severity === "warning").length}
              subtitle="Anomalies detected"
              icon={Bell}
              variant={anomalies.some(a => a.severity === "critical") ? "critical" : "warning"}
            />
          </div>
        </section>

        {/* Main Tabs for Features */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="w-full grid grid-cols-4 lg:grid-cols-8 h-14 p-1.5 bg-card border-2 border-primary/30 shadow-lg rounded-xl">
            <TabsTrigger value="overview" className="flex items-center justify-center gap-2 text-sm font-medium data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg transition-all">
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="dynamic" className="flex items-center justify-center gap-2 text-sm font-medium data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg transition-all">
              <Radio className="w-4 h-4" />
              <span className="hidden sm:inline">Dynamic</span>
            </TabsTrigger>
            <TabsTrigger value="predictive" className="flex items-center justify-center gap-2 text-sm font-medium data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg transition-all">
              <Brain className="w-4 h-4" />
              <span className="hidden sm:inline">Predictive AI</span>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center justify-center gap-2 text-sm font-medium data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg transition-all">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Alerts</span>
            </TabsTrigger>
            <TabsTrigger value="drilldown" className="flex items-center justify-center gap-2 text-sm font-medium data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg transition-all">
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="simulation" className="flex items-center justify-center gap-2 text-sm font-medium data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg transition-all">
              <FlaskConical className="w-4 h-4" />
              <span className="hidden sm:inline">Simulation</span>
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center justify-center gap-2 text-sm font-medium data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg transition-all">
              <Plug className="w-4 h-4" />
              <span className="hidden sm:inline">Integrations</span>
            </TabsTrigger>
            <TabsTrigger value="export" className="flex items-center justify-center gap-2 text-sm font-medium data-[state=active]:bg-gradient-primary data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg transition-all">
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <BottleneckChart data={bottlenecks} />
            <TopBottlenecks bottlenecks={bottlenecks} limit={10} />
            
            {/* AI Insights */}
            <section className="bg-card border-2 border-primary/30 rounded-xl p-6 shadow-glow">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-primary rounded-xl">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-3">AI-Powered Quick Insights</h3>
                  <div className="space-y-3">
                    {metrics.criticalBottlenecks > 0 && (
                      <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
                        <p className="font-semibold text-destructive mb-1">🚨 Critical Action Required</p>
                        <p className="text-sm text-foreground">
                          {metrics.criticalBottlenecks} tasks showing critical delays. Recommend immediate resource allocation 
                          and process review for tasks with queue times exceeding 25 minutes.
                        </p>
                      </div>
                    )}
                    
                    {metrics.avgQueueTime > metrics.avgProcessTime && (
                      <div className="p-4 bg-warning/10 border border-warning/30 rounded-lg">
                        <p className="font-semibold text-warning mb-1">⚡ Queue Optimization Opportunity</p>
                        <p className="text-sm text-foreground">
                          Queue wait time ({metrics.avgQueueTime}m) exceeds process time ({metrics.avgProcessTime}m). 
                          Consider implementing parallel processing or increasing capacity during peak periods.
                        </p>
                      </div>
                    )}

                    {metrics.efficiencyScore >= 60 && metrics.criticalBottlenecks === 0 && (
                      <div className="p-4 bg-success/10 border border-success/30 rounded-lg">
                        <p className="font-semibold text-success mb-1">✅ Strong Performance</p>
                        <p className="text-sm text-foreground">
                          Process efficiency at {metrics.efficiencyScore}% with no critical bottlenecks. 
                          Continue monitoring for sustained performance.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </TabsContent>

          {/* Dynamic Bottleneck Tab */}
          <TabsContent value="dynamic">
            <DynamicBottleneckPanel />
          </TabsContent>

          {/* Predictive AI Tab */}
          <TabsContent value="predictive">
            <PredictiveInsights predictions={predictions} recommendations={recommendations} />
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts">
            <AlertsPanel anomalies={anomalies} />
          </TabsContent>

          {/* Drill-Down Analytics Tab */}
          <TabsContent value="drilldown">
            <DrillDownAnalytics bottlenecks={bottlenecks} />
          </TabsContent>

          {/* Simulation Tab */}
          <TabsContent value="simulation">
            <SimulationPanel baseMetrics={metrics} />
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations">
            <IntegrationTemplates />
          </TabsContent>

          {/* Export Tab */}
          <TabsContent value="export">
            <ExportPanel metrics={metrics} bottlenecks={bottlenecks} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
