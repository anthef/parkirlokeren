'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { newProjectSchema } from '@/lib/validations/auth';
import { Form } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Step1Form } from './step1-form';
import { Step2Form } from './step2-form';
import { Step3Form } from './step3-form';
import { StepIndicator } from './step-indicator';
import { FormActions } from './form-actions';
import { RecommendationsView } from './recommendations-view';
import { RecommendationsLoading } from './recommendations-loading';
import { NewProjectFormValues } from './types';
import { BusinessRecommendation } from './recommendations';

export function NewProjectForm() {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<
    BusinessRecommendation[]
  >([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [showLoadingView, setShowLoadingView] = useState(false);
  const [aiReason, setAiReason] = useState<string>('');
  const [citations, setCitations] = useState<any[]>([]);

  const form = useForm<NewProjectFormValues>({
    resolver: zodResolver(newProjectSchema),
    defaultValues: {
      location: '',
      ageRange: '',
      skills: '',
      education: 'bachelors',
      businessType: 'both',
      industry: 'technology',
      timeAvailability: 20,
      soloEntrepreneur: true,
      hiringEmployees: true,
      openToPartnerships: true,
      investmentBudget: '10k-50k',
      riskTolerance: 3,
      businessGoal: 'income',
      additionalInfo: '',
    },
  });

  const handleNext = () => {
    if (step === 1) {
      const step1Fields = ['location', 'ageRange', 'skills', 'education'];
      const step1Valid = step1Fields.every(
        (field) => form.getFieldState(field as any).invalid === false,
      );

      if (step1Valid) {
        setStep(2);
      } else {
        form.trigger(step1Fields as any);
      }
    } else if (step === 2) {
      const step2Fields = [
        'businessType',
        'industry',
        'timeAvailability',
        'soloEntrepreneur',
        'hiringEmployees',
        'openToPartnerships',
      ];
      const step2Valid = step2Fields.every(
        (field) => form.getFieldState(field as any).invalid === false,
      );

      if (step2Valid) {
        setStep(3);
      } else {
        form.trigger(step2Fields as any);
      }
    } else {
      form.handleSubmit(onSubmit)();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  async function onSubmit(data: NewProjectFormValues) {
    setLoading(true);
    setShowLoadingView(true);

    try {
      // Call our API endpoint to get recommendations from Perplexity
      const response = await fetch('/api/business-recommendation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }
      const result = await response.json();
      setRecommendations(result.recommendations);
      setShowRecommendations(true);

      // If there's a reason from Perplexity, we can display it
      if (result.reason) {
        setAiReason(result.reason);
      }

      // If there are citations from Perplexity
      if (result.citations && Array.isArray(result.citations)) {
        setCitations(result.citations);
      }

      toast({
        title: 'Analysis complete!',
        description: "We've found some opportunities that match your profile.",
      });
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setShowLoadingView(false); // Reset loading view on error
      toast({
        title: 'Error',
        description:
          'There was a problem generating business recommendations. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  const handleCancelAnalysis = () => {
    setShowLoadingView(false);
    setLoading(false);
  };

  if (showRecommendations) {
    return (
      <RecommendationsView
        recommendations={recommendations}
        aiReason={aiReason}
        citations={citations}
        setShowRecommendations={setShowRecommendations}
      />
    );
  }

  if (showLoadingView) {
    return <RecommendationsLoading onCancel={handleCancelAnalysis} />;
  }

  return (
    <div className="max-w-2xl mx-auto px-2 overflow-auto mt-16">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold tracking-tight text-center mb-2"
      >
        Create New Project
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-muted-foreground text-center mb-4"
      >
        Tell us about your interests and constraints to find the perfect
        business opportunity.
      </motion.p>

      <StepIndicator currentStep={step} />

      <Form {...form}>
        <form className="space-y-6">
          <AnimatePresence mode="wait">
            {step === 1 && <Step1Form control={form.control} />}
            {step === 2 && <Step2Form control={form.control} />}
            {step === 3 && <Step3Form control={form.control} />}
          </AnimatePresence>

          <FormActions
            step={step}
            loading={loading}
            handleBack={handleBack}
            handleNext={handleNext}
          />
        </form>
      </Form>
    </div>
  );
}
