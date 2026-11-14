import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Exact spring configuration from reference portfolio for natural trailing ring
  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const ringX = useSpring(cursorX, springConfig);
  const ringY = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Only activate on devices with a fine pointer (desktop mouse / trackpad)
    if (typeof window === 'undefined') return;
    const hasPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!hasPointer) return;

    const moveCursor = (e: MouseEvent) => {
      if (!isVisible) {
        cursorX.set(e.clientX);
        cursorY.set(e.clientY);
        ringX.jump(e.clientX);
        ringY.jump(e.clientY);
        setIsVisible(true);
      } else {
        cursorX.set(e.clientX);
        cursorY.set(e.clientY);
      }

      const target = e.target as HTMLElement | null;
      const isInteractive = !!target?.closest(
        'a, button, [role="button"], input, select, textarea, .nav-frame, .arch-card, .chip, [data-interactive="true"]'
      );
      setIsHovering(isInteractive);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', moveCursor, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [cursorX, cursorY, ringX, ringY, isVisible]);

  return (
    <>
      {/* Inner dot — directly replaces the mouse arrow, tracking cursor instantly */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full bg-[#FF6B35]"
        style={{
          x: cursorX,
          y: cursorY,
          width: isHovering ? 5 : 8,
          height: isHovering ? 5 : 8,
          translateX: '-50%',
          translateY: '-50%',
          opacity: isVisible ? 1 : 0,
          boxShadow: '0 0 10px rgba(255, 107, 53, 0.7)',
        }}
        transition={{
          width: { duration: 0.15 },
          height: { duration: 0.15 },
          opacity: { duration: 0.2 },
        }}
      />

      {/* Outer ring — follows with spring physics at normal speed */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full border"
        style={{
          x: ringX,
          y: ringY,
          width: isHovering ? 50 : 32,
          height: isHovering ? 50 : 32,
          borderColor: isHovering
            ? '#FF6B35'
            : 'rgba(255, 107, 53, 0.35)',
          backgroundColor: isHovering
            ? 'rgba(255, 107, 53, 0.08)'
            : 'transparent',
          translateX: '-50%',
          translateY: '-50%',
          opacity: isVisible ? 1 : 0,
        }}
        transition={{
          width: { duration: 0.15 },
          height: { duration: 0.15 },
          borderColor: { duration: 0.15 },
          backgroundColor: { duration: 0.15 },
          opacity: { duration: 0.2 },
        }}
      />
    </>
  );
}
