import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';

interface RevealOnScrollProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  className?: string;
  threshold?: number;
  once?: boolean;
}

const directionMap = {
  up: { y: 1, x: 0 },
  down: { y: -1, x: 0 },
  left: { x: 1, y: 0 },
  right: { x: -1, y: 0 },
};

export function RevealOnScroll({
  children,
  delay = 0,
  direction = 'up',
  distance = 28,
  className = '',
  threshold = 0.1,
  once = true,
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once,
    amount: threshold,
  });

  const { x: dx, y: dy } = directionMap[direction];

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{
        opacity: 0,
        x: dx * distance,
        y: dy * distance,
      }}
      animate={
        isInView
          ? { opacity: 1, x: 0, y: 0 }
          : { opacity: 0, x: dx * distance, y: dy * distance }
      }
      transition={{
        duration: 0.7,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
