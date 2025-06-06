"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  RocketIcon,
  Loader2,
  AlertTriangle,
  Clock,
  Sparkles,
  Zap,
  TrendingUp,
} from "lucide-react";
import { useGenerating } from "./generating-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface GenerateDetailsButtonProps {
  readonly projectId: string;
}

export function GenerateDetailsButton({
  projectId,
}: Readonly<GenerateDetailsButtonProps>) {
  const { isGenerating, setIsGenerating } = useGenerating();
  const { toast } = useToast();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [progressInterval, setProgressInterval] =
    useState<NodeJS.Timeout | null>(null);
  const [buttonHovered, setButtonHovered] = useState(false);

  // Clear interval on unmount
  useEffect(() => {
    return () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [progressInterval]);

  const startGeneration = async () => {
    try {
      setIsGenerating(true);
      setShowConfirmDialog(false);

      // Start progress animation
      const interval = setInterval(() => {
        setProgressStep((prev) => (prev + 1) % 8);
      }, 2500);
      setProgressInterval(interval);

      toast({
        title: "🚀 Generation started",
        description:
          "We are creating your detailed business analysis and plan. This may take up to 5 minutes. Please do not refresh or close this page.",
        duration: 10000,
      });

      // Use API endpoint instead of server action
      const response = await fetch("/api/generate-project-detail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId }),
      });

      const result = await response.json();

      // Clear the progress interval
      clearInterval(interval);
      setProgressInterval(null);

      if (response.ok && result.success) {
        toast({
          title: "✨ Success!",
          description:
            "Your business details have been generated. Refreshing page...",
        });

        // Refresh the page to show the new data
        window.location.reload();
      } else {
        toast({
          variant: "destructive",
          title: "❌ Generation failed",
          description:
            result.error ??
            "Something went wrong generating your business details.",
        });
      }
    } catch (error) {
      console.error("Error generating details:", error);
      toast({
        variant: "destructive",
        title: "⚠️ Error",
        description:
          "An unexpected error occurred while generating your business details.",
      });

      // Clear the progress interval on error
      if (progressInterval) {
        clearInterval(progressInterval);
        setProgressInterval(null);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Enhanced progress steps with icons and better descriptions
  const progressSteps = [
    { text: "Analyzing business data...", icon: TrendingUp },
    { text: "Creating market analysis...", icon: Zap },
    { text: "Calculating financial projections...", icon: TrendingUp },
    { text: "Building implementation timeline...", icon: Clock },
    { text: "Gathering relevant resources...", icon: Sparkles },
    { text: "Finalizing business details...", icon: RocketIcon },
    { text: "Preparing to display results...", icon: Sparkles },
    { text: "Almost done! Just a moment...", icon: Zap },
  ];

  const currentStep = progressSteps[progressStep];
  const CurrentIcon = currentStep?.icon || Loader2;

  return (
    <>
      <Button
        onClick={() => setShowConfirmDialog(true)}
        disabled={isGenerating}
        size="lg"
        onMouseEnter={() => setButtonHovered(true)}
        onMouseLeave={() => setButtonHovered(false)}
        className={`
          w-full md:w-auto relative overflow-hidden
          transition-all duration-500 ease-out
          ${
            isGenerating
              ? "bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-size-200 animate-gradient-x"
              : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600"
          }
          ${
            buttonHovered && !isGenerating
              ? "scale-105 shadow-lg shadow-blue-500/25"
              : ""
          }
          ${isGenerating ? "cursor-wait" : "cursor-pointer"}
          border-0 text-white font-semibold
        `}
        style={{
          background: isGenerating
            ? "linear-gradient(-45deg, #3b82f6, #8b5cf6, #06b6d4, #3b82f6)"
            : undefined,
          backgroundSize: isGenerating ? "400% 400%" : undefined,
          animation: isGenerating ? "gradient 3s ease infinite" : undefined,
        }}
      >
        {isGenerating ? (
          <div className="flex items-center gap-3 py-2">
            <div className="relative">
              <CurrentIcon className="h-5 w-5 animate-pulse" />
              <div className="absolute -inset-1 rounded-full bg-white/20 animate-ping" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-white animate-pulse">
                {currentStep?.text}
              </div>
              <div className="text-xs text-blue-100 animate-bounce">
                Please don't refresh the page
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 py-1">
            <RocketIcon
              className={`h-4 w-4 transition-transform duration-300 ${
                buttonHovered ? "animate-bounce" : ""
              }`}
            />
            <span className="relative">
              Generate Business Details with AI
              {buttonHovered && (
                <Sparkles className="absolute -top-2 -right-2 h-3 w-3 text-yellow-300 animate-spin" />
              )}
            </span>
          </div>
        )}
      </Button>

      <Dialog
        open={showConfirmDialog && !isGenerating}
        onOpenChange={setShowConfirmDialog}
      >
        <DialogContent className="sm:max-w-md animate-in fade-in-0 zoom-in-95 duration-300">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <div className="relative">
                <AlertTriangle className="h-5 w-5 text-orange-500 animate-pulse" />
                <div className="absolute -inset-1 rounded-full bg-orange-500/20 animate-ping" />
              </div>
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Generation will take time
              </span>
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              This process will generate a complete business analysis and plan
              for your project. It may take up to 5 minutes to complete.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 p-4 transition-all duration-300 hover:shadow-md">
              <div className="relative">
                <Clock className="h-5 w-5 text-blue-500 mt-0.5 animate-pulse" />
                <div className="absolute -inset-1 rounded-full bg-blue-500/10 animate-ping" />
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-gray-800">
                  Please don't close or refresh the page
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Closing or refreshing will interrupt the generation process
                  and you'll need to start over.
                </p>
              </div>
            </div>

            {/* Progress preview */}
            <div className="rounded-lg bg-gradient-to-r from-gray-50 to-blue-50 p-3 border">
              <p className="text-sm font-medium text-gray-700 mb-2">
                🔮 What we'll generate for you:
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Market Analysis
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  Financial Projections
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Timeline & Milestones
                </div>
                <div className="flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Resource Planning
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-3">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="hover:bg-gray-100 transition-colors duration-200"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={startGeneration}
              className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
            >
              <RocketIcon className="h-4 w-4 animate-bounce" />
              <span>Start Generation</span>
              <Sparkles className="h-3 w-3 animate-spin" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
