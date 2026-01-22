'use client';

import { ReactNode } from 'react';

interface DialogueBoxProps {
  children: ReactNode;
  className?: string;
}

export function DialogueBox({ children, className = '' }: DialogueBoxProps) {
  return (
    <div
      className={`
        flex-1
        parchment
        rounded-lg
        p-4
        border
        border-amber-900/20
        ${className}
      `}
    >
      {children}
    </div>
  );
}
