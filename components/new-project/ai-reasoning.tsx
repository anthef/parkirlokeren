'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface AIReasoningProps {
  aiReason: string;
  citations: any[];
}

export function AIReasoning({ aiReason, citations }: AIReasoningProps) {
  if (!aiReason) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mt-4 rounded-md border p-4 text-sm"
    >
      <Collapsible>
        <CollapsibleTrigger asChild>
          <motion.div
            className="flex justify-between items-center cursor-pointer"
            whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center">
              <motion.p
                className="font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                AI Analysis
              </motion.p>
              {citations && citations.length > 0 && (
                <motion.span
                  className="ml-2 text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  {citations.length} reference{citations.length > 1 ? 's' : ''}
                </motion.span>
              )}
            </div>
            <motion.div
              whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
              transition={{ duration: 0.2 }}
            >
              <Button variant="ghost" size="sm">
                <motion.div
                  animate={{ rotate: 180 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="h-4 w-4" />
                </motion.div>
              </Button>
            </motion.div>
          </motion.div>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 text-xs text-muted-foreground">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <motion.p
                className="text-justify"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                {aiReason}
              </motion.p>

              {citations && citations.length > 0 && (
                <motion.div
                  className="mt-4 pt-4 border-t"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <motion.p
                    className="font-medium mb-2"
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    References:
                  </motion.p>
                  <ul className="list-disc pl-5 space-y-1">
                    {citations.map((citation, index) => (
                      <motion.li
                        key={`${citation}-${index}`}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: 0.3 + index * 0.1,
                        }}
                      >
                        {citation && (
                          <a
                            href={citation}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-1 text-primary hover:underline"
                          >
                            {citation}
                          </a>
                        )}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </CollapsibleContent>
      </Collapsible>
    </motion.div>
  );
}
