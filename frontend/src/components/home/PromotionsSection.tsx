import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { SpotlightCard } from '../reactbits';
import { ShoppingBag, Shirt, Coffee, Utensils, ArrowUpRight } from 'lucide-react';

interface PromoItem {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  icon: React.ReactNode;
  spotlightColor: string;
}

const promoCards: PromoItem[] = [
  {
    id: 'duty-free',
    title: 'Duty Free World',
    category: 'LUXURY RETAIL & LIQUOR',
    description: 'Explore tax-free prices on global perfumes, premium spirits, designer watches, and luxury confectionery before your flight.',
    image: '/images/duty_free.jpg',
    icon: <ShoppingBag size={20} color="#38BDF8" />,
    spotlightColor: 'rgba(56, 189, 248, 0.25)',
  },
  {
    id: 'asolo',
    title: 'ASOLO Fashion Hub',
    category: 'MULTI-BRAND APPAREL',
    description: 'Discover high-street fashion, travel couture, and Italian craftsmanship footwear across Terminal 1 & 2 flagship stores.',
    image: '/images/fashion_boutique.jpg',
    icon: <Shirt size={20} color="#E087FF" />,
    spotlightColor: 'rgba(224, 135, 255, 0.25)',
  },
  {
    id: 'lounges',
    title: 'SAPHIRE VIP Lounges',
    category: 'EXECUTIVE RELAXATION',
    description: 'Relax in quiet suites featuring high-speed Wi-Fi, private shower rooms, gourmet buffet spreads, and complimentary bar service.',
    image: '/images/vip_lounge.jpg',
    icon: <Coffee size={20} color="#34D399" />,
    spotlightColor: 'rgba(52, 211, 153, 0.25)',
  },
  {
    id: 'dining',
    title: 'Airport Fine Dining',
    category: 'GOURMET & QUICK BITES',
    description: 'Savor Michelin-starred restaurant concepts, artisanal coffee, and authentic global delicacies available 24/7.',
    image: '/images/fine_dining.jpg',
    icon: <Utensils size={20} color="#FBBF24" />,
    spotlightColor: 'rgba(251, 191, 36, 0.25)',
  },
];

export const PromotionsSection: React.FC = () => {
  return (
    <Box sx={{ py: 6, position: 'relative' }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography
            component="span"
            sx={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '0.82rem',
              fontWeight: 700,
              letterSpacing: '0.15em',
              color: '#38BDF8',
              textTransform: 'uppercase',
              display: 'inline-block',
              mb: 1,
            }}
          >
            TERMINAL EXPERIENCES
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 800,
              color: '#FFFFFF',
              fontSize: { xs: '1.8rem', md: '2.4rem' },
              letterSpacing: '-0.02em',
            }}
          >
            Airport Retail & Dining Promotions
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
            gap: 3,
          }}
        >
          {promoCards.map((promo) => (
            <SpotlightCard
              key={promo.id}
              spotlightColor={promo.spotlightColor}
              className="promo-card"
              style={{
                height: '100%',
                background: 'rgba(15, 23, 42, 0.88)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '16px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                padding: 0,
              }}
            >
              {/* Image Header */}
              <Box
                sx={{
                  height: '190px',
                  width: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                  backgroundColor: '#0F172A',
                }}
              >
                <Box
                  component="img"
                  src={promo.image}
                  alt={promo.title}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 0.4s ease',
                    '&:hover': { transform: 'scale(1.05)' },
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(180deg, rgba(15,23,42,0.1) 0%, rgba(15,23,42,0.85) 100%)',
                    pointerEvents: 'none',
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 14,
                    left: 14,
                    background: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(8px)',
                    p: 1,
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    zIndex: 2,
                  }}
                >
                  {promo.icon}
                </Box>
              </Box>

              {/* Content */}
              <Box sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography
                  sx={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    color: '#94A3B8',
                    textTransform: 'uppercase',
                    mb: 0.8,
                  }}
                >
                  {promo.category}
                </Typography>

                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 700,
                    color: '#F8FAFC',
                    fontSize: '1.25rem',
                    mb: 1.2,
                  }}
                >
                  {promo.title}
                </Typography>

                <Typography
                  sx={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '0.88rem',
                    lineHeight: 1.55,
                    color: '#94A3B8',
                    mb: 2,
                    flexGrow: 1,
                  }}
                >
                  {promo.description}
                </Typography>

                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.8,
                    color: '#38BDF8',
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    '&:hover': { color: '#60A5FA' },
                  }}
                >
                  <span>Explore Stores</span>
                  <ArrowUpRight size={16} />
                </Box>
              </Box>
            </SpotlightCard>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default PromotionsSection;
