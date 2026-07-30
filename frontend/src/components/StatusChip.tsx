import React from 'react';
import { Chip } from '@mui/material';

interface StatusChipProps {
  status: string;
  size?: 'small' | 'medium';
}

export const StatusChip: React.FC<StatusChipProps> = ({ status, size = 'small' }) => {
  const getStatusStyle = (s: string) => {
    switch (s.toUpperCase()) {
      case 'READY':
      case 'COMPLETED':
      case 'AIRBORNE':
      case 'AVAILABLE':
        return { bg: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.35)' };
      case 'IN_PROGRESS':
      case 'SERVICING':
      case 'BOARDING':
      case 'ON_BLOCK':
        return { bg: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.35)' };
      case 'DELAYED':
      case 'CRITICAL':
      case 'MAINTENANCE':
        return { bg: 'rgba(244, 63, 94, 0.15)', color: '#fb7185', border: '1px solid rgba(244, 63, 94, 0.35)' };
      case 'SCHEDULED':
      case 'LANDED':
      case 'PENDING':
      case 'OCCUPIED':
      default:
        return { bg: 'rgba(6, 182, 212, 0.15)', color: '#38bdf8', border: '1px solid rgba(6, 182, 212, 0.35)' };
    }
  };

  const style = getStatusStyle(status);

  return (
    <Chip
      label={status.replace(/_/g, ' ')}
      size={size}
      sx={{
        backgroundColor: style.bg,
        color: style.color,
        border: style.border,
        borderRadius: '8px',
        fontWeight: 700,
        fontSize: size === 'small' ? '0.72rem' : '0.85rem',
        letterSpacing: '0.5px',
      }}
    />
  );
};
