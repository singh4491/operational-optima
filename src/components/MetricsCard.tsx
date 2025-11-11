import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  variant?: "default" | "warning" | "success" | "critical";
}

export const MetricsCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend = "neutral",
  variant = "default" 
}: MetricsCardProps) => {
  const variantStyles = {
    default: "from-card to-card/50 border-border",
    warning: "from-warning/10 to-warning/5 border-warning/30",
    success: "from-success/10 to-success/5 border-success/30",
    critical: "from-destructive/10 to-destructive/5 border-destructive/30",
  };

  const iconStyles = {
    default: "text-primary",
    warning: "text-warning",
    success: "text-success",
    critical: "text-destructive",
  };

  return (
    <Card className={cn(
      "p-6 bg-gradient-to-br border-2 transition-all duration-300 hover:shadow-glow hover:scale-[1.02]",
      variantStyles[variant]
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold text-foreground mb-2">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className={cn(
          "p-3 rounded-xl bg-background/50 backdrop-blur-sm",
          iconStyles[variant]
        )}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  );
};
