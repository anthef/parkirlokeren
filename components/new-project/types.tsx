'use client';

import { z } from 'zod';
import { newProjectSchema } from '@/lib/validations/auth';

export type NewProjectFormValues = z.infer<typeof newProjectSchema>;

// Import the BusinessRecommendation type from recommendations.tsx to avoid duplication
export type { BusinessRecommendation } from './recommendations';
