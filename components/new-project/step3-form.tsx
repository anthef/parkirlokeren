'use client';

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { Control } from 'react-hook-form';
import { NewProjectFormValues } from './types';

interface Step3FormProps {
  control: Control<NewProjectFormValues>;
}

export function Step3Form({ control }: Step3FormProps) {
  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <FormField
        control={control}
        name="investmentBudget"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Initial Investment Budget</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select investment range" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="under-1k">Under $1,000</SelectItem>
                <SelectItem value="1k-10k">$1,000 - $10,000</SelectItem>
                <SelectItem value="10k-50k">$10,000 - $50,000</SelectItem>
                <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                <SelectItem value="100k+">$100,000+</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="riskTolerance"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Risk Tolerance</FormLabel>
            <FormControl>
              <div className="pt-4">
                <Slider
                  defaultValue={[field.value]}
                  max={5}
                  step={1}
                  onValueChange={(value) => field.onChange(value[0])}
                  className="mb-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Very Low</span>
                  <span>Low</span>
                  <span>Medium</span>
                  <span>High</span>
                  <span>Very High</span>
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="businessGoal"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Primary Business Goal</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="income" />
                  </FormControl>
                  <FormLabel className="font-normal">Steady Income</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="growth" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Growth & Expansion
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="passion" />
                  </FormControl>
                  <FormLabel className="font-normal">Pursue Passion</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="exit" />
                  </FormControl>
                  <FormLabel className="font-normal">Build & Sell</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="additionalInfo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Additional Information</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Any other information that might help us find the right opportunity for you"
                rows={4}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </motion.div>
  );
}
