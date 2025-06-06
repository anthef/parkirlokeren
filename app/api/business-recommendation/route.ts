import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.json();

    // Create a prompt for Perplexity to generate business recommendations
    const prompt = `
    Based on the following user profile, generate 10 business recommendations.
    Each recommendation should include:
    1. Title
    2. Description
    3. Investment Required (as a string range)
    4. Time Commitment (hours per week)
    5. Risk Level (Low, Medium, High)
    6. Potential Returns (as a string)
    7. Match Score (a number between 1-100)
    
    User Profile:
    - Location: ${formData.location}
    - Age Range: ${formData.ageRange}
    - Skills & Experience: ${formData.skills}
    - Education: ${formData.education}
    - Business Type Preference: ${formData.businessType}
    - Industry Preference: ${formData.industry}
    - Time Availability: ${formData.timeAvailability} hours/week
    - Solo Entrepreneur: ${formData.soloEntrepreneur ? "Yes" : "No"}
    - Willing to Hire Employees: ${formData.hiringEmployees ? "Yes" : "No"}
    - Open to Partnerships: ${formData.openToPartnerships ? "Yes" : "No"}
    - Investment Budget: ${formData.investmentBudget}
    - Risk Tolerance: ${formData.riskTolerance}/5
    - Business Goal: ${formData.businessGoal}
    - Additional Info: ${formData.additionalInfo}
    
    Return the recommendations as a JSON array of objects with the following structure:
    [
      {
        "id": 1,
        "title": "Business Title",
        "description": "Brief description of the business opportunity",
        "investmentRequired": "Low ($X-$Y)",
        "timeCommitment": "X hours/week",
        "riskLevel": "Low/Medium/High",
        "potentialReturns": "$X-$Y/month within Z months",
        "matchScore": 95
      },
      ...
    ]
    Only return the JSON array, nothing else.
    `;

    // Call Perplexity API
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SONAR_API}`,
      },
      body: JSON.stringify({
        model: "sonar-reasoning-pro",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2048,
        response_format: {
          type: "json_schema",
          json_schema: {
            schema: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "number" },
                  title: { type: "string" },
                  description: { type: "string" },
                  investmentRequired: { type: "string" },
                  timeCommitment: { type: "string" },
                  riskLevel: { type: "string" },
                  potentialReturns: { type: "string" },
                  matchScore: { type: "number" },
                },
                required: [
                  "id",
                  "title",
                  "description",
                  "investmentRequired",
                  "timeCommitment",
                  "riskLevel",
                  "potentialReturns",
                  "matchScore",
                ],
              },
            },
          },
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Perplexity API error:", errorData);
      return NextResponse.json(
        { error: "Failed to generate recommendations" },
        { status: response.status }
      );
    }

    // Parse the response from Perplexity
    const responseData = await response.json();
    let recommendations;

    try {
      let content = responseData.choices[0].message.content;
      let reason = "";

      console.log("Raw Perplexity response:", content);

      // Check if content contains <think> tags and extract both parts
      if (content.includes("<think>") && content.includes("</think>")) {
        // Extract the content inside the <think> tags
        reason = content.split("<think>")[1].split("</think>")[0].trim();
        // Extract the content after the closing </think> tag
        content = content.split("</think>")[1].trim();
      }

      console.log("Perplexity response reason:", reason);
      console.log("Perplexity response content:", content);
      // Try to parse the JSON
      recommendations = JSON.parse(content);

      return NextResponse.json({
        recommendations,
        reason,
        citations: responseData.citations,
      });
    } catch (error) {
      console.error("Failed to parse Perplexity response:", error);
      return NextResponse.json(
        { error: "Failed to generate recommendations" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
