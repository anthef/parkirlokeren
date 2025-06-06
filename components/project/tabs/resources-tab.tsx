"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ExternalLink,
  BookOpen,
  HammerIcon as Tool,
  GraduationCap,
  Settings,
} from "lucide-react";
import { Project, LearningMaterial, Tool as ToolType } from "../types";

interface ResourcesTabProps {
  project: Project;
}

// Helper function to parse JSON strings safely
const parseJsonSafely = (jsonString: string | null) => {
  if (!jsonString) return [];
  try {
    return JSON.parse(jsonString);
  } catch {
    return [];
  }
};

export function ResourcesTab({ project }: ResourcesTabProps) {
  const learningMaterials: LearningMaterial[] = parseJsonSafely(
    project.learning_materials as string
  );
  const tools: ToolType[] = parseJsonSafely(project.tools as string);
  const citations = parseJsonSafely(project.citations as string);

  return (
    <div className="space-y-8 overflow-auto">
      <div>
        <h2 className="text-2xl font-bold mb-2">Resources & Tools</h2>
        <p className="text-muted-foreground">
          Turn your plan into action with curated learning materials and
          practical tools
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Learning Materials Column */}
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Learning Materials
          </h3>
          <div className="space-y-4">
            {learningMaterials.length > 0 ? (
              learningMaterials.map((material, index) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {material.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {material.description}
                        </p>
                      </div>
                      <Badge variant="secondary">{material.type}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => window.open(material.url, "_blank")}
                    >
                      <ExternalLink className="h-4 w-4" />
                      Access Resource
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground italic text-center">
                    No learning materials available yet
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Tools Column */}
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Recommended Tools
          </h3>
          <div className="space-y-4">
            {tools.length > 0 ? (
              tools.map((tool, index) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{tool.name}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {tool.description}
                        </p>
                      </div>
                      <Badge variant="outline">{tool.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => window.open(tool.url, "_blank")}
                    >
                      <ExternalLink className="h-4 w-4" />
                      Visit {tool.name}
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground italic text-center">
                    No tools available yet
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Citations Section */}
      {citations && citations.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Other Resources & Citations
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {citations.map((citation: any, index: number) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{citation.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {citation.description}
                  </p>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => window.open(citation.url, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4" />
                    View Source
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
