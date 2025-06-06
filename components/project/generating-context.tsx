'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface GeneratingContextType {
  isGenerating: boolean;
  setIsGenerating: (value: boolean) => void;
}

const GeneratingContext = createContext<GeneratingContextType | undefined>(
  undefined,
);

export function GeneratingProvider({ children }: { children: ReactNode }) {
  const [isGenerating, setIsGenerating] = useState(false);

  return (
    <GeneratingContext.Provider value={{ isGenerating, setIsGenerating }}>
      {children}
    </GeneratingContext.Provider>
  );
}

export function useGenerating() {
  const context = useContext(GeneratingContext);
  if (context === undefined) {
    throw new Error('useGenerating must be used within a GeneratingProvider');
  }
  return context;
}
