import React from 'react';

interface JerseyIconProps {
  primaryColor: string;
  accentColor: string;
  shirtNumber: number;
  size?: 'sm' | 'md' | 'lg';
}

export const JerseyIcon: React.FC<JerseyIconProps> = ({
  primaryColor,
  accentColor,
  shirtNumber,
  size = 'md',
}) => {
  const dimensions =
    size === 'sm' ? 'w-9 h-9' : size === 'lg' ? 'w-14 h-14' : 'w-11 h-11';
  const textSize =
    size === 'sm' ? 'text-[11px]' : size === 'lg' ? 'text-[16px]' : 'text-[13px]';

  const isLightBody =
    primaryColor.toUpperCase() === '#FFFFFF' ||
    primaryColor.toUpperCase() === '#F8FAFC' ||
    primaryColor.toUpperCase() === '#F1F5F9' ||
    primaryColor.toUpperCase() === '#E2E8F0' ||
    primaryColor.toUpperCase() === '#EAB308';

  const numColor = isLightBody ? '#0F172A' : '#FFFFFF';

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 select-none ${dimensions}`}>
      <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-sm" aria-hidden="true">
        <path
          d="M20 10 L26 10 C27.5 14 36.5 14 38 10 L44 10 L56 18 L51 29 L45 26 L45 54 L19 54 L19 26 L13 29 L8 18 Z"
          fill={primaryColor}
          stroke={accentColor}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M26 10 C27.5 14 36.5 14 38 10"
          fill="none"
          stroke={accentColor}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
      <span
        className={`absolute inset-0 flex items-center justify-center pt-1 font-display font-extrabold leading-none tabular-nums ${textSize}`}
        style={{ color: numColor }}
      >
        {shirtNumber}
      </span>
    </div>
  );
};
