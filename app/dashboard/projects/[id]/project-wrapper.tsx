'use client';

import { ReactNode } from 'react';
import { GeneratingProvider } from '@/components/project/generating-context';

export function ProjectWrapper({ children }: { children: ReactNode }) {
  return <GeneratingProvider>{children}</GeneratingProvider>;
}
