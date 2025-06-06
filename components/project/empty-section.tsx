import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { GenerateDetailsButton } from './generate-details-button';

interface EmptySectionProps {
  projectId: string;
  title: string;
  description: string;
}

export function EmptySection({
  projectId,
  title,
  description,
}: EmptySectionProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-6 py-8">
        <div className="text-center space-y-4 max-w-md">
          <h3 className="text-xl font-semibold">No Details Generated Yet</h3>
          <p className="text-muted-foreground">
            Generate AI-powered business details to get a complete analysis,
            business plan, and resources for your project.
          </p>
          <GenerateDetailsButton projectId={projectId} />
        </div>
      </CardContent>
    </Card>
  );
}
