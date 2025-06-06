"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  RiDownload2Line,
  RiChat1Line,
  RiFileTextLine,
  RiBarChartLine,
  RiBookLine,
} from "react-icons/ri";
import { BsPeople } from "react-icons/bs";
import { useGenerating } from "./generating-context";

interface ProjectTabsProps {
  readonly children: ReactNode;
  readonly defaultTab?: string;
}

export function ProjectTabs({
  children,
  defaultTab = "chat",
}: Readonly<ProjectTabsProps>) {
  const { isGenerating } = useGenerating();
  return (
    <Tabs defaultValue={defaultTab} className="flex-1 flex flex-col">
      <div className="flex justify-between items-center">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger
            value="chat"
            disabled={isGenerating}
            className="flex items-center gap-2"
          >
            <RiChat1Line className="h-4 w-4" />
            Chat
          </TabsTrigger>
          <TabsTrigger
            value="plan"
            disabled={isGenerating}
            className="flex items-center gap-2"
          >
            <RiFileTextLine className="h-4 w-4" />
            Plan
          </TabsTrigger>
          <TabsTrigger
            value="market"
            disabled={isGenerating}
            className="flex items-center gap-2"
          >
            <RiBarChartLine className="h-4 w-4" />
            Market
          </TabsTrigger>
          <TabsTrigger
            value="competitors"
            disabled={isGenerating}
            className="flex items-center gap-2"
          >
            <BsPeople className="h-4 w-4" />
            Competitors
          </TabsTrigger>
          <TabsTrigger
            value="resources"
            disabled={isGenerating}
            className="flex items-center gap-2"
          >
            <RiBookLine className="h-4 w-4" />
            Resources
          </TabsTrigger>
        </TabsList>
      </div>
      {children}
    </Tabs>
  );
}
