import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Plug, FileCode, CheckCircle, Clock, ExternalLink, Search, Building2, ShoppingCart, HeartPulse, Factory, Truck } from "lucide-react";
import { toast } from "sonner";

interface Integration {
  id: string;
  name: string;
  type: "CRM" | "ERP" | "WFM" | "Custom";
  description: string;
  status: "connected" | "available" | "coming_soon";
  icon: string;
  features: string[];
}

interface WorkflowTemplate {
  id: string;
  name: string;
  industry: string;
  industryIcon: React.ComponentType<{ className?: string }>;
  description: string;
  steps: number;
  avgTime: string;
  popularity: "high" | "medium" | "low";
  tags: string[];
}

export const IntegrationTemplates = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);

  const integrations: Integration[] = [
    {
      id: "salesforce",
      name: "Salesforce",
      type: "CRM",
      description: "Sync customer data and track sales pipeline bottlenecks",
      status: "available",
      icon: "☁️",
      features: ["Lead routing analysis", "Opportunity stage tracking", "Support ticket monitoring"],
    },
    {
      id: "hubspot",
      name: "HubSpot",
      type: "CRM",
      description: "Analyze marketing and sales funnel efficiency",
      status: "available",
      icon: "🔶",
      features: ["Contact lifecycle stages", "Deal pipeline analysis", "Email workflow tracking"],
    },
    {
      id: "sap",
      name: "SAP ERP",
      type: "ERP",
      description: "Enterprise resource planning integration for manufacturing",
      status: "available",
      icon: "📊",
      features: ["Order processing", "Inventory management", "Production scheduling"],
    },
    {
      id: "oracle",
      name: "Oracle NetSuite",
      type: "ERP",
      description: "Cloud ERP for financial and operational workflows",
      status: "available",
      icon: "🔴",
      features: ["Financial close process", "Procurement cycle", "Revenue recognition"],
    },
    {
      id: "workday",
      name: "Workday",
      type: "WFM",
      description: "HR and workforce management analytics",
      status: "connected",
      icon: "👥",
      features: ["Hiring workflow", "Employee onboarding", "Performance reviews"],
    },
    {
      id: "servicenow",
      name: "ServiceNow",
      type: "WFM",
      description: "IT service management workflow optimization",
      status: "available",
      icon: "🎫",
      features: ["Incident management", "Change requests", "Service catalog"],
    },
    {
      id: "jira",
      name: "Jira",
      type: "WFM",
      description: "Agile project management bottleneck detection",
      status: "available",
      icon: "📋",
      features: ["Sprint velocity", "Issue cycle time", "Backlog analysis"],
    },
    {
      id: "custom-api",
      name: "Custom API",
      type: "Custom",
      description: "Connect your proprietary systems via REST API",
      status: "available",
      icon: "🔌",
      features: ["Webhook support", "Custom data mapping", "Real-time sync"],
    },
  ];

  const workflowTemplates: WorkflowTemplate[] = [
    {
      id: "retail-order",
      name: "Retail Order Fulfillment",
      industry: "Retail",
      industryIcon: ShoppingCart,
      description: "End-to-end order processing from placement to delivery",
      steps: 8,
      avgTime: "2-5 days",
      popularity: "high",
      tags: ["e-commerce", "logistics", "inventory"],
    },
    {
      id: "healthcare-intake",
      name: "Patient Intake Process",
      industry: "Healthcare",
      industryIcon: HeartPulse,
      description: "Patient registration and initial assessment workflow",
      steps: 6,
      avgTime: "45 min",
      popularity: "high",
      tags: ["compliance", "scheduling", "documentation"],
    },
    {
      id: "manufacturing-qa",
      name: "Manufacturing QA Pipeline",
      industry: "Manufacturing",
      industryIcon: Factory,
      description: "Quality assurance checks from raw materials to finished goods",
      steps: 12,
      avgTime: "4-8 hours",
      popularity: "medium",
      tags: ["quality control", "inspection", "batch processing"],
    },
    {
      id: "finance-approval",
      name: "Financial Approval Chain",
      industry: "Finance",
      industryIcon: Building2,
      description: "Multi-tier approval workflow for financial transactions",
      steps: 5,
      avgTime: "1-3 days",
      popularity: "high",
      tags: ["compliance", "audit trail", "authorization"],
    },
    {
      id: "logistics-shipping",
      name: "Logistics & Shipping",
      industry: "Logistics",
      industryIcon: Truck,
      description: "Package routing and delivery optimization workflow",
      steps: 10,
      avgTime: "1-7 days",
      popularity: "medium",
      tags: ["routing", "tracking", "delivery"],
    },
    {
      id: "hr-onboarding",
      name: "Employee Onboarding",
      industry: "HR",
      industryIcon: Building2,
      description: "New hire setup from offer acceptance to productivity",
      steps: 15,
      avgTime: "30 days",
      popularity: "high",
      tags: ["compliance", "training", "equipment"],
    },
  ];

  const handleConnect = (integration: Integration) => {
    if (integration.status === "coming_soon") {
      toast.info(`${integration.name} integration coming soon!`);
      return;
    }
    if (integration.status === "connected") {
      toast.success(`${integration.name} is already connected`);
      return;
    }
    toast.success(`Connecting to ${integration.name}...`, {
      description: "OAuth flow would open here",
    });
  };

  const handleUseTemplate = (template: WorkflowTemplate) => {
    toast.success(`Template "${template.name}" applied!`, {
      description: `${template.steps} workflow steps configured`,
    });
  };

  const filteredIntegrations = integrations.filter(
    (int) =>
      int.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      int.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTemplates = workflowTemplates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesIndustry = !selectedIndustry || template.industry === selectedIndustry;
    return matchesSearch && matchesIndustry;
  });

  const industries = [...new Set(workflowTemplates.map((t) => t.industry))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Plug className="w-5 h-5 text-primary" />
            Integration & Templates
          </CardTitle>
          <CardDescription>
            Pre-built connectors for CRM/ERP/WFM systems and industry-specific workflow templates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search integrations and templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="integrations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-grid">
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Plug className="w-4 h-4" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FileCode className="w-4 h-4" />
            Workflow Templates
          </TabsTrigger>
        </TabsList>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-6">
          {/* Integration Types */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["CRM", "ERP", "WFM", "Custom"].map((type) => (
              <Card
                key={type}
                className="bg-card border-border text-center p-4 cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => setSearchTerm(type)}
              >
                <h4 className="font-semibold text-foreground">{type}</h4>
                <p className="text-sm text-muted-foreground">
                  {integrations.filter((i) => i.type === type).length} available
                </p>
              </Card>
            ))}
          </div>

          {/* Integration Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredIntegrations.map((integration) => (
              <Card
                key={integration.id}
                className={`bg-card border-2 ${
                  integration.status === "connected"
                    ? "border-success/50"
                    : "border-border"
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{integration.icon}</span>
                      <div>
                        <h4 className="font-semibold text-foreground">{integration.name}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {integration.type}
                        </Badge>
                      </div>
                    </div>
                    {integration.status === "connected" && (
                      <Badge variant="default" className="bg-success text-success-foreground gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Connected
                      </Badge>
                    )}
                    {integration.status === "coming_soon" && (
                      <Badge variant="secondary" className="gap-1">
                        <Clock className="w-3 h-3" />
                        Coming Soon
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">
                    {integration.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    {integration.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <Button
                      variant={integration.status === "connected" ? "outline" : "default"}
                      size="sm"
                      onClick={() => handleConnect(integration)}
                      disabled={integration.status === "coming_soon"}
                    >
                      {integration.status === "connected" ? "Configure" : "Connect"}
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                    {integration.status === "connected" && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Sync Active</span>
                        <Switch defaultChecked />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          {/* Industry Filter */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedIndustry === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedIndustry(null)}
            >
              All Industries
            </Button>
            {industries.map((industry) => (
              <Button
                key={industry}
                variant={selectedIndustry === industry ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedIndustry(industry)}
              >
                {industry}
              </Button>
            ))}
          </div>

          {/* Template Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="bg-card border-border hover:border-primary/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/20 rounded-lg">
                        <template.industryIcon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground text-sm">{template.name}</h4>
                        <Badge variant="outline" className="text-xs mt-1">
                          {template.industry}
                        </Badge>
                      </div>
                    </div>
                    <Badge
                      variant={
                        template.popularity === "high"
                          ? "default"
                          : template.popularity === "medium"
                          ? "secondary"
                          : "outline"
                      }
                      className="text-xs"
                    >
                      {template.popularity === "high" ? "Popular" : template.popularity === "medium" ? "Trending" : "New"}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">{template.description}</p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <FileCode className="w-3 h-3" />
                      {template.steps} steps
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {template.avgTime}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {template.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Button
                    variant="default"
                    size="sm"
                    className="w-full"
                    onClick={() => handleUseTemplate(template)}
                  >
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
