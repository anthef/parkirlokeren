'use client';

import { motion } from 'framer-motion';
import { RiLoader4Line } from 'react-icons/ri';
import { Button } from '@/components/ui/button';

interface RecommendationsLoadingProps {
  onCancel?: () => void;
}

export function RecommendationsLoading({
  onCancel,
}: RecommendationsLoadingProps = {}) {
  return (
    <div className="mx-auto px-2 overflow-auto mt-16 flex flex-col items-center justify-center min-h-[60vh]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center space-y-6"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: 'linear',
          }}
          className="text-primary"
        >
          <RiLoader4Line className="h-16 w-16" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-2xl font-bold tracking-tight text-center"
        >
          Analyzing your profile...
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-muted-foreground text-center max-w-md"
        >
          We're finding the best business opportunities based on your
          preferences and market analysis
        </motion.p>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="h-1 bg-primary rounded-full mt-4 max-w-xs"
        />

        {onCancel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Button variant="outline" onClick={onCancel} className="mt-6">
              Cancel
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
