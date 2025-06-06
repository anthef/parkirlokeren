'use client';

import { motion } from 'framer-motion';

interface StepIndicatorProps {
  currentStep: number;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-12"
    >
      <div className="flex items-center justify-center">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center">
            <div
              className={`flex h-10 w-10 items-center justify-center relative rounded-full border-2 ${
                currentStep >= i
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-muted-foreground/20 text-muted-foreground'
              }`}
            >
              {i}
              {i === 1 ? (
                <div
                  className={`absolute text-xs ${
                    currentStep >= 1 ? 'text-primary' : 'text-muted-foreground'
                  } whitespace-nowrap -bottom-5`}
                >
                  Personal Info
                </div>
              ) : i === 2 ? (
                <div
                  className={`absolute text-xs ${
                    currentStep >= 2 ? 'text-primary' : 'text-muted-foreground'
                  } whitespace-nowrap -bottom-5`}
                >
                  Business Preferences
                </div>
              ) : (
                <div
                  className={`absolute text-xs ${
                    currentStep >= 3 ? 'text-primary' : 'text-muted-foreground'
                  } whitespace-nowrap -bottom-5`}
                >
                  Resources & Goals
                </div>
              )}
            </div>
            {i < 3 && (
              <div
                className={`h-1 w-32 ${
                  currentStep > i ? 'bg-primary' : 'bg-muted-foreground/20'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
