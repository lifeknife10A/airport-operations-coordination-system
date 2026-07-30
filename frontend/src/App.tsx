import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { theme } from './theme/theme';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { PrivateRoute } from './components/PrivateRoute';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { FlightSchedulePage } from './pages/FlightSchedulePage';
import { FlightDetailPage } from './pages/FlightDetailPage';
import { GateAllocationPage } from './pages/GateAllocationPage';
import { TaskTrackerPage } from './pages/TaskTrackerPage';
import { CabinCleaningModule } from './pages/CabinCleaningModule';
import { RefuelingModule } from './pages/RefuelingModule';
import { MaintenanceModule } from './pages/MaintenanceModule';
import { CateringModule } from './pages/CateringModule';
import { BoardingGateModule } from './pages/BoardingGateModule';
import { SecurityClearancePage } from './pages/SecurityClearancePage';
import { PassengerManifestPage } from './pages/PassengerManifestPage';
import { ReportsAnalyticsPage } from './pages/ReportsAnalyticsPage';
import { AuditLogViewer } from './pages/AuditLogViewer';

const RootRouteHandler: React.FC = () => {
  const { user } = useAuth();
  return user ? <DashboardPage /> : <LandingPage />;
};

const AppLayout: React.FC = () => {
  const location = useLocation();
  const isFullPage = location.pathname === '/login' || location.pathname === '/landing' || location.pathname === '/';

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#070b14' }}>
      {!isFullPage && <Navbar />}
      {!isFullPage && <Sidebar />}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: isFullPage ? 0 : '64px',
          width: isFullPage ? '100%' : `calc(100% - 260px)`,
          minHeight: '100vh',
        }}
      >
        <Routes>
          <Route path="/" element={<RootRouteHandler />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/flights" element={<PrivateRoute><FlightSchedulePage /></PrivateRoute>} />
          <Route path="/flights/:id" element={<PrivateRoute><FlightDetailPage /></PrivateRoute>} />
          <Route path="/gates" element={<PrivateRoute><GateAllocationPage /></PrivateRoute>} />
          <Route path="/tasks" element={<PrivateRoute><TaskTrackerPage /></PrivateRoute>} />
          
          <Route path="/cleaning" element={<PrivateRoute><CabinCleaningModule /></PrivateRoute>} />
          <Route path="/refueling" element={<PrivateRoute><RefuelingModule /></PrivateRoute>} />
          <Route path="/maintenance" element={<PrivateRoute><MaintenanceModule /></PrivateRoute>} />
          <Route path="/catering" element={<PrivateRoute><CateringModule /></PrivateRoute>} />
          
          <Route path="/boarding" element={<PrivateRoute><BoardingGateModule /></PrivateRoute>} />
          <Route path="/security" element={<PrivateRoute><SecurityClearancePage /></PrivateRoute>} />
          <Route path="/manifest" element={<PrivateRoute><PassengerManifestPage /></PrivateRoute>} />
          
          <Route path="/reports" element={<PrivateRoute><ReportsAnalyticsPage /></PrivateRoute>} />
          <Route path="/audit" element={<PrivateRoute><AuditLogViewer /></PrivateRoute>} />
        </Routes>
      </Box>
    </Box>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
