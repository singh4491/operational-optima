import { useEffect, useState } from "react";
import { sampleData } from "@/data/sampleData";
import { analyzeData, BottleneckAnalysis, AggregateMetrics } from "@/utils/analytics";
import { MetricsCard } from "@/components/MetricsCard";
import { BottleneckChart } from "@/components/BottleneckChart";
import { TopBottlenecks } from "@/components/TopBottlenecks";
import { ClientRoadmap } from "@/components/ClientRoadmap";
import { Activity, Clock, TrendingUp, AlertTriangle, Target, Zap } from "lucide-react";

const Index = () => {
  const [bottlenecks, setBottlenecks] = useState<BottleneckAnalysis[]>([]);
  const [metrics, setMetrics] = useState<AggregateMetrics | null>(null);

  useEffect(() => {
    const { bottlenecks: analyzedBottlenecks, metrics: analyzedMetrics } = analyzeData(sampleData);
    setBottlenecks(analyzedBottlenecks);
    setMetrics(analyzedMetrics);
  }, []);

  if (!metrics) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Analyzing workflow data...</p>
        </div>
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
              title="High Risk Tasks"
              value={metrics.highRiskTasks}
              subtitle="Above threshold performance"
              icon={AlertTriangle}
              variant={metrics.highRiskTasks > 20 ? "warning" : "success"}
            />
          </div>
        </section>

        {/* Visualization */}
        <section>
          <BottleneckChart data={bottlenecks} />
        </section>

        {/* Top Bottlenecks */}
        <section>
          <TopBottlenecks bottlenecks={bottlenecks} limit={10} />
        </section>

        {/* AI Insights */}
        <section className="bg-card border-2 border-primary/30 rounded-xl p-6 shadow-glow">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gradient-primary rounded-xl">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-3">AI-Powered Recommendations</h3>
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

                {metrics.efficiencyScore < 60 && (
                  <div className="p-4 bg-accent/10 border border-accent/30 rounded-lg">
                    <p className="font-semibold text-accent mb-1">📊 Process Redesign Suggested</p>
                    <p className="text-sm text-foreground">
                      Current efficiency score of {metrics.efficiencyScore}% indicates potential for workflow optimization. 
                      AI analysis suggests reviewing task dependencies and automating repetitive steps.
                    </p>
                  </div>
                )}

                {metrics.efficiencyScore >= 60 && metrics.criticalBottlenecks === 0 && (
                  <div className="p-4 bg-success/10 border border-success/30 rounded-lg">
                    <p className="font-semibold text-success mb-1">✅ Strong Performance</p>
                    <p className="text-sm text-foreground">
                      Process efficiency at {metrics.efficiencyScore}% with no critical bottlenecks. 
                      Continue monitoring for sustained performance and consider minor optimizations for continuous improvement.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Client Roadmap */}
        <section>
          <ClientRoadmap />
        </section>
      </main>
    </div>
  );
};

export default Index;
