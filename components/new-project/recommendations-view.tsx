"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import RecommendationsComponent, {
  BusinessRecommendation,
} from "./recommendations";
import { AIReasoning } from "./ai-reasoning";

interface RecommendationsViewProps {
  recommendations: BusinessRecommendation[];
  aiReason: string;
  citations: any[];
  setShowRecommendations: (show: boolean) => void;
}

export function RecommendationsView({
  recommendations,
  aiReason,
  citations,
  setShowRecommendations,
}: RecommendationsViewProps) {
  const router = useRouter();

  return (
    <div className="mx-auto px-2 overflow-auto mt-16">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold tracking-tight text-center mb-2"
      >
        Business Recommendations
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-muted-foreground text-center mb-8"
      >
        We've analyzed your profile and found these opportunities that match
        your preferences
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-6">
          <AIReasoning aiReason={aiReason} citations={citations} />
          <RecommendationsComponent recommendations={recommendations} />
        </div>
        <div className="mt-6 flex justify-between">
          <Button
            variant="outline"
            onClick={() => setShowRecommendations(false)}
          >
            Back to Form
          </Button>
          <Button onClick={() => router.push("/dashboard")}>
            Continue to Dashboard
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
