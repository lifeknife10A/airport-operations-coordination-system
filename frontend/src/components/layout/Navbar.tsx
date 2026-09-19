import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Box, Button, Paper, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

interface SubItem {
  label: string;
  anchor: string;
}

interface NavItem {
  label: string;
  path: string;
  subItems?: SubItem[];
}

const navItems: NavItem[] = [
  {
    label: 'Flight Tracker',
    path: '/tracker',
    subItems: [
      { label: 'Live Telemetry Search', anchor: 'search' },
      { label: 'Active Vector Results', anchor: 'results' },
      { label: 'Aerodrome Alerts', anchor: 'alerts' },
    ],
  },
  {
    label: 'Flight Schedule',
    path: '/schedule',
    subItems: [
      { label: 'Live Departure Board', anchor: 'departures' },
      { label: 'Live Arrival Board', anchor: 'arrivals' },
    ],
  },
  {
    label: 'Passenger Services',
    path: '/passenger-services',
    subItems: [
      { label: 'Terminal Facilities', anchor: 'facilities' },
      { label: 'VIP Lounges & Dining', anchor: 'lounges' },
      { label: 'Accessibility & Care', anchor: 'medical' },
      { label: 'Lost & Found Desk', anchor: 'lost-found' },
    ],
  },
  {
    label: 'Cargo Operations',
    path: '/cargo',
    subItems: [
      { label: 'Airside Cargo Capabilities', anchor: 'services' },
      { label: '4-Step Handling Protocol', anchor: 'process' },
      { label: 'Air Waybill Verification', anchor: 'docs' },
    ],
  },
  {
    label: 'Airport Hub',
    path: '/airport',
    subItems: [
      { label: 'Aerodrome Overview', anchor: 'about' },
      { label: 'Terminals 1 & 2', anchor: 'terminals' },
      { label: 'Ground Transit & Valet', anchor: 'transport' },
    ],
  },
  {
    label: 'Contact & Support',
    path: '/contact',
    subItems: [
      { label: 'Operations Directory', anchor: 'info' },
      { label: '24/7 Tower Hotline', anchor: 'emergency' },
      { label: 'Direct Enquiry Form', anchor: 'form' },
    ],
  },
];

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (path: string, anchor?: string) => {
    setHoveredIndex(null);
    if (anchor) {
      navigate(`${path}#${anchor}`);
      setTimeout(() => {
        const element = document.getElementById(anchor);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      navigate(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navbarBg = isScrolled
    ? 'rgba(250, 249, 246, 0.88)'
    : 'rgba(255, 255, 255, 0.8)';
  const borderColor = isScrolled ? 'rgba(229, 231, 235, 0.8)' : 'rgba(255, 255, 255, 0.7)';

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: navbarBg,
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        transition: 'all 0.25s ease-in-out',
        borderBottom: `1px solid ${borderColor}`,
        boxShadow: isScrolled ? '0 8px 32px rgba(15, 41, 66, 0.05)' : 'none',
        py: 0.5,
        zIndex: 100,
      }}
    >
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          maxWidth: '1480px',
          width: '100%',
          margin: '0 auto',
          px: { xs: 2, md: 4 },
          flexWrap: 'nowrap',
        }}
      >
        {/* Sapphire Airport Brand Mark */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.4,
            cursor: 'pointer',
            flexShrink: 0,
            textDecoration: 'none',
          }}
          onClick={() => handleNavClick('/')}
        >
          <img
            src="/saphire_logo_clean.png"
            alt="Saphire International Airport"
            style={{
              height: '42px',
              width: 'auto',
              objectFit: 'contain',
              display: 'block',
              imageRendering: '-webkit-optimize-contrast',
              filter: 'drop-shadow(0 2px 8px rgba(2, 132, 199, 0.22))',
            }}
          />
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Typography
              sx={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 800,
                fontSize: '1.05rem',
                letterSpacing: '-0.025em',
                color: '#0F2942',
                lineHeight: 1.1,
              }}
            >
              SAPHIRE
            </Typography>
            <Typography
              sx={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: '0.64rem',
                color: '#0284C7',
                fontWeight: 600,
                letterSpacing: '0.12em',
                lineHeight: 1.1,
                textTransform: 'uppercase',
              }}
            >
              AIRPORT
            </Typography>
          </Box>
        </Box>

        {/* Linear 1-Row Navigation Items - Centered */}
        <Box
          sx={{
            display: { xs: 'none', lg: 'flex' },
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            mx: { lg: 2, xl: 4 },
            gap: { lg: 1, xl: 2 },
            flexWrap: 'nowrap',
            whiteSpace: 'nowrap',
          }}
        >
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            const isHovered = hoveredIndex === index;
            const hasSubItems = Boolean(item.subItems && item.subItems.length > 0);

            return (
              <Box
                key={item.label}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                sx={{ position: 'relative', flexShrink: 0 }}
              >
                <Button
                  onClick={() => handleNavClick(item.path)}
                  sx={{
                    color: isActive ? '#0F2942' : isHovered ? '#1E3A5F' : '#475569',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.84rem',
                    textTransform: 'none',
                    whiteSpace: 'nowrap',
                    px: { lg: 1.3, xl: 1.8 },
                    py: 0.7,
                    borderRadius: '8px',
                    transition: 'all 0.15s ease',
                    '&:hover': {
                      background: 'rgba(30, 58, 95, 0.05)',
                    },
                  }}
                >
                  {item.label}
                </Button>

                {/* Submenu Dropdown Popover */}
                {hasSubItems && (
                  <Paper
                    elevation={0}
                    sx={{
                      position: 'absolute',
                      top: '100%',
                      left: '50%',
                      transform: isHovered
                        ? 'translateX(-50%) translateY(4px)'
                        : 'translateX(-50%) translateY(-6px)',
                      opacity: isHovered ? 1 : 0,
                      visibility: isHovered ? 'visible' : 'hidden',
                      pointerEvents: isHovered ? 'auto' : 'none',
                      transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                      minWidth: '220px',
                      background: 'rgba(255, 255, 255, 0.92)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      border: '1px solid rgba(229, 231, 235, 0.8)',
                      borderRadius: '12px',
                      boxShadow: '0 16px 36px rgba(30, 58, 95, 0.08)',
                      py: 1,
                      px: 0.8,
                      zIndex: 105,
                    }}
                  >
                    {item.subItems!.map((sub) => (
                      <Box
                        key={sub.label}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNavClick(item.path, sub.anchor);
                        }}
                        sx={{
                          py: 0.9,
                          px: 1.4,
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          '&:hover': {
                            background: 'rgba(30, 58, 95, 0.05)',
                            transform: 'translateX(2px)',
                            '& .sub-title': { color: '#1E3A5F', fontWeight: 600 },
                          },
                        }}
                      >
                        <Typography
                          className="sub-title"
                          sx={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: '0.82rem',
                            fontWeight: 400,
                            color: '#475569',
                            transition: 'color 0.15s ease',
                          }}
                        >
                          {sub.label}
                        </Typography>
                      </Box>
                    ))}
                  </Paper>
                )}
              </Box>
            );
          })}
        </Box>

        {/* Staff Portal CTA */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <Button
            variant="contained"
            onClick={() => navigate('/login')}
            sx={{
              background: '#1E3A5F',
              color: '#FFFFFF',
              borderRadius: '8px',
              padding: '6px 18px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 600,
              fontSize: '0.82rem',
              textTransform: 'none',
              boxShadow: '0 2px 8px rgba(30, 58, 95, 0.15)',
              whiteSpace: 'nowrap',
              transition: 'all 0.18s ease',
              '&:hover': {
                background: '#0F2942',
                boxShadow: '0 4px 14px rgba(30, 58, 95, 0.25)',
                transform: 'translateY(-1px)',
              },
            }}
          >
            Staff Portal
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
