import React from 'react';

interface AmcorLogoProps {
  variant?: 'light' | 'dark';
  compact?: boolean;
}

export const AmcorLogo: React.FC<AmcorLogoProps> = ({
  variant = 'dark',
  compact = false,
}) => {
  const wordmarkColor = variant === 'light' ? '#FFFFFF' : '#00284D';
  const subColor = variant === 'light' ? 'text-emerald-300' : 'text-[#009639]';

  return (
    <div className="flex items-center gap-2.5 select-none shrink-0">
      <svg
        width="38"
        height="34"
        viewBox="0 0 64 58"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Logo Amcor"
        className="shrink-0"
      >
        <defs>
          <linearGradient id="amcorBlueRibbon" x1="6" y1="10" x2="40" y2="54" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00284D" />
            <stop offset="55%" stopColor="#005EB8" />
            <stop offset="100%" stopColor="#009FDF" />
          </linearGradient>
          <linearGradient id="amcorGreenRibbon" x1="22" y1="6" x2="58" y2="38" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#009FDF" />
            <stop offset="50%" stopColor="#009639" />
            <stop offset="100%" stopColor="#3CB043" />
          </linearGradient>
          <linearGradient id="amcorCyanBottom" x1="12" y1="48" x2="58" y2="26" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00284D" />
            <stop offset="65%" stopColor="#00843D" />
            <stop offset="100%" stopColor="#009FDF" />
          </linearGradient>
        </defs>
        <path
          d="M28 8C14 11 5 22 6 35C7 47 19 54 33 50C21 48 15 39 17 28C19 19 25 13 35 10L28 8Z"
          fill="url(#amcorBlueRibbon)"
        />
        <path
          d="M24 10C34 5 49 9 56 20C61 28 59 38 52 45C54 35 50 25 40 20C32 16 24 17 17 22C18 16 20 12 24 10Z"
          fill="url(#amcorGreenRibbon)"
        />
        <path
          d="M15 44C23 53 39 54 50 46C55 42 58 35 58 29C54 39 43 44 31 42C23 41 18 39 15 44Z"
          fill="url(#amcorCyanBottom)"
        />
      </svg>
      {!compact && (
        <div className="leading-none">
          <div className="flex items-baseline gap-1.5">
            <span
              className="font-display text-lg font-extrabold tracking-tight lowercase"
              style={{ color: wordmarkColor }}
            >
              amcor
            </span>
            <span className="text-[11px] font-bold tracking-wide text-[#009FDF]">
              InkScale
            </span>
          </div>
          <div className={`text-[10px] font-semibold tracking-wider uppercase mt-0.5 ${subColor}`}>
            Central de Tintas
          </div>
        </div>
      )}
    </div>
  );
};
