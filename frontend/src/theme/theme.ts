import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#FAF9F6', // vE Warm Porcelain White
      paper: '#FFFFFF',   // Crisp Surface
    },
    primary: {
      main: '#1E3A5F',   // vE Authoritative Navy
      light: '#2D5584',
      dark: '#0F2942',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#0284C7',   // Precision Sky Cyan
      light: '#38BDF8',
      dark: '#0369A1',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#10B981',   // Status Sage Green
      light: '#34D399',
      dark: '#059669',
      contrastText: '#FFFFFF',
    },
    text: {
      primary: '#0F2942', // Deep Navy
      secondary: '#475569', // Muted Slate
    },
    divider: '#E5E7EB',
  },
  typography: {
    fontFamily: ['Plus Jakarta Sans', 'Inter', 'Outfit', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'].join(','),
    h1: {
      fontWeight: 700,
      fontSize: '2.85rem',
      lineHeight: 1.12,
      letterSpacing: '-0.03em',
      color: '#0F2942',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.2rem',
      lineHeight: 1.18,
      letterSpacing: '-0.02em',
      color: '#0F2942',
    },
    h3: {
      fontWeight: 700,
      fontSize: '1.65rem',
      lineHeight: 1.25,
      letterSpacing: '-0.015em',
      color: '#0F2942',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.35rem',
      lineHeight: 1.35,
      color: '#0F2942',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.15rem',
      lineHeight: 1.4,
      color: '#0F2942',
    },
    h6: {
      fontWeight: 600,
      fontSize: '0.95rem',
      lineHeight: 1.5,
      color: '#0F2942',
    },
    body1: {
      fontSize: '0.95rem',
      fontWeight: 400,
      lineHeight: 1.65,
      color: '#475569',
    },
    body2: {
      fontSize: '0.85rem',
      fontWeight: 400,
      lineHeight: 1.55,
      color: '#475569',
    },
  },
  shape: {
    borderRadius: 14,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#FAF9F6',
          color: '#0F2942',
          fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
        },
        '*::-webkit-scrollbar': {
          width: '6px',
          height: '6px',
        },
        '*::-webkit-scrollbar-track': {
          background: '#FAF9F6',
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: '#CBD5E1',
          borderRadius: '4px',
        },
        '*::-webkit-scrollbar-thumb:hover': {
          backgroundColor: '#94A3B8',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0 10px 30px rgba(30, 58, 95, 0.04)',
          border: '1px solid #E5E7EB',
        },
      },
    },
  },
});

export default theme;
