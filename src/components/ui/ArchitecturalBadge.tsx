import React, { useId } from 'react';

interface ArchitecturalBadgeProps {
  size?: number | string;
  speed?: number;
  isStatic?: boolean;
  className?: string;
  centerText?: string;
  legendText?: string;
}

export function ArchitecturalBadge({
  size = 42,
  speed = 1,
  isStatic = false,
  className = '',
  centerText = 'PO',
  legendText = 'OPERATIONS',
}: ArchitecturalBadgeProps) {
  const rawId = useId();
  const uid = `arch-badge-${rawId.replace(/:/g, '')}`;

  const outerDur = (22 / speed).toFixed(2);
  const innerDur = (14 / speed).toFixed(2);

  const outerStyle = isStatic
    ? {}
    : {
        transformOrigin: '250px 250px',
        animation: `scroll ${outerDur}s linear infinite`,
      };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 500 500"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Operations Architectural Badge"
      className={className}
      style={{ display: 'block', overflow: 'hidden' }}
    >
      <defs>
        <radialGradient id={`${uid}-bg`} cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#1a120c" />
          <stop offset="100%" stopColor="#080605" />
        </radialGradient>
        <radialGradient id={`${uid}-disk`} cx="38%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#2a160d" />
          <stop offset="100%" stopColor="#0e0704" />
        </radialGradient>
        <linearGradient id={`${uid}-num`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#f3efe8" />
          <stop offset="100%" stopColor="var(--accent)" />
        </linearGradient>
      </defs>

      {/* Background circular plate */}
      <circle cx="250" cy="250" r="248" fill={`url(#${uid}-bg)`} />

      {/* Outer guide ring */}
      <circle
        cx="250"
        cy="250"
        r="214"
        fill="none"
        stroke="#241710"
        strokeWidth="3"
      />

      {/* Rotating dotted ring */}
      <g style={outerStyle}>
        <circle
          cx="250"
          cy="250"
          r="205"
          fill="none"
          stroke="#422214"
          strokeWidth="2.5"
          strokeDasharray="4 9"
        />
        {/* Cardinal copper dots */}
        <circle cx="250" cy="45" r="5" fill="var(--accent)" />
        <circle cx="455" cy="250" r="5" fill="var(--accent)" />
        <circle cx="250" cy="455" r="5" fill="var(--accent)" />
        <circle cx="45" cy="250" r="5" fill="var(--accent)" />
      </g>

      {/* Pulsing copper rim */}
      <circle
        cx="250"
        cy="250"
        r="179"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2"
        opacity="0.5"
      />

      {/* Disk */}
      <circle cx="250" cy="250" r="156" fill={`url(#${uid}-disk)`} />
      <circle
        cx="250"
        cy="250"
        r="156"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.5"
        opacity="0.3"
      />

      {/* Center symbol text */}
      <text
        x="250"
        y="272"
        fontFamily="'DM Serif Display', Georgia, serif"
        fontSize="140"
        fontWeight="bold"
        fill={`url(#${uid}-num)`}
        textAnchor="middle"
        dominantBaseline="middle"
        letterSpacing="-3"
      >
        {centerText}
      </text>

      {/* Legend text */}
      <text
        x="250"
        y="172"
        fontFamily="'DM Mono', monospace"
        fontSize="12"
        fontWeight="500"
        letterSpacing="6"
        fill="var(--accent)"
        textAnchor="middle"
      >
        {legendText}
      </text>
    </svg>
  );
}
