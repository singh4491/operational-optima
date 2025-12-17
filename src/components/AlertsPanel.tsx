import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  Bell, 
  AlertTriangle, 
  AlertCircle, 
  Info,
  Clock,
  RefreshCw,
  XCircle,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Settings
} from "lucide-react";
import { Anomaly } from "@/utils/predictions";

interface AlertsPanelProps {
  anomalies: Anomaly[];
}

interface AlertConfig {
  idleTime: boolean;
  reworkLoop: boolean;
  volumeSpike: boolean;
  skippedValidation: boolean;
}

const getAnomalyIcon = (type: Anomaly["type"]) => {
  switch (type) {
    case "idle_time": return <Clock className="w-4 h-4" />;
    case "rework_loop": return <RefreshCw className="w-4 h-4" />;
    case "skipped_validation": return <XCircle className="w-4 h-4" />;
    case "volume_spike": return <TrendingUp className="w-4 h-4" />;
  }
};

const getSeverityStyles = (severity: Anomaly["severity"]) => {
  switch (severity) {
    case "critical": return {
      bg: "bg-destructive/10",
      border: "border-destructive/30",
      icon: "text-destructive",
      badge: "destructive" as const
    };
    case "warning": return {
      bg: "bg-warning/10",
      border: "border-warning/30",
      icon: "text-warning",
      badge: "default" as const
    };
    case "info": return {
      bg: "bg-primary/10",
      border: "border-primary/30",
      icon: "text-primary",
      badge: "secondary" as const
    };
  }
};

const getAnomalyLabel = (type: Anomaly["type"]) => {
  switch (type) {
    case "idle_time": return "Excessive Idle Time";
    case "rework_loop": return "Potential Rework Loop";
    case "skipped_validation": return "Skipped Validation";
    case "volume_spike": return "Volume Spike";
  }
};

export const AlertsPanel = ({ anomalies }: AlertsPanelProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [alertConfig, setAlertConfig] = useState<AlertConfig>({
    idleTime: true,
    reworkLoop: true,
    volumeSpike: true,
    skippedValidation: true
  });

  const filteredAnomalies = anomalies.filter(a => {
    if (a.type === "idle_time" && !alertConfig.idleTime) return false;
    if (a.type === "rework_loop" && !alertConfig.reworkLoop) return false;
    if (a.type === "volume_spike" && !alertConfig.volumeSpike) return false;
    if (a.type === "skipped_validation" && !alertConfig.skippedValidation) return false;
    return true;
  });

  const criticalCount = filteredAnomalies.filter(a => a.severity === "critical").length;
  const warningCount = filteredAnomalies.filter(a => a.severity === "warning").length;

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-lg relative">
              <Bell className="w-5 h-5 text-white" />
              {criticalCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                  {criticalCount}
                </span>
              )}
            </div>
            <div>
              <CardTitle className="text-lg">Alerts & Anomaly Detection</CardTitle>
              <p className="text-sm text-muted-foreground">
                {criticalCount > 0 ? `${criticalCount} critical` : "No critical alerts"}
                {warningCount > 0 && ` • ${warningCount} warnings`}
              </p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowConfig(!showConfig)}
          >
            <Settings className="w-4 h-4 mr-1" />
            Configure
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Alert Configuration */}
        {showConfig && (
          <div className="mb-4 p-4 bg-muted/50 rounded-lg border border-border">
            <h4 className="font-medium mb-3 text-foreground">Alert Thresholds</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Idle Time Alerts</span>
                <Switch 
                  checked={alertConfig.idleTime}
                  onCheckedChange={(checked) => setAlertConfig({...alertConfig, idleTime: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Rework Loop Detection</span>
                <Switch 
                  checked={alertConfig.reworkLoop}
                  onCheckedChange={(checked) => setAlertConfig({...alertConfig, reworkLoop: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Volume Spike Alerts</span>
                <Switch 
                  checked={alertConfig.volumeSpike}
                  onCheckedChange={(checked) => setAlertConfig({...alertConfig, volumeSpike: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Skipped Validation</span>
                <Switch 
                  checked={alertConfig.skippedValidation}
                  onCheckedChange={(checked) => setAlertConfig({...alertConfig, skippedValidation: checked})}
                />
              </div>
            </div>
          </div>
        )}

        {/* Alerts List */}
        <div className="space-y-3">
          {filteredAnomalies.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p>No active alerts</p>
              <p className="text-sm">All systems operating within normal parameters</p>
            </div>
          ) : (
            filteredAnomalies.map((anomaly) => {
              const styles = getSeverityStyles(anomaly.severity);
              const isExpanded = expandedId === anomaly.id;
              
              return (
                <div 
                  key={anomaly.id}
                  className={`p-4 rounded-lg border ${styles.bg} ${styles.border} transition-all`}
                >
                  <div 
                    className="flex items-start justify-between cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : anomaly.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 ${styles.icon}`}>
                        {anomaly.severity === "critical" ? (
                          <AlertTriangle className="w-5 h-5" />
                        ) : anomaly.severity === "warning" ? (
                          <AlertCircle className="w-5 h-5" />
                        ) : (
                          <Info className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-foreground">{getAnomalyLabel(anomaly.type)}</span>
                          <Badge variant={styles.badge}>{anomaly.severity}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{anomaly.message}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getAnomalyIcon(anomaly.type)}
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-border/50">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Threshold</p>
                          <p className="font-medium text-foreground">{Math.round(anomaly.threshold)}m</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Actual Value</p>
                          <p className="font-medium text-foreground">{Math.round(anomaly.actualValue)}m</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Affected Tasks</p>
                          <p className="font-medium text-foreground">{anomaly.taskIds.length} tasks</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm text-muted-foreground mb-1">Task IDs:</p>
                        <div className="flex flex-wrap gap-1">
                          {anomaly.taskIds.slice(0, 10).map(id => (
                            <Badge key={id} variant="outline" className="text-xs">
                              #{id}
                            </Badge>
                          ))}
                          {anomaly.taskIds.length > 10 && (
                            <Badge variant="outline" className="text-xs">
                              +{anomaly.taskIds.length - 10} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};
