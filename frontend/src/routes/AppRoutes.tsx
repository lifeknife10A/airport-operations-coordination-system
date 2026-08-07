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
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
