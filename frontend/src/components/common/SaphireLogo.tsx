import React from 'react';
import { Box, Typography } from '@mui/material';
import saphireLogoClean from '../../assets/saphire_logo_clean.png';

export interface SaphireLogoProps {
  /** Size of the logo mark icon in px (default: 40) */
  size?: number;
  /** Layout style: 'full' includes wordmark, 'mark' is icon only */
  variant?: 'full' | 'mark';
  /** Title text (default: 'SAPHIRE') */
  title?: string;
  /** Subtitle caption text (default: 'INTERNATIONAL AIRPORT') */
  subtitle?: string;
  /** Color theme: 'dark' (navy text) or 'light' (white text) */
  theme?: 'dark' | 'light';
  /** Optional click handler */
  onClick?: () => void;
}

/**
 * Official Saphire International Airport Brand Identity Logo
 * Uses the official supersonic jet faceted crystal apex mark from assets.
 */
export const SaphireLogo: React.FC<SaphireLogoProps> = ({
  size = 40,
  variant = 'full',
  title = 'SAPHIRE',
  subtitle = 'INTERNATIONAL AIRPORT',
  theme = 'dark',
  onClick,
}) => {
  const isLight = theme === 'light';
  const textColor = isLight ? '#FFFFFF' : '#0F2942';
  const subColor = isLight ? '#38BDF8' : '#0284C7';

  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1.4,
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none',
        flexShrink: 0,
      }}
    >
      {/* Official Saphire Jet Emblem Asset */}
      <Box
        component="img"
        src={saphireLogoClean}
        alt="Saphire International Airport"
        sx={{
          height: `${size}px`,
          width: 'auto',
          maxWidth: `${Math.round(size * 1.35)}px`,
          objectFit: 'contain',
          display: 'block',
          flexShrink: 0,
          filter: isLight
            ? 'drop-shadow(0 2px 10px rgba(56, 189, 248, 0.4))'
            : 'drop-shadow(0 2px 8px rgba(2, 132, 199, 0.22))',
          imageRendering: '-webkit-optimize-contrast',
        }}
      />

      {/* Official Typography Wordmark */}
      {variant !== 'mark' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <Typography
            sx={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 800,
              fontSize: `${Math.max(14, Math.round(size * 0.44))}px`,
              color: textColor,
              letterSpacing: '-0.025em',
              lineHeight: 1.1,
              whiteSpace: 'nowrap',
            }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: `${Math.max(9, Math.round(size * 0.22))}px`,
              color: subColor,
              fontWeight: 700,
              letterSpacing: '0.12em',
              lineHeight: 1.1,
              mt: '2px',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
          >
            {subtitle}
          </Typography>
        </Box>
      )}
    </Box>
  );
};
