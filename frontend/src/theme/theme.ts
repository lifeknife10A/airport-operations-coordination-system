import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#070b14', // Deep operational black-navy
      paper: '#0f172a',   // Sleek glassmorphic card paper
    },
    primary: {
      main: '#06b6d4',   // Electric Cyan
      light: '#38bdf8',
      dark: '#0891b2',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#6366f1',   // Electric Indigo
      light: '#818cf8',
      dark: '#4f46e5',
      contrastText: '#ffffff',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#94a3b8',
    },
    divider: 'rgba(255, 255, 255, 0.08)',
    warning: {
      main: '#f59e0b',
    },
    error: {
      main: '#f43f5e',
    },
    success: {
      main: '#10b981',
    },
  },
  typography: {
    fontFamily: ['Inter', 'Outfit', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'].join(','),
    h1: { fontFamily: 'Outfit, sans-serif', fontWeight: 800, color: '#f8fafc' },
    h2: { fontFamily: 'Outfit, sans-serif', fontWeight: 800, color: '#f8fafc' },
    h3: { fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: '#f8fafc' },
    h4: { fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: '#f8fafc' },
    h5: { fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: '#f8fafc' },
    h6: { fontFamily: 'Outfit, sans-serif', fontWeight: 600, color: '#f8fafc' },
    subtitle1: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 700 },
  },
  shape: {
    borderRadius: 14,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#070b14',
          color: '#f8fafc',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          minHeight: '44px',
          borderRadius: '10px',
          fontWeight: 700,
          boxShadow: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 20px rgba(6, 182, 212, 0.3)',
            transform: 'translateY(-1px)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
          color: '#ffffff',
        },
        outlined: {
          borderColor: 'rgba(255, 255, 255, 0.15)',
          color: '#f8fafc',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderColor: 'rgba(255, 255, 255, 0.3)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          borderRadius: '8px',
        },
      },
    },
  },
});
