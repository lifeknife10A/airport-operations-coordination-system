import React from 'react';
import { CssBaseline } from '@mui/material';
import { CustomThemeProvider } from './theme/CustomThemeProvider';
import AppRoutes from './routes/AppRoutes';
import { Toaster } from 'react-hot-toast';

export const App: React.FC = () => {
  return (
    <CustomThemeProvider>
      <CssBaseline />
      <Toaster position="top-right" />
      <AppRoutes />
    </CustomThemeProvider>
  );
};

export default App;

