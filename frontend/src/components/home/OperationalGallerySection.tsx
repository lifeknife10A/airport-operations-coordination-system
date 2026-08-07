import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { AccordionGallery, AccordionGalleryItem } from '../reactbits';

const galleryItems: AccordionGalleryItem[] = [
  {
    id: 'terminal',
    image: 'https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=1200&auto=format&fit=crop',
    badge: 'Terminal Telemetry',
    subtitle: 'PASSENGER HUB',
    title: 'Intelligent Terminal Scheduling',
    description: 'Real-time gate allocations, passenger flow monitoring, and dynamic baggage carousel coordination across all international terminals.',
    link: '/flights',
  },
  {
    id: 'airside',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1200&auto=format&fit=crop',
    badge: 'Airside Command',
    subtitle: 'AIRPORT CONTROL',
    title: 'Precision Airside Management',
    description: 'Automated apron allocation, taxiway routing, and real-time aircraft turnaround radar telemetry for flight dispatch.',
    link: '/airside',
  },
  {
    id: 'ground',
    image: 'https://images.unsplash.com/photo-1508873696983-2df515122519?q=80&w=1200&auto=format&fit=crop',
    badge: 'Ground Handling',
    subtitle: 'GROUND DISPATCH',
    title: 'Ground Handling Operations',
    description: 'Synchronized refueling, baggage loading, aircraft servicing, and live SLA countdown management for ground crews.',
    link: '/tasks',
  },
  {
    id: 'cargo',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop',
    badge: 'Cargo Logistics',
    subtitle: 'FREIGHT CONTROL',
    title: 'Smart Cargo Telemetry',
    description: 'End-to-end Air Waybill tracking, automated pallet handling, and cold-chain monitoring for high-priority air cargo.',
    link: '/cargo',
  },
];

export const OperationalGallerySection: React.FC = () => {
  return (
    <Box sx={{ py: 6, position: 'relative' }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography
            component="span"
            sx={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '0.85rem',
              fontWeight: 700,
              letterSpacing: '0.15em',
              color: '#38BDF8',
              textTransform: 'uppercase',
              display: 'inline-block',
              mb: 1,
            }}
          >
            SYSTEM MODULES & ARCHITECTURE
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 800,
              color: '#FFFFFF',
              fontSize: { xs: '1.8rem', md: '2.5rem' },
              letterSpacing: '-0.02em',
            }}
          >
            Integrated Airport Operations
          </Typography>
        </Box>

        <AccordionGallery
          items={galleryItems}
          orientation="horizontal"
          trigger="hover"
          expandRatio={3.6}
          grayscale={true}
          height="460px"
        />
      </Container>
    </Box>
  );
};

export default OperationalGallerySection;
