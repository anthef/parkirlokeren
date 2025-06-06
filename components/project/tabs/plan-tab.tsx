"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Download,
  FileText,
  TrendingUp,
  Target,
  Shield,
  Calendar,
} from "lucide-react";
import { Project } from "../types";

interface PlanTabProps {
  project: Project;
}

// Helper function to parse JSON strings safely
const parseJsonSafely = (jsonString: string | null) => {
  if (!jsonString) return null;
  try {
    return JSON.parse(jsonString);
  } catch {
    return null;
  }
};

export function PlanTab({ project }: PlanTabProps) {
  const implementationTimeline = parseJsonSafely(
    project.implementation_timeline as string
  );
  const digitalMarketing = parseJsonSafely(project.digital_marketing as string);
  const physicalMarketing = parseJsonSafely(
    project.physical_marketing as string
  );
  const mainRisks = parseJsonSafely(project.main_risks as string) || [];
  const riskMitigations =
    parseJsonSafely(project.risk_mitigations as string) || [];

  const planSections = [
    {
      title: "Executive Summary",
      content: project.executive_summary || "Not generated yet",
      key: "executive_summary",
      icon: FileText,
    },
    {
      title: "Business Model",
      content: project.business_model || "Not generated yet",
      key: "business_model",
      icon: TrendingUp,
    },
    {
      title: "Marketing Strategy",
      content: {
        brand_positioning: project.brand_positioning || "Not defined yet",
        digital_marketing: digitalMarketing || [],
        physical_marketing: physicalMarketing || [],
      },
      key: "marketing_strategy",
      icon: Target,
    },
    {
      title: "Financial Projections",
      content: {
        initial_investment: project.initial_investment,
        break_even_point: project.break_event_point,
        profit_margin: project.profit_margin,
        revenue_streams:
          parseJsonSafely(project.revenue_streams as string) || [],
      },
      key: "financial_projections",
      icon: TrendingUp,
    },
    {
      title: "Risk Analysis",
      content: {
        main_risks: mainRisks,
        risk_mitigations: riskMitigations,
      },
      key: "risk_analysis",
      icon: Shield,
    },
  ];

  const renderMarketingStrategy = (content: any) => (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium mb-2">Brand Positioning</h4>
        <p className="text-muted-foreground">{content.brand_positioning}</p>
      </div>
      <div>
        <h4 className="font-medium mb-2">Digital Marketing</h4>
        {Array.isArray(content.digital_marketing) &&
        content.digital_marketing.length > 0 ? (
          <ul className="list-disc pl-5 text-muted-foreground">
            {content.digital_marketing.map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground italic">
            No strategies defined yet
          </p>
        )}
      </div>
      <div>
        <h4 className="font-medium mb-2">Physical Marketing</h4>
        {Array.isArray(content.physical_marketing) &&
        content.physical_marketing.length > 0 ? (
          <ul className="list-disc pl-5 text-muted-foreground">
            {content.physical_marketing.map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground italic">
            No strategies defined yet
          </p>
        )}
      </div>
    </div>
  );

  const renderFinancialProjections = (content: any) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded-md p-4">
          <h4 className="font-medium mb-1">Initial Investment</h4>
          <span className="text-2xl font-bold">
            ${content.initial_investment || 0}
          </span>
        </div>
        <div className="border rounded-md p-4">
          <h4 className="font-medium mb-1">Break-even Point</h4>
          <span className="text-2xl font-bold">
            {content.break_even_point
              ? `${content.break_even_point} months`
              : "TBD"}
          </span>
        </div>
        <div className="border rounded-md p-4">
          <h4 className="font-medium mb-1">Profit Margin</h4>
          <span className="text-2xl font-bold">
            {content.profit_margin ? `${content.profit_margin}%` : "TBD"}
          </span>
        </div>
      </div>
      {Array.isArray(content.revenue_streams) &&
        content.revenue_streams.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Revenue Streams</h4>
            <div className="space-y-2">
              {content.revenue_streams.map((stream: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between border rounded-md p-2"
                >
                  <span>{stream.stream}</span>
                  <Badge variant="outline">{stream.percentage}%</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
    </div>
  );

  const renderRiskAnalysis = (content: any) => (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium mb-2">Main Risks</h4>
        {Array.isArray(content.main_risks) && content.main_risks.length > 0 ? (
          <ul className="list-disc pl-5 text-muted-foreground space-y-1">
            {content.main_risks.map((risk: string, index: number) => (
              <li key={index}>{risk}</li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground italic">
            No risks identified yet
          </p>
        )}
      </div>
      <div>
        <h4 className="font-medium mb-2">Risk Mitigation Strategies</h4>
        {Array.isArray(content.risk_mitigations) &&
        content.risk_mitigations.length > 0 ? (
          <ul className="list-disc pl-5 text-muted-foreground space-y-1">
            {content.risk_mitigations.map(
              (mitigation: string, index: number) => (
                <li key={index}>{mitigation}</li>
              )
            )}
          </ul>
        ) : (
          <p className="text-muted-foreground italic">
            No mitigation strategies defined yet
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 overflow-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Business Plan</h2>
        <Badge variant={project.status === "SUCCESS" ? "default" : "secondary"}>
          {project.status === "SUCCESS" ? "Complete" : "In Progress"}
        </Badge>
      </div>

      {planSections.map((section, index) => (
        <Card key={section.key}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">
                {index + 1}
              </span>
              <section.icon className="h-5 w-5" />
              {section.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {section.key === "marketing_strategy" ? (
              renderMarketingStrategy(section.content)
            ) : section.key === "financial_projections" ? (
              renderFinancialProjections(section.content)
            ) : section.key === "risk_analysis" ? (
              renderRiskAnalysis(section.content)
            ) : typeof section.content === "string" ? (
              section.content === "Not generated yet" ? (
                <p className="text-muted-foreground italic">
                  {section.content}
                </p>
              ) : (
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap">{section.content}</p>
                </div>
              )
            ) : (
              <p className="text-muted-foreground italic">
                Content not available
              </p>
            )}
          </CardContent>
        </Card>
      ))}

      {implementationTimeline && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Implementation Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            {implementationTimeline.timeline &&
            Array.isArray(implementationTimeline.timeline) ? (
              <div className="space-y-4">
                {implementationTimeline.timeline.map(
                  (item: any, index: number) => (
                    <div key={index} className="border rounded-md p-4">
                      <h4 className="font-medium flex items-center mb-3">
                        <Badge className="mr-2">{item.period}</Badge>
                        <span className="text-muted-foreground">
                          {item.phase}
                        </span>
                      </h4>
                      {item.tasks && Array.isArray(item.tasks) && (
                        <ul className="list-disc pl-5 text-muted-foreground mt-2 space-y-1">
                          {item.tasks.map((task: string, idx: number) => (
                            <li key={idx}>{task}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )
                )}
              </div>
            ) : (
              <p className="text-muted-foreground italic">
                No timeline available
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
