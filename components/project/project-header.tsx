'use client';

import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { GenerateDetailsButton } from './generate-details-button';
import { useGenerating } from './generating-context';

interface ProjectHeaderProps {
  readonly id: string;
  readonly title: string;
  readonly createdDate: string;
  readonly hasGeneratedDetails?: boolean;
}

export function ProjectHeader({
  id,
  title,
  createdDate,
  hasGeneratedDetails = false,
}: Readonly<ProjectHeaderProps>) {
  const { isGenerating } = useGenerating();
  return (
    <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {isGenerating && (
            <Badge
              variant="outline"
              className="animate-pulse flex items-center gap-1"
            >
              <Loader2 className="h-3 w-3 animate-spin" />
              Generating
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground">
          Project #{id} • Created on {createdDate}
        </p>
      </div>

      {!hasGeneratedDetails && !isGenerating && (
        <div className="shrink-0">
          <GenerateDetailsButton projectId={id} />
        </div>
      )}
    </div>
  );
}
