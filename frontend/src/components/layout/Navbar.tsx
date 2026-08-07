import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Box, Button, Paper, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

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
  { label: 'Home', path: '/' },
  {
    label: 'Tracker',
    path: '/tracker',
    subItems: [
      { label: 'Flight Telemetry Search', anchor: 'search' },
      { label: 'Live Results & Details', anchor: 'results' },
      { label: 'Airport Operational Alerts', anchor: 'alerts' },
    ],
  },
  {
    label: 'Schedule',
    path: '/schedule',
    subItems: [
      { label: 'Live Departure Board', anchor: 'departures' },
      { label: 'Live Arrival Board', anchor: 'arrivals' },
    ],
  },
  {
    label: 'Services',
    path: '/passenger-services',
    subItems: [
      { label: 'Passenger Facilities', anchor: 'facilities' },
      { label: 'VIP Lounges & Dining', anchor: 'lounges' },
      { label: 'Medical & Accessibility', anchor: 'medical' },
      { label: 'Lost & Found Desk', anchor: 'lost-found' },
      { label: 'Passenger FAQs', anchor: 'faq' },
    ],
  },
  {
    label: 'Cargo',
    path: '/cargo',
    subItems: [
      { label: 'Cargo Services Overview', anchor: 'services' },
      { label: '4-Step Handling Process', anchor: 'process' },
      { label: 'Air Waybill & Documentation', anchor: 'docs' },
      { label: 'Cargo Direct Enquiries', anchor: 'contact' },
    ],
  },
  {
    label: 'Airport',
    path: '/airport',
    subItems: [
      { label: 'About SAPHIRE Airport', anchor: 'about' },
      { label: 'Terminal 1 & 2 Info', anchor: 'terminals' },
      { label: 'Ground Transportation', anchor: 'transport' },
      { label: 'Parking & Valet Rates', anchor: 'parking' },
      { label: 'Terminal Map View', anchor: 'map' },
    ],
  },
  {
    label: 'Contact',
    path: '/contact',
    subItems: [
      { label: 'Directory & Hotlines', anchor: 'info' },
      { label: '24/7 Emergency Desk', anchor: 'emergency' },
      { label: 'Feedback & Contact Form', anchor: 'form' },
    ],
  },
];

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
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
    ? 'rgba(11, 16, 32, 0.94)'
    : 'linear-gradient(180deg, rgba(11, 16, 32, 0.9) 0%, rgba(11, 16, 32, 0.3) 100%)';
  const textColor = '#94A3B8';
  const activeColor = '#38BDF8';
  const borderColor = isScrolled ? 'rgba(255, 255, 255, 0.12)' : 'transparent';

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: navbarBg,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        transition: 'all 0.3s ease-in-out',
        borderBottom: `1px solid ${borderColor}`,
        padding: '0.3rem 0',
        zIndex: 100,
      }}
    >
      <Toolbar
        sx={{
          justify: 'space-between',
          maxWidth: '1400px',
          width: '100%',
          margin: '0 auto',
          px: { xs: 2, md: 4 },
        }}
      >
        {/* Logo */}
        <Box
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => handleNavClick('/')}
        >
          <Box
            component="img"
            src="/saphire_logo_transparent.png"
            alt="Saphire AOCS Logo"
            sx={{ height: '42px', mr: 4, filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.5))' }}
          />
        </Box>

        {/* Navigation Items with Dropdown */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.5 }}>
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            const isHovered = hoveredIndex === index;
            const hasSubItems = Boolean(item.subItems && item.subItems.length > 0);

            return (
              <Box
                key={item.label}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                sx={{ position: 'relative' }}
              >
                <Button
                  onClick={() => handleNavClick(item.path)}
                  sx={{
                    color: isActive ? activeColor : isHovered ? '#F8FAFC' : textColor,
                    fontFamily: "'Outfit', 'Inter', sans-serif",
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.92rem',
                    textTransform: 'none',
                    letterSpacing: '0.02em',
                    px: 2,
                    py: 1,
                    borderRadius: '8px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.5,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.06)',
                    },
                  }}
                >
                  {item.label}
                  {hasSubItems && (
                    <ChevronDown
                      size={14}
                      style={{
                        transform: isHovered ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                        opacity: isHovered || isActive ? 1 : 0.6,
                      }}
                    />
                  )}
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
                      transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                      minWidth: '220px',
                      background: 'rgba(15, 23, 42, 0.96)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(56, 189, 248, 0.25)',
                      borderRadius: '12px',
                      boxShadow: '0 15px 35px rgba(0, 0, 0, 0.7)',
                      py: 1.2,
                      px: 1,
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
                          py: 1,
                          px: 1.8,
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          '&:hover': {
                            background: 'rgba(56, 189, 248, 0.12)',
                            transform: 'translateX(4px)',
                            '& .sub-title': { color: '#38BDF8' },
                          },
                        }}
                      >
                        <Typography
                          className="sub-title"
                          sx={{
                            fontFamily: "'Outfit', sans-serif",
                            fontSize: '0.85rem',
                            fontWeight: 500,
                            color: '#CBD5E1',
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

        {/* Operations Portal Action Button */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 'auto' }}>
          <Button
            variant="contained"
            onClick={() => navigate('/login')}
            sx={{
              display: { xs: 'none', sm: 'block' },
              background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
              borderRadius: '8px',
              padding: '8px 22px',
              fontFamily: "'Outfit', 'Inter', sans-serif",
              fontWeight: 600,
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)',
              transition: 'all 0.2s ease',
              '&:hover': {
                background: 'linear-gradient(135deg, #1D4ED8 0%, #1E40AF 100%)',
                boxShadow: '0 6px 20px rgba(37, 99, 235, 0.5)',
                transform: 'translateY(-1px)',
              },
            }}
          >
            Portal
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
