import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/public/Home';
import FlightTracker from '../pages/public/FlightTracker';
import FlightSchedule from '../pages/public/FlightSchedule';
import PassengerServices from '../pages/public/PassengerServices';
import CargoInformation from '../pages/public/CargoInformation';
import AirportInformation from '../pages/public/AirportInformation';
import Contact from '../pages/public/Contact';
import Login from '../pages/auth/Login';
import ProtectedRoute from '../components/auth/ProtectedRoute';

const SystemAdminDashboard = lazy(() => import('../pages/dashboards/SystemAdminDashboard'));
const AOCCControllerDashboard = lazy(() => import('../pages/dashboards/AOCCControllerDashboard'));
const GroundOpsSupervisorDashboard = lazy(() => import('../pages/dashboards/GroundOpsSupervisorDashboard'));
const DepartmentDashboard = lazy(() => import('../pages/dashboards/DepartmentDashboard'));
const BillingDashboard = lazy(() => import('../pages/dashboards/BillingDashboard'));
const AirsideOpsDashboard = lazy(() => import('../pages/dashboards/AirsideOpsDashboard'));
const LogisticsDashboard = lazy(() => import('../pages/dashboards/LogisticsDashboard'));
const PassengerSecurityOpsDashboard = lazy(() => import('../pages/dashboards/PassengerSecurityOpsDashboard'));
const PassengerCheckInDashboard = lazy(() => import('../pages/dashboards/PassengerCheckInDashboard'));

const AppRoutes: React.FC = () => {
    return (
        <BrowserRouter>
            <Suspense fallback={<div style={{ padding: 32, fontFamily: 'sans-serif' }}>Loading…</div>}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/tracker" element={<FlightTracker />} />
                <Route path="/schedule" element={<FlightSchedule />} />
                <Route path="/passenger-services" element={<PassengerServices />} />
                <Route path="/cargo" element={<CargoInformation />} />
                <Route path="/airport" element={<AirportInformation />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />

                {/* Role dashboards: each is only reachable by the roles mapped to it in auth/roleRoutes.ts */}
                <Route path="/dashboard/system-admin" element={<ProtectedRoute dashboard="system-admin"><SystemAdminDashboard /></ProtectedRoute>} />
                <Route path="/dashboard/aocc" element={<ProtectedRoute dashboard="aocc"><AOCCControllerDashboard /></ProtectedRoute>} />
                <Route path="/dashboard/ground-ops" element={<ProtectedRoute dashboard="ground-ops"><GroundOpsSupervisorDashboard /></ProtectedRoute>} />
                <Route path="/dashboard/billing" element={<ProtectedRoute dashboard="billing"><BillingDashboard /></ProtectedRoute>} />
                <Route path="/dashboard/department" element={<ProtectedRoute dashboard="department"><DepartmentDashboard /></ProtectedRoute>} />
                <Route path="/dashboard/airside-ops" element={<ProtectedRoute dashboard="airside-ops"><AirsideOpsDashboard /></ProtectedRoute>} />
                <Route path="/dashboard/logistics" element={<ProtectedRoute dashboard="logistics"><LogisticsDashboard /></ProtectedRoute>} />
                <Route path="/dashboard/passenger-security" element={<ProtectedRoute dashboard="passenger-security"><PassengerSecurityOpsDashboard /></ProtectedRoute>} />
                <Route path="/dashboard/check-in" element={<ProtectedRoute dashboard="check-in"><PassengerCheckInDashboard /></ProtectedRoute>} />
            </Routes>
            </Suspense>
        </BrowserRouter>
    );
};

export default AppRoutes;
