import React from 'react';
import { Box } from '@mui/material';

export interface PriorityBadgeProps {
  priority: 'HIGH' | 'MEDIUM' | 'ROUTINE' | 'LOW' | 'CRITICAL' | string;
  size?: 'small' | 'medium';
  labelOverride?: string;
}

/**
 * Professional Aeronautical Priority Tag Badge
 * Clean rectangular micro-tag with flat status indicators (zero AI-slop 3D emoji spheres).
 */
export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  size = 'small',
  labelOverride,
}) => {
  const norm = (priority || '').toUpperCase();

  let isHigh = norm === 'HIGH' || norm === 'CRITICAL' || norm === 'URGENT';
  let isMedium = norm === 'MEDIUM' || norm === 'WARNING';
  let label = labelOverride || (isHigh ? 'HIGH PRIORITY' : isMedium ? 'MEDIUM' : 'ROUTINE');

  const config = isHigh
    ? {
        bg: '#FEF2F2',
        border: '#FECACA',
        text: '#DC2626',
        dot: '#DC2626',
      }
    : isMedium
    ? {
        bg: '#FFFBEB',
        border: '#FED7AA',
        text: '#D97706',
        dot: '#D97706',
      }
    : {
        bg: '#F8FAFC',
        border: '#E2E8F0',
        text: '#64748B',
        dot: '#94A3B8',
      };

  const isSmall = size === 'small';

  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        px: isSmall ? '7px' : '9px',
        py: isSmall ? '2px' : '4px',
        borderRadius: '4px',
        bgcolor: config.bg,
        border: `1px solid ${config.border}`,
        color: config.text,
        fontFamily: "'Outfit', sans-serif",
        fontSize: isSmall ? '0.68rem' : '0.74rem',
        fontWeight: 700,
        letterSpacing: '0.03em',
        lineHeight: 1.2,
        userSelect: 'none',
        whiteSpace: 'nowrap',
      }}
    >
      <Box
        component="span"
        sx={{
          width: isSmall ? 5 : 6,
          height: isSmall ? 5 : 6,
          borderRadius: '50%',
          bgcolor: config.dot,
          flexShrink: 0,
        }}
      />
      {label}
    </Box>
  );
};
