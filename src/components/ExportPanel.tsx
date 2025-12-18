import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Download, 
  Share2, 
  MessageSquare, 
  Link, 
  Copy,
  FileJson,
  FileSpreadsheet,
  Image,
  Plus,
  X,
  CheckCircle,
  FileText,
  Table
} from "lucide-react";
import { AggregateMetrics, BottleneckAnalysis } from "@/utils/analytics";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";

interface ExportPanelProps {
  metrics: AggregateMetrics;
  bottlenecks: BottleneckAnalysis[];
}

interface Annotation {
  id: string;
  text: string;
  author: string;
  timestamp: Date;
}

export const ExportPanel = ({ metrics, bottlenecks }: ExportPanelProps) => {
  const [annotations, setAnnotations] = useState<Annotation[]>([
    { id: "1", text: "Queue times need attention in Q1 planning", author: "System", timestamp: new Date() }
  ]);
  const [newAnnotation, setNewAnnotation] = useState("");
  const [shareLink, setShareLink] = useState<string | null>(null);

  const handleExportJSON = () => {
    const exportData = {
      exportDate: new Date().toISOString(),
      metrics,
      bottlenecks: bottlenecks.slice(0, 20), // Top 20
      annotations
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bottleneck-analysis-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("JSON export downloaded");
  };

  const handleExportCSV = () => {
    const headers = ["TaskID", "QueueWaitTime", "ProcessTime", "TotalTime", "BottleneckScore", "RiskLevel"];
    const rows = bottlenecks.map(b => [
      b.taskId,
      b.queueWaitTime,
      b.processTime,
      b.totalTime,
      b.bottleneckScore.toFixed(2),
      b.riskLevel
    ]);
    
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bottleneck-data-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV export downloaded");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();
    
    // Title
    doc.setFontSize(20);
    doc.text("Bottleneck Analysis Report", 20, 20);
    
    // Date
    doc.setFontSize(10);
    doc.text(`Generated: ${date}`, 20, 30);
    
    // Summary Metrics
    doc.setFontSize(14);
    doc.text("Performance Summary", 20, 45);
    doc.setFontSize(11);
    doc.text(`Efficiency Score: ${metrics.efficiencyScore}%`, 25, 55);
    doc.text(`Average Queue Time: ${metrics.avgQueueTime} minutes`, 25, 62);
    doc.text(`Average Process Time: ${metrics.avgProcessTime} minutes`, 25, 69);
    doc.text(`Total Tasks Analyzed: ${metrics.totalTasks}`, 25, 76);
    doc.text(`Critical Bottlenecks: ${metrics.criticalBottlenecks}`, 25, 83);
    
    // Top Bottlenecks Table
    doc.setFontSize(14);
    doc.text("Top 10 Bottlenecks", 20, 100);
    doc.setFontSize(9);
    
    const tableTop = 110;
    doc.text("Task ID", 25, tableTop);
    doc.text("Queue Time", 60, tableTop);
    doc.text("Process Time", 95, tableTop);
    doc.text("Score", 135, tableTop);
    doc.text("Risk", 165, tableTop);
    
    bottlenecks.slice(0, 10).forEach((b, i) => {
      const y = tableTop + 8 + (i * 7);
      doc.text(String(b.taskId), 25, y);
      doc.text(`${b.queueWaitTime}m`, 60, y);
      doc.text(`${b.processTime}m`, 95, y);
      doc.text(b.bottleneckScore.toFixed(1), 135, y);
      doc.text(b.riskLevel, 165, y);
    });
    
    // Annotations
    if (annotations.length > 0) {
      doc.setFontSize(14);
      doc.text("Notes & Annotations", 20, 195);
      doc.setFontSize(9);
      annotations.forEach((a, i) => {
        doc.text(`• ${a.text} (${a.author})`, 25, 205 + (i * 7));
      });
    }
    
    doc.save(`bottleneck-report-${new Date().toISOString().split("T")[0]}.pdf`);
    toast.success("PDF report downloaded");
  };

  const handleExportExcel = () => {
    // Create workbook
    const wb = XLSX.utils.book_new();
    
    // Summary sheet
    const summaryData = [
      ["Bottleneck Analysis Report"],
      ["Generated", new Date().toLocaleDateString()],
      [""],
      ["Performance Summary"],
      ["Efficiency Score", `${metrics.efficiencyScore}%`],
      ["Average Queue Time", `${metrics.avgQueueTime} minutes`],
      ["Average Process Time", `${metrics.avgProcessTime} minutes`],
      ["Total Tasks", metrics.totalTasks],
      ["Critical Bottlenecks", metrics.criticalBottlenecks]
    ];
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summarySheet, "Summary");
    
    // Bottlenecks sheet
    const bottleneckHeaders = ["Task ID", "Queue Time (min)", "Process Time (min)", "Total Time (min)", "Bottleneck Score", "Risk Level"];
    const bottleneckRows = bottlenecks.map(b => [
      b.taskId,
      b.queueWaitTime,
      b.processTime,
      b.totalTime,
      b.bottleneckScore.toFixed(2),
      b.riskLevel
    ]);
    const bottleneckSheet = XLSX.utils.aoa_to_sheet([bottleneckHeaders, ...bottleneckRows]);
    XLSX.utils.book_append_sheet(wb, bottleneckSheet, "Bottlenecks");
    
    // Annotations sheet
    const annotationHeaders = ["Note", "Author", "Date"];
    const annotationRows = annotations.map(a => [a.text, a.author, a.timestamp.toLocaleDateString()]);
    const annotationSheet = XLSX.utils.aoa_to_sheet([annotationHeaders, ...annotationRows]);
    XLSX.utils.book_append_sheet(wb, annotationSheet, "Annotations");
    
    // Download
    XLSX.writeFile(wb, `bottleneck-analysis-${new Date().toISOString().split("T")[0]}.xlsx`);
    toast.success("Excel workbook downloaded");
  };

  const handleGenerateShareLink = () => {
    // Simulate generating a shareable link
    const fakeLink = `https://app.bottleneck.ai/share/${Math.random().toString(36).substring(7)}`;
    setShareLink(fakeLink);
    toast.success("Shareable link generated!");
  };

  const handleCopyLink = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
      toast.success("Link copied to clipboard");
    }
  };

  const handleAddAnnotation = () => {
    if (newAnnotation.trim()) {
      setAnnotations([
        ...annotations,
        {
          id: Date.now().toString(),
          text: newAnnotation,
          author: "You",
          timestamp: new Date()
        }
      ]);
      setNewAnnotation("");
      toast.success("Annotation added");
    }
  };

  const handleRemoveAnnotation = (id: string) => {
    setAnnotations(annotations.filter(a => a.id !== id));
    toast.success("Annotation removed");
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-primary rounded-lg">
            <Share2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg">Export & Collaboration</CardTitle>
            <p className="text-sm text-muted-foreground">Share insights and download reports</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Export Options */}
        <div>
          <h4 className="font-medium text-foreground mb-3">Export Dashboard</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <Button 
              variant="outline" 
              className="flex flex-col h-auto py-4"
              onClick={handleExportPDF}
            >
              <FileText className="w-6 h-6 mb-2 text-destructive" />
              <span className="text-sm">PDF</span>
              <span className="text-xs text-muted-foreground">Report</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex flex-col h-auto py-4"
              onClick={handleExportExcel}
            >
              <Table className="w-6 h-6 mb-2 text-success" />
              <span className="text-sm">Excel</span>
              <span className="text-xs text-muted-foreground">Workbook</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex flex-col h-auto py-4"
              onClick={handleExportJSON}
            >
              <FileJson className="w-6 h-6 mb-2 text-primary" />
              <span className="text-sm">JSON</span>
              <span className="text-xs text-muted-foreground">Full data</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex flex-col h-auto py-4"
              onClick={handleExportCSV}
            >
              <FileSpreadsheet className="w-6 h-6 mb-2 text-warning" />
              <span className="text-sm">CSV</span>
              <span className="text-xs text-muted-foreground">Spreadsheet</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex flex-col h-auto py-4"
              onClick={() => toast.info("Screenshot feature coming soon")}
            >
              <Image className="w-6 h-6 mb-2 text-accent" />
              <span className="text-sm">Image</span>
              <span className="text-xs text-muted-foreground">Snapshot</span>
            </Button>
          </div>
        </div>

        {/* Share Section */}
        <div>
          <h4 className="font-medium text-foreground mb-3">Share Analysis</h4>
          <div className="p-4 bg-muted/50 rounded-lg space-y-3">
            {!shareLink ? (
              <Button onClick={handleGenerateShareLink} className="w-full">
                <Link className="w-4 h-4 mr-2" />
                Generate Shareable Link
              </Button>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input 
                    value={shareLink} 
                    readOnly 
                    className="text-sm"
                  />
                  <Button size="icon" variant="outline" onClick={handleCopyLink}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle className="w-3 h-3 text-success" />
                  Link expires in 7 days
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Annotations */}
        <div>
          <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Annotations
          </h4>
          <div className="space-y-3">
            {annotations.map((annotation) => (
              <div 
                key={annotation.id}
                className="p-3 bg-muted/50 rounded-lg border border-border group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{annotation.text}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-xs">{annotation.author}</Badge>
                      <span>{annotation.timestamp.toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                    onClick={() => handleRemoveAnnotation(annotation.id)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
            
            <div className="flex gap-2">
              <Textarea
                placeholder="Add a note or observation..."
                value={newAnnotation}
                onChange={(e) => setNewAnnotation(e.target.value)}
                className="min-h-[60px] resize-none"
              />
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleAddAnnotation}
              disabled={!newAnnotation.trim()}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Annotation
            </Button>
          </div>
        </div>

        {/* Summary Stats for Export */}
        <div className="p-4 bg-secondary/50 rounded-lg">
          <h4 className="font-medium text-foreground mb-2">Export Summary</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Tasks</span>
              <span className="font-medium text-foreground">{metrics.totalTasks}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Efficiency</span>
              <span className="font-medium text-foreground">{metrics.efficiencyScore}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Annotations</span>
              <span className="font-medium text-foreground">{annotations.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Generated</span>
              <span className="font-medium text-foreground">{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
