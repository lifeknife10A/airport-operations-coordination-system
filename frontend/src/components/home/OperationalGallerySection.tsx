import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { AccordionGallery, AccordionGalleryItem } from '../reactbits';

const galleryItems: AccordionGalleryItem[] = [
  {
    id: 'terminal',
    image: '/images/terminal_exterior_day_1785780999460.jpg',
    badge: 'Terminal Telemetry',
    subtitle: 'PASSENGER HUB',
    title: 'Intelligent Terminal Scheduling',
    description: 'Real-time gate allocations, passenger flow monitoring, and dynamic baggage carousel coordination across all international terminals.',
    link: '/flights',
  },
  {
    id: 'airside',
    image: '/images/tarmac_jetway_view_1785781058195.jpg',
    badge: 'Airside Command',
    subtitle: 'AIRPORT CONTROL',
    title: 'Precision Airside Management',
    description: 'Automated apron allocation, taxiway routing, and real-time aircraft turnaround radar telemetry for flight dispatch.',
    link: '/airside',
  },
  {
    id: 'ground',
    image: '/images/boarding_gate_lounge_1785781551556.jpg',
    badge: 'Ground Handling',
    subtitle: 'GROUND DISPATCH',
    title: 'Ground Handling Operations',
    description: 'Synchronized refueling, baggage loading, aircraft servicing, and live SLA countdown management for ground crews.',
    link: '/tasks',
  },
  {
    id: 'cargo',
    image: '/images/balanced_4limb_quad_runway_airport_1785780879496.jpg',
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
