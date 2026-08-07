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
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800&auto=format&fit=crop',
    icon: <ShoppingBag size={20} color="#38BDF8" />,
    spotlightColor: 'rgba(56, 189, 248, 0.25)',
  },
  {
    id: 'asolo',
    title: 'ASOLO Fashion Hub',
    category: 'MULTI-BRAND APPAREL',
    description: 'Discover high-street fashion, travel couture, and Italian craftsmanship footwear across Terminal 1 & 2 flagship stores.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop',
    icon: <Shirt size={20} color="#E087FF" />,
    spotlightColor: 'rgba(224, 135, 255, 0.25)',
  },
  {
    id: 'lounges',
    title: 'SAPHIRE VIP Lounges',
    category: 'EXECUTIVE RELAXATION',
    description: 'Relax in quiet suites featuring high-speed Wi-Fi, private shower rooms, gourmet buffet spreads, and complimentary bar service.',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop',
    icon: <Coffee size={20} color="#34D399" />,
    spotlightColor: 'rgba(52, 211, 153, 0.25)',
  },
  {
    id: 'dining',
    title: 'Airport Fine Dining',
    category: 'GOURMET & QUICK BITES',
    description: 'Savor Michelin-starred restaurant concepts, artisanal coffee, and authentic global delicacies available 24/7.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop',
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
                  height: '180px',
                  width: '100%',
                  backgroundImage: `url(${promo.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(180deg, rgba(15,23,42,0.2) 0%, rgba(15,23,42,0.95) 100%)',
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 14,
                    left: 14,
                    background: 'rgba(15, 23, 42, 0.8)',
                    backdropFilter: 'blur(8px)',
                    p: 1,
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
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
