import { Card } from "@/components/ui/card";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { BottleneckAnalysis } from "@/utils/analytics";

interface BottleneckChartProps {
  data: BottleneckAnalysis[];
}

export const BottleneckChart = ({ data }: BottleneckChartProps) => {
  const chartData = data.map(item => ({
    x: item.queueWaitTime,
    y: item.processTime,
    taskId: item.taskId,
    riskLevel: item.riskLevel,
  }));

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "critical": return "hsl(var(--destructive))";
      case "high": return "hsl(var(--warning))";
      case "medium": return "hsl(var(--accent))";
      default: return "hsl(var(--success))";
    }
  };

  return (
    <Card className="p-6 bg-card border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4">Bottleneck Distribution Analysis</h3>
      <p className="text-sm text-muted-foreground mb-6">Queue Wait Time vs Process Duration</p>
      
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            type="number" 
            dataKey="x" 
            name="Queue Wait Time"
            stroke="hsl(var(--muted-foreground))"
            label={{ value: 'Queue Wait Time (min)', position: 'insideBottom', offset: -10, fill: 'hsl(var(--foreground))' }}
          />
          <YAxis 
            type="number" 
            dataKey="y" 
            name="Process Duration"
            stroke="hsl(var(--muted-foreground))"
            label={{ value: 'Process Duration (min)', angle: -90, position: 'insideLeft', fill: 'hsl(var(--foreground))' }}
          />
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }}
            contentStyle={{ 
              backgroundColor: 'hsl(var(--popover))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              color: 'hsl(var(--popover-foreground))'
            }}
            formatter={(value: number, name: string) => [
              `${value} min`,
              name === 'x' ? 'Queue Time' : 'Process Time'
            ]}
          />
          <Scatter name="Tasks" data={chartData} fill="hsl(var(--primary))">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getRiskColor(entry.riskLevel)} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>

      <div className="flex items-center justify-center gap-6 mt-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getRiskColor("low") }} />
          <span className="text-xs text-muted-foreground">Low Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getRiskColor("medium") }} />
          <span className="text-xs text-muted-foreground">Medium Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getRiskColor("high") }} />
          <span className="text-xs text-muted-foreground">High Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getRiskColor("critical") }} />
          <span className="text-xs text-muted-foreground">Critical</span>
        </div>
      </div>
    </Card>
  );
};
