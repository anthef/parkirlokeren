'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronRight,
  TrendingUp,
  Clock,
  DollarSign,
  AlertTriangle,
  Star,
  Zap,
  Bookmark,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface BusinessRecommendation {
  id: number;
  title: string;
  description: string;
  investmentRequired: string;
  timeCommitment: string;
  riskLevel: string;
  potentialReturns: string;
  matchScore: number;
  isSaved?: boolean;
}

const getRiskConfig = (risk: string) => {
  const riskLower = risk?.toLowerCase() || '';
  if (riskLower.includes('low')) {
    return {
      color: 'text-emerald-700 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/50',
      border: 'border-emerald-200 dark:border-emerald-800',
      icon: <Zap className="h-3 w-3" />,
    };
  }
  if (riskLower.includes('high')) {
    return {
      color: 'text-red-700 dark:text-red-400',
      bg: 'bg-red-50 dark:bg-red-950/50',
      border: 'border-red-200 dark:border-red-800',
      icon: <AlertTriangle className="h-3 w-3" />,
    };
  }
  return {
    color: 'text-amber-700 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/50',
    border: 'border-amber-200 dark:border-amber-800',
    icon: <AlertTriangle className="h-3 w-3" />,
  };
};

const getMatchScoreVariant = (score: number) => {
  if (score >= 90) return 'default';
  if (score >= 80) return 'secondary';
  return 'outline';
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};
const RecommendationCard = ({ rec }: { rec: BusinessRecommendation }) => {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const supabase = createClient();
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(rec.isSaved || false);
  const [savedProjectId, setSavedProjectId] = useState<number | null>(null);
  const riskConfig = getRiskConfig(rec.riskLevel);

  const saveIdea = async () => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please login to save ideas',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSaving(true); // Save the idea to Supabase
      const { data, error } = await supabase
        .from('project')
        .insert({
          title: rec.title,
          description: rec.description,
          status: 'IN_PROGRESS',
          user_id: user.id,
          investment_required: rec.investmentRequired,
          time_commitment: rec.timeCommitment,
          risk_level: rec.riskLevel,
          potential_returns: rec.potentialReturns,
        })
        .select();
      if (error) {
        throw error;
      }

      // Store the saved project ID for redirection
      if (data && data.length > 0) {
        setSavedProjectId(data[0].id);
      }

      setIsSaved(true);
      toast({
        title: 'Idea Saved',
        description:
          'Your business idea has been saved to your dashboard. Click to view details.',
      });
    } catch (error: any) {
      console.error('Error saving idea:', error);
      toast({
        title: 'Error',
        description:
          error.message || 'Failed to save your idea. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{
        y: -8,
        transition: { type: 'spring', stiffness: 300, damping: 20 },
      }}
    >
      <Card className="group relative overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-500 bg-gradient-to-br from-card via-card to-card/50 backdrop-blur-sm">
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />

        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

        <CardContent className="relative p-6 space-y-6">
          {/* Header with enhanced styling */}
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 space-y-3">
              <motion.h3
                className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 leading-tight"
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                {rec.title}
              </motion.h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {rec.description}
              </p>
            </div>

            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <Badge
                variant={getMatchScoreVariant(rec.matchScore)}
                className="px-3 py-1.5 text-sm font-bold shadow-sm backdrop-blur-sm relative"
              >
                <Star className="h-3 w-3 mr-1" />
                {rec.matchScore}% Match
              </Badge>
            </motion.div>
          </div>
          {/* Enhanced metrics grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <motion.div
              className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-muted/40 to-muted/20 border border-border/50 backdrop-blur-sm"
              whileHover={{
                scale: 1.02,
                backgroundColor: 'hsl(var(--muted) / 0.6)',
              }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-2.5 rounded-full bg-primary/10 border border-primary/20">
                <DollarSign className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  Investment Required
                </p>
                <p className="font-semibold text-foreground truncate">
                  {rec.investmentRequired}
                </p>
              </div>
            </motion.div>

            <motion.div
              className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-muted/40 to-muted/20 border border-border/50 backdrop-blur-sm"
              whileHover={{
                scale: 1.02,
                backgroundColor: 'hsl(var(--muted) / 0.6)',
              }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-2.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  Time Commitment
                </p>
                <p className="font-semibold text-foreground truncate">
                  {rec.timeCommitment}
                </p>
              </div>
            </motion.div>

            <motion.div
              className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-muted/40 to-muted/20 border border-border/50 backdrop-blur-sm"
              whileHover={{
                scale: 1.02,
                backgroundColor: 'hsl(var(--muted) / 0.6)',
              }}
              transition={{ duration: 0.2 }}
            >
              <div
                className={`p-2.5 rounded-full ${riskConfig.bg} border ${riskConfig.border}`}
              >
                <div className={riskConfig.color}>{riskConfig.icon}</div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  Risk Level
                </p>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-foreground">
                    {rec.riskLevel}
                  </p>
                  <Badge
                    variant="outline"
                    className={`px-2 py-0.5 text-xs ${riskConfig.color} ${riskConfig.bg} ${riskConfig.border}`}
                  >
                    {rec.riskLevel}
                  </Badge>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-muted/40 to-muted/20 border border-border/50 backdrop-blur-sm"
              whileHover={{
                scale: 1.02,
                backgroundColor: 'hsl(var(--muted) / 0.6)',
              }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  Potential Returns
                </p>
                <p className="font-semibold text-emerald-600 dark:text-emerald-400 truncate">
                  {rec.potentialReturns}
                </p>
              </div>
            </motion.div>
          </div>{' '}
          {/* Enhanced action buttons */}
          <div className="flex gap-4">
            <motion.div
              className="flex-1"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="outline"
                className="w-full h-12 text-base font-medium group/button border-2 relative overflow-hidden bg-gradient-to-r from-background to-background/50 backdrop-blur-sm hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                onClick={() => router.push(`/dashboard/projects/${rec.id}`)}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '0%' }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  View Opportunity
                  <motion.div
                    animate={{ x: 0 }}
                    whileHover={{ x: 4 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </motion.div>
                </span>
              </Button>
            </motion.div>

            <motion.div
              className="flex-1"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {' '}
              <Button
                variant={isSaved ? 'default' : 'secondary'}
                className="w-full h-12 text-base font-medium group/button border-2 relative overflow-hidden transition-all duration-300"
                onClick={
                  isSaved
                    ? () => router.push(`/dashboard/projects/${savedProjectId}`)
                    : saveIdea
                }
                disabled={isSaving}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isSaving ? (
                    <>
                      <span className="animate-pulse">Saving...</span>
                    </>
                  ) : isSaved ? (
                    <>
                      <ChevronRight className="h-4 w-4 mr-2" />
                      View Project
                    </>
                  ) : (
                    <>
                      <Bookmark className="h-4 w-4 mr-2" />
                      Save Idea
                    </>
                  )}
                </span>
              </Button>
            </motion.div>
          </div>
        </CardContent>

        {/* Enhanced hover indicator */}
        <motion.div
          className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary/80 to-primary"
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{ originX: 0 }}
        />
      </Card>
    </motion.div>
  );
};

export default function RecommendationsComponent({
  recommendations,
}: {
  recommendations: BusinessRecommendation[];
}) {
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No recommendations available</p>
      </div>
    );
  }

  return (
    <motion.div
      className="mt-6 grid grid-cols-1 xl:grid-cols-2 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {recommendations.map((rec) => (
        <RecommendationCard key={rec.id} rec={rec} />
      ))}
    </motion.div>
  );
}
