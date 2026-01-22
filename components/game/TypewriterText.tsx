'use client';

import { useState, useEffect, useCallback } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
}

export function TypewriterText({
  text,
  speed = 30,
  onComplete,
  className = ''
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Reset when text changes
  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
    setIsComplete(false);
  }, [text]);

  // Typewriter effect
  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else if (!isComplete) {
      // Call onComplete even for empty text so scenes can advance
      setIsComplete(true);
      onComplete?.();
    }
  }, [currentIndex, text, speed, onComplete, isComplete]);

  // Click to complete instantly
  const handleClick = useCallback(() => {
    if (currentIndex < text.length) {
      setDisplayedText(text);
      setCurrentIndex(text.length);
      setIsComplete(true);
      onComplete?.();
    }
  }, [currentIndex, text, onComplete]);

  return (
    <p
      onClick={handleClick}
      className={`text-amber-100/90 text-lg leading-relaxed font-serif cursor-pointer select-none ${className}`}
    >
      {displayedText}
      {currentIndex < text.length && (
        <span className="cursor-blink ml-0.5 text-amber-600">|</span>
      )}
    </p>
  );
}
