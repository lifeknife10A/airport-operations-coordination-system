import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Hero from '../../components/home/Hero/Hero';
import PromotionsSection from '../../components/home/PromotionsSection';
import CombinedServicesSection from '../../components/home/CombinedServicesSection';
import OperationalGallerySection from '../../components/home/OperationalGallerySection';
import Footer from '../../components/layout/Footer';
import { Box } from '@mui/material';

const Home: React.FC = () => {
    return (
        <Box sx={{ 
            minHeight: '100vh', 
            backgroundColor: '#0B1020',
            color: '#F4F4F4',
            overflowX: 'hidden'
        }}>
            <Navbar />
            <Box component="main">
                {/* Hero Section (Contains HeroVideo, Particles, HeroContent & FlightTracker) */}
                <Hero />
                
                {/* Main Content Area */}
                <Box sx={{ 
                    position: 'relative',
                    zIndex: 2,
                    background: 'linear-gradient(180deg, #0B1020 0%, #0D1326 50%, #070A14 100%)',
                    pt: 10,
                    pb: 6
                }}>
                    {/* 1. Terminal Experiences & Promotions (Retail, Duty Free, VIP Lounges, Fine Dining) */}
                    <PromotionsSection />

                    {/* 2. Combined Passenger & Cargo Services Section */}
                    <CombinedServicesSection />

                    {/* 3. Integrated Airport Operations Gallery */}
                    <OperationalGallerySection />
                </Box>
            </Box>
            <Footer />
        </Box>
    );
};

export default Home;
