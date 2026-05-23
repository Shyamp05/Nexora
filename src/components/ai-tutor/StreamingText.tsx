import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface StreamingTextProps {
  content: string;
  speed?: number;
  onComplete?: () => void;
}

/**
 * StreamingText — reveals text character-by-character with a blinking cursor,
 * simulating ChatGPT-style streaming output.
 */
export default function StreamingText({ content, speed = 30, onComplete }: StreamingTextProps) {
  const [displayedLength, setDisplayedLength] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setDisplayedLength(0);
    setIsComplete(false);

    intervalRef.current = setInterval(() => {
      setDisplayedLength((prev) => {
        if (prev >= content.length) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setIsComplete(true);
          onComplete?.();
          return content.length;
        }
        return prev + 1;
      });
    }, speed);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [content, speed, onComplete]);

  return (
    <span>
      {content.slice(0, displayedLength)}
      {!isComplete && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="inline-block w-[2px] h-[1em] bg-cyan-400 ml-0.5 align-text-bottom"
        />
      )}
    </span>
  );
}
