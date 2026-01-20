import React from 'react';

interface RKLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withText?: boolean;
  variant?: 'navbar' | 'footer' | 'hero';
}

const sizeMap = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
};

export const RKLogo: React.FC<RKLogoProps> = ({
  className = '',
  size = 'md',
  withText = false,
  variant = 'navbar'
}) => {
  return (
    <svg
      viewBox="0 0 500 500"
      xmlns="http://www.w3.org/2000/svg"
      className={`${sizeMap[size]} ${className} transition-all duration-300`}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <filter id="dropShadow">
          <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
          <feOffset dx="0" dy="4" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.5" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer black circle border with thick stroke */}
      <circle
        cx="250"
        cy="250"
        r="240"
        fill="#1a1a1a"
        stroke="#1a1a1a"
        strokeWidth="25"
      />

      {/* Main circle background */}
      <circle cx="250" cy="250" r="220" fill="#1a1a1a" />

      {/* Golden circle border */}
      <circle
        cx="250"
        cy="250"
        r="220"
        fill="none"
        stroke="#FDB913"
        strokeWidth="12"
      />

      {/* Decorative curved lines on the left side */}
      <path
        d="M 100 150 Q 90 200 100 250 Q 90 300 100 350"
        stroke="#FDB913"
        strokeWidth="18"
        fill="none"
        strokeLinecap="round"
      />

      {/* Decorative curved lines on the right side (top) */}
      <path
        d="M 380 80 Q 420 120 440 160"
        stroke="#FDB913"
        strokeWidth="16"
        fill="none"
        strokeLinecap="round"
      />

      {/* Decorative curved lines on the right side (middle) */}
      <path
        d="M 450 140 Q 480 180 470 220"
        stroke="#FDB913"
        strokeWidth="14"
        fill="none"
        strokeLinecap="round"
      />

      {/* Letter R - Large, bold, positioned left */}
      <text
        x="130"
        y="290"
        fontSize="180"
        fontWeight="900"
        fill="#FDB913"
        fontFamily="Arial, Helvetica, sans-serif"
        textAnchor="middle"
        dominantBaseline="central"
      >
        R
      </text>

      {/* Letter K - Large, bold, angular, positioned right */}
      <text
        x="320"
        y="290"
        fontSize="180"
        fontWeight="900"
        fill="#FDB913"
        fontFamily="Arial, Helvetica, sans-serif"
        textAnchor="middle"
        dominantBaseline="central"
      >
        K
      </text>

      {/* Inner highlight on the left side */}
      <path
        d="M 110 160 Q 105 200 110 240"
        stroke="#FDB913"
        strokeWidth="6"
        fill="none"
        opacity="0.4"
        strokeLinecap="round"
      />

      {/* Small accent curve at top left corner */}
      <path
        d="M 140 110 Q 170 90 200 100"
        stroke="#FDB913"
        strokeWidth="8"
        fill="none"
        opacity="0.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default RKLogo;
