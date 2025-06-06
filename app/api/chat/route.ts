import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// Define API response types for better type safety
interface PerplexityResponse {
  choices: {
    message: {
      content: string;
      role: string;
    };
    index: number;
    finish_reason: string;
  }[];
  id: string;
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  created: number;
}

interface ChatMessage {
  role: "assistant" | "user" | "system";
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const { chatHistory, projectId } = await req.json(); // Get project details from Supabase
    let projectContext = "";
    let projectTitle = "your business project";

    if (projectId) {
      const supabase = await createClient();
      const { data: project, error } = await supabase
        .from("project")
        .select("*")
        .eq("id", projectId)
        .single();

      if (error) {
        console.error("Error fetching project details:", error);
      } else if (project) {
        projectTitle = project.title;
        // Build detailed project context with clear sections
        projectContext = `
# Project Details for "${project.title}"

## Basic Information
- Title: ${project.title}
- Description: ${project.description ?? "Not specified"}
- Status: ${project.status ?? "Not specified"}
${
  project.investment_required
    ? `- Investment Required: ${project.investment_required}`
    : ""
}
${
  project.time_commitment ? `- Time Commitment: ${project.time_commitment}` : ""
}
${project.risk_level ? `- Risk Level: ${project.risk_level}` : ""}
${
  project.potential_returns
    ? `- Potential Returns: ${project.potential_returns}`
    : ""
}

## Market Analysis
${
  project.market_size
    ? `- Market Size: ${project.market_size}`
    : "- Market Size: Not specified"
}
${
  project.target_audience
    ? `- Target Audience: ${project.target_audience}`
    : "- Target Audience: Not specified"
}
${
  project.brand_positioning
    ? `- Brand Positioning: ${project.brand_positioning}`
    : ""
}

## Financial Information`;

        // Add financial projections if available
        if (
          project.initial_investment ||
          project.break_event_point ||
          project.profit_margin
        ) {
          if (project.initial_investment)
            projectContext += `\n- Initial Investment: ${project.initial_investment}`;
          if (project.break_event_point)
            projectContext += `\n- Break Even Point: ${project.break_event_point} months`;
          if (project.profit_margin)
            projectContext += `\n- Profit Margin: ${project.profit_margin}%`;
        } else {
          projectContext += `\n- Financial projections not yet specified`;
        }

        // Add revenue streams if available
        if (
          project.revenue_streams &&
          typeof project.revenue_streams === "object"
        ) {
          projectContext += `\n\n## Revenue Streams`;
          try {
            const streams = project.revenue_streams;
            if (Array.isArray(streams) && streams.length > 0) {
              streams.forEach(
                (stream: { stream: string; percentage: number }) => {
                  projectContext += `\n- ${stream.stream}: ${stream.percentage}%`;
                }
              );
            } else {
              projectContext += `\n- Revenue streams not yet specified in detail`;
            }
          } catch (e) {
            console.error("Error parsing revenue streams:", e);
            projectContext += `\n- Revenue streams data exists but could not be parsed`;
          }
        }

        // Add operational requirements if available
        if (
          project.operational_requirements &&
          typeof project.operational_requirements === "object"
        ) {
          projectContext += `\n\n## Operational Requirements`;
          const opReq = project.operational_requirements;

          // Add staffing needs
          if (
            opReq.staffingNeeds &&
            Array.isArray(opReq.staffingNeeds) &&
            opReq.staffingNeeds.length > 0
          ) {
            projectContext += `\n\n### Staffing Needs`;
            opReq.staffingNeeds.forEach(
              (staff: { period: string; description: string }) => {
                projectContext += `\n- ${staff.period}: ${staff.description}`;
              }
            );
          }

          // Add equipment
          if (
            opReq.equipment &&
            Array.isArray(opReq.equipment) &&
            opReq.equipment.length > 0
          ) {
            projectContext += `\n\n### Equipment`;
            opReq.equipment.forEach((item: { item: string; cost: string }) => {
              projectContext += `\n- ${item.item}: ${item.cost}`;
            });
          }

          // Add location requirements
          if (opReq.locationRequirements) {
            projectContext += `\n\n### Location Requirements`;
            projectContext += `\n- ${opReq.locationRequirements.description}`;
            projectContext += `\n- Estimated Monthly Rent: ${opReq.locationRequirements.estimatedMonthlyRent}`;
          }
        }

        // Add business structure and legal requirements if available
        if (
          project.business_structure ||
          (project.required_permits_licenses &&
            project.required_permits_licenses.length > 0) ||
          (project.insurance_needs && project.insurance_needs.length > 0)
        ) {
          projectContext += `\n\n## Legal and Business Structure`;

          if (project.business_structure) {
            projectContext += `\n- Business Structure: ${project.business_structure}`;
          }

          if (
            project.required_permits_licenses &&
            Array.isArray(project.required_permits_licenses) &&
            project.required_permits_licenses.length > 0
          ) {
            projectContext += `\n\n### Required Permits & Licenses`;
            project.required_permits_licenses.forEach((item: string) => {
              projectContext += `\n- ${item}`;
            });
          }

          if (
            project.insurance_needs &&
            Array.isArray(project.insurance_needs) &&
            project.insurance_needs.length > 0
          ) {
            projectContext += `\n\n### Insurance Needs`;
            project.insurance_needs.forEach((item: string) => {
              projectContext += `\n- ${item}`;
            });
          }
        }

        // Add marketing information if available
        if (
          (project.digital_marketing && project.digital_marketing.length > 0) ||
          (project.physical_marketing && project.physical_marketing.length > 0)
        ) {
          projectContext += `\n\n## Marketing Strategy`;

          if (
            project.digital_marketing &&
            Array.isArray(project.digital_marketing) &&
            project.digital_marketing.length > 0
          ) {
            projectContext += `\n\n### Digital Marketing`;
            project.digital_marketing.forEach((item: string) => {
              projectContext += `\n- ${item}`;
            });
          }

          if (
            project.physical_marketing &&
            Array.isArray(project.physical_marketing) &&
            project.physical_marketing.length > 0
          ) {
            projectContext += `\n\n### Physical Marketing`;
            project.physical_marketing.forEach((item: string) => {
              projectContext += `\n- ${item}`;
            });
          }
        }

        // Add implementation timeline if available
        if (
          project.implementation_timeline &&
          typeof project.implementation_timeline === "object"
        ) {
          projectContext += `\n\n## Implementation Timeline`;
          try {
            const timeline = project.implementation_timeline;
            if (Object.keys(timeline).length > 0) {
              Object.entries(timeline).forEach(([phase, details]) => {
                projectContext += `\n- ${phase}: ${details}`;
              });
            } else {
              projectContext += `\n- Implementation timeline structure exists but no details provided`;
            }
          } catch (e) {
            console.error("Error parsing implementation timeline:", e);
          }
        }

        // Add growth opportunities if available
        if (
          project.growth_opportunities &&
          Array.isArray(project.growth_opportunities) &&
          project.growth_opportunities.length > 0
        ) {
          projectContext += `\n\n## Growth Opportunities`;
          project.growth_opportunities.forEach((item: string) => {
            projectContext += `\n- ${item}`;
          });
        }

        // Add executive summary if available
        if (project.executive_summary) {
          projectContext += `\n\n## Executive Summary\n${project.executive_summary}`;
        }
      }
    } // System message with context about being a business advisor
    const systemMessage = {
      role: "system",
      content: `# GapMap AI - Business Advisor Assistant

You are GapMap AI, a specialized business advisor assistant helping the user with their business project (ID: ${
        projectId ?? "unknown"
      }) titled "${projectTitle}".

${projectContext}

## Your Role as a Business Advisor

### Expertise Areas
- Business planning and strategic development
- Market analysis and competitive landscape assessment
- Financial modeling and investment planning
- Operational optimization and scaling strategies
- Marketing and customer acquisition approaches

### Communication Guidelines
- Format responses with clear markdown headings and bullet points for readability
- Be encouraging but realistic about business challenges and timelines
- Provide specific, actionable advice rather than generic statements
- When discussing financial matters, be specific with numbers and realistic projections
- If asked about something outside your expertise, acknowledge limitations and suggest professional consultation
- Use data from the project context to personalize your advice

### Conversation Style
- Professional but conversational tone
- Focus on practical, implementable advice
- Break down complex business concepts into understandable parts
- Refer to specific details from the project when relevant`,
    }; // Format chat history for the API
    const messages: ChatMessage[] = [systemMessage, ...(chatHistory ?? [])];

    // Call Perplexity API
    const perplexityRequest = {
      model: "sonar",
      messages,
    };
    console.log(
      "Sending to Perplexity API:",
      JSON.stringify(
        {
          model: perplexityRequest.model,
          messageCount: messages.length,
          projectId: projectId ?? "none",
        },
        null,
        2
      )
    );

    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SONAR_API}`,
      },
      body: JSON.stringify(perplexityRequest),
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Perplexity API error:", errorData);
      // Provide more specific error messages based on status codes
      if (response.status === 429) {
        return NextResponse.json(
          {
            error:
              "Rate limit exceeded. Please wait a moment before sending another message.",
          },
          { status: 429 }
        );
      } else if (response.status === 401 || response.status === 403) {
        return NextResponse.json(
          {
            error:
              "Authentication error with AI service. Please contact support.",
          },
          { status: response.status }
        );
      } else if (response.status === 400) {
        // Check for token limit errors in the error message
        if (
          errorData.error?.message?.toLowerCase().includes("token") &&
          errorData.error?.message?.toLowerCase().includes("limit")
        ) {
          return NextResponse.json(
            {
              error:
                "The conversation has reached the token limit. Please clear the conversation and start a new one.",
            },
            { status: 400 }
          );
        }
        return NextResponse.json(
          {
            error:
              "Invalid request format. Please try again with a different message.",
          },
          { status: 400 }
        );
      } else {
        return NextResponse.json(
          {
            error: errorData.error?.message ?? "Failed to get response from AI",
          },
          { status: response.status }
        );
      }
    }
    const data = (await response.json()) as PerplexityResponse;
    return NextResponse.json({
      response: data.choices[0].message.content,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      metadata: {
        tokens: data.usage?.total_tokens ?? 0,
        promptTokens: data.usage?.prompt_tokens ?? 0,
        completionTokens: data.usage?.completion_tokens ?? 0,
        model: data.model ?? "sonar",
        finishReason: data.choices[0].finish_reason ?? "unknown",
      },
    });
  } catch (error) {
    console.error("Error in chat API:", error);

    // Provide more specific error messages
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return NextResponse.json(
        {
          error:
            "Network error while connecting to AI service. Please try again.",
        },
        { status: 503 }
      );
    } else if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Error parsing response from AI service. Please try again." },
        { status: 500 }
      );
    } else if (
      typeof error === "object" &&
      error !== null &&
      "message" in error
    ) {
      return NextResponse.json(
        { error: (error as Error).message ?? "Internal server error" },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }
}
