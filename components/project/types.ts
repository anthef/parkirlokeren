export interface Message {
  role: "assistant" | "user";
  content: string;
  timestamp: string;
  metadata?: {
    tokens?: number;
    promptTokens?: number;
    completionTokens?: number;
    model?: string;
    finishReason?: string;
    processingTime?: number;
    sentimentScore?: number;
    isWelcomeMessage?: boolean;
  };
}

export interface ConversationAnalytics {
  totalMessages: number;
  userMessages: number;
  assistantMessages: number;
  averageResponseTime: number;
  topCategories: { [key: string]: number };
  averageSentiment: number;
}

export interface MarketStatistic {
  metric: string;
  value: string;
  source: string;
  link: string;
}

export interface CompetitorLink {
  name: string;
  website: string;
  description: string;
}

export interface LearningMaterial {
  title: string;
  description: string;
  url: string;
  type: string;
}

export interface Tool {
  name: string;
  description: string;
  url: string;
  category: string;
}

export interface TamSamSom {
  tam: {
    value: string;
    description: string;
  };
  sam: {
    value: string;
    description: string;
  };
  som: {
    value: string;
    description: string;
  };
}

export interface DemandForecast {
  summary: string;
  growth_predictions: {
    period: string;
    users: number;
    revenue: number;
    growth_rate: number;
  }[];
  key_drivers: string[];
}

export interface SwotAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface DifferentiationTable {
  comparison_table: {
    feature: string;
    your_business: string;
    competitors: string;
  }[];
}

export interface Project {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  description: string;
  market_size?: string;
  target_audience?: string;
  initial_investment?: number;
  break_event_point?: number;
  profit_margin?: number;
  revenue_streams?: Record<string, any>[] | string;
  growth_opportunities?: string[] | string;
  operational_requirements?: Record<string, any> | string;
  executive_summary?: string;
  implementation_timeline?: Record<string, any> | string;
  brand_positioning?: string;
  digital_marketing?: string[] | string;
  physical_marketing?: string[] | string;
  business_structure?: string;
  required_permits_licenses?: string[] | string;
  insurance_needs?: string[] | string;
  user_id: string;
  status: "SUCCESS" | "IN_PROGRESS" | "CANCELLED";
  investment_required?: string;
  time_commitment?: string;
  risk_level?: string;
  potential_returns?: string;
  business_model?: string;
  customer_personas?: string;
  pain_points?: string;
  key_competitors?: string;
  citations?: string;

  // Updated structured fields
  demand_forecast?: string; // JSON string of DemandForecast
  tam_sam_som?: string; // JSON string of TamSamSom
  market_statistics?: string; // JSON string of MarketStatistic[]
  main_risks?: string; // JSON string of string[]
  risk_mitigations?: string; // JSON string of string[]
  swot_analysis?: string; // JSON string of SwotAnalysis
  differentiation?: string; // JSON string of DifferentiationTable
  competitor_links?: string; // JSON string of CompetitorLink[]
  learning_materials?: string; // JSON string of LearningMaterial[]
  tools?: string; // JSON string of Tool[]
}
