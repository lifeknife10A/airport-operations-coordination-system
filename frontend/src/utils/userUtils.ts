/**
 * Utility functions for user profiles and operational identity.
 */

export const getUserInitials = (name?: string): string => {
  if (!name || !name.trim()) return 'AL';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    const first = parts[0][0] || '';
    const last = parts[parts.length - 1][0] || '';
    return (first + last).toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
};
