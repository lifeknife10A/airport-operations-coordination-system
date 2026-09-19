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
}

const promoCards: PromoItem[] = [
  {
    id: 'duty-free',
    title: 'Duty Free World',
    category: 'LUXURY RETAIL & LIQUOR',
    description: 'Explore tax-free prices on global perfumes, premium spirits, designer watches, and luxury confectionery before your flight.',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800&auto=format&fit=crop',
    icon: <ShoppingBag size={20} />,
  },
  {
    id: 'asolo',
    title: 'ASOLO Fashion Hub',
    category: 'MULTI-BRAND APPAREL',
    description: 'Discover high-street fashion, travel couture, and Italian craftsmanship footwear across Terminal 1 & 2 flagship stores.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop',
    icon: <Shirt size={20} />,
  },
  {
    id: 'lounges',
    title: 'SAPHIRE VIP Lounges',
    category: 'EXECUTIVE RELAXATION',
    description: 'Relax in quiet suites featuring high-speed Wi-Fi, private shower rooms, gourmet buffet spreads, and complimentary bar service.',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop',
    icon: <Coffee size={20} />,
  },
  {
    id: 'dining',
    title: 'Airport Fine Dining',
    category: 'GOURMET & QUICK BITES',
    description: 'Savor Michelin-starred restaurant concepts, artisanal coffee, and authentic global delicacies available 24/7.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop',
    icon: <Utensils size={20} />,
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
              color: 'primary.main',
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
              color: 'text.primary',
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
            gap: 4,
          }}
        >
          {promoCards.map((promo) => (
            <SpotlightCard
              key={promo.id}
              sx={{
                height: '100%',
                borderRadius: 16,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                bgcolor: 'background.paper',
                boxShadow: 0,
                '&:hover': {
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
                  transform: 'translateY(-2px)',
                },
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
                    background: 'linear-gradient(180deg, rgba(11, 16, 32, 0.2) 0%, rgba(11, 16, 32, 0.8) 100%)',
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 12,
                    left: 12,
                    background: 'rgba(11, 16, 32, 0.6)',
                    backdropFilter: 'blur(4px)',
                    p: 1,
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {promo.icon}
                </Box>
              </Box>

              {/* Content */}
              <Box sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography
                  sx={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'text.secondary',
                  }}
                >
                  {promo.category}
                </Typography>

                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 600,
                    color: 'text.primary',
                  }}
                >
                  {promo.title}
                </Typography>

                <Typography
                  sx={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '0.875rem',
                    lineHeight: 1.6,
                    color: 'text.secondary',
                    flexGrow: 1,
                  }}
                >
                  {promo.description}
                </Typography>

                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    color: 'primary.main',
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                  }}
                >
                  <span>Explore</span>
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
