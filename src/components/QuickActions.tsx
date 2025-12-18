import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Lightbulb, 
  TrendingUp, 
  Download,
  Play
} from "lucide-react";
import { toast } from "sonner";

interface QuickActionsProps {
  onGenerateReport?: () => void;
  onRunSimulation?: () => void;
}

export const QuickActions = ({ onGenerateReport, onRunSimulation }: QuickActionsProps) => {
  const handleGenerateReport = () => {
    toast.info("Generating optimization report...", { duration: 2000 });
    setTimeout(() => {
      toast.success("Report generated! Check the Export tab.");
      onGenerateReport?.();
    }, 2000);
  };

  const handleSuggestPlan = () => {
    toast.info("Analyzing workflow patterns...", { duration: 2000 });
    setTimeout(() => {
      toast.success("Improvement plan ready! Check Predictive AI tab.");
    }, 2000);
  };

  const handleRunSimulation = () => {
    toast.info("Starting simulation...", { duration: 1500 });
    setTimeout(() => {
      toast.success("Simulation ready! View results in Simulation tab.");
      onRunSimulation?.();
    }, 1500);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleGenerateReport}
        className="gap-2"
      >
        <FileText className="w-4 h-4" />
        Generate Report
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleSuggestPlan}
        className="gap-2"
      >
        <Lightbulb className="w-4 h-4" />
        Suggest Improvement Plan
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleRunSimulation}
        className="gap-2"
      >
        <Play className="w-4 h-4" />
        Run Quick Simulation
      </Button>
    </div>
  );
};
