import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Activity, TrendingUp, TrendingDown, Zap, Calendar, Clock, RefreshCw, BarChart3 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";

interface VolumeData {
  time: string;
  volume: number;
  baseline: number;
  threshold: number;
}

interface SeasonalTrend {
  period: string;
  pattern: string;
  impact: number;
  recommendation: string;
}

interface DynamicBottleneck {
  id: string;
  name: string;
  currentLoad: number;
  normalLoad: number;
  spikeDetected: boolean;
  trend: "increasing" | "decreasing" | "stable";
  confidence: number;
  adjustedThreshold: number;
}

export const DynamicBottleneckPanel = () => {
  const [timeRange, setTimeRange] = useState("24h");
  const [isLive, setIsLive] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Simulated real-time volume data
  const volumeData: VolumeData[] = [
    { time: "00:00", volume: 45, baseline: 50, threshold: 75 },
    { time: "04:00", volume: 30, baseline: 35, threshold: 75 },
    { time: "08:00", volume: 85, baseline: 70, threshold: 75 },
    { time: "10:00", volume: 120, baseline: 80, threshold: 75 },
    { time: "12:00", volume: 95, baseline: 75, threshold: 75 },
    { time: "14:00", volume: 110, baseline: 78, threshold: 75 },
    { time: "16:00", volume: 88, baseline: 72, threshold: 75 },
    { time: "18:00", volume: 65, baseline: 60, threshold: 75 },
    { time: "20:00", volume: 50, baseline: 45, threshold: 75 },
    { time: "22:00", volume: 40, baseline: 40, threshold: 75 },
  ];

  const seasonalTrends: SeasonalTrend[] = [
    {
      period: "Monday Morning Rush",
      pattern: "Weekly peak 8AM-11AM",
      impact: 45,
      recommendation: "Pre-allocate 30% additional resources",
    },
    {
      period: "End of Month Processing",
      pattern: "Monthly spike last 3 days",
      impact: 65,
      recommendation: "Scale queue workers by 50%",
    },
    {
      period: "Q4 Holiday Season",
      pattern: "Seasonal increase Nov-Dec",
      impact: 80,
      recommendation: "Enable burst capacity mode",
    },
    {
      period: "Post-lunch Dip",
      pattern: "Daily low 1PM-2PM",
      impact: -20,
      recommendation: "Schedule maintenance during this window",
    },
  ];

  const dynamicBottlenecks: DynamicBottleneck[] = [
    {
      id: "queue-1",
      name: "Order Processing Queue",
      currentLoad: 92,
      normalLoad: 65,
      spikeDetected: true,
      trend: "increasing",
      confidence: 87,
      adjustedThreshold: 85,
    },
    {
      id: "queue-2",
      name: "Validation Pipeline",
      currentLoad: 78,
      normalLoad: 70,
      spikeDetected: false,
      trend: "stable",
      confidence: 92,
      adjustedThreshold: 80,
    },
    {
      id: "queue-3",
      name: "Data Enrichment Stage",
      currentLoad: 45,
      normalLoad: 55,
      spikeDetected: false,
      trend: "decreasing",
      confidence: 94,
      adjustedThreshold: 75,
    },
    {
      id: "queue-4",
      name: "Final Review Queue",
      currentLoad: 88,
      normalLoad: 60,
      spikeDetected: true,
      trend: "increasing",
      confidence: 85,
      adjustedThreshold: 82,
    },
  ];

  // Simulate real-time updates
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 5000);
    return () => clearInterval(interval);
  }, [isLive]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing":
        return <TrendingUp className="w-4 h-4 text-destructive" />;
      case "decreasing":
        return <TrendingDown className="w-4 h-4 text-success" />;
      default:
        return <Activity className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getLoadColor = (current: number, threshold: number) => {
    if (current >= threshold) return "bg-destructive";
    if (current >= threshold * 0.8) return "bg-warning";
    return "bg-success";
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Zap className="w-5 h-5 text-primary" />
                Dynamic Bottleneck Detection
              </CardTitle>
              <CardDescription>
                Real-time tracking with automatic threshold adjustments
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">Last 1 hour</SelectItem>
                  <SelectItem value="6h">Last 6 hours</SelectItem>
                  <SelectItem value="24h">Last 24 hours</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant={isLive ? "default" : "outline"}
                size="sm"
                onClick={() => setIsLive(!isLive)}
                className="gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isLive ? "animate-spin" : ""}`} />
                {isLive ? "Live" : "Paused"}
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </CardHeader>
      </Card>

      {/* Volume Spike Chart */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <BarChart3 className="w-5 h-5 text-primary" />
            Volume Spike Detection
          </CardTitle>
          <CardDescription>
            Real-time volume vs baseline with dynamic thresholds
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="volume"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.3}
                  name="Current Volume"
                />
                <Area
                  type="monotone"
                  dataKey="baseline"
                  stroke="hsl(var(--muted-foreground))"
                  fill="hsl(var(--muted-foreground))"
                  fillOpacity={0.1}
                  strokeDasharray="5 5"
                  name="Baseline"
                />
                <Line
                  type="monotone"
                  dataKey="threshold"
                  stroke="hsl(var(--destructive))"
                  strokeDasharray="3 3"
                  name="Threshold"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Active Bottlenecks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dynamicBottlenecks.map((bottleneck) => (
          <Card
            key={bottleneck.id}
            className={`bg-card border-2 ${
              bottleneck.spikeDetected
                ? "border-destructive/50 shadow-lg shadow-destructive/10"
                : "border-border"
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-foreground">{bottleneck.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    {getTrendIcon(bottleneck.trend)}
                    <span className="text-sm text-muted-foreground capitalize">
                      {bottleneck.trend}
                    </span>
                  </div>
                </div>
                {bottleneck.spikeDetected && (
                  <Badge variant="destructive" className="animate-pulse">
                    Spike Detected
                  </Badge>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Current Load</span>
                    <span className="font-medium text-foreground">{bottleneck.currentLoad}%</span>
                  </div>
                  <Progress
                    value={bottleneck.currentLoad}
                    className={`h-2 ${getLoadColor(bottleneck.currentLoad, bottleneck.adjustedThreshold)}`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Normal Load:</span>
                    <span className="ml-2 text-foreground">{bottleneck.normalLoad}%</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Threshold:</span>
                    <span className="ml-2 text-foreground">{bottleneck.adjustedThreshold}%</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-border">
                  <span className="text-xs text-muted-foreground">AI Confidence:</span>
                  <Progress value={bottleneck.confidence} className="flex-1 h-1.5" />
                  <span className="text-xs font-medium text-foreground">{bottleneck.confidence}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Seasonal Trends */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Calendar className="w-5 h-5 text-primary" />
            Seasonal Trend Analysis
          </CardTitle>
          <CardDescription>
            Historical patterns used for predictive threshold adjustments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {seasonalTrends.map((trend, index) => (
              <div
                key={index}
                className="flex items-start justify-between p-4 bg-muted/50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-primary" />
                    <h4 className="font-semibold text-foreground">{trend.period}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{trend.pattern}</p>
                  <p className="text-sm text-foreground">
                    <span className="font-medium">Recommendation:</span> {trend.recommendation}
                  </p>
                </div>
                <Badge
                  variant={trend.impact > 0 ? "destructive" : "secondary"}
                  className="ml-4"
                >
                  {trend.impact > 0 ? "+" : ""}
                  {trend.impact}% impact
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
