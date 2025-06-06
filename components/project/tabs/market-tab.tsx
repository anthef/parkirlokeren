"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ExternalLink,
  TrendingUp,
  Users,
  Target,
  AlertCircle,
  BarChart,
  DollarSign,
  PieChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Project, MarketStatistic, TamSamSom, DemandForecast } from "../types";

interface MarketTabProps {
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

// TAM/SAM/SOM Overlapping Circles Component
const TamSamSomCircles = ({ tamSamSom }: { tamSamSom: TamSamSom }) => {
  return (
    <div className="flex items-center justify-center h-64 relative overflow-visible">
      <svg width="400" height="400" viewBox="0 0 300 250">
        {/* TAM Circle (Largest, Blue) */}
        <circle
          cx="150"
          cy="125"
          r="100"
          fill="rgba(59, 130, 246, 0.2)"
          stroke="#3b82f6"
          strokeWidth="2"
          className="-translate-y-[5%]"
        />
        <text
          x="80"
          y="70"
          className="text-sm font-medium fill-blue-600 -translate-y-[100%]"
        >
          TAM
        </text>

        {/* SAM Circle (Medium, Cyan) */}
        <circle
          cx="150"
          cy="125"
          r="70"
          fill="rgba(6, 182, 212, 0.25)"
          stroke="#06b6d4"
          strokeWidth="2"
          className="-translate-y-[3%]"
        />
        <text x="110" y="90" className="text-sm font-medium fill-cyan-600">
          SAM
        </text>

        {/* SOM Circle (Smallest, Green) */}
        <circle
          cx="150"
          cy="125"
          r="30"
          fill="rgba(16, 185, 129, 0.3)"
          stroke="#10b981"
          strokeWidth="2"
          className="translate-y-[1%]"
        />
        <text x="130" y="130" className="text-sm font-medium fill-emerald-600">
          SOM
        </text>
      </svg>
    </div>
  );
};

export function MarketTab({ project }: MarketTabProps) {
  const marketStatistics: MarketStatistic[] =
    parseJsonSafely(project.market_statistics as string) || [];
  const tamSamSom: TamSamSom = parseJsonSafely(project.tam_sam_som as string);
  const demandForecast: DemandForecast = parseJsonSafely(
    project.demand_forecast as string
  );

  const marketDataLeft = [
    {
      title: "Market Size & Trends",
      content: project.market_size || "Not analyzed yet",
      icon: TrendingUp,
    },
    {
      title: "Customer Personas",
      content: project.customer_personas || "Not defined yet",
      icon: Users,
    },
  ];

  const marketDataRight = [
    {
      title: "Target Audience",
      content: project.target_audience || "Not defined yet",
      icon: Target,
    },
    {
      title: "Key Pain Points",
      content: project.pain_points || "Not identified yet",
      icon: AlertCircle,
    },
  ];

  return (
    <div className="space-y-6 overflow-auto">
      <div>
        <h2 className="text-2xl font-bold mb-2">Market Analysis</h2>
        <p className="text-muted-foreground">
          Understand your target market and identify opportunities
        </p>
      </div>

      {/* Market Statistics Section */}
      {marketStatistics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Key Market Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {marketStatistics.map((stat, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium">{stat.metric}</h4>
                    <Badge variant="outline">{stat.source}</Badge>
                  </div>
                  <p className="text-2xl font-bold text-primary mb-2">
                    {stat.value}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 bg-muted text-primary "
                    onClick={() => window.open(stat.link, "_blank")}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Verify Source
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAM/SAM/SOM Analysis - 2 columns wide */}
      {tamSamSom && (
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Market Size Analysis (TAM/SAM/SOM)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6 items-center">
              {/* Text Explanations */}
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <h4 className="font-medium">
                      TAM (Total Addressable Market)
                    </h4>
                  </div>
                  <p className="text-2xl font-bold text-blue-500 mb-1">
                    {tamSamSom.tam.value}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {tamSamSom.tam.description}
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 bg-cyan-500 rounded"></div>
                    <h4 className="font-medium">
                      SAM (Serviceable Addressable Market)
                    </h4>
                  </div>
                  <p className="text-2xl font-bold text-cyan-500 mb-1">
                    {tamSamSom.sam.value}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {tamSamSom.sam.description}
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 bg-emerald-500 rounded"></div>
                    <h4 className="font-medium">
                      SOM (Serviceable Obtainable Market)
                    </h4>
                  </div>
                  <p className="text-2xl font-bold text-emerald-500 mb-1">
                    {tamSamSom.som.value}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {tamSamSom.som.description}
                  </p>
                </div>
              </div>

              {/* Overlapping Circles Visualization */}
              <div className="flex flex-col items-center">
                <TamSamSomCircles tamSamSom={tamSamSom} />
                <div className="mt-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Concentric circles show the relationship between market
                    sizes
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Demand Forecast - 2 columns wide */}
      {demandForecast && (
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Demand Forecast & Growth Predictions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Growth Chart */}
              <div>
                <h4 className="font-medium mb-4">Revenue Growth Prediction</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={demandForecast.growth_predictions}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip
                        formatter={(value: any, name: string) => {
                          if (name === "revenue")
                            return [`$${value.toLocaleString()}`, "Revenue"];
                          if (name === "users")
                            return [value.toLocaleString(), "Users"];
                          if (name === "growth_rate")
                            return [`${value}%`, "Growth Rate"];
                          return [value, name];
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#3b82f6"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="users"
                        stroke="#06b6d4"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Text Summary and Key Drivers */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Market Demand Summary</h4>
                  <p className="text-muted-foreground">
                    {demandForecast.summary}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Key Growth Drivers</h4>
                  <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                    {demandForecast.key_drivers.map((driver, index) => (
                      <li key={index}>{driver}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Growth Milestones</h4>
                  <div className="space-y-2">
                    {demandForecast.growth_predictions.map(
                      (prediction, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center border rounded p-2"
                        >
                          <span className="text-sm font-medium">
                            {prediction.period}
                          </span>
                          <div className="text-right">
                            <p className="text-sm text-primary font-bold">
                              ${prediction.revenue.toLocaleString()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {prediction.users.toLocaleString()} users
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Two Column Layout for Market Data */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {marketDataLeft.map((item, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <item.icon className="h-5 w-5 text-primary" />
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {item.content.includes("Not ") ? (
                  <p className="text-muted-foreground italic">{item.content}</p>
                ) : (
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-wrap">{item.content}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {marketDataRight.map((item, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <item.icon className="h-5 w-5 text-primary" />
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {item.content.includes("Not ") ? (
                  <p className="text-muted-foreground italic">{item.content}</p>
                ) : (
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-wrap">{item.content}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
