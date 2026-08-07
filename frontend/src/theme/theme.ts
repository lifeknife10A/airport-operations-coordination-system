import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0B1020', // Operational Navy
      paper: '#151B2F',   // Dark Glass Cards
    },
    primary: {
      main: '#210780',   // Primary Navy
      light: '#4C51E2',
      dark: '#12172B',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#4C51E2',   // Secondary Blue
      light: '#818cf8',
      dark: '#210780',
      contrastText: '#ffffff',
    },
    text: {
      primary: '#F4F4F4',
      secondary: 'rgba(244, 244, 244, 0.75)',
    },
    divider: '#D4C8A6', // Soft Neutral (Pale Oak)
  },
  typography: {
    fontFamily: ['Playfair Display', 'Outfit', 'Inter', '-apple-system', 'sans-serif'].join(','),
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#0B1020',
          color: '#F4F4F4',
          transition: 'background-color 0.3s ease, color 0.3s ease',
        },
      },
    },
  }
});
