import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// Helper function to process project data
function processProjectDetails(rawDetails: any) {
  const projectDetails: Record<string, any> = {};

  // Helper function to safely convert to integer
  const safeToInt = (value: any): number | null => {
    if (value === null || value === undefined) return null;
    const num = typeof value === "string" ? parseFloat(value) : value;
    return isNaN(num) ? null : Math.round(num);
  };

  // Helper function to safely convert to number
  const safeToNumber = (value: any): number | null => {
    if (value === null || value === undefined) return null;
    const num = typeof value === "string" ? parseFloat(value) : value;
    return isNaN(num) ? null : num;
  };

  // Handle market_analysis fields
  if (rawDetails.market_analysis) {
    projectDetails.market_size = rawDetails.market_analysis.market_size;
    projectDetails.target_audience = rawDetails.market_analysis.target_audience;
    projectDetails.customer_personas =
      rawDetails.market_analysis.customer_personas;
    projectDetails.pain_points = rawDetails.market_analysis.pain_points;
    projectDetails.demand_forecast = JSON.stringify(
      rawDetails.market_analysis.demand_forecast
    );
    projectDetails.tam_sam_som = JSON.stringify(
      rawDetails.market_analysis.tam_sam_som
    );
    projectDetails.market_statistics = JSON.stringify(
      rawDetails.market_analysis.market_statistics
    );
  }

  // Handle financial_projections fields with proper type conversion
  if (rawDetails.financial_projections) {
    projectDetails.initial_investment = safeToNumber(
      rawDetails.financial_projections.initial_investment
    );
    projectDetails.break_event_point = safeToInt(
      rawDetails.financial_projections.break_even_point
    );
    projectDetails.profit_margin = safeToNumber(
      rawDetails.financial_projections.profit_margin
    );
    projectDetails.revenue_streams = JSON.stringify(
      rawDetails.financial_projections.revenue_streams
    );
  }

  // Handle direct fields
  projectDetails.growth_opportunities = JSON.stringify(
    rawDetails.growth_opportunities
  );
  projectDetails.operational_requirements = JSON.stringify(
    rawDetails.operational_requirements
  );
  projectDetails.executive_summary = rawDetails.executive_summary;
  projectDetails.implementation_timeline = JSON.stringify(
    rawDetails.implementation_timeline
  );

  // Handle marketing_strategy fields
  if (rawDetails.marketing_strategy) {
    projectDetails.brand_positioning =
      rawDetails.marketing_strategy.brand_positioning;
    projectDetails.digital_marketing = JSON.stringify(
      rawDetails.marketing_strategy.digital_marketing
    );
    projectDetails.physical_marketing = JSON.stringify(
      rawDetails.marketing_strategy.physical_marketing
    );
  }

  // Handle legal_regulatory fields
  if (rawDetails.legal_regulatory) {
    projectDetails.business_structure =
      rawDetails.legal_regulatory.business_structure;
    projectDetails.required_permits_licenses = JSON.stringify(
      rawDetails.legal_regulatory.required_permits_licenses
    );
    projectDetails.insurance_needs = JSON.stringify(
      rawDetails.legal_regulatory.insurance_needs
    );
  }

  // Handle competitive_analysis fields
  if (rawDetails.competitive_analysis) {
    projectDetails.key_competitors =
      rawDetails.competitive_analysis.key_competitors;
    projectDetails.swot_analysis = JSON.stringify(
      rawDetails.competitive_analysis.swot_analysis
    );
    projectDetails.differentiation = JSON.stringify(
      rawDetails.competitive_analysis.differentiation
    );
    projectDetails.competitor_links = JSON.stringify(
      rawDetails.competitive_analysis.competitor_links
    );
  }

  // Handle new business plan fields
  projectDetails.business_model = rawDetails.business_model;

  // Handle risk_analysis as structured data
  if (rawDetails.risk_analysis) {
    projectDetails.main_risks = JSON.stringify(
      rawDetails.risk_analysis.main_risks
    );
    projectDetails.risk_mitigations = JSON.stringify(
      rawDetails.risk_analysis.risk_mitigations
    );
  }

  // Handle resources with structured categories
  if (rawDetails.resources) {
    projectDetails.learning_materials = JSON.stringify(
      rawDetails.resources.learning_materials
    );
    projectDetails.tools = JSON.stringify(rawDetails.resources.tools);
  }

  // Handle citations
  projectDetails.citations = JSON.stringify(rawDetails.citations);

  return projectDetails;
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  try {
    const { projectId } = await req.json();

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    const { data: project, error: fetchError } = await supabase
      .from("project")
      .select("*")
      .eq("id", projectId)
      .single();

    if (fetchError || !project) {
      return NextResponse.json(
        { error: fetchError?.message ?? "Project not found" },
        { status: 404 }
      );
    }

    await supabase
      .from("project")
      .update({ status: "IN_PROGRESS" })
      .eq("id", projectId);

    const systemPrompt = `You are GapMap AI, a specialized business advisor assistant.
    Your task is to generate comprehensive business analysis and planning for the project: "${
      project.title
    }".
    
    CRITICAL REQUIREMENTS:
    - Always refer to the business as "Your business" instead of creating fictional names
    - Do NOT use any markdown formatting in your JSON response (no **, *, #, etc.)
    - Provide explicit links to competitor websites and market data sources for verification
    - Use simple, non-technical language that anyone can understand
    - Be specific and actionable in all recommendations
    - For growth predictions, provide realistic monthly/yearly growth percentages with supporting data
    - ENSURE your response is COMPLETE and VALID JSON that matches the exact schema provided
    - Do NOT exceed the token limit - if needed, prioritize completeness over verbosity
    
    Follow the JSON schema I provided exactly. Provide detailed, realistic, and actionable information for each section.
    Include verified citation links for data sources, especially for competitor information, market data, and industry insights.
    
    Project Details:
    Description: ${project.description}
    Investment Required: ${project.investment_required ?? "Not specified"}
    Time Commitment: ${project.time_commitment ?? "Not specified"}
    Risk Level: ${project.risk_level ?? "Not specified"}
    Potential Returns: ${project.potential_returns ?? "Not specified"}`;

    const userPrompt =
      "Generate comprehensive business details for my project. Ensure the response is complete valid JSON.";

    console.log("🚀 Making request to Perplexity API...");

    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SONAR_API}`,
      },
      body: JSON.stringify({
        model: "sonar-deep-research",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.5, // Reduced for more consistent output
        max_tokens: 4000, // Increased token limit
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "business_plan_analysis",
            schema: {
              type: "object",
              properties: {
                market_analysis: {
                  type: "object",
                  properties: {
                    market_size: {
                      type: "string",
                      description:
                        "Simple explanation of how big the market is with specific numbers and sources",
                    },
                    target_audience: {
                      type: "string",
                      description:
                        "Who will buy this product, explained in simple terms",
                    },
                    customer_personas: {
                      type: "string",
                      description:
                        "3-4 types of ideal customers with their problems and demographics, easy to understand",
                    },
                    pain_points: {
                      type: "string",
                      description:
                        "Main problems your customers face that your business solves",
                    },
                    demand_forecast: {
                      type: "object",
                      properties: {
                        summary: {
                          type: "string",
                          description:
                            "Simple explanation of market demand trends",
                        },
                        growth_predictions: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              period: {
                                type: "string",
                                description:
                                  "Time period like 'Month 6', 'Year 1'",
                              },
                              users: {
                                type: "number",
                                description:
                                  "Predicted number of users/customers",
                              },
                              revenue: {
                                type: "number",
                                description: "Predicted revenue in dollars",
                              },
                              growth_rate: {
                                type: "number",
                                description: "Growth percentage",
                              },
                            },
                            required: [
                              "period",
                              "users",
                              "revenue",
                              "growth_rate",
                            ],
                          },
                          description:
                            "Monthly/yearly growth predictions with specific numbers",
                        },
                        key_drivers: {
                          type: "array",
                          items: { type: "string" },
                          description:
                            "Main factors that will drive growth, explained simply",
                        },
                      },
                      required: [
                        "summary",
                        "growth_predictions",
                        "key_drivers",
                      ],
                    },
                    tam_sam_som: {
                      type: "object",
                      properties: {
                        tam: {
                          type: "object",
                          properties: {
                            value: {
                              type: "string",
                              description: "Total market size value",
                            },
                            description: {
                              type: "string",
                              description:
                                "Simple explanation of what TAM means for this business",
                            },
                          },
                          required: ["value", "description"],
                        },
                        sam: {
                          type: "object",
                          properties: {
                            value: {
                              type: "string",
                              description: "Serviceable market size value",
                            },
                            description: {
                              type: "string",
                              description:
                                "Simple explanation of what SAM means for this business",
                            },
                          },
                          required: ["value", "description"],
                        },
                        som: {
                          type: "object",
                          properties: {
                            value: {
                              type: "string",
                              description: "Obtainable market size value",
                            },
                            description: {
                              type: "string",
                              description:
                                "Simple explanation of what SOM means for this business",
                            },
                          },
                          required: ["value", "description"],
                        },
                      },
                      required: ["tam", "sam", "som"],
                    },
                    market_statistics: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          metric: { type: "string" },
                          value: { type: "string" },
                          source: { type: "string" },
                          link: { type: "string" },
                        },
                        required: ["metric", "value", "source", "link"],
                      },
                      description:
                        "Key market statistics with verified sources",
                    },
                  },
                  required: [
                    "market_size",
                    "target_audience",
                    "customer_personas",
                    "pain_points",
                    "demand_forecast",
                    "tam_sam_som",
                    "market_statistics",
                  ],
                },
                financial_projections: {
                  type: "object",
                  properties: {
                    initial_investment: {
                      type: "number",
                      description: "How much money needed to start, in dollars",
                    },
                    break_even_point: {
                      type: "number",
                      description: "How many months until profitable",
                    },
                    profit_margin: {
                      type: "number",
                      description: "Percentage of profit on each sale",
                    },
                    revenue_streams: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          stream: {
                            type: "string",
                            description: "How money is made",
                          },
                          percentage: {
                            type: "number",
                            description: "What percent of total income",
                          },
                        },
                        required: ["stream", "percentage"],
                      },
                    },
                  },
                  required: [
                    "initial_investment",
                    "break_even_point",
                    "profit_margin",
                    "revenue_streams",
                  ],
                },
                growth_opportunities: {
                  type: "array",
                  items: { type: "string" },
                  description:
                    "Ways to grow the business bigger, explained simply",
                },
                operational_requirements: {
                  type: "object",
                  properties: {
                    staffingNeeds: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          period: { type: "string" },
                          description: { type: "string" },
                        },
                        required: ["period", "description"],
                      },
                    },
                    equipment: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          item: { type: "string" },
                          cost: { type: "string" },
                        },
                        required: ["item", "cost"],
                      },
                    },
                    locationRequirements: {
                      type: "object",
                      properties: {
                        description: { type: "string" },
                        estimatedMonthlyRent: { type: "string" },
                      },
                      required: ["description", "estimatedMonthlyRent"],
                    },
                  },
                  required: [
                    "staffingNeeds",
                    "equipment",
                    "locationRequirements",
                  ],
                },
                executive_summary: {
                  type: "string",
                  description:
                    "Simple summary of the business opportunity that anyone can understand",
                },
                business_model: {
                  type: "string",
                  description: "How the business makes money, explained simply",
                },
                risk_analysis: {
                  type: "object",
                  properties: {
                    main_risks: {
                      type: "array",
                      items: { type: "string" },
                      description:
                        "Main things that could go wrong, explained simply",
                    },
                    risk_mitigations: {
                      type: "array",
                      items: { type: "string" },
                      description:
                        "How to prevent or fix these problems, explained simply",
                    },
                  },
                  required: ["main_risks", "risk_mitigations"],
                },
                implementation_timeline: {
                  type: "object",
                  properties: {
                    timeline: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          period: { type: "string" },
                          phase: { type: "string" },
                          tasks: {
                            type: "array",
                            items: { type: "string" },
                            description:
                              "Each task should be a separate string item, no line breaks within tasks",
                          },
                        },
                        required: ["period", "phase", "tasks"],
                      },
                    },
                  },
                  required: ["timeline"],
                },
                marketing_strategy: {
                  type: "object",
                  properties: {
                    brand_positioning: {
                      type: "string",
                      description:
                        "How your business is different and better, explained simply",
                    },
                    digital_marketing: {
                      type: "array",
                      items: { type: "string" },
                      description:
                        "Online marketing strategies that are easy to understand",
                    },
                    physical_marketing: {
                      type: "array",
                      items: { type: "string" },
                      description:
                        "Offline marketing approaches that are easy to understand",
                    },
                  },
                  required: [
                    "brand_positioning",
                    "digital_marketing",
                    "physical_marketing",
                  ],
                },
                competitive_analysis: {
                  type: "object",
                  properties: {
                    key_competitors: {
                      type: "string",
                      description: "Main competitors explained simply",
                    },
                    swot_analysis: {
                      type: "object",
                      properties: {
                        strengths: {
                          type: "array",
                          items: { type: "string" },
                          description: "What your business does well",
                        },
                        weaknesses: {
                          type: "array",
                          items: { type: "string" },
                          description: "What your business needs to improve",
                        },
                        opportunities: {
                          type: "array",
                          items: { type: "string" },
                          description: "Good chances for growth and success",
                        },
                        threats: {
                          type: "array",
                          items: { type: "string" },
                          description:
                            "External challenges that could hurt the business",
                        },
                      },
                      required: [
                        "strengths",
                        "weaknesses",
                        "opportunities",
                        "threats",
                      ],
                    },
                    differentiation: {
                      type: "object",
                      properties: {
                        comparison_table: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              feature: {
                                type: "string",
                                description: "What is being compared",
                              },
                              your_business: {
                                type: "string",
                                description: "How your business handles this",
                              },
                              competitors: {
                                type: "string",
                                description: "How competitors handle this",
                              },
                            },
                            required: [
                              "feature",
                              "your_business",
                              "competitors",
                            ],
                          },
                          description:
                            "Direct comparison between your business and competitors",
                        },
                      },
                      required: ["comparison_table"],
                    },
                    competitor_links: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          name: { type: "string" },
                          website: { type: "string" },
                          description: { type: "string" },
                        },
                        required: ["name", "website", "description"],
                      },
                      description:
                        "Direct links to competitor websites for verification",
                    },
                  },
                  required: [
                    "key_competitors",
                    "swot_analysis",
                    "differentiation",
                    "competitor_links",
                  ],
                },
                legal_regulatory: {
                  type: "object",
                  properties: {
                    business_structure: {
                      type: "string",
                      description:
                        "What type of business entity to register as, explained simply",
                    },
                    required_permits_licenses: {
                      type: "array",
                      items: { type: "string" },
                      description: "Legal requirements and permits needed",
                    },
                    insurance_needs: {
                      type: "array",
                      items: { type: "string" },
                      description: "Types of insurance protection needed",
                    },
                  },
                  required: [
                    "business_structure",
                    "required_permits_licenses",
                    "insurance_needs",
                  ],
                },
                citations: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      url: { type: "string" },
                      description: { type: "string" },
                    },
                    required: ["title", "url", "description"],
                  },
                  description: "Sources used for data and research",
                },
                resources: {
                  type: "object",
                  properties: {
                    learning_materials: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          title: { type: "string" },
                          description: { type: "string" },
                          url: { type: "string" },
                          type: {
                            type: "string",
                            description: "e.g., Course, Guide, Book",
                          },
                        },
                        required: ["title", "description", "url", "type"],
                      },
                      description:
                        "Educational resources for learning business skills",
                    },
                    tools: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          name: { type: "string" },
                          description: { type: "string" },
                          url: { type: "string" },
                          category: {
                            type: "string",
                            description: "e.g., Design, Analytics, Finance",
                          },
                        },
                        required: ["name", "description", "url", "category"],
                      },
                      description: "Practical tools for business operations",
                    },
                  },
                  required: ["learning_materials", "tools"],
                },
              },
              required: [
                "market_analysis",
                "financial_projections",
                "growth_opportunities",
                "operational_requirements",
                "executive_summary",
                "business_model",
                "risk_analysis",
                "implementation_timeline",
                "marketing_strategy",
                "competitive_analysis",
                "legal_regulatory",
                "citations",
                "resources",
              ],
            },
          },
        },
      }),
    });

    console.log("📊 Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Perplexity API error:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });

      return NextResponse.json(
        {
          error: `API Error (${response.status}): ${response.statusText}`,
          details: errorText,
        },
        { status: response.status }
      );
    }

    const responseData = await response.json();
    console.log("✅ Got response from Perplexity");

    let projectDetails;

    try {
      let content = responseData.choices[0].message.content;

      console.log("📝 Raw content length:", content?.length || 0);
      console.log("📝 Content preview:", content?.substring(0, 200) + "...");

      // Handle reasoning model responses that include <think> tags
      if (content.includes("<think>") && content.includes("</think>")) {
        const parts = content.split("</think>");
        if (parts.length > 1) {
          content = parts[1].trim();
          console.log("🧠 Extracted content after </think> tag");
        }
      }

      // Additional cleaning - remove any remaining XML-like tags
      content = content.replace(/<[^>]*>/g, "").trim();

      // Validate it looks like JSON
      if (!content.startsWith("{") || !content.endsWith("}")) {
        console.error("❌ Content doesn't look like valid JSON");
        console.error("Content starts with:", content.substring(0, 50));
        console.error(
          "Content ends with:",
          content.substring(content.length - 50)
        );

        return NextResponse.json(
          {
            error: "Invalid response format from AI",
            details: "Response is not valid JSON",
          },
          { status: 500 }
        );
      }

      console.log("🔍 Attempting to parse JSON...");
      const rawDetails = JSON.parse(content);
      console.log("✅ Successfully parsed JSON");

      projectDetails = processProjectDetails(rawDetails);
      console.log("✅ Successfully processed project details");
    } catch (parseError: any) {
      console.error("❌ Failed to parse Perplexity response:", parseError);
      console.error(
        "❌ Content that failed to parse:",
        responseData.choices[0]?.message?.content
      );

      // Update project status to show error
      await supabase
        .from("project")
        .update({ status: "CANCELLED" })
        .eq("id", projectId);

      return NextResponse.json(
        {
          error: "Failed to parse AI generated content",
          details: parseError.message,
          rawContent: responseData.choices[0]?.message?.content?.substring(
            0,
            500
          ),
        },
        { status: 500 }
      );
    }

    console.log("💾 Updating project in database...");
    const { error: updateError } = await supabase
      .from("project")
      .update({
        ...projectDetails,
        status: "SUCCESS",
        updated_at: new Date().toISOString(),
      })
      .eq("id", projectId);

    if (updateError) {
      console.error("❌ Database update error:", updateError);
      return NextResponse.json(
        {
          error: `Failed to update project: ${updateError.message}`,
        },
        { status: 500 }
      );
    }

    console.log("✅ Successfully updated project");
    revalidatePath(`/dashboard/projects/${projectId}`);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("❌ Unexpected error:", error);

    // Update project status to show error
    try {
      const { projectId } = await req.json();
      await supabase
        .from("project")
        .update({ status: "CANCELLED" })
        .eq("id", projectId);
    } catch (updateError) {
      console.error(
        "Failed to update project status after error:",
        updateError
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message ?? "Failed to generate project details",
      },
      { status: 500 }
    );
  }
}
