import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/public/Home';
import FlightTracker from '../pages/public/FlightTracker';
import FlightSchedule from '../pages/public/FlightSchedule';
import PassengerServices from '../pages/public/PassengerServices';
import CargoInformation from '../pages/public/CargoInformation';
import AirportInformation from '../pages/public/AirportInformation';
import Contact from '../pages/public/Contact';
import Login from '../pages/auth/Login';

import SystemAdminDashboard from '../pages/dashboards/SystemAdminDashboard';
import AOCCControllerDashboard from '../pages/dashboards/AOCCControllerDashboard';
import GroundOpsSupervisorDashboard from '../pages/dashboards/GroundOpsSupervisorDashboard';
import DepartmentDashboard from '../pages/dashboards/DepartmentDashboard';
import AirsideOpsDashboard from '../pages/dashboards/AirsideOpsDashboard';
import LogisticsDashboard from '../pages/dashboards/LogisticsDashboard';
import PassengerSecurityOpsDashboard from '../pages/dashboards/PassengerSecurityOpsDashboard';

const AppRoutes: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/tracker" element={<FlightTracker />} />
                <Route path="/schedule" element={<FlightSchedule />} />
                <Route path="/passenger-services" element={<PassengerServices />} />
                <Route path="/cargo" element={<CargoInformation />} />
                <Route path="/airport" element={<AirportInformation />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />

                {/* 7 Top-Level Role Dashboard Routes */}
                <Route path="/dashboard/system-admin" element={<SystemAdminDashboard />} />
                <Route path="/dashboard/aocc" element={<AOCCControllerDashboard />} />
                <Route path="/dashboard/ground-ops" element={<GroundOpsSupervisorDashboard />} />
                <Route path="/dashboard/department" element={<DepartmentDashboard />} />
                <Route path="/dashboard/airside-ops" element={<AirsideOpsDashboard />} />
                <Route path="/dashboard/logistics" element={<LogisticsDashboard />} />
                <Route path="/dashboard/passenger-security" element={<PassengerSecurityOpsDashboard />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
