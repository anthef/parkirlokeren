'use client';

import { Button } from '@/components/ui/button';
import { RiArrowRightLine, RiLoader4Line } from 'react-icons/ri';

interface FormActionsProps {
  step: number;
  loading: boolean;
  handleBack: () => void;
  handleNext: () => void;
}

export function FormActions({
  step,
  loading,
  handleBack,
  handleNext,
}: FormActionsProps) {
  return (
    <div className="flex justify-between pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={handleBack}
        disabled={step === 1 || loading}
      >
        Back
      </Button>
      <Button type="button" onClick={handleNext} disabled={loading}>
        {loading ? (
          <>
            <RiLoader4Line className="mr-2 h-4 w-4 animate-spin" />
            {step < 3 ? 'Processing...' : 'Analyzing...'}
          </>
        ) : (
          <>
            {step < 3 ? 'Next' : 'Find Opportunities'}
            <RiArrowRightLine className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
}
