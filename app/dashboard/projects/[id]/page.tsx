import { TabsContent } from "@/components/ui/tabs";
import { ProjectHeader, ProjectTabs, EmptySection } from "@/components/project";
import ChatSection from "@/components/project/tabs/chat-section";
import { PlanTab } from "@/components/project/tabs/plan-tab";
import { MarketTab } from "@/components/project/tabs/market-tab";
import { CompetitorsTab } from "@/components/project/tabs/competitors-tab";
import { ResourcesTab } from "@/components/project/tabs/resources-tab";
import { createClient } from "@/utils/supabase/server";
import { format } from "date-fns";
import { redirect } from "next/navigation";
import { ProjectWrapper } from "./project-wrapper";

export default async function ProjectPage({
  params,
}: {
  readonly params: { id: string };
}) {
  const { id } = await params;

  // Fetch project data from Supabase
  const supabase = await createClient();
  const { data: project, error } = await supabase
    .from("project")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !project) {
    console.error("Error fetching project:", error);
    redirect("/dashboard/projects");
  }

  // Format created_at date
  const createdDate = project.created_at
    ? format(new Date(project.created_at), "MMMM d, yyyy")
    : "Unknown date";

  // Check if the project has generated details
  const hasGeneratedDetails = Boolean(
    project.market_size ||
      project.executive_summary ||
      project.implementation_timeline ||
      project.business_model ||
      project.key_competitors
  );

  return (
    <ProjectWrapper>
      <div className="h-[calc(100vh-9rem)] flex flex-col mt-16">
        <ProjectHeader
          id={id}
          title={project.title}
          createdDate={createdDate}
          hasGeneratedDetails={hasGeneratedDetails}
        />
        <ProjectTabs>
          <TabsContent value="chat">
            <ChatSection projectId={id} />
          </TabsContent>

          <TabsContent value="plan">
            {hasGeneratedDetails ? (
              <PlanTab project={project} />
            ) : (
              <EmptySection
                projectId={id}
                title="Business Plan"
                description="Generate a comprehensive business plan with financial projections and implementation timeline"
              />
            )}
          </TabsContent>

          <TabsContent value="market">
            {hasGeneratedDetails ? (
              <MarketTab project={project} />
            ) : (
              <EmptySection
                projectId={id}
                title="Market Analysis"
                description="Analyze your target market, customer personas, and market opportunities"
              />
            )}
          </TabsContent>

          <TabsContent value="competitors">
            {hasGeneratedDetails ? (
              <CompetitorsTab project={project} />
            ) : (
              <EmptySection
                projectId={id}
                title="Competitive Analysis"
                description="Understand your competition and identify your competitive advantages"
              />
            )}
          </TabsContent>

          <TabsContent value="resources">
            {hasGeneratedDetails ? (
              <ResourcesTab project={project} />
            ) : (
              <EmptySection
                projectId={id}
                title="Resources & Tools"
                description="Access learning materials, tools, and resources to implement your business plan"
              />
            )}
          </TabsContent>
        </ProjectTabs>
      </div>
    </ProjectWrapper>
  );
}
