import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Hero from '../../components/home/Hero/Hero';
import PromotionsSection from '../../components/home/PromotionsSection';
import CombinedServicesSection from '../../components/home/CombinedServicesSection';
import Footer from '../../components/layout/Footer';
import { Box, Typography } from '@mui/material';
import { AccordionGallery } from '../../components/reactbits';

const accordionItems = [
  {
    id: 'duty-free',
    title: 'Duty Free World',
    subtitle: 'LUXURY RETAIL & LIQUOR',
    description: 'Explore tax-free prices on global perfumes, premium spirits, designer watches, and luxury confectionery before your flight.',
    image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80',
    link: '#duty-free',
    badge: 'Open 24/7'
  },
  {
    id: 'asolo',
    title: 'ASOLO Fashion Hub',
    subtitle: 'MULTI-BRAND APPAREL',
    description: 'Discover high-street fashion, travel couture, and Italian craftsmanship footwear across Terminal 1 & 2 flagship stores.',
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80',
    link: '#asolo'
  },
  {
    id: 'lounges',
    title: 'SAPHIRE VIP Lounges',
    subtitle: 'EXECUTIVE RELAXATION',
    description: 'Relax in quiet suites featuring high-speed Wi-Fi, private shower rooms, gourmet buffet spreads, and complimentary bar service.',
    image: 'https://images.unsplash.com/photo-1542296332-2e4473faf563?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80',
    link: '#lounges'
  },
  {
    id: 'dining',
    title: 'Airport Fine Dining',
    subtitle: 'GOURMET & QUICK BITES',
    description: 'Savor Michelin-starred restaurant concepts, artisanal coffee, and authentic global delicacies available 24/7.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80',
    link: '#dining'
  }
];

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
                    {/* 1. Promotions Section (4 ReactBits Cards) */}
                    <PromotionsSection />

                    {/* 2. Combined Passenger & Cargo Services Section */}
                    <CombinedServicesSection />

                    {/* 3. Retail & Dining Accordion Gallery */}
                    <Box sx={{ py: 10, px: { xs: 2, md: 4, lg: 8 }, maxWidth: '1400px', mx: 'auto' }}>
                        <Box sx={{ textAlign: 'center', mb: 6 }}>
                            <Typography sx={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.15em', color: '#38BDF8', textTransform: 'uppercase', mb: 1 }}>
                                Terminal Experiences
                            </Typography>
                            <Typography variant="h3" sx={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: '#FFFFFF' }}>
                                Airport Retail & Dining Promotions
                            </Typography>
                        </Box>
                        <AccordionGallery items={accordionItems} height="500px" expandRatio={3.5} />
                    </Box>
                </Box>
            </Box>
            <Footer />
        </Box>
    );
};

export default Home;
