import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Check } from "lucide-react";
import { toast } from "sonner";

interface RecommendationFeedbackProps {
  recommendationId: string;
  onFeedback?: (id: string, helpful: boolean) => void;
}

export const RecommendationFeedback = ({ recommendationId, onFeedback }: RecommendationFeedbackProps) => {
  const [feedback, setFeedback] = useState<"helpful" | "not_helpful" | null>(null);

  const handleFeedback = (isHelpful: boolean) => {
    setFeedback(isHelpful ? "helpful" : "not_helpful");
    onFeedback?.(recommendationId, isHelpful);
    toast.success(isHelpful ? "Thanks for the feedback!" : "We'll improve this recommendation");
  };

  if (feedback) {
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Check className="w-3 h-3 text-success" />
        <span>Feedback recorded</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground">Was this helpful?</span>
      <Button
        variant="ghost"
        size="sm"
        className="h-7 px-2 hover:text-success hover:bg-success/10"
        onClick={() => handleFeedback(true)}
      >
        <ThumbsUp className="w-3 h-3 mr-1" />
        <span className="text-xs">Yes</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-7 px-2 hover:text-destructive hover:bg-destructive/10"
        onClick={() => handleFeedback(false)}
      >
        <ThumbsDown className="w-3 h-3 mr-1" />
        <span className="text-xs">No</span>
      </Button>
    </div>
  );
};
