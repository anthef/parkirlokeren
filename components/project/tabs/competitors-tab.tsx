"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ExternalLink,
  Building,
  TrendingUp,
  AlertTriangle,
  Target,
  Zap,
} from "lucide-react";
import {
  Project,
  CompetitorLink,
  SwotAnalysis,
  DifferentiationTable,
} from "../types";

interface CompetitorsTabProps {
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

export function CompetitorsTab({ project }: CompetitorsTabProps) {
  const competitorLinks: CompetitorLink[] =
    parseJsonSafely(project.competitor_links as string) || [];
  const swotAnalysis: SwotAnalysis = parseJsonSafely(
    project.swot_analysis as string
  );
  const differentiation: DifferentiationTable = parseJsonSafely(
    project.differentiation as string
  );

  return (
    <div className="space-y-6 overflow-auto">
      <div>
        <h2 className="text-2xl font-bold mb-2">Competitive Analysis</h2>
        <p className="text-muted-foreground">
          Understand your competitive landscape and positioning
        </p>
      </div>

      {/* Key Competitors */}
      <Card>
        {/* <button onClick={() => console.log(project)}>test</button> */}
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Key Competitors
          </CardTitle>
        </CardHeader>
        <CardContent>
          {project.key_competitors ? (
            <p className="whitespace-pre-wrap">{project.key_competitors}</p>
          ) : (
            <p className="text-muted-foreground italic">Not identified yet</p>
          )}
        </CardContent>
      </Card>

      {/* Competitor Links Section */}
      {competitorLinks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              Direct Competitor Links
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {competitorLinks.map((competitor, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">{competitor.name}</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    {competitor.description}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(competitor.website, "_blank")}
                    className="w-full"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Visit {competitor.name}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* SWOT Analysis - 2x2 Grid */}
      {swotAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              SWOT Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {/* Strengths */}
              <div className="border rounded-lg p-4 bg-green-50 border-green-200">
                <h4 className="font-medium mb-3 flex items-center gap-2 text-green-700">
                  <TrendingUp className="h-4 w-4" />
                  Strengths
                </h4>
                <ul className="space-y-2">
                  {swotAnalysis.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-green-600 mt-1">•</span>
                      <span className="dark:text-primary-foreground">
                        {strength}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="border rounded-lg p-4 bg-red-50 border-red-200">
                <h4 className="font-medium mb-3 flex items-center gap-2 text-red-700">
                  <AlertTriangle className="h-4 w-4" />
                  Weaknesses
                </h4>
                <ul className="space-y-2">
                  {swotAnalysis.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-red-600 mt-1">•</span>
                      <span className="dark:text-primary-foreground">
                        {weakness}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Opportunities */}
              <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
                <h4 className="font-medium mb-3 flex items-center gap-2 text-blue-700">
                  <Zap className="h-4 w-4" />
                  Opportunities
                </h4>
                <ul className="space-y-2">
                  {swotAnalysis.opportunities.map((opportunity, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-blue-600 mt-1">•</span>
                      <span className="dark:text-primary-foreground">
                        {opportunity}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Threats */}
              <div className="border rounded-lg p-4 bg-yellow-50 border-yellow-200">
                <h4 className="font-medium mb-3 flex items-center gap-2 text-yellow-700">
                  <AlertTriangle className="h-4 w-4" />
                  Threats
                </h4>
                <ul className="space-y-2">
                  {swotAnalysis.threats.map((threat, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-yellow-600 mt-1">•</span>
                      <span className="dark:text-primary-foreground">
                        {threat}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Differentiation Table */}
      {differentiation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              How Your Business Compares
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-gray-300 p-3 text-left font-medium">
                      Feature
                    </th>
                    <th className="border border-gray-300 p-3 text-left font-medium text-primary">
                      Your Business
                    </th>
                    <th className="border border-gray-300 p-3 text-left font-medium">
                      Competitors
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {differentiation.comparison_table.map((row, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-muted/50" : "bg-muted"}
                    >
                      <td className="border border-gray-300 p-3 font-medium">
                        {row.feature}
                      </td>
                      <td className="border border-gray-300 p-3 text-primary">
                        {row.your_business}
                      </td>
                      <td className="border border-gray-300 p-3">
                        {row.competitors}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
